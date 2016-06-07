/**
 * Created by 姜昊 on 2016/6/4.
 */
var nodemailer = require('nodemailer');

function sendmial(option){
// create reusable transporter object using the default SMTP transport
    console.log(option);
    var transporter = nodemailer.createTransport('smtps://'+option.mail+':'+option.password+'@smtp.'+option.type+'.com');

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: option.mail,
        to: option.sendto, // list of receivers
        subject: option.subject, // Subject line
        text: option.text, // plaintext body
        html: '' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
exports.sendmail=sendmial;