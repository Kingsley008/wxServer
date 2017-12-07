const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Tmote = require('../../models/TMoteStatus');

/**
 * params：
 *
 * 查看 status 是否为空
 * 1. 如果不为空 返回一个 ret: 0
 * 2. 如果为空 通过计时开始时间去查找对应的字段得到停车时间  并且 生成订单
 * **/
router.get('/',(req, res) => {
    // TODO 根据timeBegin 查找对应计时字段
    // const timeBegin = req.query.timeBegin;
    const sensor_code = req.query.sensor_code;
    const order_id = req.query.order_id;
    let duration = 0;
    let cost = 0; // 单位/分
    let minutes = 0;

    console.log(sensor_code, order_id);
    // TODO 先不考虑用户不立即付费的情况
    Tmote.findOne({SN:sensor_code})
        .then((ret)=>{
            // 车未开出 结算订单无效
            console.log(ret.Status);
            let status = ret.Status; // 1有车  0 没车
            if(status){
                // ret 0 有车
                res.status(200).json({ret:0})

            } else {
                // 更新菜单
                const end = ret.hData[0].TimeTermine;
                duration = ret.hData[0].OccupyTime;
                if(duration !== 0){
                    minutes = Math.ceil(duration / 1000 / 60);
                    cost = Math.ceil(minutes * 100); // 以分为单位  测试：1元1分钟
                }else{
                    res.status(200).json({ret:0,message:'程序处理异常，请报错'})
                }
                Order.update({order_id: order_id},{
                    '$set':{'cost': cost/100, 'duration':duration, 'end':end }
                },{multi: true},function (err,docs) {
                    if(err) console.log(err);
                    console.log('更改成功：' + docs); // 返回受影响的行数
                    res.status(200).json({ret:1,duration:minutes, cost:cost/100});
                });

            }
        })
});

module.exports = router;
