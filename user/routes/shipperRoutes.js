const express = require('express');
const router = express.Router();
const shipperController = require('../controllers/shipperController');
const { isShipper } = require('../middlewares/authMiddleware');

router.get('/dashboard', isShipper, shipperController.getDashboard);
router.post('/accept', isShipper, shipperController.acceptOrder);
router.post('/deliver', isShipper, shipperController.deliverOrder);
router.post('/cancel', isShipper, shipperController.cancelOrder);

module.exports = router;