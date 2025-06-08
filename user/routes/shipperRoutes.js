const express = require('express');
const router = express.Router();
const shipperController = require('../controllers/shipperController');
const { isShipper } = require('../middlewares/authMiddleware');

router.get('/dashboard', isShipper, shipperController.getDashboard);
router.post('/accept', isShipper, shipperController.acceptOrder);
router.post('/deliver', isShipper, shipperController.deliverOrder);
router.post('/cancel', isShipper, shipperController.cancelOrder);
router.get('/history/filter', isShipper, shipperController.filterOrderHistory);
router.get('/earnings/chart', isShipper, shipperController.earningsChartData);
router.get('/orders', isShipper, shipperController.getOrdersPage);
router.get('/shipping', isShipper, shipperController.getShippingPage);
router.get('/history', isShipper, shipperController.getHistoryPage);

module.exports = router;