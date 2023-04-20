const express = require('express');
const registerController = require('../controllers/register.controller.js');
const ROLES_LIST = require('../config/rolesList.config');
const verifyRoles = require('../middleware/verifyRoles.middleware');

const router = express.Router();

router
  .route('/participant')
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Staff),
    registerController.handleNewParticipant
  );

router
  .route('/staff')
  .post(verifyRoles(ROLES_LIST.Admin), registerController.handleNewStaff);
// .post(registerController.handleNewStaff);

module.exports = router;
