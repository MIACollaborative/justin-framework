const express = require('express');
const router = express.Router();
const dialogueController = require('../../controllers/dialogue.controller');
const ROLES_LIST = require('../../config/rolesList.config');
const verifyRoles = require('../../middleware/verifyRoles.middleware');

// NOTE: these API endpoints need to be unit-tested and tested with the frontend

router
  .route('/')
  .get(verifyRoles(ROLES_LIST.Admin), dialogueController.getAllDialogueObjs)
  .delete(verifyRoles(ROLES_LIST.Admin), dialogueController.deleteDialogueObj);

router
  .route('/:id')
  .get(verifyRoles(ROLES_LIST.Admin), dialogueController.getDialogueObj);

router
  .route('/updateUtterances/:newDialogueID')
  .post(
    verifyRoles(ROLES_LIST.Participant),
    dialogueController.updateDialogueUtterances
  );

module.exports = router;
