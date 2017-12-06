const mongoose = require('mongoose');

const { Schema } = mongoose;

const TMoteStatusSchema = new Schema(
    {
        Status: Number,
        Count: Number,
        SN: String,
        hData: [
            {
                Count: Number,
                TimeBegin: String,  // 开始时间
                TimeTermine: String, // 结束时间
                TimeRefresh: String,
                Status:Number, // 状态核对
                OccupyTime:Number,  // 停车时间/毫秒
            },
        ],
        errData: [
            {
                Count: Number,
                TimeBegin: String,
                TimeTermine: String,
            },
        ],
    },
    { collection: 'tmote_status' }
);
const TMoteStatus  = mongoose.model('TMoteStatus', TMoteStatusSchema);
module.exports = TMoteStatus;


