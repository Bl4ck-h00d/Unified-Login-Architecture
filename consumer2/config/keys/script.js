const fs = require("fs");
const path = require("path");

const KeyPath = path.resolve(__dirname, "./JWTpub.key");

const publicKey = fs.readFileSync(KeyPath, "utf8");

module.exports = Object.assign(
  {},
  {
    publicKey,
  }
);
