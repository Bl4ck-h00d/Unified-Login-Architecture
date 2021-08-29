const fs = require("fs");
const path = require("path");

const KeyPath = path.resolve(__dirname, "./JWTpvt.key");

const privateKey = fs.readFileSync(KeyPath, "utf8");

module.exports = Object.assign(
  {},
  {
    privateKey,
  }
);
