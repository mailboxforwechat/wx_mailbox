var xmlParse = require('xml2js').parseString;
var Util = require('./util');
var util = new Util();
// 验证微信服务器的签名
function Processor(){

}
Processor.prototype = {
  constructor:Processor,
  checkSignature:function(params, token){//验证请求是否来自微信服务器
  //1. 将token、timestamp、nonce三个参数进行字典序排序
  //2. 将三个参数字符串拼接成一个字符串进行sha1加密
  //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  var key = [token, params.timestamp, params.nonce].sort().join('');
    return  util.sha1(key) == params.signature;
  },
  /*
   *@params wxdata 微信服务器发来的数据
   *@params res response对象
   */
  process:function(wxdata, res) {
    xmlParse(wxdata, function(err, data) {
      if (err) {
        console.log(err);
        res.end('err');
      } else {
        console.log(data);
      }
    });
  }
};
module.exports = Processor;
