const isAuthenticated = (req, res, next) => {
    
    const callbackURL = `${req.protocol}://${req.headers.host}${req.path}`;
    if (req.session.user == null) {
      return res.redirect(
        `http://localhost:3010/auth/login?serviceURL=${callbackURLL}`
      );
    }
    next();
  };
  
  module.exports = isAuthenticated;
  