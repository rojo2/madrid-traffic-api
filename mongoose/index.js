const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const log = require("debug")("app:mongoose:log");
const error = require("debug")("app:mongoose:error");

function requireAll(directory) {
  try {
    return fs.readdirSync(directory)
      .filter((filename) => path.extname(filename) === ".js")
      .map((filename) => path.join(directory, filename))
      .reduce((acc, filename) => {
        const name = path.basename(filename, ".js");
        acc[name] = require(filename);
        return acc;
      }, {});
  } catch (err) {
    if (err.code === "ENOENT") {
      return {};
    }
  }
}

module.exports = function(opts = {}) {

  const options = Object.assign({
    models: true,
    fixtures: true,
    options: {
      server: {
        socketOptions: {
          keepAlive: 1,
          socketTimeoutMS: 40000,
          connectTimeoutMS: 40000
        }
      }
    }
  }, opts);

  mongoose.Promise = global.Promise;
  mongoose.connect(options.uri, options.options).then(() => {

    if (options.models) {
      requireAll(path.join(__dirname, "models"));
    }

    if (options.fixtures) {
      requireAll(path.join(__dirname, "fixtures"));
    }

    log(`Conectado a ${options.uri}`);

    mongoose.connection.emit("ready");

  }).catch((err) => {

    error(`${err}`);

  });

  return mongoose;

};
