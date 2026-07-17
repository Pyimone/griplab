const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require('serverless-http');
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const respondentRoutes = require("./routes/respondentRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();
app.use(cors()); // Cukup panggil sekali aja
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "GripLab MERN Backend berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/respondents", respondentRoutes);
app.use("/api/admin", adminRoutes);

// Koneksi MongoDB tetap jalan, tapi app.listen dihapus
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB berhasil terhubung");
  })
  .catch((error) => {
    console.log("MongoDB gagal terhubung:", error.message);
  });

// Export untuk Netlify
module.exports = app;
module.exports.handler = serverless(app);