"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var _config = _interopRequireDefault(require("../../../util/config"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var sort, order, _end, _start, user_log;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sort = req.query._sort === undefined || null ? 'id' : req.query._sort;
            order = req.query._order === undefined || null ? 'ASC' : req.query._order;
            _end = req.query._end === undefined || null ? 100 : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);
            _context.next = 7;
            return _models["default"].User_Log.findAndCountAll({
              order: [[sort, order]],
              offset: _start,
              limit: _end
            });

          case 7:
            user_log = _context.sent;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(user_log.count));
            res.setHeader('X-Total-Count', "".concat(user_log.count));
            res.send(user_log.rows);
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

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;