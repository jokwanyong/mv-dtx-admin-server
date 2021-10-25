"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var _config = _interopRequireDefault(require("../../../util/config"));

var User = require('../../../models').User;

var Device = require('../../../models').Device;

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var is_area, is_smart, is_admin, area_id, sort, order, _end, _start, _where, user, total, _total, _total2, _total3;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            is_area = req.query.is_area === undefined || null ? true : false;
            is_smart = req.query.is_smart === undefined || null ? true : false;
            is_admin = req.query.is_admin === undefined || null ? true : false;
            area_id = req.query.is_area === undefined || null ? '' : req.query.is_area;
            sort = req.query._sort === undefined || 'id' ? 'user_id' : req.query._sort;
            order = req.query._order === undefined ? 'DESC' : req.query._order;
            _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

            if (is_area) {
              _context.next = 21;
              break;
            }

            _context.next = 12;
            return User.findAll({
              attributes: ['user_id', 'real_id', 'device_id', 'area_id', 'state', 'admin', 'create_date'],
              where: (_where = {}, (0, _defineProperty2["default"])(_where, Op.or, [{
                real_id: ''
              }, {
                user_fid_prefix: ''
              }, {
                area_id: area_id
              }]), (0, _defineProperty2["default"])(_where, Op.and, [{
                admin: 0
              }]), _where)
            });

          case 12:
            user = _context.sent;
            total = user.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(total));
            res.setHeader('X-Total-Count', "".concat(total));
            return _context.abrupt("return", res.send(user));

          case 21:
            if (is_admin) {
              _context.next = 33;
              break;
            }

            _context.next = 24;
            return User.findAll({
              attributes: ['user_id', 'real_id', 'device_id', 'area_id', 'state', 'admin', 'create_date'],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                admin: 1
              }, {
                user_fid_prefix: ''
              }])
            });

          case 24:
            user = _context.sent;
            _total = user.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(_total));
            res.setHeader('X-Total-Count', "".concat(_total));
            return _context.abrupt("return", res.send(user));

          case 33:
            if (is_smart) {
              _context.next = 45;
              break;
            }

            _context.next = 36;
            return User.findAll({
              attributes: ['user_id', 'real_id', 'device_id', 'area_id', 'state', 'admin', 'create_date']
            });

          case 36:
            user = _context.sent;
            _total2 = user.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(_total2));
            res.setHeader('X-Total-Count', "".concat(_total2));
            return _context.abrupt("return", res.send(user));

          case 45:
            _context.next = 47;
            return User.findAll({
              attributes: ['user_id', 'real_id', 'device_id', 'area_id', 'state', 'admin', 'create_date'],
              order: [['area_id'], [sort, order]],
              offset: _start,
              limit: _end
            });

          case 47:
            user = _context.sent;
            _total3 = user.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(_total3));
            res.setHeader('X-Total-Count', "".concat(_total3));
            return _context.abrupt("return", res.send(user));

          case 54:
            _context.next = 60;
            break;

          case 56:
            _context.prev = 56;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 60:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 56]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var user, arr;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return User.findOne({
              where: {
                user_id: req.params.id
              }
            });

          case 3:
            user = _context2.sent;
            arr = {};
            arr.user_id = user.user_id;
            arr.id = user.user_id;
            arr.user_fid_prefix = user.user_fid_prefix;
            arr.device_id = user.device_id;
            arr.state = user.state;
            arr.admin = user.admin;
            arr.create_date = user.create_date;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            res.send(arr);
            _context2.next = 22;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 19]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/user/:id', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var area_id, user, arr, response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            area_id = req.params.id;

            if (!(area_id !== undefined)) {
              _context3.next = 12;
              break;
            }

            _context3.next = 5;
            return _models["default"].Area.findAll({
              where: {
                area_id: area_id
              }
            });

          case 5:
            user = _context3.sent;
            user = user[0].user_id.split(",");
            arr = [];

            _lodash["default"].map(user, function (e, i) {
              var res = {};
              res.id = e;
              res.name = e;
              arr.push(res);
            });

            response = {};
            response.user_ids = arr;
            res.send(response);

          case 12:
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 14]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('', function (req, res, next) {
  try {
    var user_id = req.body.user_id.toLocaleUpperCase();

    var password = _config["default"].encrypt(req.body.password);

    var result;
    return _models["default"].sequelize.transaction().then(function (t) {
      return _models["default"].User.create({
        user_id: user_id,
        password: JSON.stringify(password),
        device_id: req.body.device_id,
        admin: req.body.auth
      }, {
        transaction: t
      }).then(function (device) {
        if (req.body.auth === 0) {
          return _models["default"].Device.update({
            usage: '1'
          }, {
            where: {
              device_id: req.body.device_id
            }
          }, {
            transaction: t
          }).then(function (User) {
            console.log(User);
            return _models["default"].User.findOne({
              where: {
                user_id: user_id
              }
            }, {
              transaction: t
            }).then(function (data) {
              console.log('user', data);
            });
          });
        } else {
          return _models["default"].User.findOne({
            where: {
              user_id: user_id
            }
          }, {
            transaction: t
          }).then(function (data) {
            console.log('admin', data);
          });
        }
      }).then(function () {
        t.commit();
        res.send({
          id: user_id
        });
      })["catch"](function (err) {
        console.log(err);
        t.rollback();
        res.json(err);
      });
    });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});
router.post('/login', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var password, login;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            password = JSON.stringify(_config["default"].encrypt(req.body.password));
            _context4.next = 4;
            return _models["default"].User.findOne({
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                user_id: req.body.user_id
              }, {
                password: password
              }])
            });

          case 4:
            login = _context4.sent;
            res.send(login);
            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]('/:id', function (req, res, next) {
  try {
    var result;
    return _models["default"].sequelize.transaction().then(function (t) {
      return _models["default"].User.findOne({
        where: {
          user_id: req.params.id
        }
      }, {
        transaction: t
      }).then(function (user) {
        return _models["default"].User.destroy({
          where: {
            user_id: user.user_id
          }
        }, {
          transaction: t
        }).then(function (device) {
          return _models["default"].Device.update({
            usage: 0
          }, {
            where: {
              device_id: user.device_id
            }
          }, {
            transaction: t
          });
        });
      }).then(function () {
        t.commit();
        res.send("SUCCESS");
      })["catch"](function (err) {
        console.log(err);
        res.send(err);
      });
    });
  } catch (error) {
    res.send(error);
  }
});
router.put('/:id', function (req, res, next) {
  try {
    var user_id = req.body.user_id;
    return _models["default"].sequelize.transaction().then(function (t) {
      return _models["default"].User.findOne({
        where: {
          user_id: user_id
        }
      }, {
        transaction: t
      }).then(function (User) {
        if (User.device_id !== req.body.device_id) {
          if (req.body.password !== undefined) {
            var password = JSON.stringify(_config["default"].encrypt(req.body.password));
            return _models["default"].User.update({
              device_id: req.body.device_id,
              password: password
            }, {
              where: {
                user_id: user_id
              }
            }, {
              transaction: t
            }).then(function (device) {
              return _models["default"].Device.update({
                usage: 0
              }, {
                where: {
                  device_id: User.device_id
                }
              }, {
                transaction: t
              }).then(function (newD) {
                return _models["default"].Device.update({
                  usage: 1
                }, {
                  where: {
                    device_id: req.body.device_id
                  }
                }, {
                  transaction: t
                });
              });
            });
          } else {
            return _models["default"].User.update({
              device_id: req.body.device_id
            }, {
              where: {
                user_id: user_id
              }
            }, {
              transaction: t
            }).then(function (device2) {
              return _models["default"].Device.update({
                usage: 0
              }, {
                where: {
                  device_id: User.device_id
                }
              }, {
                transaction: t
              }).then(function (newD2) {
                return _models["default"].Device.update({
                  usage: 1
                }, {
                  where: {
                    device_id: req.body.device_id
                  }
                }, {
                  transaction: t
                });
              });
            });
          }
        } else {
          if (req.body.password !== undefined) {
            var password = JSON.stringify(_config["default"].encrypt(req.body.password));
            return _models["default"].User.update({
              password: password
            }, {
              where: {
                user_id: user_id
              }
            }, {
              transaction: t
            });
          }
        }
      }).then(function () {
        t.commit();
        res.send({
          id: req.params.id
        });
      })["catch"](function (err) {
        console.log(err);
        res.send(err);
      });
    });
  } catch (error) {
    res.send({
      "result": "fail",
      "message": error.message
    });
  }
});
module.exports = router;