"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _models = _interopRequireDefault(require("../../../models"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _moment = _interopRequireDefault(require("moment"));

var _gm = _interopRequireDefault(require("gm"));

var _imageSize = _interopRequireDefault(require("image-size"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get("", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var sort, order, _end, _start, fid, obstruction, fids, real_ids;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sort = req.query._sort === undefined || "id" ? "fid" : req.query._sort;
            order = req.query._order === undefined ? "DESC" : req.query._order;
            _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
            _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

            if (req.query.q === "test") {
              fid = 11419142;
            } else if (req.query.q === "test01") {
              fid = 1141914201;
            } else {
              fid = req.query.q === undefined || null ? "" : _config["default"].createEncoding(req.query.q);
            }

            _models["default"].Obstruction.hasOne(_models["default"].ObsModelRelation, {
              foreignKey: "fid"
            });

            _models["default"].ObsModelRelation.hasOne(_models["default"].ObsManhole, {
              foreignKey: "idx",
              sourceKey: "manhole_idx"
            });

            _models["default"].ObsModelRelation.hasOne(_models["default"].ObsRelation, {
              foreignKey: "idx",
              sourceKey: "code_idx"
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsCompany, {
              foreignKey: 'company_idx'
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsModel, {
              foreignKey: 'model_idx'
            });

            if (!(req.query.area_id !== undefined)) {
              _context.next = 22;
              break;
            }

            fids = req.query.area_id === undefined || null ? '' : _config["default"].createEncoding(req.query.area_id);
            _context.next = 15;
            return _models["default"].Obstruction.findAndCountAll({
              attributes: ["fid", [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('obstruction_TBL.latlon')), 'lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('obstruction_TBL.latlon')), 'lon'], "alt", "geo", "depth", "fix", "img", [_models["default"].sequelize.fn('date_format', _models["default"].sequelize.col('obstruction_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'], "type", "pipe_type", "data_id", 'vdop', 'hdop', "azimuth", "heading", "pitch", "roll", "diameter", "instrument_height", "hole_depth", [_models["default"].sequelize.col('obstruction_model_relation_TBL.code_idx'), 'code_idx'], [_models["default"].sequelize.col('obstruction_model_relation_TBL.manhole_idx'), 'manhole_idx'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.width'), 'width'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.diameter'), 'diameter'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.height'), 'height'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_model_TBL.model_name'), 'model_name']],
              include: [{
                model: _models["default"].ObsModelRelation,
                attributes: [],
                include: [{
                  model: _models["default"].ObsManhole,
                  attributes: []
                }, {
                  model: _models["default"].ObsRelation,
                  attributes: [],
                  include: [{
                    model: _models["default"].ObsCompany,
                    attributes: []
                  }, {
                    model: _models["default"].ObsModel,
                    attributes: []
                  }]
                }]
              }],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, '%' + fid + '%')
              }, {
                fid: (0, _defineProperty2["default"])({}, Op.like, '%' + fids + '%')
              }]),
              order: [[sort, order]],
              offset: _start,
              limit: _end,
              raw: true
            });

          case 15:
            obstruction = _context.sent;
            _context.next = 18;
            return _models["default"].Job.findAndCountAll({
              raw: true
            });

          case 18:
            real_ids = _context.sent;

            _lodash["default"].map(obstruction.rows, function (e) {
              var imgs = [];
              var image = e.img.split(",");
              image.map(function (smart_result) {
                var img = {};
                img.img = smart_result;
                imgs.push(img);
              });
              e.imgs = imgs;
              e.lat = e.lat.toFixed(12);
              e.lon = e.lon.toFixed(12);

              _lodash["default"].map(real_ids.rows, function (job) {
                if (e.fid.substr(0, 12) === job.job_fid_prefix) {
                  e.real_id = job.real_id;
                  e.pipe_type = job.pipe_type;
                }

                ;
              });

              delete e.img;
            });

            _context.next = 26;
            break;

          case 22:
            _context.next = 24;
            return _models["default"].Obstruction.findAndCountAll({
              attributes: ["fid", [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('obstruction_TBL.latlon')), 'lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('obstruction_TBL.latlon')), 'lon'], "alt", "geo", "depth", "fix", "img", [_models["default"].sequelize.fn('date_format', _models["default"].sequelize.col('obstruction_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'], "type", "pipe_type", "data_id", 'vdop', 'hdop', "azimuth", "heading", "pitch", "roll", "diameter", "instrument_height", "hole_depth", [_models["default"].sequelize.col('obstruction_model_relation_TBL.code_idx'), 'code_idx'], [_models["default"].sequelize.col('obstruction_model_relation_TBL.manhole_idx'), 'manhole_idx'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.width'), 'width'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.diameter'), 'diameter'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.height'), 'height'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_model_TBL.model_name'), 'model_name']],
              include: [{
                model: _models["default"].ObsModelRelation,
                attributes: [],
                include: [{
                  model: _models["default"].ObsManhole,
                  attributes: []
                }, {
                  model: _models["default"].ObsRelation,
                  attributes: [],
                  include: [{
                    model: _models["default"].ObsCompany,
                    attributes: []
                  }, {
                    model: _models["default"].ObsModel,
                    attributes: []
                  }]
                }]
              }],
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, "%" + fid + "%")
              }]),
              raw: true
            });

          case 24:
            obstruction = _context.sent;

            _lodash["default"].map(obstruction.rows, function (e) {
              var imgs = [];
              var image = e.img.split(",");
              image.map(function (smart_result) {
                var img = {};
                img.img = smart_result;
                imgs.push(img);
              });
              e.imgs = imgs;
              e.lat = e.lat.toFixed(12);
              e.lon = e.lon.toFixed(12);
              delete e.img;
            });

          case 26:
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/".concat(obstruction.count));
            res.setHeader("X-Total-Count", "".concat(obstruction.count));
            res.send(obstruction.rows);
            _context.next = 37;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 33]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get("/:id", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var obstruction_one, imgs, image;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].Obstruction.findOne({
              attributes: ["fid", [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('obstruction_TBL.latlon')), 'lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('obstruction_TBL.latlon')), 'lon'], "alt", "geo", "depth", "fix", "img", [_models["default"].sequelize.fn('date_format', _models["default"].sequelize.col('obstruction_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'], "type", "pipe_type", "data_id", 'vdop', 'hdop', "azimuth", "heading", "pitch", "roll", "diameter", "instrument_height", "hole_depth", [_models["default"].sequelize.col('obstruction_model_relation_TBL.code_idx'), 'code_idx'], [_models["default"].sequelize.col('obstruction_model_relation_TBL.manhole_idx'), 'manhole_idx'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.width'), 'width'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.diameter'), 'diameter'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.height'), 'height'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_model_TBL.model_name'), 'model_name']],
              include: [{
                model: _models["default"].ObsModelRelation,
                attributes: [],
                include: [{
                  model: _models["default"].ObsManhole,
                  attributes: []
                }, {
                  model: _models["default"].ObsRelation,
                  attributes: [],
                  include: [{
                    model: _models["default"].ObsCompany,
                    attributes: []
                  }, {
                    model: _models["default"].ObsModel,
                    attributes: []
                  }]
                }]
              }],
              where: {
                fid: req.params.id
              },
              raw: true
            });

          case 3:
            obstruction_one = _context2.sent;
            obstruction_one.lat = obstruction_one.lat.toFixed(12);
            obstruction_one.lon = obstruction_one.lon.toFixed(12);
            imgs = [];
            image = obstruction_one.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });
            obstruction_one.imgs = imgs;
            obstruction_one.id = obstruction_one.fid;
            obstruction_one.type = "".concat(obstruction_one.type);
            delete obstruction_one.img;
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/".concat(1));
            res.setHeader("X-Total-Count", "".concat(1));
            res.send(obstruction_one);
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 20]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("", /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var transaction, fid, date, img_name, result, point, find_area, filePath, manhole, code, imgs;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (req.body.real_id === "test") {
              fid = 11419142;
            } else if (req.body.real_id === "test01") {
              fid = 1141914201;
            } else {
              fid = _config["default"].createEncoding(req.body.real_id);
            } //     37.679233902595406
            // 126.74595697925315
            // 37.672212655192
            // 126.74119378622


            date = (0, _moment["default"])().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
            fid = "".concat(fid) + new Date(date).getTime() / 1000;

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsCompany, {
              foreignKey: 'company_idx'
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsModel, {
              foreignKey: 'model_idx'
            });

            img_name = [];
            point = {
              type: "Point",
              coordinates: [req.body.lat, req.body.lon]
            };
            _context3.next = 10;
            return _models["default"].sequelize.transaction();

          case 10:
            transaction = _context3.sent;
            _context3.next = 13;
            return _models["default"].Job.findOne({
              attributes: ["area_id"],
              where: {
                real_id: req.body.real_id
              }
            }, {
              transaction: transaction
            });

          case 13:
            find_area = _context3.sent;
            filePath = "/efs/dtx_image/obs_images/".concat(find_area.area_id, "/");
            filePath = process.platform === 'linux' ? "/efs/dtx_image/obs_images/".concat(find_area.area_id, "/") : _path["default"].join(__dirname.substr(0, __dirname.length - 25), "public/".concat(find_area.area_id, "/"));

            _lodash["default"].map(req.body.imgs, function (e, i) {
              var base64Data;

              if (e.src.includes("data:image/png;base64,")) {
                base64Data = e.src.replace(/^data:image\/png;base64,/, "");
              } else {
                base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
              }

              _fs["default"].writeFileSync(filePath + e.title, base64Data, "base64", function (err) {
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
              img_name.push("obs_images/".concat(find_area.area_id, "/").concat(e.title));
            });

            if (req.body.hole_depth === undefined) {
              req.body.hole_depth = null;
            }

            ;
            _context3.next = 21;
            return _models["default"].Obstruction.create({
              fid: fid,
              latlon: point,
              alt: req.body.alt,
              geo: req.body.geo,
              depth: req.body.depth,
              fix: req.body.fix,
              img: img_name.join(),
              type: req.body.type,
              code: req.body.type,
              pipe_type: req.body.pipe_type,
              data_id: req.body.data_id,
              qid: req.body.qid,
              vdop: req.body.vdop,
              hdop: req.body.hdop,
              azimuth: req.body.azimuth,
              heading: req.body.heading,
              pitch: req.body.pitch,
              roll: req.body.roll,
              diameter: req.body.diameter,
              instrument_height: req.body.instrument_height,
              hole_depth: req.body.hole_depth
            }, {
              transaction: transaction
            });

          case 21:
            _context3.t0 = req.body.type;
            _context3.next = _context3.t0 === "1" ? 24 : _context3.t0 === "2" ? 27 : _context3.t0 === "3" ? 27 : _context3.t0 === "4" ? 36 : _context3.t0 === "5" ? 36 : _context3.t0 === "6" ? 36 : 44;
            break;

          case 24:
            _context3.next = 26;
            return _models["default"].ObsModelRelation.create({
              fid: fid
            }, {
              transaction: transaction
            });

          case 26:
            return _context3.abrupt("break", 46);

          case 27:
            _context3.next = 29;
            return _models["default"].ObsManhole.findOne({
              where: {
                idx: req.body.manhole_idx
              }
            }, {
              transaction: transaction
            });

          case 29:
            manhole = _context3.sent;
            req.body.width = manhole.dataValues.width;
            req.body.diameter = manhole.dataValues.diameter;
            req.body.height = manhole.dataValues.height;
            _context3.next = 35;
            return _models["default"].ObsModelRelation.create({
              fid: fid,
              manhole_idx: req.body.manhole_idx
            }, {
              transaction: transaction
            });

          case 35:
            return _context3.abrupt("break", 46);

          case 36:
            _context3.next = 38;
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
                idx: req.body.code_idx
              },
              transaction: transaction
            });

          case 38:
            code = _context3.sent;
            req.body.company_name = code.dataValues.company_name;
            req.body.model_name = code.dataValues.model_name;
            _context3.next = 43;
            return _models["default"].ObsModelRelation.create({
              fid: fid,
              code_idx: req.body.code_idx
            }, {
              transaction: transaction
            });

          case 43:
            return _context3.abrupt("break", 46);

          case 44:
            throw new Error("Error");

          case 46:
            ;
            _context3.next = 49;
            return transaction.commit();

          case 49:
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/1");
            res.setHeader("X-Total-Count", "1");
            req.body.fid = fid;
            imgs = [];
            img_name.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });
            req.body.imgs = imgs;
            res.send(req.body);
            _context3.next = 67;
            break;

          case 60:
            _context3.prev = 60;
            _context3.t1 = _context3["catch"](0);

            if (!transaction) {
              _context3.next = 65;
              break;
            }

            _context3.next = 65;
            return transaction.rollback();

          case 65:
            console.log("error", _context3.t1);
            res.send({
              "result": "fail",
              "message": _context3.t1.message
            });

          case 67:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 60]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
