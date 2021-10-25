"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var Device = require('../../../models').Device;

var Op = _sequelize["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var is_user, sort, order, _end, _start, devices, total;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            is_user = req.query.is_user === undefined || null ? '' : 0;
            sort = req.query._sort === undefined || 'id' ? 'device_id' : req.query._sort;
            order = req.query._order === undefined || null ? 'DESC' : req.query._order;
            _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);
            _context.next = 8;
            return Device.findAll({
              where: {
                usage: (0, _defineProperty2["default"])({}, Op.like, is_user + "%")
              },
              order: [[sort, order]],
              offset: _start,
              limit: _end
            });

          case 8:
            devices = _context.sent;
            total = devices.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(total));
            res.setHeader('X-Total-Count', "".concat(total));
            res.send(devices);
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 17]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var devices;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            console.log("GET ONE");
            _context2.next = 4;
            return Device.findAll({
              where: {
                device_id: req.params.id
              }
            });

          case 4:
            devices = _context2.sent;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            res.send(devices);
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 12]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/device/:equipment', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var arr, result, data;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            arr = {};
            arr.device_id = _config["default"].createDevice(req.params.equipment);
            _context3.prev = 2;
            _context3.next = 5;
            return Device.findAll({
              where: {
                device_id: arr.device_id
              }
            });

          case 5:
            result = _context3.sent;

            if (!(result.length < 1)) {
              _context3.next = 16;
              break;
            }

            data = [{}];
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            data[0].device_id = arr.device_id;
            res.send(data);
            _context3.next = 17;
            break;

          case 16:
            return _context3.abrupt("return", res.send('error'));

          case 17:
            _context3.next = 22;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3["catch"](2);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 19]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var param, result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            param = req.body;

            if (!(param.device_id === false || param.device_id === "press Button")) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return", res.send("ERROR"));

          case 5:
            _context4.prev = 5;
            _context4.next = 8;
            return Device.create({
              device_id: param.device_id,
              equipment: param.equipment,
              usage: param.usage
            });

          case 8:
            result = _context4.sent;
            res.send(result);
            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](5);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[5, 12]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var devices;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return Device.destroy({
              where: {
                device_id: req.params.id
              }
            });

          case 3:
            devices = _context5.sent;
            res.send('success');
            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            res.send({
              "result": "fail",
              "message": _context5.t0.message
            });

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;