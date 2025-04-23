const mongoose = require("mongoose");

const coursesSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Timestamps,
  },
});

module.exports = mongoose.model("course", coursesSchema);
