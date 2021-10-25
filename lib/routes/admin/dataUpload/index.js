"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _models = _interopRequireDefault(require("../../../models"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _moment = _interopRequireDefault(require("moment"));

var _path = _interopRequireDefault(require("path"));

var _multer = _interopRequireDefault(require("multer"));

var _excelConvert = require("./excelConvert");

var Op = _models["default"].Op;

var router = _express["default"].Router();

router.get('', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
              res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
              res.setHeader('Content-Range', "0-5/".concat(0));
              res.setHeader('X-Total-Count', "".concat(0));
              res.send([]);
            } catch (error) {
              console.log(error);
              res.send({
                "result": "fail",
                "message": error.message
              });
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var design_storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    try {
      var file_path = process.platform === 'linux' ? '/efs/dtx_excel/admin/' : _path["default"].join(__dirname.substr(0, __dirname.length - 23), 'public/excel/');
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
router.post('/excel', json_uploadMiddleware, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var transaction, data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("excel upload API");
            _context2.prev = 1;

            if (!_lodash["default"].isEmpty(req.files)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.send("file empty"));

          case 6:
            _context2.next = 8;
            return _models["default"].sequelize.transaction();

          case 8:
            transaction = _context2.sent;

            if (!(req.files[0].originalname.split(".")[1] === "csv")) {
              _context2.next = 27;
              break;
            }

            _context2.next = 12;
            return (0, _excelConvert.csvConvert)(req.files[0].path);

          case 12:
            data = _context2.sent;
            _context2.next = 15;
            return Promise.all(data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].Smart.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].ModelRelation.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].Pipe.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].Axis.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].Curve.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].CurveJoint.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.obsRealArr.map(function (real_id) {
              if (real_id) {
                return _models["default"].Obstruction.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.obsRealArr.map(function (real_id) {
              if (real_id) {
                return _models["default"].ObsModelRelation.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(real_id.toLocaleUpperCase()));
              }
            }));

          case 15:
            _context2.next = 17;
            return _models["default"].Smart.bulkCreate(data.smart, {
              transaction: transaction
            });

          case 17:
            _context2.next = 19;
            return _models["default"].ModelRelation.bulkCreate(data.smartModel, {
              transaction: transaction
            });

          case 19:
            _context2.next = 21;
            return _models["default"].Obstruction.bulkCreate(data.obs, {
              transaction: transaction
            });

          case 21:
            _context2.next = 23;
            return _models["default"].ObsModelRelation.bulkCreate(data.manhole, {
              transaction: transaction
            });

          case 23:
            _context2.next = 25;
            return transaction.commit();

          case 25:
            _context2.next = 36;
            break;

          case 27:
            data = (0, _excelConvert.excelConvert)(req.files[0].path);
            _context2.next = 30;
            return Promise.all(data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].Smart.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].ModelRelation.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].Pipe.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].Axis.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].Curve.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _models["default"].CurveJoint.destroy({
                  where: {
                    fid: (0, _defineProperty2["default"])({}, Op.like, _config["default"].createEncoding(real_id) + '%')
                  },
                  transaction: transaction
                });
              }
            }), data.realId.map(function (real_id) {
              if (real_id) {
                return _shelljs["default"].exec("sudo rm -rf /efs/dtx_model_web/tilesets/data/".concat(real_id.toLocaleUpperCase()));
              }
            }));

          case 30:
            _context2.next = 32;
            return _models["default"].Smart.bulkCreate(data.smart, {
              transaction: transaction
            });

          case 32:
            _context2.next = 34;
            return _models["default"].ModelRelation.bulkCreate(data.smartModel, {
              transaction: transaction
            });

          case 34:
            _context2.next = 36;
            return transaction.commit();

          case 36:
            res.send("SUCCESS");

          case 37:
            _context2.next = 46;
            break;

          case 39:
            _context2.prev = 39;
            _context2.t0 = _context2["catch"](1);

            if (!transaction) {
              _context2.next = 44;
              break;
            }

            _context2.next = 44;
            return transaction.rollback();

          case 44:
            console.log(_context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 46:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 39]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
module.exports = router;