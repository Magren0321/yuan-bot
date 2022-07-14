'use strict';

import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/yuan-bot');

const db = mongoose.connection;

db.once('open' ,() => {
  console.log(
    '连接数据库成功'
  );
})

db.on('error', function(error) {
    console.error(
     'Error in MongoDb connection: ' + error
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
        '数据库断开，重新连接数据库'
    );
});

export default db;
