require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/Admin");
const DashboardSnapshot = require("./src/models/DashboardSnapshot");
const { connectDatabase } = require("./src/config/database");
const { ensureSeedData } = require("./src/seed/seedDatabase");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || "shopadmin_secret_key";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";

app.use(cors());
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

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(String(password), admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const user = {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("name email role isActive");
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({
      user: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not validate session" });
  }
});

app.get("/api/dashboard", authenticateToken, async (req, res) => {
  try {
    const period = String(req.query.period || "month").toLowerCase();
    const selectedPeriod = ["today", "week", "month"].includes(period) ? period : "month";

    const snapshot = await DashboardSnapshot.findOne({ period: selectedPeriod }).lean();
    if (!snapshot) {
      return res.status(404).json({ message: "Dashboard data not found for selected period." });
    }

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
  } catch (error) {
    return res.status(500).json({ message: "Could not load dashboard." });
  }
});

app.get("/api/health", (_, res) => {
  return res.json({ status: "ok" });
});

async function startServer() {
  try {
    await connectDatabase();
    await ensureSeedData();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
