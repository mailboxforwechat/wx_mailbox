var express = require('express');
var path = require('path');
var wxqiyehao = require("wechat-crypto")
var config = require('./config');
// var wxprocessor = require('./wxprocessor');
var session = require('express-session');
var app = express();
var xmlparser = require('express-xml-bodyparser');
var xml_Parse = require('xml2js').parseString;
// var Util = require('./util');
// var util = new Util();
var settings = new config();
// var processor = new wxprocessor();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

var openid ="";

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

//util.createMenu();

app.get('/',function(req,res){
  var query = require('url').parse(req.url).query;
  var params = require('qs').parse(query);
  var signature = params.msg_signature||"";
  var timestamp = params.timestamp||"";
  var nonce = params.nonce||"";
  var echostr = params.echostr||"";

  if(signature!==""&&timestamp!==""&&nonce!==""&&echostr!==""){
    console.log('验证签名');
    var crypto = new wxqiyehao(settings.TOKEN,settings.encodingAES,settings.corpID);
    var s = crypto.decrypt(echostr);
    res.end(s.message);
  }else{
    res.cookie('openid', openid);
    res.render('index',{title:'邮箱绑定', openid: openid});
  }
});

app.post('/',xmlparser({trim: false, explicitArray: false}),function(req,res,next){
  console.log(req.body);
  var crypto = new wxqiyehao(settings.TOKEN,settings.encodingAES,settings.corpID);
  var s = crypto.decrypt(req.body.xml.encrypt);
  console.log(s.message);
  xml_Parse(s.message, function(err, data) {
      if (err) {
        console.log(err);
        res.end('err');
      } else {
        console.log(data);
        console.log(data.xml.FromUserName);
        openid = data.xml.FromUserName;
      }
    });
  // var event = req.body.xml.event || "";
  // if (event === "VIEW") {
  //     console.log("123");
  // }
  // console.log(openid);
    res.end("");
});


app.listen(settings.PORT,function(req,res){
  console.log("Server runing at port: " + settings.PORT);
});
