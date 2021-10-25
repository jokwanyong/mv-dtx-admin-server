"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.send = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _nodemailerSmtpTransport = _interopRequireDefault(require("nodemailer-smtp-transport"));

var mail = 'dailyreporter@movements.kr';
var pass = 'move0524';

var send = function send(email, subject, htmlcontent, filename, filepath, callback) {
  var transporter = _nodemailer["default"].createTransport((0, _nodemailerSmtpTransport["default"])({
    host: 'smtp.daum.net',
    port: 465,
    secure: true,
    auth: {
      user: mail,
      pass: pass
    }
  }));

  var mailOptions = {
    from: mail,
    to: email,
    subject: subject,
    text: htmlcontent,
    attachments: [{
      filename: filename,
      path: filepath
    }]
  };
  transporter.sendMail(mailOptions, function (err, info) {
    transporter.close();

    if (err) {
      callback(err, info);
    } else {
      callback(null, info);
    }
  });
};

exports.send = send;