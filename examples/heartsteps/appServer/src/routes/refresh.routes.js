const express = require('express');
const refreshTokenController = require('../controllers/refreshToken.controller.js');

const router = express.Router();

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;
