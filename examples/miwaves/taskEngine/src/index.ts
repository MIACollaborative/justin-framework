import express, { Express, Request, Response } from 'express';
import passport from "passport";
var Strategy = require('passport-http-bearer').Strategy;
import { loadTestUsers } from './tests/loadusers.tests';
import { loadTestResponses } from './tests/loadresponses.tests';
//var BearerStrategy = require('passport-http-bearer').BearerStrategy;
//import {Strategy} from "passport-http-bearer";
import dotenv from 'dotenv';
import * as userService from './db/users.service';
import * as responseService from "./db/responses.service";
import { User } from './models/user.model';

// this mostly likely has to be at the top, below import
dotenv.config(); 



//var db = require('./db');




loadTestUsers();
loadTestResponses();

// Configure the Bearer strategy for use by Passport.
//
// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.
/*
passport.use(new Strategy(
  function(token, cb) {
    db.users.findByToken(token, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  }));
*/

  passport.use(new Strategy(
    async function(token, callback) {
      let theUser:User|null = null;
      let users = await userService.getAllUsers();

      for (let u of users) {
          u = u as User;
          console.log(`u: ${JSON.stringify(u)}`);
          console.log(`u.getToken(): ${u.getToken()}, token: ${token}`);
          if( u.getToken() == token){
            theUser = u;
            break;
          }
      }

      // return done(err);
      if (!theUser) { return callback(null, false); }
      return callback(null, theUser, { scope: 'all' });

      /*
      User.findOne({ token: token }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'all' });
      });
      */
    }
  ));

const app: Express = express();
const port = process.env.PORT;


// version 2: bearer token
app.get('/',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    console.log(`req["user"]: ${JSON.stringify(req["user"], null, 2)}`);
    if(req.user){
      res.json({ name: req["user"]["name"], email: req["user"]["email"] });
    }    
});

app.get('/users',
  passport.authenticate('bearer', { session: false }),
  async function(req, res) {
    //console.log(`req: ${JSON.stringify(req, null, 2)}`);
    let users = await userService.getAllUsers();
    let userNameList = users.map((userInfo) => {return userInfo?.getUsername()});
    res.json(userNameList);
  }
);

app.get('/users/:userName',
  passport.authenticate('bearer', { session: false }),
  async function(req, res) {
    //console.log(`req: ${JSON.stringify(req, null, 2)}`);
    let users = await userService.getAllUsers();
    let userList = users.filter((userInfo) => {return userInfo?.getUsername() == req.params.userName;});
    if(userList.length > 0 ){
      return res.json({...userList[0], token:null, email: null, name:null});
    }
    res.json({});
  }
);

app.get('/users/:userName/responses',
  passport.authenticate('bearer', { session: false }),
  async function(req, res) {
    console.log('/users/:userName/responses');
    const orderBy = req.query["orderBy"] != undefined? String(req.query["orderBy"]): "_id";
    const order = req.query["order"] != undefined? String(req.query["order"]): "asc";
    const limit = req.query["limit"] != undefined? Number(req.query["limit"]): 0;


    let items = await responseService.getResponseByParticipantId(req.params.userName, limit, orderBy, order);
    res.json(items);
  }
);

// version 1: no authentication
/*
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
*/

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});