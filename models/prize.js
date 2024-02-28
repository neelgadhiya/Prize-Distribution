const mongoose = require("mongoose");

const prizeSchema = new mongoose.Schema(
  {
    prize_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,

    },
    probability: {
      type: String,
      required: true,
    },
    awarded: { 
      type: Boolean, 
      default: false, 
      required: true }
  },
);

const Prize = mongoose.model("prize", prizeSchema);

module.exports = Prize;