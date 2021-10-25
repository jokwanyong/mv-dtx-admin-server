"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _path = _interopRequireDefault(require("path"));

require("@babel/polyfill");

var _admin = _interopRequireDefault(require("./routes/admin"));

var _index = _interopRequireDefault(require("./models/index"));

var sequelize = _index["default"].sequelize;
var app = (0, _express["default"])();
var port = process.env.PORT || 9292; // sequelize.sync();
// app.use(session({
//     secret: 'movements04',
//     resave: false,
//     saveUninitialized: true
//   }))

app.disable('x-powered-by');
app.set('trust proxy', true);

_morgan["default"].token('date', function (req, res, tz) {
  return (0, _momentTimezone["default"])().tz("Asia/Seoul").format('YYYY-MM-DD, HH:mm:ss a');
});

_morgan["default"].token('body', function (req, res) {
  return JSON.stringify(req.body);
});

_morgan["default"].token('file', function (req, res) {
  return JSON.stringify(req.files);
});

_morgan["default"].format('myformat', "admin :remote-addr - :remote-user [:date[Asia/Seoul]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\"\n :body \n :file");

app.use(_bodyParser["default"].json({
  limit: '100mb'
}));
app.use(_bodyParser["default"].urlencoded({
  limit: '100mb',
  extended: true,
  parameterLimit: 50000
}));
app.use((0, _cors["default"])());
app.use((0, _morgan["default"])('myformat'));
app.use('/admin', _admin["default"]); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
app.listen(port, function () {
  console.log("ADMIN Server is Start 😆");
});
