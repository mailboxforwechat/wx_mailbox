var express = require('express');
var path = require('path');
var config = require('./config');
var wxprocessor = require('./wxprocessor');
var app = express();
var xmlparser = require('express-xml-bodyparser');
var Util = require('./util');
var util = new Util();
var settings = new config();
var processor = new wxprocessor();
// var OAuth = require('wechat-oauth');
// var client = new OAuth(settings.APPID,settings.APPSECRET);

//var url = client.getAuthorizeURL('http://123.206.75.54:4000', 'state', 'scope');

// var url = client.getAuthorizeURLForWebsite('redirectUrl');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

util.createMenu();

app.get('/',function(req,res){
  var query = require('url').parse(req.url).query;
  var params = require('qs').parse(query);
  var signature = params.signature||"";
  var timestamp = params.timestamp||"";
  var nonce = params.nonce||"";
  var echostr = params.echostr||"";
  if(signature!==""&&timestamp!==""&&nonce!==""&&echostr!==""){
    console.log('验证签名');
    if(!processor.checkSignature(params, settings.TOKEN)){//签名错误
      res.end('signature fail');
    }else{
      res.end(params.echostr);
    }
  }else{
    res.render('index',{title:'邮箱绑定'});
  }
});

app.post('/',xmlparser({trim: false, explicitArray: false}),function(req,res,next){
  console.log(req.body);
  res.end("");
});


app.listen(settings.PORT,function(req,res){
  console.log("Server runing at port: " + settings.PORT);
});
