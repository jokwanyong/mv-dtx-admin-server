"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var _ = require('lodash');

var Config = require('../../util/config');

var jwt = require('jsonwebtoken');

var sequelize = require('../../models');

var areaRoute = require('./area');

var pipeRoute = require('./pipe');

var pipeMapRoute = require('./pipeMap');

var smartRoute = require('./smart');

var smartMapRoute = require('./smartMap');

var ModelRoute = require('./model');

var ObstructionTypeRoute = require('./obstructionType');

var ObstructionRoute = require('./obstruction');

var MaterialRoute = require('./material');

var JobRoute = require('./job');

var JobLogRoute = require('./job_log');

var ObsModel = require('./obsModel');

var email = require('./email');

var JointBluePrint = require('./jointBluePrint');

var SurveyRoute = require('./survey');

var JournalRoute = require('./journal');

var DataUpload = require('./dataUpload');

var Application = require('./application');

var router = express.Router();
var Op = sequelize.Op;
router.post('/login', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var param, arr, result, data, secretOrPrivateKey, options;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            param = req.body;
            arr = {};
            arr.user_id = param.username;
            arr.user_pw = JSON.stringify(Config.encrypt(param.password));
            _context.next = 7;
            return sequelize.Admin.findOne({
              where: {
                user_id: req.body.username,
                user_pw: JSON.stringify(Config.encrypt(param.password))
              }
            });

          case 7:
            result = _context.sent;

            if (result !== null) {
              data = {};
              data.token = Config.generate_key();
              data.username = result.user_id;
              secretOrPrivateKey = Config.secret;
              options = {
                expiresIn: 60 * 60 * 24
              };
              jwt.sign(data, secretOrPrivateKey, options, function (err, token) {
                if (err) {
                  console.log(err);
                  return res.json({
                    "result": "error"
                  });
                }

                ;
                res.json({
                  token: token
                });
              });
            } else {
              res.send("ERROR");
            }

            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send("ERROR");

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

var editPass = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var user_pw;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            user_pw = JSON.stringify(Config.encrypt('move0524!@#'));
            _context2.next = 4;
            return sequelize.Admin.update({
              user_pw: user_pw
            }, {
              where: {
                user_id: 'admin'
              }
            });

          case 4:
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 6]]);
  }));

  return function editPass() {
    return _ref2.apply(this, arguments);
  };
}(); // router.use((req, res, next) => {
//   var secretOrPrivateKey = Config.secret;
//   var token = req.headers['x-access-token'];
//   if (!token) return res.status(403).json('token is required!');
//   else {
//     jwt.verify(token, secretOrPrivateKey, (err, decoded) => {
//       if(err) return res.status(403).json(err);
//       else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } 
// });


router.use('/area', areaRoute);
router.use('/smart', smartRoute);
router.use('/smartMap', smartMapRoute);
router.use('/pipe', pipeRoute);
router.use('/pipeMap', pipeMapRoute);
router.use('/model', ModelRoute);
router.use('/obstruction', ObstructionRoute);
router.use('/hole', ObstructionRoute);
router.use('/obstructionType', ObstructionTypeRoute);
router.use('/material', MaterialRoute);
router.use('/job', JobRoute);
router.use('/jobLog', JobLogRoute);
router.use('/obsModel', ObsModel);
router.use('/email', email);
router.use('/jointBluePrint', JointBluePrint);
router.use('/servey', SurveyRoute);
router.use('/journal', JournalRoute);
router.use('/dataUpload', DataUpload);
router.use('/application', Application);
module.exports = router;