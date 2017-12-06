const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// var park = {
//     park_name:'这是一个测试的停车场',
//     park_code:'1234578',
//     zipcode:'310018',
//     responsible_person_phone:'0571-83031258',
//     responsible_person:'杭州目博科技有限公司',
//     state:'使用中',
//     area_name:'宁波大学孵化园',
//     address:'浙江省宁波市宁波大学孵化园',
//     type:'室内停车场',
//     plan:'车场',
//     offset_x: 120.372031,
//     offset_y: 130.303537,
//     stall_number: 0 ,
//     owner_list: ['admin','wywywy'],
// };

const ParkSchema = new Schema(
    {
        park_name: { type: String, default: '高新技术孵化园停车场' },
        park_code: { type: String, index: { unique: true } }, // 与车位表的 park_code 进行关联
        zipcode: { type: String, default: '310018' },

        responsible_person_phone: { type: String, default: '0571-83031258（默认）' },
        responsible_person: { type: String, default: '杭州目博科技有限公司（默认）' },
        state: { type: String, default: '使用中（默认）' },
        area_name: { type: String, default: '高新技术孵化园' },
        address: { type: String, default: '浙江省杭州市下沙江干区高新技术孵化园' },
        type: { type: String, default: '室内停车场' },
        plan: { type: String, default: '车场' },
        // charging_standard_name: { type: String, default: 'hahaha' },

        charging_standard_code: String,

        // area_code: String,
        is_appoint: String,
        is_reserve: String,
        offset_x: { type: Number, default: 120.372031 },
        offset_y: { type: Number, default: 30.303537 },
        stall_number: { type: Number, default: 0 },

        owner_list: [String], // 用于车位展示过滤
    },
    // TODO 真实环境为parks
    { collection: 'park' }
);
const Park = mongoose.model('Park', ParkSchema);

module.exports = Park;