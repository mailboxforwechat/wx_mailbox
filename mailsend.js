/**
 * Created by 姜昊 on 2016/6/4.
 */
var nodemailer = require('nodemailer');
function sendmail(option,res,link){
// create reusable transporter object using the default SMTP transport
    console.log(option);

    var transporter = nodemailer.createTransport({
        service: option.type,
        auth: {
            user: option.mail,
            pass: option.password
        }
    });

    var mailOptions = {
        from:option.mail, // sender address
        to: option.sendto, // list of receivers
        subject:  option.subject, // Subject line
        text:  option.text, // plaintext body
        html: '' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.render("tip_fail",{content:"发送失败，请检查邮箱授权码或收件人是否填写完整",
                iconcode:0,
                yes:link,
                yestext:"确定",
                no:"/",
                notext:"取消"});
        }else{
            console.log(error);
            res.render("tip_fail",{content:"发送成功！",
                iconcode:1,
                yes:link,
                yestext:"再发一封",
                no:"/",
                notext:"返回"});
        }
    });
}
exports.sendmail=sendmail;