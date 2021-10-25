"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _multer = _interopRequireDefault(require("multer"));

var _moment = _interopRequireDefault(require("moment"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _gm = _interopRequireDefault(require("gm"));

var _imageSize = _interopRequireDefault(require("image-size"));

var _models = _interopRequireDefault(require("../../../models"));

var _config = _interopRequireDefault(require("../../../util/config"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var sort, order, fid, fids, survey_all;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sort = req.query._sort === undefined || 'id' ? 'fid' : req.query._sort;
            order = req.query._order === undefined ? 'DESC' : req.query._order;
            fid = req.query.q === undefined || null ? '' : req.query.q;
            fids = req.query.area_id === undefined || null ? '' : _config["default"].createEncoding(req.query.area_id);

            if (req.query.q === 'test') {
              fid = 11419142;
            } else if (req.query.q === 'test01') {
              fid = 1141914201;
            } else {
              fid = req.query.q === undefined || null ? '' : _config["default"].createEncoding(req.query.q);
            }

            ;
            _context.next = 9;
            return _models["default"].Survey.findAndCountAll({
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                fid: (0, _defineProperty2["default"])({}, Op.like, '%' + fid + '%')
              }, {
                fid: (0, _defineProperty2["default"])({}, Op.like, '%' + fids + '%')
              }]),
              order: [[sort, order]]
            });

          case 9:
            survey_all = _context.sent;

            _lodash["default"].map(survey_all.rows, function (e, i) {
              var imgs = [];
              var image = e.img.split(",");
              image.map(function (survey_all) {
                var img = {};
                img.img = survey_all;
                imgs.push(img);
              });
              e.dataValues.imgs = imgs;
              e.dataValues.lat = e.dataValues.latlon.coordinates[0];
              e.dataValues.lon = e.dataValues.latlon.coordinates[1];
              delete e.dataValues.img;
              delete e.dataValues.latlon;
            });

            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(survey_all.count));
            res.setHeader('X-Total-Count', "".concat(survey_all.count));
            res.send(survey_all.rows);
            _context.next = 22;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 18]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var survey_one, imgs, image;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].Survey.findOne({
              where: {
                fid: req.params.id
              }
            });

          case 3:
            survey_one = _context2.sent;
            imgs = [];
            image = survey_one.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });
            survey_one.dataValues.imgs = imgs;
            survey_one.dataValues.id = req.params.id;
            survey_one.dataValues.lat = survey_one.dataValues.latlon.coordinates[0];
            survey_one.dataValues.lon = survey_one.dataValues.latlon.coordinates[1];
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', "0-5/".concat(1));
            res.setHeader('X-Total-Count', "".concat(1));
            res.send(survey_one);
            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 18]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

var image_storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    try {
      var image_path = process.platform === 'linux' ? '/efs/dtx_image/gps_images/' : _path["default"].join(__dirname.substr(0, __dirname.length - 18), 'public/');
      image_path = image_path + req.body.area_id;
      cb(null, image_path);
    } catch (error) {
      return cb(new Error("error"));
    }
  },
  filename: function filename(req, file, cb) {
    file.uploadedFile = {
      name: file.filename,
      ext: file.mimetype.split('/')[1]
    }; // cb(null, file.fieldname + '-' + Date.now() + '.' + file.uploadedFile.ext);

    cb(null, file.originalname);
  }
}); // image Type, Check, maxCount


