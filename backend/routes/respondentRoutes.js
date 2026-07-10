const express = require("express");
const Respondent = require("../models/Respondent");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nama responden wajib diisi" });
    }

    if (!age) {
      return res.status(400).json({ message: "Umur responden wajib diisi" });
    }

    const respondent = await Respondent.create({
      name,
      age,
      results: [],
    });

    res.json({
      message: "Data responden berhasil disimpan",
      respondentId: respondent._id,
      respondent,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan responden" });
  }
});

router.post("/:id/results", async (req, res) => {
  try {
    const { id } = req.params;
    const { grip, test, score, accuracy, best } = req.body;

    if (!grip || !test || score === undefined) {
      return res.status(400).json({ message: "Data hasil test belum lengkap" });
    }

    const respondent = await Respondent.findById(id);

    if (!respondent) {
      return res.status(404).json({ message: "Responden tidak ditemukan" });
    }

    const existingResultIndex = respondent.results.findIndex(
      (result) => result.grip === grip && result.test === test
    );

    const newResult = {
      grip,
      test,
      score,
      accuracy: accuracy ?? null,
      best: best ?? null,
    };

    if (existingResultIndex !== -1) {
      respondent.results[existingResultIndex].grip = newResult.grip;
      respondent.results[existingResultIndex].test = newResult.test;
      respondent.results[existingResultIndex].score = newResult.score;
      respondent.results[existingResultIndex].accuracy = newResult.accuracy;
      respondent.results[existingResultIndex].best = newResult.best;
    } else {
      respondent.results.push(newResult);
    }

    await respondent.save();

    res.json({
      message: "Hasil test berhasil disimpan",
      respondent,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan hasil test" });
  }
});

module.exports = router;