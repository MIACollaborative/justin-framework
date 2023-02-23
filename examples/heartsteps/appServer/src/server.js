const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
// import restaurants from './routes/api/restaurants.route.js';
const corsOptions = require('./config/corsOptions.config');
const verifyJWT = require('./middleware/verifyJWT.middleware');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials.middleware');
const connectDB = require('./config/dbConn.config');
const PORT = process.env.PORT || 4000;

connectDB();

/* 
MUST BE BEFORE CORS
Handle options credentials check
and fetch cookies credentials requirement
*/
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// app.use('/api/v1/restaurants', restaurants);

// THESE ROUTES MUST COME BEFORE verifyJWT MIDDLEWARE
app.use('/register', require('./routes/register.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/refresh', require('./routes/refresh.routes'));
app.use('/logout', require('./routes/logout.routes'));
app.use('/ping', (req, res) => res.status(200).json({ message: 'pong' }));

app.use(verifyJWT); // everything underneath this line uses JWT tokens

// THESE ROUTES MUST COME AFTER JWT MIDDLEWARE
app.use('/protected', require('./routes/api/protected.routes'));
app.use('/users', require('./routes/api/users.routes'));

app.use('*', (req, res) => res.status(404).json({ error: 'not found' }));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
