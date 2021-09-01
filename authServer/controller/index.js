const uuidv4 = require("uuid/v4");
const Hashids = require("hashids");
const URL = require("url").URL;

const { generateJWTtoken } = require("./jwt");

const AUTH = "authorization";
const BEARER = "bearer";

const regex = /(\S+)\s+(\S+)/;
//split the auth header to get scheme and token
function parseHeader(headerValue) {
  if (typeof headerValue !== "string") {
    return null;
  }
  const hdr = headerValue.match(regex);
  return hdr && { scheme: hdr[1], value: hdr[2] };
}

//get the token from header
const fromAuthHeader = function(authScheme) {
  const authSchemeLower = authScheme.toLowerCase();
  return function(request) {
    let token = null;
    if (request.headers[AUTH]) {
      const authParams = parseHeader(request.headers[AUTH]);
      if (authParams && authSchemeLower === authParams.scheme.toLowerCase()) {
        token = authParams.value;
      }
    }
    return token;
  };
};

const AuthHeaderBearerToken = function() {
  return fromAuthHeader(BEARER);
};

//get bearer token
const appTokenFromReq = AuthHeaderBearerToken();

// app token to validate the request is coming from the authenticated server only.
const applicationDB = {
  consumer1: "k2P8xkPR34dSgTAvF36VpGMW2DBL",
  consumer2: "1g0jJwGmRQhJwvwNOrY4i90kD0m"
};

//cors
const allowedConsumers = {
  "http://127.0.0.1:3020": true,
  "http://127.0.0.1:3030": true
};

//remove "-" form generated uuid
const hashids = new Hashids();
const deHyphenatedUUID = () => uuidv4().replace(/-/gi, "");
const encode = () => hashids.encodeHex(deHyphenatedUUID());

//cache to store session state
const userSession = {};
const consumerSession = {};

const consumerName = {
  "http://127.0.0.1:3020": "consumer1",
  "http://127.0.0.1:3030": "consumer2",
};

//user details
const userDB = {
  "admin@flam.com": {
    password: "123",
    userId: encode(), 
    appPolicy: {
      consumer1: { role: "admin", shareEmail: true },
      consumer2: { role: "user", shareEmail: false }
    }
  }
};

// these token are for the validation purpose
//Intermediate token cache (consumer <----> auth server)
const authTokenCache = {};

const cacheAuthToken = (origin, sid, authToken) => {
  authTokenCache[authToken] = [sid, consumerName[origin]];
};

const cacheApp = (origin, sid, authToken) => {
  if (consumerSession[sid] == null) {
    consumerSession[sid] = {
      [consumerName[origin]]: true
    };
    cacheAuthToken(origin, sid, authToken);
  } else {
    consumerSession[sid][consumerName[origin]] = true;
    cacheAuthToken(origin, sid, authToken);
  }
  console.log("Here" , { ...consumerSession }, { ...userSession }, { authTokenCache });
};



//validation
const getLogin = (req, res, next) => {
  
  const { email, password } = req.body;
  if (!(userDB[email] && password === userDB[email].password)) {
    return res.status(404).json({ message: "Invalid email and password" });
  }

  const { redirectURL } = req.query;
  const sid = encode(); //sessionID
  req.session.user = sid;
  //session cache
  userSession[sid] = email;
  if (redirectURL == null) {
    return res.redirect("/");
  }
  const url = new URL(redirectURL);
  const authToken = encode();

  cacheApp(url.origin, sid, authToken);
  return res.redirect(`${redirectURL}?authToken=${authToken}`);
};

const login = (req, res, next) => {
  
  const { redirectURL } = req.query;
  
  if (redirectURL != null) {
    const url = new URL(redirectURL);
    //check if consumer is of valid origin
    if (allowedConsumers[url.origin] !== true) {
      return res
        .status(400)
        .json({ message: "Wait a minute! who are you?" });
    }
  }
  
  //redirect to home page of auth server 
  if (req.session.user != null && redirectURL == null) {
    return res.redirect("/");
  }
  // if already authenticated (has global session set)
  if (req.session.user != null && redirectURL != null) {
    const url = new URL(redirectURL);
    const authToken = encode();
    cacheApp(url.origin, req.session.user, authToken);
    return res.redirect(`${redirectURL}?authToken=${authToken}`);
  }

  return res.render("login", {
    title: "Auth-Server | Login"
  });
};


const generatePayload = authToken => {
  const globalSessionToken = authTokenCache[authToken][0]; //global session ID
  const appName = authTokenCache[authToken][1];
  const userEmail = userSession[globalSessionToken];
  const user = userDB[userEmail];
  const appPolicy = user.appPolicy[appName];
  const email = appPolicy.shareEmail === true ? userEmail : undefined;
  const payload = {
    ...{ ...appPolicy },
    ...{
      email,
      shareEmail: undefined,
      uid: user.userId,
      globalSessionID: globalSessionToken
    }
  };
  return payload;
};




const verifyAuthToken = async (req, res, next) => {
  const consumerToken = appTokenFromReq(req); //trust token
  const { authToken } = req.query;
  
  if (
    consumerToken == null ||
    authToken == null ||
    authTokenCache[authToken] == null
  ) {
    return res.status(400).json({ message: "Bad Request" });
  }

  
  const appName = authTokenCache[authToken][1];
  const globalSessionToken = authTokenCache[authToken][0]; //sid
  
//Check if app is registered and has been looged in
  if (
    consumerToken !== applicationDB[appName] ||
    consumerSession[globalSessionToken][appName] !== true
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const payload = generatePayload(authToken);

  const token = await generateJWTtoken(payload);
 
  delete authTokenCache[authToken];
  return res.status(200).json({ token });
  
};





module.exports = Object.assign({}, { getLogin, login, verifyAuthToken });
