const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/status', adminController.updateUserStatus);

module.exports = router;
