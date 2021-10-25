"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var _config = _interopRequireDefault(require("../../../util/config"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _multer = _interopRequireDefault(require("multer"));

var _axios = _interopRequireDefault(require("axios"));

var _mailer = require("./mailer");

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
      var file_path = process.platform === 'linux' ? '/efs/dtx_excel' : _path["default"].join(__dirname.substr(0, __dirname.length - 18), 'public/excel/');
      cb(null, file_path);
    } catch (error) {
      return cb(new Error(error));
    }
  },
  filename: function filename(req, file, cb) {
    file.uploadedFile = {
      name: file.filename,
      ext: file.mimetype.split('/')[1]
    };
    cb(null, file.originalname);
  }
});

var excel_upload = (0, _multer["default"])({
  storage: design_storage
});
var excel_uploadMiddleware = excel_upload.any('excel');
router.post('', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var email_address;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].Area.findOne({
              attributes: ['email'],
              where: {
                area_id: req.body.area_id
              }
            });

          case 3:
            email_address = _context2.sent;
            // email, subject, htmlcontent, callback
            // multiple 'your-first-email@gmail.com, your-second-email@gmail.com',
            // send(`${email_address.email}`, req.body.title, req.body.contents, req.files[0].filename, req.files[0].path, (err, result) => {
            //     if(err) throw err;
            //     console.log(result);
            // });
            res.send(email_address);
            _context2.next = 11;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.send({
              "result": "fail",
              "message": _context2.t0.message
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
module.exports = router;