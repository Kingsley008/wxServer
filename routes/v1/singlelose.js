const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

/**
 *  车辆驶入没有丢包
 *
 * **/
router.get('/', (req, res)=> {
    const duration = req.query.duration;
    let cost = 0;
    let minutes = 0;
    const end = req.query.end;
    const order_id = req.query.order_id;
    console.log(duration);
    if(duration !== 0){
        minutes = Math.ceil(duration / 1000 / 60);
        cost = Math.ceil(minutes * 100); // 以分为单位  测试：1元1分钟
    }else{
        res.status(200).json({ret:0,message:'程序处理异常，请报错'});
        return;
    }

    Order.update({order_id: order_id},{
        '$set':{'cost': cost/100, 'duration':duration, 'end':end }
    },{multi: true},function (err,docs) {
        if(err) console.log(err);
        console.log('更改成功：' + docs); // 返回受影响的行数
        res.status(200).json({ret:1,duration:minutes, cost:cost/100});
    });

});

module.exports = router;
