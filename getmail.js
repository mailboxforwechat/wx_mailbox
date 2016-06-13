/**
 * Created by 姜昊 on 2016/6/12.
 */
var Imap = require('imap')
var MailParser = require("mailparser").MailParser
var fs = require("fs")

//option:
// userid:存储用户html数据路径
// user：用户邮箱
//mailtype:邮箱类型  qq ne pku
// password：授权码
// host：邮箱服务器host

function getmaillist(option,res){
    var imap = new Imap({
        user: option.user,
        password: option.password,
        host:option.host,
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }

    var messages = [];
    var maillists=[];

    imap.once('ready', function() {
        openInbox(function(err, box) {
            if (err) throw err;
            //imap.search([ ['OR', 'UNSEEN', ['SINCE', 'April 20, 2010'] ] ], function(err, results) {
            imap.search( [ 'UNFLAGGED', ['SINCE', 'January 1, 2016']], function(err, results) {
                if (err) throw err;
                var f = imap.fetch(results, { bodies: '' });

                f.on('message', function(msg, seqno) {
                    var mailparser = new MailParser()
                    msg.on('body', function(stream, info) {
                        stream.pipe( mailparser );
                        mailparser.on("end",function( mail ){
                            maillist = {
                                from:mail.headers.from,
                                to:mail.headers.to,
                                subject:mail.headers.subject,
                                date:mail.headers.date,
                                seqno:seqno
                            }
                            maillists.unshift(maillist);
                            //console.log(mail.receivedDate);
                            writefile(option.userid,option.mailtype,mail.html,seqno);

                        })
                    });
                    msg.once('end', function() {
                    });
                });
                f.once('error', function(err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function() {
                    imap.end();
                });
            });
        });
    });

    imap.once('error', function(err) {
        console.log(err);
    });

    imap.once('end', function() {
        //console.log(maillists);
        res.render('recmail',{title:'收件箱',maillist:maillists,mailtype:option.mailtype});
        console.log('Connection ended');
    });

    imap.connect();
};
function writefile(userid,mailtype,html,seqno){
    var path='views/'+userid+'/'+mailtype;
    var file=path+'/mail-'+seqno+'-body.ejs'
    fs.exists(path, function (exists) {
        if(!exists){
            fs.mkdir('views/'+userid,function(){
                fs.mkdir(path,function(){
                    fs.writeFile(file,html, function (err) {
                        if (err) throw err;
                    });
                });
            });
        }else{
            fs.writeFile(file,html, function (err) {
                if (err) throw err;
            });
        }
    });
};
exports.getmail=getmaillist;
// var imap = new Imap({
//   user: '1501210385@pku.edu.cn',
//   password: 'ly2411459122',
//   host: 'mail.pku.edu.cn',
//   port: 993,
//   tls: true,
//   tlsOptions: { rejectUnauthorized: false }
// });

//var imap = new Imap({
//    user: '2411459122@qq.com',
//    password: 'wbbwjkuxpkqoeace',
//    host: 'imap.qq.com',
//    port: 993,
//    tls: true,
//    tlsOptions: { rejectUnauthorized: false }
//});

