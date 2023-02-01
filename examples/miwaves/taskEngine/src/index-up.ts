import express, { Express, Request, Response } from 'express';
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
//import {Strategy} from "passport-http-bearer";
import dotenv from 'dotenv';
//var db = require('./db');

dotenv.config();

var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var morgan = require('morgan');
var logger = morgan('combined'); //dev

const session = require("express-session");

const MongoStore = require("connect-mongo");
//var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

const app: Express = express();
const port = process.env.PORT;


app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_CONN_STRING
  })
}));

app.use(passport.authenticate('session'));

//app.use('/', indexRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});