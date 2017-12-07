const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

/**
 *  处理付款完成的请求
 *  设置 is_pay 为 true
 * **/
router.get('/', (req, res)=> {

    const order_id = req.query.order_id;

    Order.update({order_id: order_id},{
        '$set':{'is_pay':true}
    },{multi: true},function (err,docs) {
        if(err) console.log(err);
        console.log('更改成功：' + docs); // 返回受影响的行数
        res.status(200).json({ret:1}); // 支付成功
    });


});

module.exports = router;
