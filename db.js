let mongoose = require('mongoose');
/**
 * connect the database of mongo
 * add the mechanism reconnect
 * **/
mongoose.connect('mongodb://root:root@localhost:27017/test', {
    server:{ auto_reconnect: true},
    useMongoClient:true
});

let db = mongoose.connection;

db.once('open',() => {
   console.log('Connection using Mongoose succeed!')
});

// 重新连接
db.on('close', function () {
   console.log('Closed, reconnection...');
    mongoose.connect('mongodb://root:root@localhost:27017/test', {
        server: { auto_reconnect: true }
    });
});

db.on('error', console.error.bind(console, 'connection error'));

module.exports = mongoose;