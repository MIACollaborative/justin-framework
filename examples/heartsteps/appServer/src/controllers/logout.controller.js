const User = require('../models/user.model');

const handleLogout = async (req, res) => {
  // TODO: SECURITY - on frontend, also delete accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // Success, No Content
  }
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    // TODO: SECURITY - SET SECURE TO TRUE, VERY IMPORTANT
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();

  // TODO: SECURITY - delete log for production
  console.log(result);

  // TODO: SECURITY - SET SECURE TO TRUE, VERY IMPORTANT
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
  res.sendStatus(204);
};

module.exports = { handleLogout };
