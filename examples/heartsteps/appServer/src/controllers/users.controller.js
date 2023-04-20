const USER_TYPES = require('../config/userTypes.config');
const { User } = require('../models/user.model');

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(204).json({ message: 'No users found' });
  }
  res.json(users);
};

const getAllParticipants = async (req, res) => {
  const participants = await User.find({ type: USER_TYPES.Participant });
  if (!participants) {
    return res.status(204).json({ message: 'No participants found' });
  }
  res.json(participants);
};

const getAllStaff = async (req, res) => {
  const staff = await User.find({ type: USER_TYPES.Staff });
  if (!staff) {
    return res.status(204).json({ message: 'No staff found' });
  }
  res.json(staff);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'User ID required' });
  }
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUserById = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'User ID required' });
  }
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(user);
};

const getParticipantByUsername = async (req, res) => {
  if (!req?.params?.username) {
    return res.status(400).json({ message: 'Username required' });
  }
  const user = await User.findOne({
    type: USER_TYPES.Participant,
    username: req.params.username
  }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `Username ${req.params.username} not found` });
  }
  res.json(user);
};

module.exports = {
  getAllUsers,
  getAllParticipants,
  getAllStaff,
  deleteUser,
  getUserById,
  getParticipantByUsername
};
