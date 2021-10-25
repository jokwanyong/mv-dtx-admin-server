"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _models = _interopRequireDefault(require("../../../models"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var sort, order, fid, pipe_result, real_ids, total;
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

            sort = req.query._sort === undefined || null || 'id' ? 'fid' : req.query._sort;
            order = req.query._order === undefined ? 'DESC' : req.query._order;

            if (req.query.q === 'test') {
              fid = 11419142;
            } else if (req.query.q === 'test01') {
              fid = 1141914201;
            } else {
              fid = req.query.q === undefined || null ? '' : _config["default"].createEncoding(req.query.q);
            }

            ;
            _context.next = 11;
            return _models["default"].Pipe.findAll({
              attributes: ['fid', 'latlon', 'alt', 'geo', 'distance', 'material', 'line_num', 'type', 'pipe_type', 'depth', 'diameter', 'remarks', 'create_date', [_models["default"].sequelize.col('axis_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('axis_TBL.heading'), 'heading'], [_models["default"].sequelize.col('axis_TBL.pitch'), 'pitch'], [_models["default"].sequelize.col('axis_TBL.roll'), 'roll'], [_models["default"].sequelize.col('curve_info_TBL.curve_deg'), 'curve_deg'], [_models["default"].sequelize.col('curve_info_TBL.curve_latlon'), 'curve_latlon'], [_models["default"].sequelize.col('curve_info_TBL.curve_pitch'), 'curve_pitch'], [_models["default"].sequelize.col('smart_station_TBL.img'), 'img'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model']],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, '%' + fid + '%')
              }]),
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
              order: [[sort, order]]
            });

          case 11:
            pipe_result = _context.sent;
            _context.next = 14;
            return _models["default"].Job.findAndCountAll({
              raw: true
            });

          case 14:
            real_ids = _context.sent;

            _lodash["default"].map(pipe_result, function (data, i) {
              var imgs = [];
              var image = data.dataValues.img === null ? [] : data.dataValues.img.split(",");
              image.map(function (pipe) {
                var img = {};
                img.img = pipe;
                imgs.push(img);
              });
              data.dataValues.imgs = imgs;
              data.dataValues.lat = data.dataValues.latlon.coordinates[0].toFixed(12);
              data.dataValues.lon = data.dataValues.latlon.coordinates[1].toFixed(12);

              _config["default"].pipe_option.map(function (op) {
                if (data.dataValues.pipe_type === op.pipe_type) {
                  data.dataValues.pipe_type = op.name;
                }
              });

              _lodash["default"].map(real_ids.rows, function (job) {
                if (data.fid.substr(0, 12) === job.job_fid_prefix) {
                  data.dataValues.real_id = job.real_id;
                }

                ;
              });

              if (data.dataValues.curve_latlon !== null) {
                data.dataValues.curve_lat = data.dataValues.curve_latlon.coordinates[0].toFixed(12);
                data.dataValues.curve_lon = data.dataValues.curve_latlon.coordinates[1].toFixed(12);
              }

              delete data.dataValues.latlon;
              delete data.dataValues.curve_latlon;
            });

            total = pipe_result.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(total));
            res.setHeader('X-Total-Count', "".concat(total));
            res.send(pipe_result);
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
              attributes: ['fid', 'latlon', 'alt', 'geo', 'distance', 'material', 'line_num', 'type', 'pipe_type', 'depth', 'diameter', 'remarks', 'diameter', 'create_date', [_models["default"].sequelize.col('axis_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('axis_TBL.heading'), 'heading'], [_models["default"].sequelize.col('axis_TBL.pitch'), 'pitch'], [_models["default"].sequelize.col('axis_TBL.roll'), 'roll'], [_models["default"].sequelize.col('curve_info_TBL.curve_deg'), 'curve_deg'], [_models["default"].sequelize.col('curve_info_TBL.curve_latlon'), 'curve_latlon'], [_models["default"].sequelize.col('curve_info_TBL.curve_pitch'), 'curve_pitch'], [_models["default"].sequelize.col('smart_station_TBL.img'), 'img'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model']],
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
              }
            });

          case 7:
            pipe_one = _context2.sent;
            imgs = [];
            image = pipe_one.dataValues.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });
            pipe_one.dataValues.imgs = imgs;

            _config["default"].pipe_option.map(function (op) {
              if (pipe_one.dataValues.pipe_type === op.pipe_type) {
                pipe_one.dataValues.pipe_type = op.name;
              }
            });

            pipe_one.dataValues.id = pipe_one.dataValues.fid;
            pipe_one.dataValues.lat = pipe_one.dataValues.latlon.coordinates[0].toFixed(12);
            pipe_one.dataValues.lon = pipe_one.dataValues.latlon.coordinates[1].toFixed(12);
            pipe_one.dataValues.curve_lon = pipe_one.dataValues.curve_latlon.coordinates[0].toFixed(12);
            pipe_one.dataValues.curve_lon = pipe_one.dataValues.curve_latlon.coordinates[1].toFixed(12);
            delete pipe_one.dataValues.latlon;
            delete pipe_one.dataValues.curve_latlon;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            res.send(pipe_one);
            _context2.next = 31;
            break;

          case 27:
            _context2.prev = 27;
            _context2.t0 = _context2["catch"](0);
            console.log("error", _context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 31:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 27]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('', function (req, res, next) {
  res.send("ERR");
});
router.put('/:id', function (req, res, next) {
  try {
    var point = {
      type: 'Point',
      coordinates: [req.body.lat, req.body.lon]
    };
    var curve_point = {
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

    var pipe_one; // pipe, axis, curve update

    return _models["default"].sequelize.transaction().then(function (t) {
      return _models["default"].Pipe.update({
        alt: req.body.alt,
        material: req.body.material,
        type: req.body.type,
        depth: req.body.depth,
        diameter: req.body.diameter,
        latlon: point,
        geo: req.body.geo,
        distance: req.body.distance,
        line_num: req.body.line_num,
        remarks: req.body.remarks,
        create_date: req.body.create_date,
        measure_date: req.body.measure_date
      }, {
        where: {
          fid: req.params.id
        }
      }, {
        transaction: t
      }).then(function (pipeUpdate) {
        return _models["default"].Axis.update({
          azimuth: req.body.azimuth,
          heading: req.body.heading,
          pitch: req.body.pitch,
          roll: req.body.roll
        }, {
          where: {
            fid: req.params.id
          }
        }, {
          transaction: t
        }).then(function (axisUpdate) {
          return _models["default"].Curve.update({
            curve_deg: req.body.curve_deg,
            curve_latlon: curve_point,
            curve_pitch: req.body.curve_pitch
          }, {
            where: {
              fid: req.params.id
            }
          }, {
            transaction: t
          }).then(function (updateCurve) {
            return _models["default"].ModelRelation.update({
              pipe_model: req.body.pipe_model
            }, {
              where: {
                fid: req.params.id
              }
            }, {
              transaction: t
            }).then(function (updateModel) {
              return _models["default"].Pipe.findOne({
                attributes: ['fid', 'latlon', 'alt', 'geo', 'distance', 'material', 'line_num', 'type', 'depth', 'diameter', 'remarks', 'create_date', [_models["default"].sequelize.col('axis_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('axis_TBL.heading'), 'heading'], [_models["default"].sequelize.col('axis_TBL.pitch'), 'pitch'], [_models["default"].sequelize.col('axis_TBL.roll'), 'roll'], [_models["default"].sequelize.col('curve_info_TBL.curve_deg'), 'curve_deg'], [_models["default"].sequelize.col('curve_info_TBL.curve_latlon'), 'curve_latlon'], [_models["default"].sequelize.col('smart_station_TBL.img'), 'img'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model']],
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
                }
              }, {
                transaction: t
              }).then(function (pipeOne) {
                var imgs = [];
                var image = pipeOne.dataValues.img.split(",");
                image.map(function (data) {
                  var img = {};
                  img.img = data;
                  imgs.push(img);
                });
                pipeOne.dataValues.imgs = imgs;
                pipeOne.dataValues.id = pipeOne.dataValues.fid;
                pipeOne.dataValues.lat = pipeOne.dataValues.latlon.coordinates[0].toFixed(12);
                pipeOne.dataValues.lon = pipeOne.dataValues.latlon.coordinates[1].toFixed(12);
                pipeOne.dataValues.curve_lon = pipeOne.dataValues.curve_latlon.coordinates[0].toFixed(12);
                pipeOne.dataValues.curve_lon = pipeOne.dataValues.curve_latlon.coordinates[1].toFixed(12);
                delete pipeOne.dataValues.latlon;
                delete pipeOne.dataValues.curve_latlon;
                return pipe_one = pipeOne;
              });
            });
          });
        });
      }).then(function () {
        t.commit();
        res.send(pipe_one);
      })["catch"](function (err) {
        t.rollback();
        console.log(err);
        res.send(err);
      });
    });
  } catch (error) {
    console.log(error);
    res.send({
      "result": "fail",
      "message": error.message
    });
  }
});
router["delete"]('/:id', function (req, res, next) {
  // pipe, axis, curve delete
  try {
    return _models["default"].sequelize.transaction().then(function (t) {
      return _models["default"].Pipe.destroy({
        where: {
          fid: req.params.id
        },
        transaction: t
      }).then(function (dePi) {
        return _models["default"].Axis.destroy({
          where: {
            fid: req.params.id
          },
          transaction: t
        }).then(function (deAx) {
          return _models["default"].Curve.destroy({
            where: {
              fid: req.params.id
            },
            transaction: t
          }).then(function (deCurve) {
            return;
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
    console.log(error);
    res.send({
      "result": "fail",
      "message": error.message
    });
  }
});
module.exports = router;