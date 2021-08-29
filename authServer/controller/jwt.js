const jwt = require("jsonwebtoken");
const { privateKey } = require("../config/keys/script");



const generateJWTtoken = payload =>
  new Promise((resolve, reject) => {
    

    const iss="Flam authServer";
    const sub = "user@filename.com";
    const exp = "24h"
    
    const signOptions = {

        issuer:iss,
        subject:sub,
        expiresIn:exp,
        algorithm:"RS256"

    }

    payLoad={...payload};

    jwt.sign(payLoad, privateKey, signOptions,(err, token) => {
        if (err) return reject(err);
        return resolve(token);
      });

    
  });

module.exports = Object.assign({}, { generateJWTtoken});
