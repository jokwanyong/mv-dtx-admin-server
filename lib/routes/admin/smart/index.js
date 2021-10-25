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

var _gm = _interopRequireDefault(require("gm"));

var _imageSize = _interopRequireDefault(require("image-size"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _http = require("../../../util/http");

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var transaction, sort, order, fid, fids, _end, _start, smart_result, real_ids;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sort = req.query._sort === 'id' || undefined ? 'fid' : req.query._sort;
            order = req.query._order === undefined ? 'DESC' : req.query._order;
            fid = req.query.q === undefined || null ? '' : req.query.q;
            fids = req.query.area_id === undefined || null ? '' : _config["default"].createEncoding(req.query.area_id);
            _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);
            _context.next = 9;
            return _models["default"].sequelize.transaction();

          case 9:
            transaction = _context.sent;

            _models["default"].Smart.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            _models["default"].Smart.hasOne(_models["default"].CurveJoint, {
              foreignKey: 'fid'
            });

            _context.next = 14;
            return _models["default"].Smart.findAndCountAll({
              attributes: ['fid', [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('smart_station_TBL.latlon')), 'lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('smart_station_TBL.latlon')), 'lon'], 'alt', 'geo', 'depth', 'fix', 'joint_num', 'img', 'pipe_type', 'data_id', 'qid', 'vdop', 'hdop', 'type', 'curve_degree', 'diameter', 'instrument_height', 'material', [_models["default"].sequelize.col('pipe_model_relation_TBL.smart_model'), 'smart_model'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'], [_models["default"].sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('curve_joint_TBL.pitch'), 'pitch'], 'facility_type', 'facility_type_name', 'facility_type_code', 'facility_usage', 'facility_usage_name', 'facility_depth', 'measure_date'],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, fid + '%')
              }, {
                fid: (0, _defineProperty2["default"])({}, Op.like, fids + '%')
              }]),
              include: [{
                model: _models["default"].ModelRelation,
                attributes: []
              }, {
                model: _models["default"].CurveJoint,
                attributes: []
              }],
              order: [[sort, order]],
              offset: _start,
              limit: _end,
              raw: true,
              transaction: transaction
            });

          case 14:
            smart_result = _context.sent;
            _context.next = 17;
            return _models["default"].Job.findAndCountAll({
              raw: true,
              transaction: transaction
            });

          case 17:
            real_ids = _context.sent;

            _lodash["default"].map(smart_result.rows, function (e, i) {
              e.Images = _lodash["default"].replace(e.img, new RegExp(',', 'g'), '|');
              var imgs = [];
              var image = e.img.split(",");
              image.map(function (smart_result) {
                var img = {};
                img.img = smart_result;
                imgs.push(img);
              });
              e.imgs = imgs;
              e.PipeType = e.pipe_type;

              _config["default"].pipe_option.map(function (op) {
                if (op.pipe_type === e.pipe_type) {
                  e.pipe_type = op.name;
                }
              });

              e.lat = e.lat.toFixed(12);
              e.lon = e.lon.toFixed(12);

              _lodash["default"].map(real_ids.rows, function (job) {
                if (e.fid.substr(0, 12) === job.job_fid_prefix) {
                  e.real_id = job.real_id;
                }

                ;
              });

              delete e.img;
            });

            _context.next = 21;
            return transaction.commit();

          case 21:
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(smart_result.count));
            res.setHeader('X-Total-Count', "".concat(smart_result.count));
            res.send(smart_result.rows);
            _context.next = 35;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](0);

            if (!transaction) {
              _context.next = 33;
              break;
            }

            _context.next = 33;
            return transaction.rollback();

          case 33:
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 35:
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
router.post('/move', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var transaction, smart_result, model_result, result, result1, smart, model, fidArr;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context2.sent;

            _models["default"].Smart.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            _models["default"].Smart.hasOne(_models["default"].CurveJoint, {
              foreignKey: 'fid'
            });

            _context2.next = 8;
            return _models["default"].Smart.findAll({
              attributes: ['fid', 'latlon', 'alt', 'geo', 'depth', 'fix', 'joint_num', 'img', 'pipe_type', 'diameter', 'instrument_height', 'material', [_models["default"].sequelize.col('pipe_model_relation_TBL.smart_model'), 'smart_model'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'], [_models["default"].sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('curve_joint_TBL.pitch'), 'pitch'], 'measure_date'],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, '172429153705' + '%')
              }, {
                diameter: 1000
              }, _models["default"].sequelize.where(_models["default"].sequelize.fn('date', _models["default"].sequelize.col('smart_station_TBL.measure_date')), "2020-05-22")]),
              include: [{
                model: _models["default"].ModelRelation,
                attributes: [],
                required: true
              }, {
                model: _models["default"].CurveJoint,
                attributes: [],
                required: false
              }],
              transaction: transaction
            });

          case 8:
            smart_result = _context2.sent;
            _context2.next = 11;
            return _models["default"].Smart.findAll({
              attributes: ['fid', 'latlon', 'alt', 'geo', 'depth', 'fix', 'joint_num', 'img', 'pipe_type', 'diameter', 'instrument_height', 'material', [_models["default"].sequelize.col('pipe_model_relation_TBL.smart_model'), 'smart_model'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'], [_models["default"].sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('curve_joint_TBL.pitch'), 'pitch'], 'measure_date'],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, '172429153705' + '%')
              }, {
                diameter: 1000
              }, _models["default"].sequelize.where(_models["default"].sequelize.fn('date', _models["default"].sequelize.col('smart_station_TBL.measure_date')), "2020-05-22")]),
              include: [{
                model: _models["default"].ModelRelation,
                attributes: [],
                required: true
              }, {
                model: _models["default"].CurveJoint,
                attributes: [],
                required: false
              }],
              transaction: transaction
            });

          case 11:
            model_result = _context2.sent;
            result = smart_result.map(function (value) {
              return value.dataValues;
            });
            result1 = model_result.map(function (value) {
              return value.dataValues;
            });
            smart = result.map(function (value) {
              var returnValues = {};
              returnValues.fid = value.fid.replace(/172429153705/g, "172429153706");
              returnValues.latlon = value.latlon;
              returnValues.alt = value.alt;
              returnValues.geo = value.geo;
              returnValues.depth = value.depth;
              returnValues.fix = value.fix;
              returnValues.joint_num = value.joint_num;
              returnValues.pipe_type = value.pipe_type;
              returnValues.instrument_height = value.instrument_height;
              returnValues.diameter = value.diameter;
              returnValues.material = value.material;
              returnValues.img = value.img;
              returnValues.measure_date = value.measure_date;
              return returnValues;
            });
            model = result1.map(function (value) {
              var returnValues = {};
              returnValues.fid = value.fid.replace(/172429153705/g, "172429153706");
              returnValues.smart_model = value.smart_model;
              returnValues.pipe_model = value.pipe_model;
              return returnValues;
            }); // await sequelize.Smart.bulkCreate(smart, {transaction: transaction});
            // await sequelize.ModelRelation.bulkCreate(model, {transaction: transaction});

            fidArr = result.map(function (value) {
              return value.fid;
            }); // await sequelize.ModelRelation.destroy({
            //     where: {
            //         fid: fidArr
            //     }
            // }, {transaction: transaction});
            // await sequelize.Smart.destroy({
            //     where: {
            //         fid: fidArr
            //     }
            // }, {transaction: transaction});
            // await sequelize.Pipe.destroy({
            //     where: {
            //         fid: fidArr
            //     }
            // }, {transaction: transaction});
            // await sequelize.Axis.destroy({
            //     where: {
            //         fid: fidArr
            //     }
            // }, {transaction: transaction});
            // await sequelize.Curve.destroy({
            //     where: {
            //         fid: fidArr
            //     }
            // }, {transaction: transaction});
            // await sequelize.CurveJoint.destroy({
            //     where: {
            //         fid: fidArr
            //     }
            // }, {transaction: transaction});

            _context2.next = 19;
            return transaction.commit();

          case 19:
            res.json({
              smart: smart,
              model: model,
              fidArr: fidArr
            });
            _context2.next = 26;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 22]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var fid, smart_one, imgs, image;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            fid = req.params.id;

            _models["default"].Smart.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            _context3.next = 5;
            return _models["default"].Smart.findOne({
              attributes: ['fid', [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('smart_station_TBL.latlon')), 'lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('smart_station_TBL.latlon')), 'lon'], 'alt', 'geo', 'depth', 'fix', 'joint_num', 'pipe_type', 'data_id', 'qid', 'vdop', 'hdop', 'type', 'diameter', 'instrument_height', 'material', 'curve_degree', [_models["default"].sequelize.col('pipe_model_relation_TBL.smart_model'), 'smart_model'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'], 'img', 'facility_type', 'facility_type_name', 'facility_type_code', 'facility_usage', 'facility_usage_name', 'facility_depth', 'measure_date'],
              where: {
                fid: fid
              },
              include: [{
                model: _models["default"].ModelRelation,
                attributes: []
              }],
              raw: true
            });

          case 5:
            smart_one = _context3.sent;
            imgs = [];
            image = smart_one.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });

            _config["default"].pipe_option.map(function (op) {
              if (smart_one.pipe_type === op.pipe_type) {
                smart_one.pipe_type = op.name;
              }
            });

            smart_one.imgs = imgs;
            smart_one.id = fid;
            smart_one.lat = smart_one.lat.toFixed(12);
            smart_one.lon = smart_one.lon.toFixed(12);
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/1");
            res.setHeader('X-Total-Count', "1");
            res.send(smart_one);
            _context3.next = 25;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 21]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var fid, date, img_name, smart_model_relation, pipe_model_relation, pipe_type, point, insert_smart;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            fid = _config["default"].createEncoding(req.body.real_id);
            date = (0, _moment["default"])().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
            fid = fid + new Date(date).getTime() / 1000;

            _models["default"].Smart.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            img_name = [];
            point = {
              type: 'Point',
              coordinates: [req.body.lat, req.body.lon]
            };
            return _context4.abrupt("return", _models["default"].sequelize.transaction().then(function (t) {
              return _models["default"].Job.findOne({
                attributes: ['pipe_type', 'area_id'],
                where: {
                  real_id: req.body.real_id
                }
              }, {
                transaction: t
              }).then(function (findA) {
                // 37.672212655192
                // 126.74119378622
                pipe_type = findA.pipe_type; // var filePath = `/efs/dtx_image/gps_images/${findA.area_id}/`;

                var filePath = process.platform === 'linux' ? "/efs/dtx_image/gps_images/".concat(findA.area_id, "/") : _path["default"].join(__dirname.substr(0, __dirname.length - 18), "public/".concat(findA.area_id, "/"));

                _lodash["default"].map(req.body.imgs, function (e, i) {
                  var base64Data;

                  if (e.src.includes('data:image/png;base64,')) {
                    base64Data = e.src.replace(/^data:image\/png;base64,/, "");
                  } else {
                    base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
                  }

                  _fs["default"].writeFileSync(filePath + e.title, base64Data, 'base64', function (err) {
                    console.log(err);
                  });

                  var imagePath = filePath + e.title;
                  var savePath = filePath + "thumbnail/".concat(e.title);
                  var dimenstions = (0, _imageSize["default"])(imagePath);
                  base64Data = "";
                  e.src = "";
                  var width = dimenstions.width * 0.3;
                  var height = dimenstions.height * 0.3;
                  (0, _gm["default"])(imagePath).thumb(width, height, savePath, function (err) {
                    if (err) console.log(err);else console.log('done');
                  });
                  img_name.push(findA.area_id + '/' + e.title);
                });

                return _models["default"].Smart.create({
                  fid: fid,
                  latlon: point,
                  alt: req.body.alt,
                  geo: req.body.geo,
                  depth: req.body.depth,
                  fix: req.body.fix,
                  data_id: req.body.data_id,
                  qid: req.body.qid,
                  vdop: req.body.vdop,
                  hdop: req.body.hdop,
                  pipe_type: pipe_type,
                  code: 0,
                  diameter: req.body.diameter,
                  facility_type: req.body.facility_type,
                  facility_type_name: req.body.facility_type_name,
                  facility_type_code: req.body.facility_type_code,
                  facility_usage: req.body.facility_usage,
                  facility_usage_name: req.body.facility_usage_name,
                  facility_depth: req.body.facility_depth,
                  instrument_height: req.body.instrument_height,
                  material: req.body.material,
                  img: img_name.join(),
                  type: req.body.type,
                  curve_degree: req.body.curve_degree,
                  measure_date: date
                }, {
                  transaction: t
                }).then(function (insert) {
                  insert_smart = insert;
                  return _models["default"].ModelRelation.create({
                    fid: fid,
                    smart_model: req.body.smart_model,
                    pipe_model: req.body.pipe_model
                  }, {
                    transaction: t
                  }).then(function (modelC) {
                    var imgs = [];
                    var image = insert_smart.img.split(",");
                    image.map(function (data) {
                      var img = {};
                      img.img = data;
                      imgs.push(img);
                    });
                    insert_smart.dataValues.imgs = imgs;
                    insert_smart.dataValues.id = fid;
                    insert_smart.dataValues.lat = insert_smart.dataValues.latlon.coordinates[0].toFixed(12);
                    insert_smart.dataValues.lon = insert_smart.dataValues.latlon.coordinates[1].toFixed(12);
                    insert_smart.dataValues.joint_num = 0;
                    insert_smart.dataValues.smart_model = req.body.smart_model;
                    insert_smart.dataValues.pipe_model = req.body.pipe_model;
                    return;
                  });
                });
              }).then(function () {
                t.commit();
                res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
                res.setHeader('Content-Range', "0-5/1");
                res.setHeader('X-Total-Count', "1");
                res.send(insert_smart);
              })["catch"](function (err) {
                t.rollback();
                console.log(err);
                res.send(err);
              });
            }));

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            t.rollback();
            console.log(_context4.t0);
            res.send("error");

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 10]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router.put('/:id', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var transaction, point, smart_result, image_title, findA, filePath, smartOne, imgs, image;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            point = {
              type: 'Point',
              coordinates: [req.body.lat, req.body.lon]
            };

            _models["default"].Smart.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            _models["default"].Smart.hasOne(_models["default"].CurveJoint, {
              foreignKey: 'fid'
            });

            image_title = [];
            _context5.next = 7;
            return _models["default"].sequelize.transaction();

          case 7:
            transaction = _context5.sent;
            _context5.next = 10;
            return _models["default"].Job.findOne({
              attributes: ['area_id'],
              where: {
                job_fid_prefix: (0, _defineProperty2["default"])({}, Op.like, '%' + req.body.fid.substr(0, 10) + '%')
              },
              transaction: transaction
            });

          case 10:
            findA = _context5.sent;
            filePath = process.platform === 'linux' ? "/efs/dtx_image/gps_images/".concat(findA.area_id, "/") : _path["default"].join(__dirname.substr(0, __dirname.length - 18), "public/".concat(findA.area_id, "/"));

            _lodash["default"].map(req.body.newFiles, function (e, i) {
              var base64Data;

              if (e.src.includes('data:image/png;base64,')) {
                base64Data = e.src.replace(/^data:image\/png;base64,/, "");
              } else {
                base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
              }

              _fs["default"].writeFileSync(filePath + e.title, base64Data, 'base64', function (err) {
                console.log(err);
              });

              var imagePath = filePath + e.title;
              var savePath = filePath + "thumbnail/".concat(e.title);
              var dimenstions = (0, _imageSize["default"])(imagePath);
              base64Data = "";
              e.src = "";
              var width = dimenstions.width * 0.3;
              var height = dimenstions.height * 0.3;
              (0, _gm["default"])(imagePath).thumb(width, height, savePath, function (err) {
                if (err) console.log(err);else console.log('done');
              });
            });

            _lodash["default"].map(req.body.imgs, function (e, i) {
              console.log(i);
              var img = e.img.split("/");

              if (img.length < 2) {
                img.unshift(findA.area_id);
              }

              image_title.push(img.join().replace(",", "/"));
            });

            _context5.next = 16;
            return _models["default"].Smart.update({
              latlon: point,
              alt: req.body.alt,
              geo: req.body.geo,
              depth: req.body.depth,
              fix: req.body.fix,
              pipe_type: req.body.pipe_type,
              data_id: req.body.data_id,
              qid: req.body.qid,
              vdop: req.body.vdop,
              hdop: req.body.hdop,
              type: req.body.type,
              curve_degree: req.body.curve_degree,
              diameter: req.body.diameter,
              instrument_height: req.body.instrument_height,
              material: req.body.material,
              joint_num: req.body.joint_num,
              facility_type: req.body.facility_type,
              facility_type_name: req.body.facility_type_name,
              facility_type_code: req.body.facility_type_code,
              facility_usage: req.body.facility_usage,
              facility_usage_name: req.body.facility_usage_name,
              facility_depth: req.body.facility_depth,
              img: image_title.join(),
              measure_date: req.body.measure_date
            }, {
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 16:
            _context5.next = 18;
            return _models["default"].ModelRelation.update({
              smart_model: req.body.smart_model,
              pipe_model: req.body.pipe_model
            }, {
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 18:
            _context5.next = 20;
            return _models["default"].CurveJoint.update({
              azimuth: req.body.azimuth,
              pitch: req.body.pitch
            }, {
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 20:
            _context5.next = 22;
            return _models["default"].Smart.findOne({
              attributes: ['fid', 'latlon', 'alt', 'geo', 'depth', 'fix', 'pipe_type', 'data_id', 'qid', 'vdop', 'hdop', 'type', 'curve_degree', 'joint_num', 'diameter', 'instrument_height', 'material', 'facility_type', 'facility_type_name', 'facility_type_code', 'facility_usage', 'facility_usage_name', 'facility_depth', [_models["default"].sequelize.col('pipe_model_relation_TBL.smart_model'), 'smart_model'], [_models["default"].sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'], 'img', [_models["default"].sequelize.fn('date_format', _models["default"].sequelize.col('smart_station_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'], [_models["default"].sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'], [_models["default"].sequelize.col('curve_joint_TBL.pitch'), 'pitch']],
              where: {
                fid: req.params.id
              },
              include: [{
                model: _models["default"].ModelRelation,
                attributes: []
              }, {
                model: _models["default"].CurveJoint,
                attributes: []
              }],
              raw: true,
              transaction: transaction
            });

          case 22:
            smartOne = _context5.sent;
            _context5.next = 25;
            return transaction.commit();

          case 25:
            imgs = [];
            image = smartOne.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });

            _config["default"].pipe_option.map(function (op) {
              if (smartOne.pipe_type === op.pipe_type) {
                smartOne.pipe_type = op.name;
              }
            });

            smartOne.imgs = imgs;
            smartOne.id = smartOne.fid;
            smartOne.lat = smartOne.latlon.coordinates[0].toFixed(12);
            smartOne.lon = smartOne.latlon.coordinates[1].toFixed(12);
            console.log(smartOne);
            res.send(smartOne);
            _context5.next = 44;
            break;

          case 37:
            _context5.prev = 37;
            _context5.t0 = _context5["catch"](0);

            if (!transaction) {
              _context5.next = 42;
              break;
            }

            _context5.next = 42;
            return transaction.rollback();

          case 42:
            console.log(_context5.t0);
            res.send({
              "result": "fail",
              "message": _context5.t0.message
            });

          case 44:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 37]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var transaction, areaOne;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            _models["default"].Smart.hasOne(_models["default"].ModelRelation, {
              foreignKey: 'fid'
            });

            _context6.next = 4;
            return _models["default"].sequelize.transaction();

          case 4:
            transaction = _context6.sent;
            _context6.next = 7;
            return _models["default"].Job.findOne({
              where: {
                job_fid_prefix: (0, _defineProperty2["default"])({}, Op.like, req.params.id.substr(0, 12) + '%')
              },
              transaction: transaction
            });

          case 7:
            areaOne = _context6.sent;
            _context6.next = 10;
            return _models["default"].Smart.destroy({
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 10:
            _context6.next = 12;
            return _models["default"].ModelRelation.destroy({
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 12:
            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/joint/b3dm/high/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/joint/b3dm/low/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/joint/lod/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/joint/obj/").concat(req.params.id));

            _context6.next = 18;
            return (0, _http.fileIo)(areaOne.real_id, "joint");

          case 18:
            _context6.next = 20;
            return transaction.commit();

          case 20:
            res.send("SUCCESS");
            _context6.next = 30;
            break;

          case 23:
            _context6.prev = 23;
            _context6.t0 = _context6["catch"](0);

            if (!transaction) {
              _context6.next = 28;
              break;
            }

            _context6.next = 28;
            return transaction.rollback();

          case 28:
            console.log(_context6.t0);
            res.send({
              "result": "fail",
              "message": _context6.t0.message
            });

          case 30:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 23]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
module.exports = router;