"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _models = _interopRequireDefault(require("../../../models"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _moment = _interopRequireDefault(require("moment"));

var _multer = _interopRequireDefault(require("multer"));

var _blue_point = require("./blue_point");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var is_smart, area, arr, total;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            is_smart = req.query.is_smart === undefined || null ? true : false; // sequelize.Area.belongsTo(sequelize.Area_Design, {foreignKey: 'area_id'});

            _models["default"].Area.hasMany(_models["default"].Job, {
              foreignKey: 'area_id'
            });

            _context.next = 5;
            return _models["default"].Area.findAll({
              attributes: ['area_id', ['area_id', 'id'], 'area_fid_prefix', 'total_length', 'start_date', 'end_date', 'builder', 'address', 'construction', 'state', 'unit', 'curve_type', 'area_type', 'default_alt', 'create_date', 'email', 'job_id', 'job_rid', 'job_fid_prefix', 'aerial_photo', 'coordinates', 'order'],
              include: [{
                model: _models["default"].Area_Design,
                required: false
              }, {
                model: _models["default"].Area_Data,
                required: false
              }, {
                attributes: ['job_id', 'area_id', 'real_id', 'smart_model_relation', 'pipe_model_relation', 'material'],
                model: _models["default"].Job,
                required: false
              }, {
                model: _models["default"].AreaProgress,
                required: false
              }]
            });

          case 5:
            area = _context.sent;

            if (!is_smart) {
              arr = [];
              area.map(function (e) {
                var smart = {};
                smart.area_id = e.area_id;
                smart.user_id = e.user_id.split(",");
                e.job_id = e.job_id.split(",");
                arr.push(smart);
              });
            } else {
              area.map(function (e) {
                e.state = String(e.state);
                e.area_type = String(e.area_type);
                e.unit = String(e.unit);
                e.aerial_photo = String(e.aerial_photo);
                e.job_id = e.job_id.split(",");
                e.curve_type = e.curve_type.split(",");

                if (e.email) {
                  e.email = e.email.split(",").map(function (e) {
                    return {
                      "address": e
                    };
                  });
                }

                if (e.coordinates) {
                  e.coordinates = e.coordinates.split(",").map(function (v) {
                    return String(v);
                  });
                }

                _lodash["default"].map(e.area_design_TBLs, function (data) {
                  data.dataValues.min_lat = data.dataValues.min_latlon.coordinates[0].toFixed(12);
                  data.dataValues.min_lon = data.dataValues.min_latlon.coordinates[1].toFixed(12);
                  data.dataValues.max_lat = data.dataValues.max_latlon.coordinates[0].toFixed(12);
                  data.dataValues.max_lon = data.dataValues.max_latlon.coordinates[1].toFixed(12);
                  delete data.dataValues.min_latlon;
                  delete data.dataValues.max_latlon;
                });

                _lodash["default"].map(e.job_TBLs, function (data) {
                  e.dataValues.smart_model_relation = "1";
                  e.dataValues.pipe_model_relation = "1";
                  e.dataValues.material = "PE";
                });

                delete e.dataValues.job_TBLs;
              });
            }

            total = area.length;
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/".concat(total));
            res.setHeader("X-Total-Count", "".concat(total));
            res.send(area);
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.send({
              "result": "fail",
              "message": _context.t0.message
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var area_one;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            _models["default"].Area.belongsTo(_models["default"].Area_Design, {
              foreignKey: 'area_id'
            });

            _models["default"].Area.hasMany(_models["default"].Job, {
              foreignKey: 'area_id'
            });

            _context2.next = 5;
            return _models["default"].Area.findOne({
              attributes: ['area_id', ['area_id', 'id'], 'area_fid_prefix', 'total_length', 'job_id', 'job_rid', 'job_fid_prefix', 'start_date', 'end_date', 'builder', 'address', 'construction', 'state', 'unit', 'curve_type', 'area_type', 'default_alt', 'email', 'create_date', 'aerial_photo', 'coordinates', 'order'],
              where: {
                area_id: req.params.id
              },
              include: [{
                model: _models["default"].Area_Design,
                required: false
              }, {
                model: _models["default"].Area_Data,
                required: false
              }, {
                model: _models["default"].AreaProgress,
                required: false
              }]
            });

          case 5:
            area_one = _context2.sent;
            res.setHeader("Access-Control-Expose-Headers", "Content-Range");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Content-Range", "0-5/1");
            res.setHeader("X-Total-Count", "1");
            area_one.state = String(area_one.state);
            area_one.area_type = String(area_one.area_type);
            area_one.unit = String(area_one.unit);
            area_one.aerial_photo = String(area_one.aerial_photo);
            area_one.job_id = area_one.job_id.split(",");
            area_one.curve_type = area_one.curve_type.split(",");

            if (area_one.email) {
              area_one.email = area_one.email.split(",").map(function (e) {
                return {
                  "address": e
                };
              });
            }

            if (area_one.coordinates) {
              area_one.coordinates = area_one.coordinates.split(",").map(function (e) {
                return String(e);
              });
            }

            _lodash["default"].map(area_one.area_design_TBLs, function (data) {
              data.dataValues.min_lat = data.dataValues.min_latlon.coordinates[0].toFixed(12);
              data.dataValues.min_lon = data.dataValues.min_latlon.coordinates[1].toFixed(12);
              data.dataValues.max_lat = data.dataValues.max_latlon.coordinates[0].toFixed(12);
              data.dataValues.max_lon = data.dataValues.max_latlon.coordinates[1].toFixed(12);
              delete data.dataValues.min_latlon;
              delete data.dataValues.max_latlon;
            });

            res.send(area_one);
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
router.post("", function (req, res, next) {
  try {
    var result;
    var area_id;
    var area_fid_prefix;
    return _models["default"].sequelize.transaction().then(function (t) {
      return _models["default"].Area.findAndCountAll({
        attributes: ['area_id'],
        where: {
          area_id: (0, _defineProperty2["default"])({}, Op.like, req.body.area_id + '%')
        }
      }, {
        transaction: t
      }).then(function (select_Area) {
        area_id = req.body.area_id + _lodash["default"].chain(_lodash["default"].filter(_config["default"].alphabet, ['num', select_Area.count])).head().value().string;
        area_fid_prefix = _config["default"].createEncoding(area_id);

        if (req.body.email) {
          var email_arr = _lodash["default"].map(req.body.email, function (em) {
            return em.address;
          });
        }

        return _models["default"].Area.create({
          area_id: area_id,
          area_fid_prefix: area_fid_prefix,
          total_length: req.body.total_length,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          builder: req.body.builder,
          address: req.body.address,
          construction: req.body.construction,
          state: req.body.state,
          unit: req.body.unit,
          curve_type: req.body.curve_type.join(),
          area_type: req.body.area_type,
          default_alt: req.body.default_alt,
          email: email_arr !== undefined ? email_arr.join() : email_arr,
          aerial_photo: req.body.aerial_photo,
          coordinates: req.body.coordinates.join(),
          order: req.body.order
        }, {
          transaction: t
        }).then(function (afterC) {
          result = afterC;
        });
      }).then(function () {
        t.commit();

        _shelljs["default"].exec("sudo mkdir /efs/dtx_image/gps_images/".concat(area_id, " && sudo chmod 777 /efs/dtx_image/gps_images/").concat(area_id));

        _shelljs["default"].exec("sudo mkdir /efs/dtx_image/gps_images/".concat(area_id, "/thumbnail && sudo chmod 777 /efs/dtx_image/gps_images/").concat(area_id, "thumbnail"));

        _shelljs["default"].exec("sudo mkdir /efs/dtx_image/obs_images/".concat(area_id, " && sudo chmod 777 /efs/dtx_image/obs_images/").concat(area_id));

        _shelljs["default"].exec("sudo mkdir /efs/dtx_image/obs_images/".concat(area_id, "/thumbnail && sudo chmod 777 /efs/dtx_image/obs_images/").concat(area_id, "thumbnail"));

        _shelljs["default"].exec("sudo mkdir /efs/dtx_model_web/design/".concat(area_id, " && sudo chmod 777 /efs/dtx_model_web/design/").concat(area_id));

        _shelljs["default"].exec("sudo mkdir /efs/model_data/design/".concat(area_id, " && sudo chmod 777 /efs/model_data/design/").concat(area_id));

        res.send(result);
      })["catch"](function (err) {
        t.rollback();
        console.log("err");
        console.log(err);
        res.send({
          "result": "fail",
          "message": err.message
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.send({
      "result": "fail",
      "message": error.message
    });
  }
}); // image save path from multer

var design_storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    try {
      var parseData = req.body.data === undefined || null ? req.body : JSON.parse(req.body.data);
      var file_path = process.platform === 'linux' ? '/efs/dtx_model_web/design/' : _path["default"].join(__dirname.substr(0, __dirname.length - 18), 'public/design/');
      file_path = file_path + parseData.area_id;
      cb(null, file_path);
    } catch (error) {
      return cb(new Error(error));
    }
  },
  filename: function filename(req, file, cb) {
    file.uploadedFile = {
      name: file.filename,
      ext: file.mimetype.split('/')[1]
    }; // cb(null, file.fieldname + '-' + Date.now() + '.' + file.uploadedFile.ext);

    cb(null, file.originalname);
  }
});

var json_upload = (0, _multer["default"])({
  storage: design_storage
});
var json_uploadMiddleware = json_upload.any('file');
router.post('/bluePrint', json_uploadMiddleware, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var transaction, data, area_fid_prefix, json, result, area_data_find;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (!_lodash["default"].isEmpty(req.files)) {
              _context3.next = 5;
              break;
            }

            res.send("File Empty");
            _context3.next = 33;
            break;

          case 5:
            _context3.next = 7;
            return _models["default"].sequelize.transaction();

          case 7:
            transaction = _context3.sent;
            data = req.body;
            area_fid_prefix = _config["default"].createEncoding(data.area_id);
            json = _fs["default"].readFileSync(req.files[0].path, 'utf8');
            console.log(area_fid_prefix);
            _context3.next = 14;
            return (0, _blue_point.insert_data)(JSON.parse(json), data.area_id, area_fid_prefix, data.type, req.body.geo_type, transaction);

          case 14:
            result = _context3.sent;
            console.log(result);
            _context3.next = 18;
            return _models["default"].Area_Data.findAll({
              where: {
                area_id: req.body.area_id,
                type: req.body.type
              }
            }, {
              transaction: transaction
            });

          case 18:
            area_data_find = _context3.sent;

            if (!(area_data_find.length > 0)) {
              _context3.next = 26;
              break;
            }

            console.log("IF");
            console.log("area_data_find", area_data_find);
            _context3.next = 24;
            return _models["default"].Area_Data.update({
              file: req.files[0].originalname
            }, {
              where: {
                area_id: req.body.area_id,
                type: req.body.type
              }
            }, {
              transaction: transaction
            });

          case 24:
            _context3.next = 30;
            break;

          case 26:
            console.log("else");
            console.log("area_data_find", area_data_find);
            _context3.next = 30;
            return _models["default"].Area_Data.create({
              area_id: req.body.area_id,
              type: req.body.type,
              file: req.files[0].originalname
            }, {
              transaction: transaction
            });

          case 30:
            _context3.next = 32;
            return transaction.commit();

          case 32:
            res.send("success");

          case 33:
            _context3.next = 42;
            break;

          case 35:
            _context3.prev = 35;
            _context3.t0 = _context3["catch"](0);

            if (!transaction) {
              _context3.next = 40;
              break;
            }

            _context3.next = 40;
            return transaction.rollback();

          case 40:
            console.log(_context3.t0);
            res.send({
              "result": "fail",
              "message": _context3.t0.message
            });

          case 42:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 35]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());

var image_storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    try {
      var image_path = process.platform === 'linux' ? '/efs/dtx_model_web/design/' : _path["default"].join(__dirname.substr(0, __dirname.length - 18), 'public/design/');
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
router.post('/design', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var transaction;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            imageUpload(req, res, /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(err) {
                var image_name, area_design_find, max, min;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        if (!err) {
                          _context4.next = 3;
                          break;
                        }

                        console.log(err);
                        return _context4.abrupt("return", res.send("ERROR"));

                      case 3:
                        if (!_lodash["default"].isEmpty(req.files)) {
                          _context4.next = 7;
                          break;
                        }

                        return _context4.abrupt("return", res.send("image Null"));

                      case 7:
                        _context4.next = 9;
                        return _models["default"].sequelize.transaction();

                      case 9:
                        transaction = _context4.sent;
                        image_name = [];

                        _lodash["default"].map(req.files.imgs, function (img) {
                          var name = "".concat(req.body.area_id, "/").concat(img.originalname);
                          console.log(img);
                          image_name.push(name);
                        });

                        _context4.next = 14;
                        return _models["default"].Area_Design.findAll({
                          where: {
                            area_id: req.body.area_id,
                            type: req.body.type
                          }
                        }, {
                          transaction: transaction
                        });

                      case 14:
                        area_design_find = _context4.sent;
                        // geo_type
                        max = (0, _blue_point.ConvertGeo)(req.body.max_lat, req.body.max_lon, req.body.geo_type);
                        min = (0, _blue_point.ConvertGeo)(req.body.min_lat, req.body.min_lon, req.body.geo_type);

                        if (!(area_design_find.length > 0)) {
                          _context4.next = 22;
                          break;
                        }

                        _context4.next = 20;
                        return _models["default"].Area_Design.update({
                          max_latlon: {
                            type: 'Point',
                            coordinates: max
                          },
                          min_latlon: {
                            type: 'Point',
                            coordinates: min
                          },
                          imgs: image_name.join()
                        }, {
                          where: {
                            area_id: req.body.area_id,
                            type: req.body.type
                          }
                        }, {
                          transaction: transaction
                        });

                      case 20:
                        _context4.next = 24;
                        break;

                      case 22:
                        _context4.next = 24;
                        return _models["default"].Area_Design.create({
                          area_id: req.body.area_id,
                          max_latlon: {
                            type: 'Point',
                            coordinates: max
                          },
                          min_latlon: {
                            type: 'Point',
                            coordinates: min
                          },
                          type: req.body.type,
                          imgs: image_name.join()
                        }, {
                          transaction: transaction
                        });

                      case 24:
                        _context4.next = 26;
                        return transaction.commit();

                      case 26:
                        res.send({
                          "result": "success"
                        });

                      case 27:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x13) {
                return _ref5.apply(this, arguments);
              };
            }());
            _context5.next = 11;
            break;

          case 4:
            _context5.prev = 4;
            _context5.t0 = _context5["catch"](0);

            if (!transaction) {
              _context5.next = 9;
              break;
            }

            _context5.next = 9;
            return transaction.rollback();

          case 9:
            console.log(_context5.t0);
            res.send({
              "result": "fail",
              "error": _context5.t0.message
            });

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 4]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router.post('/progress', /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var transaction, result, _yield$sequelize$Area, _yield$sequelize$Area2, record, created;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context6.sent;
            _context6.next = 6;
            return _models["default"].AreaProgress.findOrCreate({
              where: {
                area_id: req.body.area_id,
                pipe_type: req.body.pipe_type
              },
              defaults: {
                area_id: req.body.area_id,
                pipe_type: req.body.pipe_type,
                total_length: req.body.total_length
              },
              transaction: transaction
            });

          case 6:
            _yield$sequelize$Area = _context6.sent;
            _yield$sequelize$Area2 = (0, _slicedToArray2["default"])(_yield$sequelize$Area, 2);
            record = _yield$sequelize$Area2[0];
            created = _yield$sequelize$Area2[1];
            console.log("created : " + created);

            if (created) {
              _context6.next = 14;
              break;
            }

            _context6.next = 14;
            return _models["default"].AreaProgress.update({
              total_length: req.body.total_length
            }, {
              where: (0, _defineProperty2["default"])({}, Op.and, [{
                area_id: req.body.area_id
              }, {
                pipe_type: req.body.pipe_type
              }]),
              transaction: transaction
            });

          case 14:
            _context6.next = 16;
            return _models["default"].AreaProgress.findAll({
              where: {
                area_id: req.body.area_id
              },
              transaction: transaction
            });

          case 16:
            result = _context6.sent;
            _context6.next = 19;
            return transaction.commit();

          case 19:
            res.send({
              "result": "success",
              "area_progress": result
            });
            _context6.next = 29;
            break;

          case 22:
            _context6.prev = 22;
            _context6.t0 = _context6["catch"](0);

            if (!transaction) {
              _context6.next = 27;
              break;
            }

            _context6.next = 27;
            return transaction.rollback();

          case 27:
            console.log(_context6.t0);
            res.send({
              "result": "fail",
              "message": _context6.t0.message
            });

          case 29:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 22]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}());
router.put("/:id", function (req, res, next) {
  try {
    var area_fid_prefix = _config["default"].createEncoding(req.params.id);

    var area_id = req.params.id;
    var curve_type = req.body.curve_type;
    var default_alt;
    return _models["default"].sequelize.transaction().then(function (t) {
      return _models["default"].Area.findOne({
        attributes: ['default_alt'],
        where: {
          area_id: req.params.id
        }
      }, {
        transaction: t
      }).then(function (find) {
        if (req.body.email) {
          var email_arr = _lodash["default"].map(req.body.email, function (em) {
            return em.address;
          });
        }

        if (req.body.area_type === 1) {
          return _models["default"].Area.update({
            total_length: req.body.total_length,
            builder: req.body.builder,
            address: req.body.address,
            construction: req.body.construction,
            unit: req.body.unit,
            curve_type: curve_type.join(),
            state: req.body.state,
            area_type: req.body.area_type,
            default_alt: req.body.default_alt,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            create_date: req.body.create_date,
            email: email_arr !== undefined ? email_arr.join() : email_arr,
            aerial_photo: req.body.aerial_photo,
            coordinates: req.body.coordinates.join(),
            order: req.body.order
          }, {
            where: {
              area_id: req.params.id
            }
          }, {
            transaction: t
          }).then(function (endAreaUp) {
            return;
          });
        } else {
          default_alt = find;
          return _models["default"].Area.update({
            total_length: req.body.total_length,
            builder: req.body.builder,
            address: req.body.address,
            construction: req.body.construction,
            unit: req.body.unit,
            state: req.body.state,
            curve_type: curve_type.join(),
            area_type: req.body.area_type,
            default_alt: req.body.default_alt,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            create_date: req.body.create_date,
            email: email_arr !== undefined ? email_arr.join() : email_arr,
            aerial_photo: req.body.aerial_photo,
            coordinates: req.body.coordinates.join(),
            order: req.body.order
          }, {
            where: {
              area_id: req.params.id
            }
          }, {
            transaction: t
          }).then(function (up) {
            var promises = []; //default alt 다를때 smart, pipe depth update

            if (default_alt.default_alt !== req.body.default_alt) {
              var smart_select = _models["default"].Smart.findAll({
                where: {
                  fid: (0, _defineProperty2["default"])({}, Op.like, '%' + area_fid_prefix + '%')
                },
                transaction: t
              });

              var pipe_select = _models["default"].Pipe.findAll({
                where: {
                  fid: (0, _defineProperty2["default"])({}, Op.like, '%' + area_fid_prefix + '%')
                },
                transaction: t
              });

              var obstruction_select = _models["default"].Obstruction.findAll({
                where: {
                  fid: (0, _defineProperty2["default"])({}, Op.like, area_fid_prefix + '%')
                },
                transaction: t
              });

              promises.push(smart_select);
              promises.push(pipe_select);
              promises.push(obstruction_select);
            }

            return Promise.all(promises).then(function (pro_res) {
              var promises2 = [];

              if (pro_res[0] !== undefined && (0, _typeof2["default"])(pro_res[0][0]) === 'object') {
                _lodash["default"].map(pro_res[0], function (data, i) {
                  var smart_depth = Number(req.body.default_alt) - Number(data.alt) - Number(data.instrument_height) * 0.01;

                  var smart_promise = _models["default"].Smart.update({
                    depth: smart_depth
                  }, {
                    where: {
                      fid: data.fid
                    }
                  }, {
                    transaction: t
                  });

                  promises2.push(smart_promise);
                });
              }

              if (pro_res[1] !== undefined && (0, _typeof2["default"])(pro_res[1][0]) === 'object') {
                _lodash["default"].map(pro_res[1], function (data, i) {
                  var pipe_depth = data.depth - (default_alt.default_alt - req.body.default_alt);

                  var pipe_promise = _models["default"].Pipe.update({
                    depth: pipe_depth
                  }, {
                    where: {
                      fid: data.fid
                    }
                  }, {
                    transaction: t
                  });

                  promises2.push(pipe_promise);
                });
              }

              if (pro_res[2] !== undefined && (0, _typeof2["default"])(pro_res[2][0]) === 'object') {
                _lodash["default"].map(pro_res[2], function (data, i) {
                  var obstruction_depth = Number(req.body.default_alt) - Number(data.alt) - Number(data.instrument_height) * 0.01;

                  var obstruction_promise = _models["default"].Obstruction.update({
                    depth: obstruction_depth
                  }, {
                    where: {
                      fid: data.fid
                    }
                  }, {
                    transaction: t
                  });

                  promises2.push(obstruction_promise);
                });
              }

              return Promise.all(promises2).then(function (pro_update) {
                return console.log("END");
              })["catch"](function (err) {
                return new Error(err);
              });
            });
          });
        }
      }).then(function () {
        t.commit();
        res.send(req.body);
      })["catch"](function (err) {
        t.rollback();
        console.log(err);
        res.send({
          "result": "fail",
          "message": error.message
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.send(err);
  }
});
router["delete"]('/:id', /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var transaction, areaOne, jobInfo, result, bluePoint_find, bluePoint_index;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context8.sent;
            _context8.next = 6;
            return _models["default"].Area.findOne({
              attributes: ['area_fid_prefix'],
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 6:
            areaOne = _context8.sent;
            _context8.next = 9;
            return _models["default"].Job.findAll({
              attributes: ['real_id'],
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 9:
            jobInfo = _context8.sent;
            _context8.next = 12;
            return _models["default"].Area.destroy({
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 12:
            result = _context8.sent;
            _context8.next = 15;
            return _models["default"].Job.destroy({
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 15:
            _context8.next = 17;
            return _models["default"].Smart.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, areaOne.area_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 17:
            _context8.next = 19;
            return _models["default"].ModelRelation.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, areaOne.area_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 19:
            _context8.next = 21;
            return _models["default"].Pipe.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, areaOne.area_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 21:
            _context8.next = 23;
            return _models["default"].Axis.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, areaOne.area_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 23:
            _context8.next = 25;
            return _models["default"].Curve.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, areaOne.area_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 25:
            _context8.next = 27;
            return _models["default"].CurveJoint.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, areaOne.area_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 27:
            _context8.next = 29;
            return _models["default"].Obstruction.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, areaOne.area_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 29:
            _context8.next = 31;
            return _models["default"].ObsModelRelation.destroy({
              where: {
                fid: (0, _defineProperty2["default"])({}, Op.like, areaOne.area_fid_prefix + '%')
              },
              transaction: transaction
            });

          case 31:
            _context8.next = 33;
            return _models["default"].Area_Design.destroy({
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 33:
            _context8.next = 35;
            return _models["default"].Area_Data.destroy({
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 35:
            _context8.next = 37;
            return _models["default"].Journal.destroy({
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 37:
            _context8.next = 39;
            return _models["default"].AreaBluePoint.findOne({
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 39:
            bluePoint_find = _context8.sent;

            if (!bluePoint_find) {
              _context8.next = 45;
              break;
            }

            _context8.next = 43;
            return _models["default"].AreaBluePoint.findAll({
              where: {
                area_id: req.params.id
              },
              transaction: transaction
            });

          case 43:
            bluePoint_index = _context8.sent;

            _lodash["default"].map(bluePoint_index, /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(data) {
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (!(data.crossPoint !== null)) {
                          _context7.next = 3;
                          break;
                        }

                        _context7.next = 3;
                        return _models["default"].BluePointCrossPoint.destroy({
                          where: {
                            id: data.crossPoint
                          },
                          transaction: transaction
                        });

                      case 3:
                        if (!(data.missingNode !== null)) {
                          _context7.next = 6;
                          break;
                        }

                        _context7.next = 6;
                        return _models["default"].BluePointMissingNode.destroy({
                          where: {
                            id: data.missingNode
                          },
                          transaction: transaction
                        });

                      case 6:
                        if (!(data.missingValve !== null)) {
                          _context7.next = 9;
                          break;
                        }

                        _context7.next = 9;
                        return _models["default"].BluePointMissingValue.destroy({
                          where: {
                            id: data.missingValve
                          },
                          transaction: transaction
                        });

                      case 9:
                        if (!(data.startPoint !== null)) {
                          _context7.next = 12;
                          break;
                        }

                        _context7.next = 12;
                        return _models["default"].BluePointStartValue.destroy({
                          where: {
                            id: data.startPoint
                          },
                          transaction: transaction
                        });

                      case 12:
                        if (!(data.endPoint !== null)) {
                          _context7.next = 15;
                          break;
                        }

                        _context7.next = 15;
                        return _models["default"].BluePointEndValue.destroy({
                          where: {
                            id: data.endPoint
                          },
                          transaction: transaction
                        });

                      case 15:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x20) {
                return _ref8.apply(this, arguments);
              };
            }());

          case 45:
            _context8.next = 47;
            return transaction.commit();

          case 47:
            _lodash["default"].map(jobInfo, function (job) {
              _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(job.real_id.toLocaleUpperCase()));
            });

            _shelljs["default"].exec("sudo tar -czvf ".concat(area_id, "_gps_").concat((0, _moment["default"])().tz("Asia/Seoul").format('YYYY-MM-DD'), ".tar.gz /efs/dtx_image/gps_images/").concat(area_id));

            res.json(result);
            _context8.next = 59;
            break;

          case 52:
            _context8.prev = 52;
            _context8.t0 = _context8["catch"](0);

            if (!transaction) {
              _context8.next = 57;
              break;
            }

            _context8.next = 57;
            return transaction.rollback();

          case 57:
            console.log(_context8.t0);
            res.send({
              "result": "fail",
              "message": _context8.t0.message
            });

          case 59:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 52]]);
  }));

  return function (_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}());
module.exports = router;