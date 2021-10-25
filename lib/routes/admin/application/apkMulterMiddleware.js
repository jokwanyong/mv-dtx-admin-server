"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

// import sequelize from '../../../models';
var storage = _multer["default"].diskStorage({
  destination: function () {
    var _destination = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, file, cb) {
      var file_path;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(process.platform !== "linux")) {
                _context.next = 4;
                break;
              }

              file_path = _path["default"].join(__dirname.substr(0, __dirname.length - 25), 'public/');
              _context.next = 13;
              break;

            case 4:
              if (!(req.body.os_type === "1")) {
                _context.next = 8;
                break;
              }

              file_path = '/efs/application/dtx_app/survey/and/';
              _context.next = 13;
              break;

            case 8:
              if (!(req.body.os_type === "2")) {
                _context.next = 12;
                break;
              }

              file_path = '/efs/application/dtx_app/survey/ios/';
              _context.next = 13;
              break;

            case 12:
              throw new Error("undefined os_type");

            case 13:
              cb(null, file_path);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function destination(_x, _x2, _x3) {
      return _destination.apply(this, arguments);
    }

    return destination;
  }(),
  filename: function filename(req, file, cb) {
    file.uploadedFile = {
      name: file.filename,
      ext: file.mimetype.split('/')[1]
    };
    cb(null, file.originalname);
  }
});

var apkMulterMiddleware = (0, _multer["default"])({
  fileFilter: function () {
    var _fileFilter = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, file, cb) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              cb(null, true);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function fileFilter(_x4, _x5, _x6) {
      return _fileFilter.apply(this, arguments);
    }

    return fileFilter;
  }(),
  storage: storage
}).fields([{
  name: 'apk',
  maxCount: 1
}]);
exports.apkMulterMiddleware = apkMulterMiddleware;