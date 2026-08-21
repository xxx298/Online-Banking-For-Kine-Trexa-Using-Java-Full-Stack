const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, transactionController.getTransactions);

module.exports = router;
