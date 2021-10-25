"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _config = _interopRequireDefault(require("../../../util/config"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var is_smart, sort, order, _end, _start, job, _job;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            is_smart = req.query.is_smart === undefined || null ? true : false;
            sort = req.query._sort === undefined || 'id' ? 'job_id' : req.query._sort;
            order = req.query._order === undefined || null ? 'DESC' : req.query._order;
            _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

            if (is_smart) {
              _context.next = 17;
              break;
            }

            _context.next = 9;
            return _models["default"].Job.findAndCountAll({
              attributes: ['job_id', 'area_id', 'real_id', 'job_fid_prefix', 'pipe_type', 'smart_model_relation', 'pipe_model_relation', 'material', 'admin', 'curve_extend', 'distance_limit', 'short_pipe', 'degree_to', 'degree_from', 'construct_detail', 'createdAt']
            });

          case 9:
            job = _context.sent;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(job.count));
            res.setHeader('X-Total-Count', "".concat(job.count));
            return _context.abrupt("return", res.send(job.rows));

          case 17:
            _context.next = 19;
            return _models["default"].Job.findAndCountAll({
              attributes: ['job_id', 'area_id', 'real_id', 'job_fid_prefix', 'pipe_type', 'smart_model_relation', 'pipe_model_relation', 'material', 'admin', 'curve_extend', 'distance_limit', 'short_pipe', 'degree_to', 'degree_from', 'construct_detail', 'createdAt'],
              order: [['area_id'], [sort, order]],
              offset: _start,
              limit: _end
            });

          case 19:
            _job = _context.sent;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(_job.count));
            res.setHeader('X-Total-Count', "".concat(_job.count));

            _lodash["default"].map(_job.rows, function (e, i) {
              e.dataValues.id = e.dataValues.job_id;
              e.dataValues.smart_model_relation = e.dataValues.smart_model_relation.split(",");
              e.dataValues.pipe_model_relation = e.dataValues.pipe_model_relation.split(",");
              e.dataValues.material = String(e.dataValues.material);
            });

            res.send(_job.rows);

          case 26:
            _context.next = 32;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 28]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var job_one;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].Job.findOne({
              attributes: ['job_id', 'area_id', 'real_id', 'job_fid_prefix', 'pipe_type', 'smart_model_relation', 'pipe_model_relation', 'material', 'admin', 'curve_extend', 'distance_limit', 'short_pipe', 'degree_to', 'degree_from', 'construct_detail', 'createdAt'],
              where: (0, _defineProperty2["default"])({}, Op.or, [{
                job_id: req.params.id
              }, {
                real_id: req.params.id
              }])
            });

          case 3:
            job_one = _context2.sent;
            job_one.dataValues.id = job_one.dataValues.job_id;
            job_one.dataValues.admin = String(job_one.dataValues.admin);
            job_one.dataValues.smart_model_relation = job_one.dataValues.smart_model_relation.split(",");
            job_one.dataValues.pipe_model_relation = job_one.dataValues.pipe_model_relation.split(",");
            job_one.dataValues.material = String(job_one.dataValues.material);
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            res.send(job_one);
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 16]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var transaction, result, findA, logAll, count, password, jobCreate, job_id, job_rid, job_fid_prefix, adminC;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context3.sent;
            _context3.next = 6;
            return _models["default"].Area.findOne({
              where: {
                area_id: req.body.area_id
              }
            }, {
              transaction: transaction
            });

          case 6:
            findA = _context3.sent;
            _context3.next = 9;
            return _models["default"].JobLog.findAndCountAll({
              where: {
                area_id: req.body.area_id
              }
            });

          case 9:
            logAll = _context3.sent;

            if (!(req.body.admin === 0 || req.body.admin === "0")) {
              _context3.next = 37;
              break;
            }

            if (logAll.count < 9) {
              count = "0".concat(logAll.count + 1);
            } else {
              count = logAll.count + 1;
            }

            if (req.body.job_id !== undefined) {
              req.body.job_id = req.body.job_id.toLocaleUpperCase();
            } else {
              req.body.job_id = (req.body.area_id + String(count)).toLocaleUpperCase();
            }

            _context3.next = 15;
            return _config["default"].createPassword(req.body.password);

          case 15:
            password = _context3.sent;
            req.body.password = password;
            req.body.real_id = req.body.area_id + String(count);
            req.body.job_fid_prefix = _config["default"].createEncoding(req.body.area_id + String(count));
            req.body.smart_model_relation = req.body.smart_model_relation.join();
            req.body.pipe_model_relation = req.body.pipe_model_relation.join();
            _context3.next = 23;
            return _models["default"].Job.create(req.body, {
              transaction: transaction
            });

          case 23:
            jobCreate = _context3.sent;
            result = jobCreate;
            job_id = findA.job_id.length > 0 ? findA.job_id.split(",") : [];
            job_rid = findA.job_rid.length > 0 ? findA.job_rid.split(",") : [];
            job_fid_prefix = findA.job_fid_prefix.length > 0 ? findA.job_fid_prefix.split(",") : [];
            job_id.push(result.job_id);
            job_rid.push(result.real_id);
            job_fid_prefix.push(result.job_fid_prefix);
            _context3.next = 33;
            return _models["default"].Area.update({
              job_id: job_id.join(),
              job_rid: job_rid.join(),
              job_fid_prefix: job_fid_prefix.join()
            }, {
              where: {
                area_id: findA.area_id
              }
            }, {
              transaction: transaction
            });

          case 33:
            _context3.next = 35;
            return _models["default"].JobLog.create(req.body, {
              transaction: transaction
            });

          case 35:
            _context3.next = 48;
            break;

          case 37:
            if (req.body.job_id !== undefined) {
              req.body.job_id = req.body.job_id.toLocaleUpperCase();
            } else {
              req.body.job_id = req.body.area_id.toLocaleUpperCase();
            }

            _context3.next = 40;
            return _config["default"].createPassword(req.body.password);

          case 40:
            password = _context3.sent;
            req.body.password = password;
            req.body.real_id = req.body.area_id;
            req.body.job_fid_prefix = _config["default"].createEncoding(req.body.area_id);
            _context3.next = 46;
            return _models["default"].Job.create(req.body, {
              transaction: transaction
            });

          case 46:
            adminC = _context3.sent;
            result = adminC;

          case 48:
            _context3.next = 50;
            return transaction.commit();

          case 50:
            result.id = result.job_id;
            res.send(result);
            _context3.next = 61;
            break;

          case 54:
            _context3.prev = 54;
            _context3.t0 = _context3["catch"](0);

            if (!transaction) {
              _context3.next = 59;
              break;
            }

            _context3.next = 59;
            return transaction.rollback();

          case 59:
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 61:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 54]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.put('/:id', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var transaction, _req$body$smart_model, _req$body$pipe_model_, password, result;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context4.sent;

            if (!(req.body.password !== undefined)) {
              _context4.next = 9;
              break;
            }

            _context4.next = 7;
            return _config["default"].createPassword(req.body.password);

          case 7:
            password = _context4.sent;
            req.body.password = password;

          case 9:
            req.body.smart_model_relation = (_req$body$smart_model = req.body.smart_model_relation.join()) !== null && _req$body$smart_model !== void 0 ? _req$body$smart_model : '';
            req.body.pipe_model_relation = (_req$body$pipe_model_ = req.body.pipe_model_relation.join()) !== null && _req$body$pipe_model_ !== void 0 ? _req$body$pipe_model_ : '';
            req.body.admin = parseInt(req.body.admin);
            _context4.next = 14;
            return _models["default"].Job.update(req.body, {
              where: {
                job_id: req.params.id
              }
            }, {
              transaction: transaction
            });

          case 14:
            _context4.next = 16;
            return _models["default"].Job.findOne({
              attributes: ['job_id', 'area_id', 'real_id', 'job_fid_prefix', 'pipe_type', 'smart_model_relation', 'pipe_model_relation', 'material', 'admin', 'curve_extend', 'distance_limit', 'short_pipe', 'degree_to', 'degree_from', 'degree_from', 'construct_detail', 'createdAt'],
              where: {
                job_id: req.body.job_id
              },
              transaction: transaction
            });

          case 16:
            result = _context4.sent;
            _context4.next = 19;
            return transaction.commit();

          case 19:
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            result.dataValues.id = result.dataValues.job_id;
            res.send(result);
            _context4.next = 34;
            break;

          case 27:
            _context4.prev = 27;
            _context4.t0 = _context4["catch"](0);

            if (!transaction) {
              _context4.next = 32;
              break;
            }

            _context4.next = 32;
            return transaction.rollback();

          case 32:
            console.log(_context4.t0);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 34:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 27]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var transaction, jobOne, areaOne, job_fid_prefix, job_id, job_rid;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context5.sent;
            _context5.next = 6;
            return _models["default"].Job.findOne({
              attributes: ['job_id', 'area_id', 'real_id', 'job_fid_prefix'],
              where: {
                job_id: req.params.id
              },
              transaction: transaction
            });

          case 6:
            jobOne = _context5.sent;
            _context5.next = 9;
            return _models["default"].Area.findOne({
              attributes: ['area_id', 'job_id', 'job_rid', 'job_fid_prefix'],
              where: {
                area_id: jobOne.area_id
              },
              transaction: transaction
            });

          case 9:
            areaOne = _context5.sent;
            job_fid_prefix = areaOne.job_fid_prefix.split(",");
            job_id = areaOne.job_id.split(",");
            job_rid = areaOne.job_rid.split(",");

            _lodash["default"].pull(job_id, jobOne.job_id);

            _lodash["default"].pull(job_fid_prefix, jobOne.job_fid_prefix);

            _lodash["default"].pull(job_rid, jobOne.real_id);

            _context5.next = 18;
            return _models["default"].Area.update({
              job_fid_prefix: job_fid_prefix.join(),
              job_id: job_id.join(),
              job_rid: job_rid.join()
            }, {
              where: {
                area_id: jobOne.area_id
              },
              transaction: transaction
            });

          case 18:
            _context5.next = 20;
            return _models["default"].Job.destroy({
              where: {
                job_id: req.params.id
              },
              transaction: transaction
            });

          case 20:
            _context5.next = 22;
            return _models["default"].Smart.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, jobOne.job_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 22:
            _context5.next = 24;
            return _models["default"].ModelRelation.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, jobOne.job_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 24:
            _context5.next = 26;
            return _models["default"].Pipe.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, jobOne.job_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 26:
            _context5.next = 28;
            return _models["default"].Axis.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, jobOne.job_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 28:
            _context5.next = 30;
            return _models["default"].Curve.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, jobOne.job_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 30:
            _context5.next = 32;
            return _models["default"].CurveJoint.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, jobOne.job_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 32:
            _context5.next = 34;
            return _models["default"].Obstruction.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, jobOne.job_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 34:
            _context5.next = 36;
            return _models["default"].ObsModelRelation.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, jobOne.job_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 36:
            _context5.next = 38;
            return transaction.commit();

          case 38:
            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(jobOne.real_id.toLocaleUpperCase()));

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