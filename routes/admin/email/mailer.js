import nodeMailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

var mail = 'dailyreporter@movements.kr'
var pass = 'move0524'

export const send = (email, subject, htmlcontent, filename, filepath, callback) => {
    // daum mail setting.
    var transporter = nodeMailer.createTransport(smtpTransport({
        host: 'smtp.daum.net',
        port: 465,
        secure: true,
        auth: {
            user: mail,
            pass: pass
        }
    }));

    // mail option.
    var mailOptions = {
        from: mail,
        to: email,
        subject: subject,
        
        text: htmlcontent,
        attachments: [{
            filename: filename,
            path: filepath,
        }]
    };
    
    // mail send
    transporter.sendMail(mailOptions, (err, info) => {
        transporter.close();
        if(err) {
            callback(err, info);
        }
        else {
            callback(null, info);
        }
    })
}