const isAuthenticated = (req, res, next) => {

    //Check if logged in? if not then redirect to authServer with callbackURL as query param
    
    const callbackURL = `${req.protocol}://${req.headers.host}${req.path}`; //return to this URL after authentication
    if (req.session.user == null) {
      return res.redirect(
        `http://localhost:3010/auth/login?redirectURL=${callbackURL}`
      );
    }
    next();
  };
  
  module.exports = isAuthenticated;
  