/**
 * Created by 姜昊 on 2016/5/9.
 */

var mysqlAdapter = require('sails-mysql');
var adapters={
    mysql:mysqlAdapter,
    default:'mysql'
};

var connections ={
    mysql:{
        adapter:'mysql',
        url:"mysql://root:haoting521@123.206.70.236/mailbox"
    }
};
var config = {
    adapters:adapters,
    connections:connections
};
exports.config = config;