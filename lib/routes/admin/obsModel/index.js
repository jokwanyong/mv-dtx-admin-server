"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var _config = _interopRequireDefault(require("../../../util/config"));

var Op = _models["default"].Op;

var router = _express["default"].Router(); // '1','기존관','1','2019-09-02 15:03:07'
// '2','원형맨홀','1','2019-09-02 15:03:07'
// '3','사각맨홀','1','2019-09-02 15:03:07'
// '4','밸브','1','2019-09-02 15:03:07'
// '5','좌측T자관','1','2019-09-04 14:36:48'
// '6','우측T자관','1','2019-09-04 14:36:52'


router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var transaction, result, count, obs_model_relation, obs_manhole;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsCompany, {
              foreignKey: 'company_idx'
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsModel, {
              foreignKey: 'model_idx'
            });

            _context.next = 5;
            return _models["default"].sequelize.transaction();

          case 5:
            transaction = _context.sent;
            result = [];
            _context.next = 9;
            return _models["default"].ObsRelation.findAndCountAll({
              attributes: ['idx', [_models["default"].sequelize.col('obs_company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('obs_model_TBL.model_name'), 'model_name']],
              include: [{
                model: _models["default"].ObsCompany,
                attributes: []
              }, {
                model: _models["default"].ObsModel,
                attributes: []
              }]
            }, {
              transaction: transaction
            });

          case 9:
            obs_model_relation = _context.sent;
            _context.next = 12;
            return _models["default"].ObsManhole.findAndCountAll({}, {
              transaction: transaction
            });

          case 12:
            obs_manhole = _context.sent;

            _lodash["default"].map(obs_model_relation.rows, function (data) {
              data.dataValues.id = "A".concat(data.dataValues.idx);
              result.push(data);
            });

            _lodash["default"].map(obs_manhole.rows, function (data) {
              data.dataValues.id = "B".concat(data.dataValues.idx);
              result.push(data);
            });

            count = obs_model_relation.count + obs_manhole.count;
            transaction.commit();
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(count));
            res.setHeader('X-Total-Count', "".concat(count));
            res.send(result);
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 24]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var code, id, result, obs_model_relation, obs_manhole;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            code = req.params.id.substr(0, 1);
            id = req.params.id.substring(req.params.id.length, 1);

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsCompany, {
              foreignKey: 'company_idx'
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsModel, {
              foreignKey: 'model_idx'
            });

            if (!(code === "A")) {
              _context2.next = 13;
              break;
            }

            _context2.next = 8;
            return _models["default"].ObsRelation.findOne({
              attributes: ['idx', [_models["default"].sequelize.col('obs_company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('obs_model_TBL.model_name'), 'model_name']],
              include: [{
                model: _models["default"].ObsCompany,
                attributes: []
              }, {
                model: _models["default"].ObsModel,
                attributes: []
              }],
              where: {
                idx: id
              }
            });

          case 8:
            obs_model_relation = _context2.sent;
            obs_model_relation.dataValues.id = req.params.id;
            result = obs_model_relation;
            _context2.next = 19;
            break;

          case 13:
            if (!(code === "B")) {
              _context2.next = 19;
              break;
            }

            _context2.next = 16;
            return _models["default"].ObsManhole.findOne({
              where: {
                idx: id
              }
            });

          case 16:
            obs_manhole = _context2.sent;
            obs_manhole.dataValues.id = req.params.id;
            result = obs_manhole;

          case 19:
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            res.send(result);
            _context2.next = 30;
            break;

          case 26:
            _context2.prev = 26;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.send("ERR");

          case 30:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 26]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var transaction, manhole, company_idx, model_idx, company, model, model_relation;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context3.sent;

            if (!(req.body.code === "0")) {
              _context3.next = 14;
              break;
            }

            if (req.body.diameter === undefined) {
              req.body.height = null;
            }

            _context3.next = 8;
            return _models["default"].ObsManhole.findOrCreate({
              where: {
                width: req.body.width,
                diameter: req.body.diameter,
                height: req.body.height
              },
              "default": {
                width: req.body.width,
                diameter: req.body.diameter,
                height: req.body.height
              },
              transaction: transaction
            });

          case 8:
            manhole = _context3.sent;
            transaction.commit();
            manhole[0].dataValues.id = "B".concat(manhole[0].dataValues.idx);
            res.send(manhole[0]);
            _context3.next = 28;
            break;

          case 14:
            _context3.next = 16;
            return _models["default"].ObsCompany.findOrCreate({
              where: {
                company_name: req.body.company_name
              },
              "default": {
                company_name: req.body.company_name
              },
              transaction: transaction
            });

          case 16:
            company = _context3.sent;
            company_idx = company[0].company_idx;
            _context3.next = 20;
            return _models["default"].ObsModel.findOrCreate({
              where: {
                model_name: req.body.model_name,
                company_idx: company_idx
              },
              "default": {
                model_name: req.body.model_name,
                company_idx: company_idx
              },
              transaction: transaction
            });

          case 20:
            model = _context3.sent;
            model_idx = model[0].model_idx;
            _context3.next = 24;
            return _models["default"].ObsRelation.findOrCreate({
              where: {
                company_idx: company_idx,
                model_idx: model_idx
              },
              "default": {
                company_idx: company_idx,
                model_idx: model_idx
              },
              transaction: transaction
            });

          case 24:
            model_relation = _context3.sent;
            transaction.commit();
            model_relation[0].dataValues.id = "A".concat(model_relation[0].dataValues.idx);
            res.send(model_relation[0]);

          case 28:
            _context3.next = 37;
            break;

          case 30:
            _context3.prev = 30;
            _context3.t0 = _context3["catch"](0);

            if (!transaction) {
              _context3.next = 35;
              break;
            }

            _context3.next = 35;
            return transaction.rollback();

          case 35:
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 37:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 30]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.put('/:id', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var transaction, code, id, result, find_model_index, update_company, update_model, find_update, manhole_update, update_result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            code = req.params.id.substr(0, 1);
            id = req.params.id.substring(req.params.id.length, 1);

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsCompany, {
              foreignKey: 'company_idx'
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsModel, {
              foreignKey: 'model_idx'
            });

            _context4.next = 7;
            return _models["default"].sequelize.transaction();

          case 7:
            transaction = _context4.sent;

            if (!(code === "A")) {
              _context4.next = 26;
              break;
            }

            _context4.next = 11;
            return _models["default"].ObsRelation.findOne({
              where: {
                idx: id
              }
            }, {
              transaction: transaction
            });

          case 11:
            find_model_index = _context4.sent;
            _context4.next = 14;
            return _models["default"].ObsCaliber.update({
              company_name: req.body.company_name
            }, {
              where: {
                company_idx: find_model_index.company_idx
              }
            }, {
              transaction: transaction
            });

          case 14:
            update_company = _context4.sent;
            _context4.next = 17;
            return _models["default"].ObsModel.update({
              model_name: req.body.model_name
            }, {
              where: {
                model_idx: find_model_index.model_idx
              }
            }, {
              transaction: transaction
            });

          case 17:
            update_model = _context4.sent;
            _context4.next = 20;
            return _models["default"].ObsRelation.findOne({
              attributes: ['idx', [_models["default"].sequelize.col('obs_company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('obs_model_TBL.model_name'), 'model_name']],
              include: [{
                model: _models["default"].ObsCompany,
                attributes: []
              }, {
                model: _models["default"].ObsModel,
                attributes: []
              }],
              where: {
                idx: id
              }
            }, {
              transaction: transaction
            });

          case 20:
            find_update = _context4.sent;
            transaction.commit();
            find_update.dataValues.id = req.params.id;
            result = find_update;
            _context4.next = 36;
            break;

          case 26:
            if (!(code === "B")) {
              _context4.next = 36;
              break;
            }

            _context4.next = 29;
            return _models["default"].ObsManhole.update({
              width: req.body.width,
              diameter: req.body.diameter,
              height: req.body.height
            }, {
              where: {
                idx: id
              }
            }, {
              transaction: transaction
            });

          case 29:
            manhole_update = _context4.sent;
            _context4.next = 32;
            return _models["default"].ObsManhole.findOne({
              where: {
                idx: id
              }
            });

          case 32:
            update_result = _context4.sent;
            transaction.commit();
            update_result.dataValues.id = req.params.id;
            result = update_result;

          case 36:
            res.send(result);
            _context4.next = 46;
            break;

          case 39:
            _context4.prev = 39;
            _context4.t0 = _context4["catch"](0);

            if (!transaction) {
              _context4.next = 44;
              break;
            }

            _context4.next = 44;
            return transaction.rollback();

          case 44:
            console.log(_context4.t0);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 46:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 39]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var transaction, code, id, result, find_model_index, caliber_model_idx, model_company_idx, delete_relation, delete_manhole;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            code = req.params.id.substr(0, 1);
            id = req.params.id.substring(req.params.id.length, 1);

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsCompany, {
              foreignKey: 'company_idx'
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsModel, {
              foreignKey: 'model_idx'
            });

            _context5.next = 7;
            return _models["default"].sequelize.transaction();

          case 7:
            transaction = _context5.sent;

            if (!(code === "A")) {
              _context5.next = 32;
              break;
            }

            _context5.next = 11;
            return _models["default"].ObsRelation.findOne({
              where: {
                idx: id
              },
              transaction: transaction
            });

          case 11:
            find_model_index = _context5.sent;
            _context5.next = 14;
            return _models["default"].ObsCaliber.findAndCountAll({
              where: {
                model_idx: find_model_index.model_idx
              },
              transaction: transaction
            });

          case 14:
            caliber_model_idx = _context5.sent;

            if (!(caliber_model_idx.count < 1)) {
              _context5.next = 24;
              break;
            }

            _context5.next = 18;
            return _models["default"].ObsModel.destroy({
              where: {
                model_idx: find_model_index.model_idx
              },
              transaction: transaction
            });

          case 18:
            _context5.next = 20;
            return _models["default"].ObsModel.findAndCountAll({
              where: {
                company_idx: find_model_index.company_idx
              },
              transaction: transaction
            });

          case 20:
            model_company_idx = _context5.sent;

            if (!(model_company_idx.count < 1)) {
              _context5.next = 24;
              break;
            }

            _context5.next = 24;
            return _models["default"].ObsCompany.destroy({
              where: {
                company_idx: find_model_index.company_idx
              },
              transaction: transaction
            });

          case 24:
            _context5.next = 26;
            return _models["default"].ObsRelation.destroy({
              where: {
                idx: id
              },
              transaction: transaction
            });

          case 26:
            delete_relation = _context5.sent;
            _context5.next = 29;
            return transaction.commit();

          case 29:
            result = delete_relation;
            _context5.next = 39;
            break;

          case 32:
            if (!(code === "B")) {
              _context5.next = 39;
              break;
            }

            _context5.next = 35;
            return _models["default"].ObsManhole.destroy({
              where: {
                idx: id
              },
              transaction: transaction
            });

          case 35:
            delete_manhole = _context5.sent;
            _context5.next = 38;
            return transaction.commit();

          case 38:
            result = delete_manhole;

          case 39:
            res.send("SUCCESS");
            _context5.next = 49;
            break;

          case 42:
            _context5.prev = 42;
            _context5.t0 = _context5["catch"](0);

            if (!transaction) {
              _context5.next = 47;
              break;
            }

            _context5.next = 47;
            return transaction.rollback();

          case 47:
            console.log(_context5.t0);
            res.send({
              "result": "fail",
              "message": _context5.t0.message
            });

          case 49:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 42]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;