let express = require('express');
let user = require('./user');
let wxpay = require('./wxpay');
let markers = require('./markers');
let preorder = require('./preorder');
let sensor  = require('./order');
let prelose = require('./prelose');
let router = express.Router();

router.use('/user',user);

router.use('/wxpay',wxpay);

router.use('/markers', markers);

router.use('/preorder', preorder);

router.use('/order', sensor);

router.use('/prelose', prelose);

module.exports = router;