/**
 * Created by 姜昊 on 2016/5/9.
 */
var waterline = require('waterline');

var user = waterline.Collection.extend({
    identity:'user',
    connection:'mysql',
    schema:true,
    migrate: 'safe',
    autoCreatedAt:false,
    autoUpdatedAt:false,
    attributes: {
        userid: {
            type: 'string',
            required: true
        },
        mailtype: {
            type: 'string'
        },
        qqusername: {
            type: 'string'
        },
        qqpassword: {
            type: 'string'
        },
        qqauthcode: {
            type: 'string'
        },
        neusername: {
            type: 'string'
        },
        nepassword: {
            type: 'string'
        },
        neauthcode: {
            type: 'string'
        },
        pkuusername: {
            type: 'string'
        },
        pkupassword: {
            type: 'string'
        },
        pkuauthcode: {
            type: 'string'
        }
    }
});
exports.user=user;