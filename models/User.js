let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        open_id :{type:String,  unique: true}, // 用户唯一标识 用于身份认证和支付
        nickName:{type:String}, // 用户昵称
        province:{type:String}, // 所在省份
        gender:{type:Number}, // 1 男  0 女
        red_package:{type:Number,default:0}, // 红包 单位元
        wallet_money:{type:Number,default:0}, // 钱包 单位元
        meta: {
            createAt: {
                type: Date,
                default: Date.now()
            },
            updateAt: {
                type: Date,
                default: Date.now()
            }
        }
    },
    // TODO 生产环境 表名变成 wxusers
    { collection:'wxusers'}
);

/**
 *  记录用户初次使用小程序的时间
 * **/
UserSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.updateAt = this.meta.createAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next()
});
/**
 *  Model层 方法声明
 * **/
UserSchema.statics = {
    fetch: function (cb) {
        return this.find({})
            .sort('meta.createAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this.findOne({_id: id})
            .sort('meta.createAt')
            .exec(cb);
    },
    findByOpenId: function (openid, cb) {
        return this.findOne({open_id: openid})
            .sort('meta.createAt')
            .exec(cb);
    }
};


const User  = mongoose.model('User', UserSchema);

module.exports = User;