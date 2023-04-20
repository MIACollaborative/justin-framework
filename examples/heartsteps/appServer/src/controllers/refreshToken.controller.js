const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;

  // find a user where user.refreshToken === cookies.jwt
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.sendStatus(403); //Forbidden
  }
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      // TODO: change expiration length TO MATCH auth.controller expiration
      { expiresIn: '10m' }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
