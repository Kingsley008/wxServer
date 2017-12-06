const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
    order_id:{ type:Number, index:{unique:true} },
    open_id:{ type:String },
    park_name:{ type:String },
    date:{ type:Date, default:Date.now()},
    start:{ type:String },// 停车开始时间 关联地磁状态
    end:{ type:String, default:''},// 停车结束时间 关联地磁状态
    duration:{ type:String, default:'' }, // '2:00:20'
    cost:{ type:Number, default:'' }, // 微信支付 单位/分 - 转换
    pay_way:{type:Number, default:1},  // 支付方式：1 微信支付  0 现金
    discount:{type:Number, default:0}, // 红包接口
    is_pay:{type:Boolean, default:''},   // 是否支付
    is_normal:{type:Boolean, default:true} // 订单是否正常 true 为没有丢包现象
},
    { collection: 'order' }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;