"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get("", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var material;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            req.query._sort;

            if (!(req.query._sort === undefined)) {
              _context.next = 8;
              break;
            }

            _context.next = 5;
            return _models["default"].Material.findAndCountAll({});

          case 5:
            material = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.next = 10;
            return _models["default"].Material.findAndCountAll({
              order: [[req.query._sort, req.query._order]],
              offset: Number(req.query._start),
              limit: Number(req.query._end)
            });

          case 10:
            material = _context.sent;

          case 11:
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/".concat(material.count));
            res.setHeader("X-Total-Count", "".concat(material.count));

            _lodash["default"].map(material.rows, function (data) {
              data.dataValues.id = String(data.dataValues.id);
            });

            res.send(material.rows);
            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 19]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get("/:id", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var material_one;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].Material.findOne({
              where: {
                id: req.params.id
              }
            });

          case 3:
            material_one = _context2.sent;
            material_one.dataValues.id = String(material_one.dataValues.id);
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/".concat(1));
            res.setHeader("X-Total-Count", "".concat(1));
            res.send(material_one);
            _context2.next = 16;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 12]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("", /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var material_create;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _models["default"].Material.create({
              abbreviation: req.body.abbreviation,
              full_name: req.body.full_name
            });

          case 3:
            material_create = _context3.sent;
            res.send(material_create);
            _context3.next = 11;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function (_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());
router.put("/:id", /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var material_update;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _models["default"].Material.update({
              abbreviation: req.body.abbreviation,
              full_name: req.body.full_name
            }, {
              where: {
                id: req.params.id
              }
            });

          case 3:
            material_update = _context4.sent;
            res.send({
              id: req.params.id
            });
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function (_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]("/:id", /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var material_delete;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _models["default"].Material.destroy({
              where: {
                id: req.params.id
              }
            });

          case 3:
            material_delete = _context5.sent;
            res.send(material_delete);
            _context5.next = 11;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);
            res.send({
              "result": "fail",
              "message": _context5.t0.message
            });

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));

  return function (_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;