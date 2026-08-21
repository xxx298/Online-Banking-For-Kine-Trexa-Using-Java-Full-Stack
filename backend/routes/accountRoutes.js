const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, accountController.getAccounts);
router.post('/', verifyToken, accountController.createAccount);
router.get('/:id', verifyToken, accountController.getAccountDetails);
router.patch('/:id/toggle-status', verifyToken, accountController.toggleAccountStatus);

module.exports = router;
