const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

/**
 *  处理进入车位丢包的情况
 *  1. 将用户扫描的时间设置为订单开始的时间
 * **/
router.get('/', (req, res) => {
    const order_id = req.query.order_id;
    const time = req.query.time;
    console.log(time);
    Order.update({order_id: order_id},{
        '$set':{'start': time }
    },{multi: true},function (err,docs) {
        if(err){
            res.status(200).json({ret:0});
            console.log(err);
        }
        console.log('更改成功：' + docs); // 返回受影响的行数
        res.status(200).json({ret:1});
    });

});

module.exports = router;