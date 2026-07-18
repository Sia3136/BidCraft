const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const adminController = require('../controllers/adminController');

router.use(auth);
router.use(adminMiddleware);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// User Management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Listing Moderation
router.get('/listings', adminController.getListings);
router.delete('/listings/:id', adminController.deleteListing);

// Reports
router.get('/reports', adminController.getReports);
router.patch('/reports/:id/status', adminController.updateReportStatus);

// Disputes Admin Override
router.get('/disputes', adminController.getDisputes);
router.patch('/disputes/:id/resolve', adminController.adminResolveDispute);

// KYC Approval Flow
router.get('/kyc', adminController.getPendingKyc);
router.patch('/kyc/:userId', adminController.reviewKyc);

module.exports = router;
