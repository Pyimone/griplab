const express = require("express");
const Respondent = require("../models/Respondent");
const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/respondents", protectAdmin, async (req, res) => {
  try {
    const respondents = await Respondent.find().sort({ createdAt: -1 });

    res.json(respondents);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data responden" });
  }
});

router.get("/results", protectAdmin, async (req, res) => {
  try {
    const respondents = await Respondent.find().sort({ createdAt: -1 });

    const results = respondents.flatMap((respondent) =>
      respondent.results.map((result) => ({
        respondentId: respondent._id,
        name: respondent.name,
        age: respondent.age,
        resultId: result._id,
        grip: result.grip,
        test: result.test,
        score: result.score,
        accuracy: result.accuracy,
        best: result.best,
        createdAt: result.createdAt,
      }))
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data hasil" });
  }
});

router.delete("/respondents/:id", protectAdmin, async (req, res) => {
  try {
    await Respondent.findByIdAndDelete(req.params.id);

    res.json({ message: "Data responden berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data responden" });
  }
});

router.delete("/results/:respondentId/:resultId", protectAdmin, async (req, res) => {
  try {
    const { respondentId, resultId } = req.params;

    const respondent = await Respondent.findById(respondentId);

    if (!respondent) {
      return res.status(404).json({ message: "Responden tidak ditemukan" });
    }

    respondent.results = respondent.results.filter(
      (result) => result._id.toString() !== resultId
    );

    await respondent.save();

    res.json({ message: "Hasil pengujian berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus hasil pengujian" });
  }
});

router.delete("/clear-data", protectAdmin, async (req, res) => {
  try {
    await Respondent.deleteMany({});

    res.json({
      message: "Semua data responden dan hasil pengujian berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus semua data",
    });
  }
});

module.exports = router;