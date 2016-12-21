const mongoose = require("mongoose");
const MeasurePointLocationSchema = new mongoose.Schema({
  location: mongoose.Schema.Types.Mixed,
  id: String,
  zone: String,
  device: String,
  description: String
}, {
  collection: "measurePointLocations"
});

const MeasurePointLocation = mongoose.model("measurePointLocation", MeasurePointLocationSchema);

module.exports = {
  MeasurePointLocationSchema,
  MeasurePointLocation
};
