const express = require('express')
const router = express.Router();
const OrderController = require('../controllers/orders')
const checkAuth = require('../middleware/check-auth')


router.get('/',checkAuth, OrderController.order_get_all);

router.post('/',checkAuth,OrderController.create_new_order);

router.get('/:orderId',checkAuth,OrderController.find_order_detail);

router.patch('/:orderId',checkAuth,OrderController.update_order);

router.delete('/:orderId',OrderController.delete_order);

module.exports = router;
