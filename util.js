var https = require('https');
var fs = require('fs');
var config = require('./config');
var settings = new config();

function saveData(path,data){
    fs.writeFileSync(path,JSON.stringify(data,null,4));
}

function readData(path){
  var data = fs.readFileSync(path,{encoding:'utf-8'});
  return JSON.parse(data);
}

//从微信服务器获取AccessToken并写入本地文件
function getAccessToken(next){
  var APPID = settings.APPID;
  var APPSECRET = settings.APPSECRET;
  var LINK = "https://api.weixin.qq.com/cgi-bin/token"+
  "?grant_type=client_credential&appid="+APPID+"&secret="+APPSECRET;
  https.get(encodeURI(LINK),function(res){
    var data = "";
    res.on('data',function(chunk){
        data += chunk;
    });
    res.on('end',function(){
      var result = JSON.parse(data);
      result.timeout = Date.now() + 7000000;
      saveData("data.json",result);
      next(result.access_token);
    });
  }).on('err',function(err){
    console.log("获取AccessToken出错"+err);
    return;
  });
}

function Util(){

}
Util.prototype = {
  constructor:Util,
  //sha1加密
  sha1:function(text){
    var sha1 = require('crypto').createHash('sha1');
    sha1.update(text);
    return sha1.digest('hex');
  },
  //获取本地的AccessToken
  getLocalAccessToken:function(next){
    var token;
    if(fs.existsSync('data.json')){
      token = readData('data.json');
    }
    if(!token||token.timeout<Date.now()){//不存在或者已过期
      getAccessToken(next);
    }else{
      next(token.access_token);
    }
  },
  //创建菜单
  createMenu:function(){
    this.getLocalAccessToken(function(token){
      console.log('创建菜单');
      var menu = {
    "button": [
      {
            "name": "邮箱管理",
            "sub_button": [
                {
                    "type": "view",
                    "name": "绑定邮箱",
                    "url": "http://123.206.70.236:2828/"
                },
                {
                    "type": "click",
                    "name": "解除绑定",
                    "key": "V1001_GOOD"
                }
            ]
        },
        {
            "name": "信箱查看",
            "sub_button": [
                {
                    "type": "click",
                    "name": "收信箱",
                    "key": "V1001_GOOD"
                },
                {
                    "type": "click",
                    "name": "发件箱",
                    "key": "V1001_GOOD"
                },
                {
                    "type": "click",
                    "name": "草稿箱",
                    "key": "V1001_GOOD"
                }
            ]
        }
    ]
};
      var post_str = new Buffer(JSON.stringify(menu));
      var access_token = token;
      var opt = {
      host: 'api.weixin.qq.com',
      path: '/cgi-bin/menu/create?access_token=' + access_token,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_str.length
       }
      };
      var req = https.request(opt, function (response) {
      var responseText = [];
      response.setEncoding('utf8');
      response.on('data', function (data) {
          responseText.push(data);
      });
      response.on('end', function () {
          console.log(responseText);
      });
     });
     req.write(post_str);
     req.end();
    });
  },

  //数据库邮箱类型字串解析器
  mailtypeParser:function(mailtype,addtype){
      console.log(mailtype+"     "+addtype);
      if(mailtype==null) {
          mailtype = addtype;
          return mailtype;
      }else{
          var strs=[]; //定义一数组
          var contain=0;
          strs=mailtype.split(","); //字符分割
          for(i=0;i<strs.length;i++){
              if(strs[i]!=addtype)
                  continue;
              else{
                  contain=1;
                  break;
              }
          }
          if(contain==0){
              mailtype=mailtype+","+addtype;
          }
          return mailtype;
      }
  },

    //数据库邮箱类型字串删除器
    mailtypeDel:function(mailtype,deltype){
        console.log(mailtype+"     "+deltype);
        if(mailtype==null) {
            return mailtype;
        }else{
            var strs=[]; //定义一数组
            var tempstr;
            strs=mailtype.split(","); //字符分割
            console.log(strs);
            for(i=0;i<strs.length;i++){
                if(strs[i]!=deltype){
                    if(tempstr==null)
                        tempstr=strs[i];
                    else
                        tempstr=tempstr+","+strs[i];
                }
            }
            return tempstr;
        }
    }

};
module.exports = Util;
