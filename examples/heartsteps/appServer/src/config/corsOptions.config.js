const allowedOrigins = require('./allowedOrigins.config');

const corsOptions = {
  /* 
  origin inside (origin, callback) params 
  is domain of website URL accessing API 
  */
  origin: (origin, callback) => {
    // TODO: SECURITY - REMOVE !origin BELOW IN PRODUCTION
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // 1st param: error status, 2nd param: boolean for 'is origin allowed?'
      console.log(`ALLOWED BY CORS: ${origin} `);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
