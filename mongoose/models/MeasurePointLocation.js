const mongoose = require("mongoose");
const MeasurePointLocationSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.Mixed,
    index: "2dsphere"
  },
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
