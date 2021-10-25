"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _models = _interopRequireDefault(require("../../../models"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var sort, order, _end, _start, journal_all;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sort = req.query._sort === undefined || 'id' ? 'id' : req.query._sort;
            order = req.query._order === undefined || null ? 'DESC' : req.query._order;
            _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);
            _context.next = 7;
            return _models["default"].Journal.findAndCountAll({
              order: [[sort, order]],
              offset: _start,
              limit: _end
            });

          case 7:
            journal_all = _context.sent;
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/".concat(journal_all.count));
            res.setHeader("X-Total-Count", "".concat(journal_all.count));
            res.send(journal_all.rows);
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
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var journal_one;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].Journal.findOne({
              where: {
                id: req.params.id
              }
            });

          case 3:
            journal_one = _context2.sent;
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/".concat(1));
            res.setHeader("X-Total-Count", "".concat(1));
            res.send(journal_one);
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 11]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var create_journal;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            req.body.area_fid_prefix = _config["default"].createEncoding(req.body.area_id);
            _context3.next = 4;
            return _models["default"].Journal.create(req.body);

          case 4:
            create_journal = _context3.sent;
            res.send(create_journal);
            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var delete_journal;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _models["default"].Journal.destroy({
              where: {
                id: req.params.id
              }
            });

          case 3:
            delete_journal = _context4.sent;
            res.send(delete_journal);
            _context4.next = 11;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
module.exports = router;