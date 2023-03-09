const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/rolesList.config');
const verifyRoles = require('../../middleware/verifyRoles.middleware');

const protectedUserCtrl = (req, res) =>
  res.status(200).json({ message: 'user protected' });

const protectedAdminCtrl = (req, res) =>
  res.status(200).json({ message: 'admin protected' });

const protectedStaffCtrl = (req, res) =>
  res.status(200).json({ message: 'staff protected' });

// need a JWT to access '/user' so don't need to verifyRoles here
router.route('/user').get(protectedUserCtrl);
router.route('/admin').get(verifyRoles(ROLES_LIST.Admin), protectedAdminCtrl);
router
  .route('/staff')
  .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Staff), protectedStaffCtrl);

module.exports = router;
