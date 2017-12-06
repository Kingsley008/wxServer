const mongoose = require('mongoose');

const { Schema } = mongoose;

const SensorSchema = new Schema(
    {
        sensor_code: { type: String, index: { unique: true } },
        stall_code: { type: String, index: { unique: true } },
        owner_list: [String],
    },

    { collection: 'sensors' }
);

const Sensor = mongoose.model('Sensor', SensorSchema);

module.exports = Sensor;