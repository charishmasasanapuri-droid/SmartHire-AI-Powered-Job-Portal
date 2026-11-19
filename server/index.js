const express = require("express");
const dotenv = require("dotenv");

// ======================
// Load Environment Variables
// ======================
const result = dotenv.config();

console.log("DOTENV RESULT:");
console.log(result);

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS loaded:",
  process.env.EMAIL_PASS ? "YES" : "NO"
);
console.log(
  "MONGO_URI loaded:",
  process.env.MONGO_URI ? "YES" : "NO"
);

// ======================
// Import Packages
// ======================
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// ======================
// Database Connection
// ======================
const connectDB = require("./config/db");
connectDB();

// ======================
// Import Routes
// ======================
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// ======================
// Initialize Express
// ======================
const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ======================
// Static Folder
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// API Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ======================
// Test Route
// ======================
app.get("/", (req, res) => {
  res.send("🚀 SmartHire Backend Running...");
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});