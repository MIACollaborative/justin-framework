// const express = require('express');
// const router = express.Router();
// const coachController = require('../../controllers/users.controller');
// const ROLES_LIST = require('../../config/rolesList.config');
// const verifyRoles = require('../../middleware/verifyRoles.middleware');

// router
//   .route('/')
//   .get(verifyRoles(ROLES_LIST.Admin), coachController.getAllCoaches)
//   .delete(verifyRoles(ROLES_LIST.Admin), coachController.deleteCoach);

// router
//   .route('/:id')
//   .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Staff), coachController.getCoach);

// module.exports = router;
