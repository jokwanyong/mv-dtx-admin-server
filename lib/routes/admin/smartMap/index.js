"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _models = _interopRequireDefault(require("../../../models"));

var _moment = _interopRequireDefault(require("moment"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var sort, order, fid, offset, limit, smart_result, real_ids, total;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sort = req.query._sort === undefined || 'id' ? 'fid' : req.query._sort;
            order = req.query._order === undefined ? 'DESC' : req.query._order;

            if (req.query.q === 'test') {
              fid = 11419142;
            } else if (req.query.q === 'test01') {
              fid = 1141914201;
            } else {
              fid = req.query.q === undefined || null ? '' : _config["default"].createEncoding(req.query.q);
            }

            ;
            offset = req.query._start;
            limit = req.query._end;

            _models["default"].Smart.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            _models["default"].Smart.hasOne(_models["default"].CurveJoint, {
              foreignKey: 'fid'
            });

            _context.next = 11;
            return _models["default"].Smart.findAll({
              attributes: ['fid', 'latlon', 'alt', 'geo', 'depth', 'fix', 'joint_num', 'img', 'pipe_type', 'data_id', 'qid', 'vdop', 'hdop', 'type', 'curve_degree', 'diameter', 'instrument_height', 'material', 'measure_date', 'facility_type', 'facility_type_name', 'facility_type_code', 'facility_usage', 'facility_usage_name', 'facility_depth', [_models["default"].sequelize.col('pipe_model_relation_TBL.smart_model'), 'smart_model'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'], [_models["default"].sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('curve_joint_TBL.pitch'), 'pitch']],
              include: [{
                model: _models["default"].ModelRelation,
                attributes: []
              }, {
                model: _models["default"].CurveJoint,
                attributes: []
              }],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, fid + '%')
              }]),
              order: [[sort, order]]
            });

          case 11:
            smart_result = _context.sent;
            _context.next = 14;
            return _models["default"].Job.findAndCountAll({
              raw: true
            });

          case 14:
            real_ids = _context.sent;

            _lodash["default"].map(smart_result, function (e, i) {
              var imgs = [];
              var image = e.img.split(",");
              image.map(function (smart_result) {
                var img = {};
                img.img = smart_result;
                imgs.push(img);
              });

              _config["default"].pipe_option.map(function (op) {
                if (e.dataValues.pipe_type === op.pipe_type) {
                  e.dataValues.pipe_type = op.name;
                }
              });

              _lodash["default"].map(real_ids.rows, function (job) {
                if (e.fid.substr(0, 12) === job.job_fid_prefix) {
                  e.dataValues.real_id = job.real_id;
                }

                ;
              });

              e.dataValues.imgs = imgs;
              e.dataValues.lat = e.dataValues.latlon.coordinates[0].toFixed(12);
              e.dataValues.lon = e.dataValues.latlon.coordinates[1].toFixed(12);
              delete e.dataValues.latlon;
            });

            total = smart_result.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(total));
            res.setHeader('X-Total-Count', "".concat(total));
            res.send(smart_result);
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
    var fid, smart_one, imgs, image;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            fid = req.params.id;
            _context2.next = 4;
            return _models["default"].Smart.findOne({
              attributes: ['fid', ['X(latlon)', 'lat'], ['Y(latlon)', 'lon'], 'alt', 'geo', 'depth', 'fix', 'joint_num', 'pipe_type', 'data_id', 'qid', 'vdop', 'hdop', 'curve_degree', 'type', 'img', 'diameter', 'instrument_height', 'material', 'measure_date'],
              where: {
                fid: fid
              }
            });

          case 4:
            smart_one = _context2.sent;
            imgs = [];
            image = smart_one.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });

            _config["default"].pipe_option.map(function (op) {
              if (smart_one.dataValues.pipe_type === op.pipe_type) {
                smart_one.dataValues.pipe_type = op.name;
              }
            });

            smart_one.dataValues.imgs = imgs;
            smart_one.dataValues.id = fid;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/1");
            res.setHeader('X-Total-Count', "1");
            res.send(smart_one);
            _context2.next = 20;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](0);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 18]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var fid, date, filePath, img_name, model_relation, point;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            fid = _config["default"].createEncoding(req.body.area_id) + "99";
            date = (0, _moment["default"])().format("YYYY-MM-DD HH:mm:ss");
            fid = fid + new Date(date).getTime();
            filePath = _path["default"].join(__dirname.substr(0, __dirname.length - 18), 'public/');
            img_name = [];

            _lodash["default"].map(req.body.imgs, function (e, i) {
              var base64Data = e.src.replace(/^data:image\/png;base64,/, "");

              _fs["default"].writeFile(filePath + e.title, base64Data, 'base64', function (err) {
                console.log(err);
              });

              img_name.push(e.title);
            });

            point = {
              type: 'Point',
              coordinates: [req.body.lat, req.body.lon]
            };
            return _context3.abrupt("return", _models["default"].sequelize.transaction().then(function (t) {
              return _models["default"].Smart.create({
                fid: fid,
                latlon: point,
                alt: req.body.alt,
                geo: req.body.geo,
                depth: req.body.depth,
                data_id: req.body.data_id,
                fix: req.body.fix,
                diameter: req.body.diameter,
                instrument_height: req.body.instrument_height,
                material: req.body.material,
                img: img_name.join()
              }, {
                transaction: t
              }).then(function (insert) {
                return _models["default"].Area.findOne({
                  attributes: ['model_relation']
                }, {
                  where: {
                    area_fid_prefix: _config["default"].createEncoding(req.body.area_id)
                  }
                }, {
                  transaction: t
                }).then(function (findA) {
                  model_relation = findA.model_relation;
                  return _models["default"].ModelRelation.create({
                    fid: fid,
                    smart: model_relation,
                    pipe: model_relation
                  }, {
                    transaction: t
                  }).then(function (modelC) {});
                });
              }).then(function () {
                t.commit();
                res.send("SUCCESS");
              })["catch"](function (err) {
                t.rollback();
                console.log(err);
                res.send(err);
              });
            }));

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            res.send("error");

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 11]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.put('/:id', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var point, update;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            point = {
              type: 'Point',
              coordinates: [req.body.lat, req.body.lon]
            };
            _context4.next = 4;
            return _models["default"].Smart.update({
              latlon: point,
              alt: req.body.alt,
              geo: req.body.geo,
              depth: req.body.depth,
              fix: req.body.fix,
              joint_num: req.body.joint_num,
              measure_date: req.body.measure_date
            }, {
              where: {
                fid: req.params.id
              }
            });

          case 4:
            update = _context4.sent;
            res.send(update);
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
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            try {
              res.send("SUCCESS");
            } catch (error) {
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

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;