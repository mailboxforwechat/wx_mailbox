/**
 * Created by 姜昊 on 2016/5/9.
 */
var waterline= require('waterline');
var user = require('./collections').user;

var orm = new waterline();
orm.loadCollection(user);
exports.orm = orm;