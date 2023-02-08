const bcrypt = require('bcrypt');
const ROLES_LIST = require('../config/rolesList.config');
const User = require('../models/user.model');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) {
    return res.sendStatus(409); // Conflict
  }
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // TODO: change so user roles can be created at register page?
    // store the new user, roles is set to participant by default
    const result = await User.create({
      username: user,
      password: hashedPwd
    });

    // TODO: delete log in production
    console.log(result);

    res.status(201).json({ success: `New User ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
