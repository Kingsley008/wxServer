var express = require('express');
var router = express.Router();
const request = require('request');
const User = require('../../models/User.js');

/**
 * 获取客户端发来的请求： code - 用户凭证
 * 向微信服务器发起请求： 得到 openid
 * 数据库中记录： openid 和 userInfo
 * 返回openid 给客户端 进行保存
 * 之后客户端发送 openid 来判断当前的用户是否合法
 * **/
router.get('/login', function (req, res) {
    console.log('user api');
    const code = req.query.code;
    const nickName = req.query.nickName;
    const gender = req.query.gender;
    const province = req.query.province;

    request.get({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
            grant_type: 'authorization_code',
            appid: 'wx1ff0ff3dc35a1f7d',
            secret: '436209b1c40f09bd2eac18d5d313f91a',
            js_code: code
        }
    }, (err, response, data) => {
        if (response.statusCode === 200) {
            console.log("[openid]", data.openid);
            console.log("[session_key]", data.session_key);
            //TODO:将open_id 和 userInfo 存入到数据库中 返回 open_id 存入到wx localStorage中
            let openId = data.openid;
            let _user = {
                open_id: openId,
                nickName: nickName,
                gender: gender,
                province:province,
            };
            const new_user = new User(_user);
            new_user.save(function (err,user) {
                if(err){
                    // 如果该 openid 已经存在 直接返回
                    console.log(err);
                    res.json({openid: data.openid})
                }else{
                    console.log(user);
                    res.json({openid: data.openid})
                }
            })

        } else {
            console.log("[error]", err);
            res.json(err)
        }
    })
});
/**
 *  通过wx本地存储的openid来查找用户
 *
 * **/
router.get('/user', function (req, res) {
    const openid  = req.query.openid;
    console.log(openid);
    // User.findByOpenId(openid, function (err,ret) {
    //     if(err){
    //
    //     } else {
    //         res.status(200).json(ret)
    //     }
    // })
    User.findOne({open_id:openid})
        .then(function (result) {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            let {message} = err;
            res.status(404).json({message})
        })
});


module.exports = router;