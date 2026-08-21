const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, transferController.executeTransfer);

module.exports = router;
