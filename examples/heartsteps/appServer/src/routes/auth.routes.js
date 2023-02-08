const express = require('express');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.post('/', authController.handleLogin);

module.exports = router;
