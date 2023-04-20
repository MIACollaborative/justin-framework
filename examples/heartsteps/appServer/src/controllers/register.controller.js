const bcrypt = require('bcrypt');
const ROLES_LIST = require('../config/rolesList.config');
const USER_TYPES = require('../config/userTypes.config');
const { User } = require('../models/user.model');
const { scheduleCronSurvey } = require('../services/cron.service');

const handleNewParticipant = async (req, res) => {
  const { user, pwd, whatsappNum, surveyTime } = req.body;
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
    console.log('surveyTime.length: ', surveyTime.length);
    if (surveyTime.length !== 0) {
      // TODO: delete log in production
      const result = await User.create({
        username: user,
        password: hashedPwd,
        type: USER_TYPES.Participant,
        // TODO: add validation so two users can't have same number
        whatsappNum: 'whatsapp:+' + whatsappNum.toString(),
        surveyTime: surveyTime
      });
      console.log(result);
      // scheduleCronSurvey(result);
    } else {
      // TODO: delete log in production
      const result = await User.create({
        username: user,
        password: hashedPwd,
        type: USER_TYPES.Participant,
        // TODO: add validation so two users can't have same number
        whatsappNum: 'whatsapp:+' + whatsappNum.toString()
      });
      console.log(result);
      // scheduleCronSurvey(result);
    }

    res.status(201).json({ success: `New Participant ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleNewStaff = async (req, res) => {
  const { user, pwd, participantList } = req.body;
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
    // TODO: test - type: 'staff' should auto-populate roles
    const result = await User.create({
      username: user,
      password: hashedPwd,
      type: USER_TYPES.Staff,
      participantList: participantList ? participantList : []
    });
    // TODO: delete log in production
    console.log(result);

    res.status(201).json({ success: `New Staff ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewParticipant, handleNewStaff };
