const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const respondentRoutes = require("./routes/respondentRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "GripLab MERN Backend berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/respondents", respondentRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB berhasil terhubung");

    app.listen(process.env.PORT, () => {
      console.log(`Server berjalan di http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB gagal terhubung:", error.message);
  });