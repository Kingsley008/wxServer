const express = require('express');

const router = express.Router();

const ParkStall = require('../../models/ParkStall');

/**
 *  得到小程序端用户的标识符
 *  进行过滤
 * **/
router.get('/', (req, res) => {

    // const client = req.query.client;
    ParkStall.aggregate([
        {   // 将当前车位与车位所属的停车场关联起来  停车场的数据在park数组中
            $lookup: {
                from: 'park', // 需要关联的表
                localField: 'park_code', // 当前的表需要关联的键
                foreignField: 'park_code', // 关联到parks表的外键
                as: 'park',  //  对应的外键集合的数据
            },
        },
        // 将park数组字段分解 park:{}
        {
            $unwind: {
                path: '$park',
                preserveNullAndEmptyArrays: true,
            },
        },
        // 再和sensors表关联
        {
            $lookup: {
                from: 'sensors',
                localField: 'stall_code', // 当前表的地磁号
                foreignField: 'stall_code', // 地磁表的地磁号
                as: 'sensor',
            },
        },
        // 同理
        {
            $unwind: {
                path: '$sensor',
                preserveNullAndEmptyArrays: true,
            },
        },
        // 地磁的状态表  数据库中已有 不用创建
        {
            $lookup: {
                from: 'tmote_status',
                localField: 'sensor.sensor_code',
                foreignField: 'SN',
                as: 'tmote_status',
            },
        },
        {
            $unwind: {
                path: '$tmote_status',
                preserveNullAndEmptyArrays: true,
            },
        },
        // 进行客户过滤
        {
            $match: {
                'sensor.owner_list': 'wywywy',
            },
        },
        // 投影结果
        {
            $project: {
                id: '$_id',
                stall_form: 1,
                plan: 1,
                offset_x: 1,
                offset_y: 1,
                stall_code: 1,
                park_name: '$park.park_name',
                park_code: '$park.park_code',
                sensor_code: '$sensor.sensor_code',
                status: '$tmote_status.Status',
            },
        },
    ])
        .then((data) => {
            res.status(200).json({
                data,
                total: data.length,
            });
        })
        .catch((err) => {
            const { message } = err;
            res.status(404).json({ message });
        });
});
module.exports = router;
