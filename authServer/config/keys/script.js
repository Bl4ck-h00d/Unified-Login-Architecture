const fs = require("fs");
const path = require("path");

const KeyPath = path.resolve(__dirname, "./jwtPrivate.key");

const privateKey = fs.readFileSync(KeyPath, "utf8");

module.exports = Object.assign(
  {},
  {
    privateKey,
  }
);
