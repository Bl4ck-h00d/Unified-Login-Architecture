const jwt = require("jsonwebtoken");
const { publicKey } = require("./config/keys/script");

const verifyJwtToken = (token) =>
  new Promise((resolve, reject) => {
    const iss = "Flam authServer";
    const sub = "user@filename.com";
    const exp = "24h";

    const signOptions = {
      issuer: iss,
      subject: sub,
      expiresIn: exp,
      algorithm: "RS256",
    };

    jwt.verify(token, publicKey, signOptions, (err, decodedToken) => {
      if (err) return reject(err);
      return resolve(decodedToken);
    });

   
  });
module.exports = Object.assign({}, { verifyJwtToken });
