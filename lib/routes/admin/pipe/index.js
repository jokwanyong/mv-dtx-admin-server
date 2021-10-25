"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _models = _interopRequireDefault(require("../../../models"));

var _http = require("../../../util/http");

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var sort, order, fid, fids, _end, _start, pipe_result;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _models["default"].Pipe.hasOne(_models["default"].Axis, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].Curve, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].Smart, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            sort = req.query._sort === 'id' || undefined ? 'fid' : req.query._sort;
            order = req.query._order === undefined ? 'DESC' : req.query._order;
            fid = req.query.q === undefined || null ? '' : req.query.q;
            fids = req.query.area_id === undefined || null ? '' : _config["default"].createEncoding(req.query.area_id);
            _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);
            _context.next = 13;
            return _models["default"].Pipe.findAndCountAll({
              attributes: ['fid', [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('pipe_TBL.latlon')), 'lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('pipe_TBL.latlon')), 'lon'], 'alt', 'geo', 'distance', 'material', 'line_num', 'type', 'pipe_type', 'depth', 'diameter', 'remarks', 'create_date', [_models["default"].sequelize.col('axis_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('axis_TBL.heading'), 'heading'], [_models["default"].sequelize.col('axis_TBL.pitch'), 'pitch'], [_models["default"].sequelize.col('axis_TBL.roll'), 'roll'], [_models["default"].sequelize.col('curve_info_TBL.curve_deg'), 'curve_deg'], [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('curve_info_TBL.curve_latlon')), 'curve_lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('curve_info_TBL.curve_latlon')), 'curve_lon'], [_models["default"].sequelize.col('curve_info_TBL.curve_pitch'), 'curve_pitch'], [_models["default"].sequelize.col('smart_station_TBL.img'), 'img'], [_models["default"].sequelize.col('smart_station_TBL.data_id'), 'data_id'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model']],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, '%' + fid + '%')
              }, {
                fid: (0, _defineProperty2["default"])({}, Op.like, '%' + fids + '%')
              }]),
              include: [{
                model: _models["default"].Axis,
                attributes: [],
                nested: false,
                required: false
              }, {
                model: _models["default"].Curve,
                attributes: [],
                required: false
              }, {
                model: _models["default"].Smart,
                attributes: [// 'img'
                ]
              }, {
                model: _models["default"].ModelRelation,
                attributes: []
              }],
              order: [[sort, order]],
              offset: _start,
              limit: _end,
              raw: true
            });

          case 13:
            pipe_result = _context.sent;

            _lodash["default"].map(pipe_result.rows, function (data, i) {
              var imgs = [];
              var image = data.img === null || '' ? [] : data.img.split(",");
              image.map(function (pipe) {
                var img = {};
                img.img = pipe;
                imgs.push(img);
              });
              data.imgs = imgs;
              data.lat = data.lat.toFixed(12);
              data.lon = data.lon.toFixed(12);

              _config["default"].pipe_option.map(function (op) {
                if (data.pipe_type === op.pipe_type) {
                  data.pipe_type = op.name;
                }
              });

              if (data.curve_lat !== null) {
                data.curve_lat = data.curve_lat.toFixed(12);
                data.curve_lon = data.curve_lon.toFixed(12);
              }
            });

            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(pipe_result.count));
            res.setHeader('X-Total-Count', "".concat(pipe_result.count));
            res.send(pipe_result.rows);
            _context.next = 26;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 22]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var pipe_one, imgs, image;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            _models["default"].Pipe.hasOne(_models["default"].Axis, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].Curve, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].Smart, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            _context2.next = 7;
            return _models["default"].Pipe.findOne({
              attributes: ['fid', [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('pipe_TBL.latlon')), 'lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('pipe_TBL.latlon')), 'lon'], 'alt', 'geo', 'distance', 'material', 'line_num', 'type', 'pipe_type', 'depth', 'diameter', 'remarks', 'create_date', [_models["default"].sequelize.col('axis_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('axis_TBL.heading'), 'heading'], [_models["default"].sequelize.col('axis_TBL.pitch'), 'pitch'], [_models["default"].sequelize.col('axis_TBL.roll'), 'roll'], [_models["default"].sequelize.col('curve_info_TBL.curve_deg'), 'curve_deg'], [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('curve_info_TBL.curve_latlon')), 'curve_lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('curve_info_TBL.curve_latlon')), 'curve_lon'], [_models["default"].sequelize.col('curve_info_TBL.curve_pitch'), 'curve_pitch'], [_models["default"].sequelize.col('smart_station_TBL.img'), 'img'], [_models["default"].sequelize.col('smart_station_TBL.data_id'), 'data_id'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model']],
              include: [{
                model: _models["default"].Axis,
                attributes: [],
                nested: false,
                required: false
              }, {
                model: _models["default"].Curve,
                attributes: [],
                required: false
              }, {
                model: _models["default"].Smart,
                attributes: [],
                paranoid: false,
                required: false,
                nested: false
              }, {
                model: _models["default"].ModelRelation,
                attributes: []
              }],
              where: {
                fid: req.params.id
              },
              raw: true
            });

          case 7:
            pipe_one = _context2.sent;
            imgs = [];
            image = pipe_one.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });
            pipe_one.imgs = imgs;

            _config["default"].pipe_option.map(function (op) {
              if (pipe_one.pipe_type === op.pipe_type) {
                pipe_one.pipe_type = op.name;
              }
            });

            pipe_one.id = pipe_one.fid;
            pipe_one.lat = Number(pipe_one.lat).toFixed(12);
            pipe_one.lon = Number(pipe_one.lon).toFixed(12);

            if (pipe_one.curve_lat !== null) {
              pipe_one.curve_lat = Number(pipe_one.curve_lat).toFixed(12);
              pipe_one.curve_lon = Number(pipe_one.curve_lon).toFixed(12);
            }

            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            res.send(pipe_one);
            _context2.next = 28;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](0);
            console.log("error", _context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 24]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('', function (req, res, next) {
  res.send("ERR");
});
router.put('/:id', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var transaction, point, curve_point, pipe_one, pipeUpdate, pipeOne, imgs, image;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            point = {
              type: 'Point',
              coordinates: [req.body.lat, req.body.lon]
            };
            curve_point = {
              type: 'Point',
              coordinates: [req.body.curve_lat, req.body.curve_lon]
            };

            _models["default"].Pipe.hasOne(_models["default"].Axis, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].Curve, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].Smart, {
              foreignKey: 'fid'
            });

            _models["default"].Pipe.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            _context3.next = 9;
            return _models["default"].sequelize.transaction();

          case 9:
            transaction = _context3.sent;
            _context3.next = 12;
            return _models["default"].Pipe.update({
              alt: req.body.alt,
              material: req.body.material,
              type: req.body.type,
              pipe_type: req.body.pipe_type,
              depth: req.body.depth,
              latlon: point,
              geo: req.body.geo,
              distance: req.body.distance,
              line_num: req.body.line_num,
              diameter: req.body.diameter,
              remarks: req.body.remarks,
              create_date: req.body.create_date,
              measure_date: req.body.measure_date
            }, {
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 12:
            pipeUpdate = _context3.sent;
            _context3.next = 15;
            return _models["default"].Axis.update({
              azimuth: req.body.azimuth,
              heading: req.body.heading,
              pitch: req.body.pitch,
              roll: req.body.roll
            }, {
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 15:
            _context3.next = 17;
            return _models["default"].Curve.update({
              curve_deg: req.body.curve_deg,
              curve_latlon: curve_point,
              curve_pitch: req.body.curve_pitch
            }, {
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 17:
            _context3.next = 19;
            return _models["default"].ModelRelation.update({
              pipe_model: req.body.pipe_model
            }, {
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 19:
            _context3.next = 21;
            return _models["default"].Pipe.findOne({
              attributes: ['fid', 'latlon', 'alt', 'geo', 'distance', 'material', 'line_num', 'type', 'depth', 'diameter', 'remarks', [_models["default"].sequelize.fn('date_format', _models["default"].sequelize.col('pipe_TBL.create_date'), '%Y-%m-%d %H:%i:%s'), 'create_date'], [_models["default"].sequelize.col('axis_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('axis_TBL.heading'), 'heading'], [_models["default"].sequelize.col('axis_TBL.pitch'), 'pitch'], [_models["default"].sequelize.col('axis_TBL.roll'), 'roll'], [_models["default"].sequelize.col('curve_info_TBL.curve_deg'), 'curve_deg'], [_models["default"].sequelize.col('curve_info_TBL.curve_latlon'), 'curve_latlon'], [_models["default"].sequelize.col('smart_station_TBL.img'), 'img'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model']],
              include: [{
                model: _models["default"].Axis,
                attributes: [// 'azimuth',
                  // 'heading',
                  // 'pitch',
                  // 'roll'
                ],
                nested: false,
                required: false
              }, {
                model: _models["default"].Curve,
                attributes: [// 'curve_deg',
                  // ['X(curve_latlon)', 'curve_lat'],
                  // ['Y(curve_latlon)', 'curve_lon']
                ],
                required: false
              }, {
                model: _models["default"].Smart,
                attributes: [// 'img'
                ],
                paranoid: false,
                required: false,
                nested: false
              }, {
                model: _models["default"].ModelRelation,
                attributes: []
              }],
              where: {
                fid: req.params.id
              },
              raw: true,
              transaction: transaction
            });

          case 21:
            pipeOne = _context3.sent;
            imgs = [];
            image = pipeOne.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });
            console.log(pipeOne);
            pipeOne.imgs = imgs;
            pipeOne.id = pipeOne.fid;
            pipeOne.lat = pipeOne.latlon.coordinates[0].toFixed(12);
            pipeOne.lon = pipeOne.latlon.coordinates[1].toFixed(12);

            if (pipeOne.curve_latlon !== null) {
              pipeOne.curve_lon = pipeOne.curve_latlon.coordinates[0].toFixed(12);
              pipeOne.curve_lon = pipeOne.curve_latlon.coordinates[1].toFixed(12);
            }

            delete pipeOne.latlon;
            delete pipeOne.curve_latlon;
            _context3.next = 35;
            return transaction.commit();

          case 35:
            res.send(pipeOne);
            _context3.next = 45;
            break;

          case 38:
            _context3.prev = 38;
            _context3.t0 = _context3["catch"](0);

            if (!transaction) {
              _context3.next = 43;
              break;
            }

            _context3.next = 43;
            return transaction.rollback();

          case 43:
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 45:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 38]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var transaction, areaOne;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context4.sent;
            _context4.next = 6;
            return _models["default"].Job.findOne({
              where: {
                job_fid_prefix: (0, _defineProperty2["default"])({}, Op.like, req.params.id.substr(0, 12) + '%')
              },
              transaction: transaction
            });

          case 6:
            areaOne = _context4.sent;
            _context4.next = 9;
            return _models["default"].Pipe.destroy({
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 9:
            _context4.next = 11;
            return _models["default"].Axis.destroy({
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 11:
            _context4.next = 13;
            return _models["default"].Curve.destroy({
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 13:
            _context4.next = 15;
            return _models["default"].CurveJoint.destroy({
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 15:
            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/pipe/b3dm/high/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/pipe/b3dm/low/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/pipe/lod/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/pipe/obj/").concat(req.params.id));

            _context4.next = 21;
            return (0, _http.fileIo)(areaOne.real_id, "pipe");

          case 21:
            _context4.next = 23;
            return transaction.commit();

          case 23:
            res.send("SUCCESS");
            _context4.next = 33;
            break;

          case 26:
            _context4.prev = 26;
            _context4.t0 = _context4["catch"](0);

            if (!transaction) {
              _context4.next = 31;
              break;
            }

            _context4.next = 31;
            return transaction.rollback();

          case 31:
            console.log(_context4.t0);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 33:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 26]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
module.exports = router;