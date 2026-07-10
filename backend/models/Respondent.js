const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    grip: {
      type: String,
      required: true,
    },
    test: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      default: null,
    },
    best: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const respondentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    results: [resultSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Respondent", respondentSchema);