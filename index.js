const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const log = require("debug")("app:log");
const error = require("debug")("app:error");
const pckg = require("./package.json");

const MONGODB = "mongodb://localhost/madrid-trafico";

const MeasurePointSchema = new mongoose.Schema({
  id: String,
  description: String,
  access: String,
  intensity: Number,
  occupancy: Number,
  load: Number,
  level: Number,
  intensitySat: Number,
  error: String,
  subarea: String,
  created: Date
});

const MeasurePoint = mongoose.model("mps", MeasurePointSchema);

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB).then(() => {
  log(`Conectado a ${MONGODB}`);
}).catch((err) => {
  error(`${err}`);
});

app.use(morgan("combined"));
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ version: pckg.version });
});

// TODO: Esto molaría más si retornase los objetos en función de la
// posición.
app.get("/mps", (req, res) => {
  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);
  MeasurePoint
    .find()
    .skip(offset || 0)
    .limit(limit || 50)
    .then((mps) => {
      res.json(mps);
    });
});

app.listen(process.env.PORT || 3000);
