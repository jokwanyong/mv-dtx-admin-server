"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var transaction, blue_point;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context.sent;
            _context.next = 6;
            return _models["default"].AreaBluePoint.findAll({
              include: [{
                model: _models["default"].BluePointStartValue,
                include: [_models["default"].Valve]
              }, {
                model: _models["default"].BluePointEndValue,
                include: [_models["default"].Valve]
              }, {
                model: _models["default"].BluePointCrossPoint,
                include: [_models["default"].Valve]
              }, {
                model: _models["default"].BluePointMissingNode,
                include: [_models["default"].Valve]
              }, {
                model: _models["default"].BluePointMissingValue,
                include: [_models["default"].Valve]
              }]
            });

          case 6:
            blue_point = _context.sent;
            _context.next = 9;
            return transaction.commit();

          case 9:
            res.send(blue_point);
            _context.next = 19;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);

            if (!transaction) {
              _context.next = 17;
              break;
            }

            _context.next = 17;
            return transaction.rollback();

          case 17:
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
    }, _callee, null, [[0, 12]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            try {} catch (error) {
              console.log(error);
              res.send({
                "result": "fail",
                "message": error.message
              });
            }

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            try {} catch (error) {
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

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.put('/:id', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            try {} catch (error) {
              console.log(error);
              res.send({
                "result": "fail",
                "message": error.message
              });
            }

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            try {} catch (error) {
              console.log(error);
              res.send({
                "result": "fail",
                "message": error.message
              });
            }

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;