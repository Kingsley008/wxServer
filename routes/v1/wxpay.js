var express = require('express');
var router = express.Router();
const wxpay = require('../../util/wxpay');
const config = require('../../config/wxapp');

/**
 * 支付接口封装
 * param 需要得到当前用户的 openid
 * param 需要得到当前费用-- 去数据库中检索
 * **/
function unifiedorder(req, res) {

    let body = "测试支付";
    let openid = req.query.openid;
    let total_fee = req.query.cost * 100;
    let notify_url = "http://localhost:8000/v1/wxpay/order";
    let mch_id = config.admin.shopId;
    let attach = "测试";
    wxpay.order(attach, body, mch_id, openid, total_fee, notify_url)
        .then(function (data) {
            // 第一次签名成功
            console.log('data--->', data, 123123);
            res.json(data)
        })
}

/**
 *  支付接口
 * **/
router.get('/order', function (req, res) {
    unifiedorder(req, res)
});

module.exports = router;

