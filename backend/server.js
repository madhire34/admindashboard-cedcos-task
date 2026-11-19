require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/Admin");
const DashboardSnapshot = require("./src/models/DashboardSnapshot");
const defaultDashboardData = require("./src/data/defaultDashboardData");
const { connectDatabase } = require("./src/config/database");
const { ensureSeedData } = require("./src/seed/seedDatabase");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || "shopadmin_secret_key";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";

// The hosted MongoDB cluster is optional: when it is unavailable the service
// keeps serving the bundled demo dataset so the dashboard stays usable.
let databaseReady = false;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

function demoCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@shopadmin.com").toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || "Admin@123"
  };
}

function demoUser() {
  const { email } = demoCredentials();
  return {
    id: "demo-admin",
    name: "ShopAdmin Administrator",
    email,
    role: "Admin"
  };
}

function isDemoLogin(email, password) {
  const demo = demoCredentials();
  return email === demo.email && password === demo.password;
}

function demoDashboard(period) {
  const data = defaultDashboardData[period];
  if (!data) return null;
  return { period, ...data, generatedAt: new Date().toISOString() };
}

function signToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (databaseReady) {
    try {
      const admin = await Admin.findOne({ email: normalizedEmail });
      if (admin && admin.isActive) {
        const isValidPassword = await bcrypt.compare(String(password), admin.passwordHash);
        if (isValidPassword) {
          admin.lastLoginAt = new Date();
          await admin.save();
          const user = {
            id: String(admin._id),
            name: admin.name,
            email: admin.email,
            role: admin.role
          };
          return res.json({ token: signToken(user), user });
        }
      }
    } catch (error) {
      console.warn("Database login failed, falling back to demo credentials:", error.message);
    }
  }

  if (isDemoLogin(normalizedEmail, String(password))) {
    const user = demoUser();
    return res.json({ token: signToken(user), user });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  if (databaseReady) {
    try {
      const admin = await Admin.findById(req.user.id).select("name email role isActive");
      if (admin && admin.isActive) {
        return res.json({
          user: {
            id: String(admin._id),
            name: admin.name,
            email: admin.email,
            role: admin.role
          }
        });
      }
    } catch (error) {
      console.warn("Database session check failed, trusting token:", error.message);
    }
  }

  return res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

app.get("/api/dashboard", authenticateToken, async (req, res) => {
  const period = String(req.query.period || "month").toLowerCase();
  const selectedPeriod = ["today", "week", "month"].includes(period) ? period : "month";

  if (databaseReady) {
    try {
      const snapshot = await DashboardSnapshot.findOne({ period: selectedPeriod }).lean();
      if (snapshot) {
        return res.json({
          period: snapshot.period,
          summary: snapshot.summary,
          topProducts: snapshot.topProducts,
          categorySales: snapshot.categorySales,
          revenueTrend: snapshot.revenueTrend,
          ordersByStatus: snapshot.ordersByStatus,
          recentOrders: snapshot.recentOrders,
          funnel: snapshot.funnel,
          generatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn("Database dashboard query failed, serving demo data:", error.message);
    }
  }

  const fallback = demoDashboard(selectedPeriod);
  if (!fallback) {
    return res.status(404).json({ message: "Dashboard data not found for selected period." });
  }

  return res.json(fallback);
});

app.get("/api/health", (_, res) => {
  return res.json({
    status: "ok",
    database: databaseReady ? "connected" : "demo-fallback"
  });
});

async function startServer() {
  try {
    await connectDatabase();
    await ensureSeedData();
    databaseReady = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.warn("MongoDB unavailable — serving bundled demo data:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
