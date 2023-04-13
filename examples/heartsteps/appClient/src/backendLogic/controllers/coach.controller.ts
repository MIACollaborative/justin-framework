const User = require('../models/user.model');
const Coach = require('../models/coach.model');
const Express = require('express');

// NOTE: These functions should work out of the box

// used to fetch coachID so that participant.coachID field will match
const getCoachById = async (req: any, res: any) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: 'Coach ID required' });
  const coach = await Coach.findOne({ _id: req.params.id }).exec();
  if (!coach) {
    return res
      .status(204)
      .json({ message: `Coach ID ${req.params.id} not found` });
  }
  res.json(coach);
};

const getCoachByName = async (req: any, res: any) => {
  if (!req?.params?.name)
    return res.status(400).json({ message: 'Coach name required' });
  const coach = await Coach.findOne({ name: req.params.name }).exec();
  if (!coach) {
    return res
      .status(204)
      .json({ message: `Coach with name: ${req.params.name} not found` });
  }
  res.json(coach);
};
