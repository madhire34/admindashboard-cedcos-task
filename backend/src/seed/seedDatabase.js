require("dotenv").config();
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const DashboardSnapshot = require("../models/DashboardSnapshot");
const defaultDashboardData = require("../data/defaultDashboardData");
const { connectDatabase } = require("../config/database");

async function ensureDefaultAdmin() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@shopadmin.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
    return existingAdmin;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  return Admin.create({
    name: "ShopAdmin Administrator",
    email: adminEmail,
    passwordHash,
    role: "Admin",
    isActive: true
  });
}

async function ensureDashboardSnapshots() {
  const snapshotCount = await DashboardSnapshot.countDocuments();
  if (snapshotCount > 0) {
    return;
  }

  const documents = Object.entries(defaultDashboardData).map(([period, data]) => ({
    period,
    ...data,
    generatedAt: new Date()
  }));

  await DashboardSnapshot.insertMany(documents);
}

async function ensureSeedData() {
  await ensureDefaultAdmin();
  await ensureDashboardSnapshots();
}

async function runSeedScript() {
  try {
    await connectDatabase();
    await ensureSeedData();
    console.log("MongoDB seed complete");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB seed failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runSeedScript();
}

module.exports = { ensureSeedData };
