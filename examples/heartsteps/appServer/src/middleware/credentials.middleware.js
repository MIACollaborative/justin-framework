const allowedOrigins = require('../config/allowedOrigins.config');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  console.log('origin inside credentials check: ', origin);
  // TODO: remove !origin for production security
  // allows localhost to run backend
  if (allowedOrigins.includes(origin) || !origin) {
    console.log('credentials check passed');
    res.header('Access-Control-Allow-Credentials', true);
  } else {
    console.log('credentials check failed');
  }
  next();
};

module.exports = credentials;
