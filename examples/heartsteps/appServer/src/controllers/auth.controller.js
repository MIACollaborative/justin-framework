const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  console.log('INSIDE HANDLE LOGIN');
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) {
    console.log('ERROR: USER NOT FOUND DURING LOGIN');
    return res.sendStatus(401); // Unauthorized
  }
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  console.log('password match bool: ', match);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    // TODO: SECURITY - ideally store accessToken in memory
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      // TODO: change expiration length TO MATCH refresh.controller expiration
      { expiresIn: '10s' }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      // TODO: change expiration length
      { expiresIn: '15s' }
    );

    // saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // TODO: SECURITY - delete log for production
    console.log(result);

    // TODO: change maxAge to larger amount
    // const oneDayInMs = 24 * 60 * 60 * 1000;
    const fifteenSecInMs = 15000;
    // TODO: change expiration length
    res.cookie('jwt', refreshToken, {
      // httpOnly: true,
      // sameSite: 'None',
      // TODO: SECURITY - SET SECURE TO TRUE, VERY IMPORTANT
      // TODO: describe thunderclient limitations with 'secure: true'
      // secure: true,
      // maxAge: oneDayInMs
      maxAge: fifteenSecInMs
    });
    res.json({ accessToken });
  } else {
    console.log('ERROR: LOGIN PASSWORDS DO NOT MATCH');
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
