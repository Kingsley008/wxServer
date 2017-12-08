const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const ParkStall = require('../../models/ParkStall');
const Sensor = require('../../models/Sensor');
const TMoteStatus = require('../../models/TMoteStatus');
const Park = require('../../models/Park');

/**
 *  产生一个预订单
 *  接收的参数： open_id  park_stall
 *  1. 判断 park_stall 是否存在 不存在返回 result: 0
 *  2. 存在 生成一个预订单
 * **/

let nextId = 0;

// 从数据库中得到最后一个id
Order.find().sort({'order_id': -1}).then((res)=>{
    nextId = res[0].order_id;
});

router.get('/', (req, res) => {
    const open_id = req.query.open_id;
    const stall_code = req.query.stall_code;
    let park_name = "";
    // 查询 stall_code 是否存在  -- 不存在返回3
    ParkStall.findOne({stall_code: stall_code})
        .then((rets) => {
            if (rets == null) {
                res.status(200).json({ret: 3, message:'您输入的车位号不存在'});
                return
            } else {
                // 查找对应的停车场的名字
                Park.findOne({park_code: rets.park_code})
                    .then((ret) => {
                        console.log(rets.park_code, ret.park_name);
                        park_name = ret.park_name
                    });

                // 通过stall_code 查询 对应的地磁
                Sensor.findOne({stall_code: stall_code})
                    .then((ret) => {
                        const sensor_code = ret.sensor_code;
                        // console.log(sensor_code);
                        TMoteStatus.findOne({SN: sensor_code})
                            .then((ret) => {
                                // 确认当前的车是否已经停进了车位 1 有车  0 无车
                                if(!ret.Status){
                                    //  考虑进入车位 但是 地磁状态为 0 丢包 丢包了 返回 0  让前端处理开始时间
                                    let _order = {
                                        order_id: ++nextId,
                                        open_id: open_id,
                                        park_name: park_name,
                                        stall_code: stall_code,
                                    };
                                    const new_order = new Order(_order);
                                    new_order.save((err) => {
                                        if (err) {
                                            res.status(404).json({ret: 0, err: err})
                                        }else{
                                            res.status(200).json({ret: 0,order_id:nextId, sensor_code:sensor_code})
                                        }
                                    });
                                    return

                                }

                                // 正常情况返回 1
                                const _order = {
                                    order_id: ++nextId,
                                    open_id: open_id,
                                    park_name: park_name,
                                    stall_code: stall_code,
                                    start: ret.hData[0].TimeBegin,
                                };

                                const new_order = new Order(_order);
                                new_order.save((err) => {
                                    if (err) {
                                        res.status(404).json({ret: 1, err: err})
                                    }else{
                                        res.status(200).json({ret: 1,order_id:nextId, sensor_code:sensor_code, start: ret.hData[0].TimeBegin})
                                    }
                                });

                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    })
                    .catch((err) => {
                        res.status(404).json({err: err});
                    });
            }
        })
        .catch((rets) => {
            res.status(404).json({ret: 0});
        })

});

module.exports = router;