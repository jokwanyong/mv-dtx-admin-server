"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _models = _interopRequireDefault(require("../../../models"));

var _apkMulterMiddleware = require("./apkMulterMiddleware");

var _moment = _interopRequireDefault(require("moment"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var sort, order, _end, _start, mobile;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sort = req.query._sort === 'id' || undefined ? 'idx' : req.query._sort;
            order = req.query._order === undefined ? 'DESC' : req.query._order;
            _end = req.query._end === undefined ? 10 : Number(req.query._end);
            _start = req.query._start === undefined ? 0 : Number(req.query._start);
            _context.next = 7;
            return _models["default"].MobileVersion.findAndCountAll({
              attributes: ['idx', 'app_name', 'update', 'download_path', 'file_size', 'update_text', [_models["default"].sequelize.fn('date_format', _models["default"].sequelize.col('mobile_version_TBL.update_date'), '%Y-%m-%d %H:%i:%s'), 'update_date'], 'update_version', 'os_type'],
              order: [[sort, order]],
              offset: _start,
              limit: _end,
              raw: true
            });

          case 7:
            mobile = _context.sent;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(mobile.count));
            res.setHeader('X-Total-Count', "".concat(mobile.count));
            res.send(mobile.rows);
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            try {
              (0, _apkMulterMiddleware.apkMulterMiddleware)(req, res, /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                  var file_path, file_name, size;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.prev = 0;
                          if (err) console.log(err);

                          if (!_lodash["default"].isEmpty(req.files)) {
                            _context2.next = 4;
                            break;
                          }

                          throw new Error("file Empty");

                        case 4:
                          if (req.body.os_type === "1") {
                            file_path = "/dtx_app/survey/and/";
                          } else if (req.body.os_type === "2") {
                            file_path = "/dtx_app/survey/ios/";
                          }

                          _lodash["default"].map(req.files.apk, function (file) {
                            console.log(file);
                            file_name = file_path + file.originalname;
                            size = file.size;
                          });

                          _context2.next = 8;
                          return _models["default"].MobileVersion.create({
                            app_name: req.body.app_name,
                            update: req.body.update,
                            download_path: file_name,
                            file_size: size,
                            update_text: req.body.update_text,
                            update_date: (0, _moment["default"])().format("YYYY-MM-DD HH:mm:ss"),
                            update_version: req.body.update_version,
                            os_type: req.body.os_type
                          });

                        case 8:
                          res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                          res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
                          res.setHeader('Content-Range', "0-5/0");
                          res.setHeader('X-Total-Count', "0");
                          res.send("success");
                          _context2.next = 19;
                          break;

                        case 15:
                          _context2.prev = 15;
                          _context2.t0 = _context2["catch"](0);
                          console.log(_context2.t0);
                          res.send({
                            "result": "fail",
                            "message": _context2.t0.message
                          });

                        case 19:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, null, [[0, 15]]);
                }));

                return function (_x7) {
                  return _ref3.apply(this, arguments);
                };
              }());
            } catch (error) {
              console.log(error);
              res.send({
                "result": "fail",
                "message": error.message
              });
            }

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
module.exports = router;