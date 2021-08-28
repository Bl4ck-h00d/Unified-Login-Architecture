const url = require("url");
const axios = require("axios");
const { URL } = url;
const JWTURL = "http://localhost:3010/auth/verifytoken";

const check = () => {
  return async function(req, res, next) {
    // check if the req has the queryParameter as authToken
    // and who is the referer.
    const { authToken } = req.query;
    
    if (authToken != null) {
      // to remove the authToken in query parameter redirect.
      const redirectURL = url.parse(req.url).pathname;
      try {
        const response = await axios.get(
          `${JWTURL}?authToken=${authToken}`,
          {
            headers: {
              Authorization: "Bearer k2P8xkPR34dSgTAvF36VpGMW2DBL"
            }
          }
        );
        //Incomplete
        
      } catch (err) {
        return next(err);
      }

      return res.redirect(`${redirectURL}`);
    }

    return next();
  };
};

module.exports = check;
