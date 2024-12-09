const mongoose = require("mongoose");

const hvid = new mongoose.Schema({
  hvi: {
    type: String,
    required: false,
  },
  sovId: {
    type: String,
    required: false,
  },
  gmail: {
    type: String,
    required: false,
  },
});

const hvi = new mongoose.model("hvi", hvid);
module.exports = hvi;
