"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var _end, _start, company_name, model, is_smart;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _models["default"].ComMoCal.belongsTo(_models["default"].Company, {
              foreignKey: 'company_idx'
            });

            _models["default"].ComMoCal.belongsTo(_models["default"].Model, {
              foreignKey: 'model_idx'
            });

            _end = req.query._end === undefined || null ? null : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);
            company_name = req.query.q === undefined || null ? '' : req.query.q;
            is_smart = req.query.is_smart === undefined ? false : req.query.is_smart;

            if (!is_smart) {
              _context.next = 13;
              break;
            }

            _context.next = 10;
            return _models["default"].ComMoCal.findAndCountAll({
              attributes: ['idx', 'company_idx', 'model_idx', [_models["default"].sequelize.col('company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('model_TBL.model_name'), 'model_name']],
              include: [{
                attributes: [],
                model: _models["default"].Company,
                required: true,
                where: {
                  company_name: (0, _defineProperty2["default"])({}, Op.like, company_name + '%')
                }
              }, {
                attributes: [],
                model: _models["default"].Model,
                required: false
              }],
              order: [['company_idx', 'ASC'], ['model_idx', 'ASC']]
            });

          case 10:
            model = _context.sent;
            _context.next = 16;
            break;

          case 13:
            _context.next = 15;
            return _models["default"].ComMoCal.findAndCountAll({
              attributes: ['idx', 'company_idx', 'model_idx', [_models["default"].sequelize.col('company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('model_TBL.model_name'), 'model_name']],
              include: [{
                attributes: [],
                model: _models["default"].Company,
                required: true,
                where: {
                  company_name: (0, _defineProperty2["default"])({}, Op.like, company_name + '%')
                }
              }, {
                attributes: [],
                model: _models["default"].Model,
                required: false
              }],
              order: [['company_idx', 'ASC'], ['model_idx', 'ASC']],
              offset: _start,
              limit: _end
            });

          case 15:
            model = _context.sent;

          case 16:
            _lodash["default"].map(model.rows, function (e, i) {
              e.dataValues.idx = String(e.dataValues.idx);
              e.dataValues.pipe_model_relation = String(e.dataValues.idx);
              e.dataValues.smart_model_relation = String(e.dataValues.idx);

              if (req.query.is_pipe !== undefined || null) {
                e.dataValues.pipe_model_relation = String(e.dataValues.idx);
              } else if (req.query.is_smart !== undefined || null) {
                e.dataValues.smart_model_relation = String(e.dataValues.idx);
              }
            });

            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(model.count));
            res.setHeader('X-Total-Count', "".concat(model.count));
            console.log(model.count);
            res.send(model.rows);
            _context.next = 29;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 25]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/company', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var company, total;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].Company.findAll({});

          case 3:
            company = _context2.sent;
            total = company.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(total));
            res.setHeader('X-Total-Count', "".concat(total));
            res.send(company);
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

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var model_one;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            _models["default"].ComMoCal.belongsTo(_models["default"].Company, {
              foreignKey: 'company_idx'
            });

            _models["default"].ComMoCal.belongsTo(_models["default"].Model, {
              foreignKey: 'model_idx'
            });

            _context3.next = 5;
            return _models["default"].ComMoCal.findOne({
              attributes: ['idx', 'company_idx', 'model_idx', [_models["default"].sequelize.col('company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('model_TBL.model_name'), 'model_name']],
              include: [{
                attributes: [],
                model: _models["default"].Company,
                required: false
              }, {
                attributes: [],
                model: _models["default"].Model,
                required: false
              }],
              where: {
                idx: req.params.id
              }
            });

          case 5:
            model_one = _context3.sent;
            model_one.dataValues.id = model_one.dataValues.idx;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            res.send(model_one);
            _context3.next = 18;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 14]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
router.get('/model/:id', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var model, total;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _models["default"].Model.findAll({
              where: {
                company_idx: req.params.id
              }
            });

          case 3:
            model = _context4.sent;
            total = model.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(total));
            res.setHeader('X-Total-Count', "".concat(total));
            res.send(model);
            _context4.next = 16;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 12]]);
  }));

  return function (_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var company_idx, model_idx, com_mo_cal_idx;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            _models["default"].ComMoCal.belongsTo(_models["default"].Company, {
              foreignKey: 'company_idx'
            });

            _models["default"].ComMoCal.belongsTo(_models["default"].Model, {
              foreignKey: 'model_idx'
            });

            _models["default"].Company.hasMany(_models["default"].Model, {
              foreignKey: 'company_idx'
            });

            return _context5.abrupt("return", _models["default"].sequelize.transaction().then(function (t) {
              return _models["default"].Company.findOrCreate({
                where: {
                  company_name: req.body.company_name
                },
                defaults: {
                  company_name: req.body.company_name
                },
                transaction: t
              }).spread(function (company, created) {
                company_idx = company.dataValues.company_idx;
                return _models["default"].Model.findOrCreate({
                  where: {
                    model_name: req.body.model_name,
                    company_idx: company_idx
                  },
                  defaults: {
                    model_name: req.body.model_name,
                    company_idx: company_idx
                  },
                  transaction: t
                }).spread(function (model, created) {
                  model_idx = model.dataValues.model_idx;
                  return _models["default"].ComMoCal.findOrCreate({
                    where: {
                      company_idx: company_idx,
                      model_idx: model_idx
                    },
                    defaults: {
                      company_idx: company_idx,
                      model_idx: model_idx
                    },
                    transaction: t
                  }).spread(function (ComMoCal, created) {
                    com_mo_cal_idx = ComMoCal;
                  });
                });
              }).then(function () {
                t.commit();
                res.send({
                  id: com_mo_cal_idx.idx
                });
              })["catch"](function (err) {
                t.rollback();
                console.log(err);
                res.json(err);
              });
            }));

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
router.put('/:id', /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var company_idx, model_idx, result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            return _context6.abrupt("return", _models["default"].sequelize.transaction().then(function (t) {
              return _models["default"].ComMoCal.findOne({
                where: {
                  idx: req.params.id
                }
              }, {
                transaction: t
              }).then(function (SELComMoCal) {
                company_idx = SELComMoCal.company_idx;
                model_idx = SELComMoCal.model_idx;
                return _models["default"].Company.update({
                  company_name: req.body.company_name
                }, {
                  where: {
                    company_idx: company_idx
                  }
                }, {
                  transaction: t
                }).then(function (UpCom) {
                  return _models["default"].Model.update({
                    model_name: req.body.model_name
                  }, {
                    where: {
                      model_idx: model_idx
                    }
                  }, {
                    transaction: t
                  }).then(function (UpCal) {
                    _models["default"].ComMoCal.belongsTo(_models["default"].Company, {
                      foreignKey: 'company_idx'
                    });

                    _models["default"].ComMoCal.belongsTo(_models["default"].Model, {
                      foreignKey: 'model_idx'
                    });

                    return _models["default"].ComMoCal.findOne({
                      attributes: ['idx', [_models["default"].sequelize.col('com_mo_cal_TBL.idx'), 'id'], 'company_idx', 'model_idx', [_models["default"].sequelize.col('company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('model_TBL.model_name'), 'model_name']],
                      include: [{
                        attributes: [],
                        model: _models["default"].Company,
                        required: false
                      }, {
                        attributes: [],
                        model: _models["default"].Model,
                        required: false
                      }],
                      where: {
                        idx: req.params.id
                      }
                    }, {
                      transaction: t
                    }).then(function (SelComMoCal) {
                      result = SelComMoCal;
                    });
                  });
                });
              }).then(function () {
                t.commit();
                res.send(result);
              })["catch"](function (err) {
                t.rollback();
                console.log(err);
                res.json(err);
              });
            }));

          case 4:
            _context6.prev = 4;
            _context6.t0 = _context6["catch"](0);
            console.log(_context6.t0);
            res.send(_context6.t0);

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 4]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var company_idx, model_idx;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            return _context7.abrupt("return", _models["default"].sequelize.transaction().then(function (t) {
              return _models["default"].ComMoCal.findOne({
                where: {
                  idx: req.params.id
                }
              }, {
                transaction: t
              }).then(function (DelComMoCal) {
                company_idx = DelComMoCal.company_idx;
                model_idx = DelComMoCal.model_idx;
                return _models["default"].ComMoCal.destroy({
                  where: {
                    idx: req.params.id
                  }
                }, {
                  transaction: t
                }).then(function (DelCom) {
                  return _models["default"].Company.destroy({
                    where: {
                      company_idx: company_idx
                    }
                  }, {
                    transaction: t
                  }).then(function (DelMo) {
                    return _models["default"].Model.destroy({
                      where: {
                        model_idx: model_idx
                      }
                    }, {
                      transaction: t
                    }).then(function (endTransaction) {
                      return;
                    });
                  });
                });
              }).then(function () {
                t.commit();
                res.send("SUCCESS");
              })["catch"](function (err) {
                t.rollback();
                console.log(err);
                res.json(err);
              });
            }));

          case 4:
            _context7.prev = 4;
            _context7.t0 = _context7["catch"](0);
            console.log(_context7.t0);
            res.send({
              "result": "fail",
              "message": _context7.t0.message
            });

          case 8:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 4]]);
  }));

  return function (_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}());
module.exports = router;