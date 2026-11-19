const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI exists:", process.env.MONGO_URI ? "YES" : "NO");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;