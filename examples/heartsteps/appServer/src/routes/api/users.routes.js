const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/users.controller');
const ROLES_LIST = require('../../config/rolesList.config');
const verifyRoles = require('../../middleware/verifyRoles.middleware');

router
  .route('/')
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router
  .route('/participants')
  .get(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    usersController.getAllParticipants
  );

router
  .route('/staff')
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Staff),
    usersController.getAllStaff
  );

router
  .route('/:username')
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getParticipantByUsername);

module.exports = router;