router.put("/:id", /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var transaction, latlon, obstruction_result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            latlon = {
              type: "Point",
              coordinates: [req.body.lat, req.body.lon]
            };

            _models["default"].Obstruction.hasOne(_models["default"].ObsModelRelation, {
              foreignKey: "fid"
            });

            _models["default"].ObsModelRelation.hasOne(_models["default"].ObsManhole, {
              foreignKey: "idx",
              sourceKey: "manhole_idx"
            });

            _models["default"].ObsModelRelation.hasOne(_models["default"].ObsRelation, {
              foreignKey: "idx",
              sourceKey: "code_idx"
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsCompany, {
              foreignKey: 'company_idx'
            });

            _models["default"].ObsRelation.belongsTo(_models["default"].ObsModel, {
              foreignKey: 'model_idx'
            }); // transaction = await sequelize.sequelize.transaction();


            return _context4.abrupt("return", _models["default"].sequelize.transaction().then(function (t) {
              return _models["default"].Job.findOne({
                attributes: ["area_id"],
                where: {
                  job_fid_prefix: (0, _defineProperty2["default"])({}, Op.like, '%' + req.body.fid.substr(0, 10) + '%')
                }
              }, {
                transaction: t
              }).then(function (findA) {
                var filePath = "/efs/dtx_image/obs_images/".concat(findA.area_id, "/");
                var image_title = [];

                _lodash["default"].map(req.body.imgs, function (e, i) {
                  var img = e.img.split("/");

                  if (img.length < 2) {
                    img.unshift("obs_images/" + findA.area_id);
                  }

                  image_title.push(_lodash["default"].replace(img.join(), new RegExp(',', 'g'), '/'));
                });

                _lodash["default"].map(req.body.newFiles, function (e, i) {
                  var base64Data;

                  if (e.src.includes("data:image/png;base64,")) {
                    base64Data = e.src.replace(/^data:image\/png;base64,/, "");
                  } else {
                    base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
                  }

                  _fs["default"].writeFileSync(filePath + e.title, base64Data, "base64", function (err) {
                    image_title.push("obs_images/".concat(findA.area_id, "/").concat(e.title));
                    console.log(err);
                  });

                  base64Data = "";
                  e.src = "";
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

                if (req.body.hole_depth === undefined) {
                  req.body.hole_depth = null;
                }

                return _models["default"].Obstruction.update({
                  latlon: latlon,
                  alt: req.body.alt,
                  geo: req.body.geo,
                  depth: req.body.depth,
                  fix: req.body.fix,
                  measure_date: req.body.measure_date,
                  type: req.body.type,
                  pipe_type: req.body.pipe_type,
                  data_id: req.body.data_id,
                  qid: req.body.qid,
                  vdop: req.body.vdop,
                  hdop: req.body.hdop,
                  azimuth: req.body.azimuth,
                  heading: req.body.heading,
                  pitch: req.body.pitch,
                  roll: req.body.roll,
                  img: image_title.join(),
                  diameter: req.body.diameter,
                  instrument_height: req.body.instrument_height,
                  hole_depth: req.body.hole_depth
                }, {
                  where: {
                    fid: req.params.id
                  },
                  transaction: t
                }).then(function (update) {
                  return _models["default"].Obstruction.findOne({
                    where: {
                      fid: req.params.id
                    },
                    transaction: t
                  }).then(function (SelObs) {
                    return _models["default"].ObsModelRelation.findOne({
                      where: {
                        fid: req.params.id
                      },
                      transaction: t
                    }).then(function (findRelation) {
                      var promise = [];

                      if (!findRelation) {
                        var relation_create = _models["default"].ObsModelRelation.create({
                          fid: req.params.id,
                          code_idx: req.body.code_idx,
                          manhole_idx: req.body.manhole_idx
                        }, {
                          transaction: t
                        });

                        promise.push(relation_create);
                      } else {
                        var relation_update = _models["default"].ObsModelRelation.update({
                          code_idx: req.body.code_idx,
                          manhole_idx: req.body.manhole_idx
                        }, {
                          where: {
                            fid: req.params.id
                          }
                        }, {
                          transaction: t
                        });

                        promise.push(relation_update);
                      }

                      return Promise.all(promise).then(function (promise_result) {
                        return _models["default"].Obstruction.findOne({
                          attributes: ["fid", [_models["default"].sequelize.fn('X', _models["default"].sequelize.col('obstruction_TBL.latlon')), 'lat'], [_models["default"].sequelize.fn('Y', _models["default"].sequelize.col('obstruction_TBL.latlon')), 'lon'], "alt", "geo", "depth", "fix", "img", [_models["default"].sequelize.fn('date_format', _models["default"].sequelize.col('obstruction_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'], "measure_date", "type", "pipe_type", "data_id", 'vdop', 'hdop', "azimuth", "heading", "pitch", "roll", "diameter", "instrument_height", "hole_depth", [_models["default"].sequelize.col('obstruction_model_relation_TBL.code_idx'), 'code_idx'], [_models["default"].sequelize.col('obstruction_model_relation_TBL.manhole_idx'), 'manhole_idx'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.width'), 'width'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.diameter'), 'diameter'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.height'), 'height'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_company_TBL.company_name'), 'company_name'], [_models["default"].sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_model_TBL.model_name'), 'model_name']],
                          include: [{
                            model: _models["default"].ObsModelRelation,
                            attributes: [],
                            include: [{
                              model: _models["default"].ObsManhole,
                              attributes: []
                            }, {
                              model: _models["default"].ObsRelation,
                              attributes: [],
                              include: [{
                                model: _models["default"].ObsCompany,
                                attributes: []
                              }, {
                                model: _models["default"].ObsModel,
                                attributes: []
                              }]
                            }]
                          }],
                          where: {
                            fid: req.params.id
                          },
                          transaction: t
                        }).then(function (update_result) {
                          // update_result.dataValues.lat = update_result.dataValues.latlon.coordinates[0].toFixed(12);
                          // update_result.dataValues.lon = update_result.dataValues.latlon.coordinates[1].toFixed(12);
                          var imgs = [];
                          var image = update_result.img.split(",");
                          image.map(function (data) {
                            var img = {};
                            img.img = data;
                            imgs.push(img);
                          });
                          update_result.dataValues.imgs = imgs;
                          update_result.dataValues.id = update_result.dataValues.fid;
                          update_result.dataValues.type = "".concat(update_result.dataValues.type);
                          delete update_result.dataValues.img;
                          obstruction_result = update_result;
                        });
                      });
                    });
                  });
                });
              }).then(function () {
                t.commit();
                res.send(obstruction_result);
              })["catch"](function (err) {
                t.rollback();
                console.log(err);
                res.json(err);
              });
            }));

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.log("error", _context4.t0);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 10]]);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]("/:id", /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var transaction, areaOne;
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
              where: {
                job_fid_prefix: (0, _defineProperty2["default"])({}, Op.like, req.params.id.substr(0, 12) + '%')
              },
              transaction: transaction
            });

          case 6:
            areaOne = _context5.sent;
            _context5.next = 9;
            return _models["default"].Obstruction.destroy({
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 9:
            _context5.next = 11;
            return _models["default"].ObsModelRelation.destroy({
              where: {
                fid: req.params.id
              },
              transaction: transaction
            });

          case 11:
            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/hole/b3dm/high/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/hole/b3dm/low/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/hole/lod/").concat(req.params.id));

            _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(areaOne.real_id.toLocaleUpperCase(), "/hole/obj/").concat(req.params.id));

            _context5.next = 17;
            return transaction.commit();

          case 17:
            res.json({
              data: "SUCCESS"
            });
            _context5.next = 27;
            break;

          case 20:
            _context5.prev = 20;
            _context5.t0 = _context5["catch"](0);

            if (!transaction) {
              _context5.next = 25;
              break;
            }

            _context5.next = 25;
            return transaction.rollback();

          case 25:
            console.log("error", _context5.t0);
            res.json(_context5.t0.message);

          case 27:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 20]]);
  }));

  return function (_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;