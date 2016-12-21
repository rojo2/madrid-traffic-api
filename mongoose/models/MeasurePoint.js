const mongoose = require("mongoose");
const MeasurePointSchema = new mongoose.Schema({
  id: String,
  created: Date,
  kind: String,
  type: String,
  intensity: Number,
  occupancy: Number,
  load: Number,
  average: Number,
  error: String,
  period: Number
}, {
  collection: "measurePoints"
});

const MeasurePoint = mongoose.model("measurePoint", MeasurePointSchema);

module.exports = {
  MeasurePointSchema,
  MeasurePoint
};