var imageUpload = (0, _multer["default"])({
  fileFilter: function fileFilter(req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(_path["default"].extname(file.originalname).toLowerCase());

    if (!(mimetype && extname)) {
      console.log(mimetype, extname);
      return cb(new Error('Invalid IMAGE Type'));
    }

    cb(null, true);
  },
  storage: image_storage
}).fields([{
  name: 'imgs',
  maxCount: 3
}]);
router.post('', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var transaction, findArea, img_name, fid, date, filePath, point, create_survey;
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
            return _models["default"].Job.findOne({
              attributes: ['area_id', 'real_id', 'job_fid_prefix'],
              where: {
                real_id: req.body.real_id
              }
            }, {
              transaction: transaction
            });

          case 6:
            findArea = _context3.sent;
            img_name = [];
            fid = findArea.job_fid_prefix;
            date = (0, _moment["default"])().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
            fid = fid + new Date(date).getTime() / 1000;
            filePath = process.platform === 'linux' ? "/efs/dtx_image/gps_images/".concat(findArea.area_id, "/") : _path["default"].join(__dirname.substr(0, __dirname.length - 18), "public/".concat(findArea.area_id));

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
              img_name.push(findArea.area_id + '/' + e.title);
            });

            point = {
              type: 'Point',
              coordinates: [req.body.lat, req.body.lon]
            };
            _context3.next = 16;
            return _models["default"].Survey.create({
              fid: fid,
              latlon: point,
              alt: req.body.alt,
              geo: req.body.geo,
              fix: req.body.fix,
              img: img_name.join(),
              measure_date: date
            }, {
              transaction: transaction
            });

          case 16:
            create_survey = _context3.sent;
            _context3.next = 19;
            return transaction.commit();

          case 19:
            res.send(create_survey);
            _context3.next = 29;
            break;

          case 22:
            _context3.prev = 22;
            _context3.t0 = _context3["catch"](0);

            if (!transaction) {
              _context3.next = 27;
              break;
            }

            _context3.next = 27;
            return transaction.rollback();

          case 27:
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 22]]);
  }));

  return function (_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());
router.put('/:id', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var transaction, findArea, image_title, filePath, update_one, result, imgs, image;
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
              attributes: ['area_id', 'real_id', 'job_fid_prefix'],
              where: (0, _defineProperty2["default"])({}, Op.like, '%' + req.body.fid.substr(0, 10) + '%')
            }, {
              transaction: transaction
            });

          case 6:
            findArea = _context4.sent;
            image_title = [];
            filePath = process.platform === 'linux' ? "/efs/dtx_image/gps_images/".concat(findArea.area_id, "/") : _path["default"].join(__dirname.substr(0, __dirname.length - 18), "public/".concat(findArea.area_id));

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
              var img = e.img.split("/");

              if (img.length < 2) {
                img.unshift(findA.area_id);
              }

              image_title.push(img.join().replace(",", "/"));
            });

            _context4.next = 13;
            return _models["default"].Survey.update({
              latlon: {
                type: 'Point',
                coordinates: [req.body.lat, req.body.lon]
              },
              alt: req.body.alt,
              geo: req.body.geo,
              fix: req.body.fix,
              img: image_title.join(),
              measure_date: req.body.measure_date
            }, {
              where: {
                fid: req.params.id
              }
            }, {
              transaction: transaction
            });

          case 13:
            update_one = _context4.sent;
            _context4.next = 16;
            return _models["default"].Survey.findOne({
              where: {
                fid: req.params.id
              }
            }, {
              transaction: transaction
            });

          case 16:
            result = _context4.sent;
            imgs = [];
            image = result.img.split(",");
            image.map(function (data) {
              var img = {};
              img.img = data;
              imgs.push(img);
            });
            result.dataValues.imgs = imgs;
            result.dataValues.id = req.params.id;
            result.dataValues.lat = result.dataValues.latlon.coordinates[0];
            result.dataValues.lon = result.dataValues.latlon.coordinates[1];
            _context4.next = 26;
            return transaction.commit();

          case 26:
            res.send(result);
            _context4.next = 36;
            break;

          case 29:
            _context4.prev = 29;
            _context4.t0 = _context4["catch"](0);

            if (!transaction) {
              _context4.next = 34;
              break;
            }

            _context4.next = 34;
            return transaction.rollback();

          case 34:
            console.log(_context4.t0);
            res.send({
              "result": "fail",
              "message": _context4.t0.message
            });

          case 36:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 29]]);
  }));

  return function (_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}());
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var delete_one;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _models["default"].Survey.destroy({
              where: {
                fid: req.params.id
              }
            });

          case 3:
            delete_one = _context5.sent;
            res.send(delete_one);
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