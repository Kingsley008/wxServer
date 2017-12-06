var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkStallSchema = new Schema(
    {
        park_code: { type: String },

        // 车位信息
        stall_code: { type: String, default: '车位编码（默认）', index: { unique: true } },
        plan: { type: String, default: '车检值（默认）' },
        stall_form: { type: String, default: '车位形式（默认）' },
        stall_pic: { type: String, default: '车位图片（默认）' },
        offset_x: { type: Number },
        offset_y: { type: Number },
        state: { type: String, default: '未启用（默认）' }
        // remark: { type: String, default: 'remark（默认）' },
    },
    { collection: 'parkStalls' }
);

const ParkStall = mongoose.model('ParkStall', ParkStallSchema);

module.exports = ParkStall;