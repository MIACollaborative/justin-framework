const USER_TYPES = require('../config/userTypes.config');
const { User } = require('../models/user.model');

const getAllParticipants = async () => {
  return await User.find({ type: USER_TYPES.Participant });
};

const getSurveyParticipants = async (cronTime = null) => {
  if (!cronTime) {
    return await User.find({ type: USER_TYPES.Participant });
  }
  return await User.find({
    type: USER_TYPES.Participant,
    surveyTime: cronTime
  });
};

const getParticipant = async (username) => {
  return await User.find({ type: USER_TYPES.Participant, username: username });
};

module.exports = {
  getAllParticipants,
  getSurveyParticipants,
  getParticipant
};
