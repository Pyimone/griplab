const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/seed-admin", async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: "admin" });

    if (adminExists) {
      return res.json({ message: "Admin sudah ada" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Administrator",
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    res.json({
      message: "Admin berhasil dibuat",
      username: "admin",
      password: "admin123",
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat admin" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Username tidak ditemukan" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router;