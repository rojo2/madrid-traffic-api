const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const log = require("debug")("app:log");
const error = require("debug")("app:error");
const pckg = require("./package.json");
const config = require("./config");
const mongoose = require("./mongoose")({
  uri: config.MONGODB
});

function asInt(value, defaultValue, maxValue, minValue) {
  const v = parseInt(value) || defaultValue;
  if (maxValue != null) {
    if (v > maxValue) return maxValue;
  }
  if (minValue != null) {
    if (v < minValue) return minValue;
  }
  return v;
}

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ version: pckg.version });
});

// TODO: Esto molaría más si retornase los objetos en función de la
// posición.
app.get("/measure-point", (req, res) => {
  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);

  const MeasurePoint = mongoose.model("measurePoint");
  MeasurePoint
    .find()
    .skip(asInt(offset,0,null,0))
    .limit(asInt(limit,50,100))
    .then((mps) => {
      console.log(mps);
      res.json(mps);
    })
    .catch((err) => {
      res.status(500).json();
    });
});

app.get("/measure-point/:mp", (req, res) => {

  const MeasurePoint = mongoose.model("measurePoint");
  MeasurePoint
    .findById(req.params.mp)
    .then((mp) => {
      res.json(mp);
    });

});

app.get("/measure-point-location", (req,res) => {
  const MeasurePointLocation = mongoose.model("measurePointLocation");
  if (req.query.latLng) {
    const coordinates = req.query.latLng.split(",").map((coord) => parseFloat(coord));
    MeasurePointLocation
      .geoNear({ type: "Point", coordinates }, {
        spherical: true,
        maxDistance: 1 / 3000,
        distanceMultiplier: 3000
      })
      .then((mps) => {
        res.json(mps);
      })
      .catch((err) => {
        res.status(500).json();
      });
  } else {
    MeasurePointLocation
      .find()
      .then((mps) => {
        res.json(mps);
      })
      .catch((err) => {
        res.status(500).json();
      });
  }
});

app.listen(process.env.PORT || 3002);
