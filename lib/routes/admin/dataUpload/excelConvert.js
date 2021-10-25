"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csvConvert = exports.excelConvert = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _convertExcelToJson = _interopRequireDefault(require("convert-excel-to-json"));

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _config = _interopRequireDefault(require("../../../util/config"));

/*
1. 정보
---- 엑셀 값
WGSX : longitude(경도) 예 - [128.9083]
WGSY : latitude(위도) 예 - [35.1348]
Elev : alt (고도) 예 - [-2.572]
RegDate : 날짜
Caliber : 외경

---- 만들어되는 값

depth : 심도 (alt 값에 마이너스 된 값 ) 예 - [2.572] , 디폴트 alt가 0이기 때문
material : PE 

---- 연결부와 맨홀 구분

PointCode : OL은 연결부, OM은 맨홀

2. ID 구분 (외경에 따라)

gnsea03 : 500, 600 mm 
gnsea05 : 700, 1000 mm
*/
// import sequelize from '../../../models';
var excelConvert = function excelConvert(filePath) {
  // var filePath = '/Users/konwoo/Documents/workspace/node/dtx_admin_server/측량성과통합_200604_WGS.xlsx';
  var result = (0, _convertExcelToJson["default"])({
    sourceFile: filePath
  });
  var ex_lat;
  var ex_lon;
  var ex_caliber;
  var ex_alt;
  var ex_point;
  var ex_date;
  var ex_depth;
  var ex_pipeType;
  var ex_material;
  var ex_real_id;
  var ex_instrument_height;
  var ex_image;
  var ex_smartModel;
  var ex_pipeModel;

  _lodash["default"].map(result.Sheet1[0], function (value, key) {
    if (value === 'WGSX') {
      ex_lat = key;
    } else if (value === 'WGSY') {
      ex_lon = key;
    } else if (value === 'Diameter') {
      ex_caliber = key;
    } else if (value === 'Elev') {
      ex_alt = key;
    } else if (value === 'PointCode') {
      ex_point = key;
    } else if (value === 'RegDate') {
      ex_date = key;
    } else if (value === 'Depth') {
      ex_depth = key;
    } else if (value === 'PipeType') {
      ex_pipeType = key;
    } else if (value === 'Material') {
      ex_material = key;
    } else if (value === 'RealId') {
      ex_real_id = key;
    } else if (value === 'InstrumentHeight') {
      ex_instrument_height = key;
    } else if (value === 'SmartModel') {
      ex_smartModel = key;
    } else if (value === 'PipeModel') {
      ex_pipeModel = key;
    } else if (value === 'Images') {
      ex_image = key;
    }
  });

  var smartArr = [];
  var smartModelArr = [];
  var arr = [];
  var obsArr = [];
  var obsModelArr = [];
  var obsRealArr = [];
  var json = {};
  var model_relation = {};

  _lodash["default"].map(result.Sheet1, function (value) {
    if (value[ex_point] === 'OL') {
      json.fid = _config["default"].createEncoding(value[ex_real_id]) + new Date((0, _moment["default"])(value[ex_date]).format("YYYY-MM-DD HH:mm:ss")).getTime() / 1000;
      json.latlon = {
        type: 'Point',
        coordinates: [value[ex_lat], value[ex_lon]]
      };
      json.geo = value[ex_alt];
      json.depth = value[ex_depth];
      json.alt = value[ex_alt];
      json.fix = 4;
      json.diameter = value[ex_caliber];
      json.pipe_type = value[ex_pipeType];
      json.instrument_height = value[ex_instrument_height];
      json.material = value[ex_material];
      json.img = _lodash["default"].replace(value[ex_image], new RegExp('[|]', 'g'), ',');
      json.measure_date = (0, _moment["default"])(value[ex_date]).format("YYYY-MM-DD HH:mm:ss");
      model_relation.fid = _config["default"].createEncoding(value[ex_real_id]) + new Date((0, _moment["default"])(value[ex_date]).format("YYYY-MM-DD HH:mm:ss")).getTime() / 1000;
      model_relation.smart_model = value[ex_smartModel];
      model_relation.pipe_model = value[ex_pipeModel];
      arr.push(value[ex_real_id]);
      smartArr.push(json);
      smartModelArr.push(model_relation);
    } else if (value[ex_point] === 'OM') {
      json.fid = _config["default"].createEncoding(value[ex_real_id]) + new Date((0, _moment["default"])(value[ex_date]).format("YYYY-MM-DD HH:mm:ss")).getTime() / 1000;
      json.latlon = {
        type: 'Point',
        coordinates: [value[ex_lat], value[ex_lon]]
      };
      json.geo = value[ex_alt];
      json.depth = value[ex_alt] * -1;
      json.alt = value[ex_alt];
      json.fix = 4;
      json.type = 1;
      json.azimuth = 0;
      json.heading = 0;
      json.pitch = 0;
      json.roll = 0;
      json.diameter = value[ex_caliber];
      json.instrument_height = 180;
      json.hole_depth = 0;
    }

    json = {};
    model_relation = {};
  });

  return {
    smart: smartArr,
    smartModel: smartModelArr,
    realId: _lodash["default"].union(arr)
  };
};

exports.excelConvert = excelConvert;

var csvConvert = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(filePath) {
    var json, model_relation, smartArr, smartModelArr, arr, obsArr, manholeArr, obsRealArr, data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // const filePath = '/Users/konwoo/Documents/workspace/node/dtx_admin_server/BOX.csv';
            json = {};
            model_relation = {};
            smartArr = [];
            smartModelArr = [];
            arr = [];
            obsArr = [];
            manholeArr = [];
            obsRealArr = [];
            _context.next = 10;
            return (0, _csvtojson["default"])({
              delimiter: [",", "\t"]
            }).fromFile(filePath);

          case 10:
            data = _context.sent;

            _lodash["default"].map(data, function (value) {
              if (value.PointCode === "OL") {
                var fid;
                var diameter;

                if (value.Fid === undefined || value.Fid === null || value.Fid.length < 1) {
                  fid = _config["default"].createEncoding(value.RealId) + new Date((0, _moment["default"])(new Date(value.RegDate)).format("YYYY-MM-DD HH:mm:ss")).getTime() / 1000;
                } else {
                  fid = value.Fid;
                }

                if (value.Diameter.includes("_")) {
                  diameter = value.Diameter.split("_")[1];
                } else {
                  diameter = value.Diameter;
                }

                json.fid = fid;
                json.latlon = {
                  type: 'Point',
                  coordinates: [value.WGSX, value.WGSY]
                };
                json.geo = value.Elev;
                json.depth = value.Depth;
                json.alt = value.Elev;
                json.vdop = value.Vdop;
                json.hdop = value.Hdop;
                json.fix = 4;
                json.diameter = diameter;
                json.pipe_type = value.PipeType;
                json.type = value.Type;
                json.instrument_height = value.InstrumentHeight;
                json.material = value.Material;
                json.data_id = value.DataId;
                json.qid = value.Qid;
                json.facility_type = value.FacilityType;
                json.facility_type_name = value.FacilityTypeName;
                json.facility_type_code = value.FacilityTypeCode;
                json.facility_usage = value.FacilityUsage;
                json.facility_usage_name = value.FacilityUsageName;
                json.facility_depth = value.FacilityDepth;
                json.img = value.Images;
                json.img = _lodash["default"].replace(String(value.Images), new RegExp('[|]', 'g'), ',');
                json.measure_date = (0, _moment["default"])(new Date(value.RegDate)).format("YYYY-MM-DD HH:mm:ss");
                model_relation.fid = fid;
                model_relation.smart_model = value.SmartModel;
                model_relation.pipe_model = value.PipeModel;
                arr.push(value.RealId);
                smartArr.push(json);
                smartModelArr.push(model_relation);
              } else if (value.PointCode === "OM") {
                var fid;

                if (value.Fid === undefined || value.Fid === null || value.Fid.length < 1) {
                  fid = _config["default"].createEncoding(value.RealId) + new Date((0, _moment["default"])(new Date(value.RegDate)).format("YYYY-MM-DD HH:mm:ss")).getTime() / 1000;
                } else {
                  fid = value.Fid;
                }

                json.fid = fid;
                json.latlon = {
                  type: 'Point',
                  coordinates: [value.WGSX, value.WGSY]
                };
                json.geo = value.Elev;
                json.depth = Number(value.Depth) * -1;
                json.alt = value.Elev;
                json.vdop = value.Vdop;
                json.hdop = value.Hdop;
                json.fix = 4;
                json.type = value.Code;
                json.pipe_type = value.PipeType;
                json.data_id = value.DataId;

                if (value.Azimuth === undefined) {
                  json.azimuth = 0;
                } else {
                  json.azimuth = value.Azimuth;
                }

                if (value.Heading === undefined) {
                  json.heading = 0;
                } else {
                  json.heading = value.Heading;
                }

                if (value.Pitch === undefined) {
                  json.pitch = 0;
                } else {
                  json.pitch = value.Pitch;
                }

                if (value.Roll === undefined) {
                  json.roll = 0;
                } else {
                  json.roll = value.Roll;
                }

                json.diameter = value.Diameter;
                json.instrument_height = value.InstrumentHeight;
                json.hole_depth = value.HoleDepth;
                json.img = _lodash["default"].replace(String(value.Images), new RegExp('[|]', 'g'), ',');
                json.measure_date = (0, _moment["default"])(new Date(value.RegDate)).format("YYYY-MM-DD HH:mm:ss");

                if (value.Code === "1") {
                  var manhole = {};
                  manhole.fid = fid;
                  manholeArr.push(manhole);
                } else if (value.Code === "2" || value.Code === "3") {
                  var manhole = {};
                  manhole.fid = fid;
                  manhole.manhole_idx = value.ManholeIdx;
                  manholeArr.push(manhole);
                } else if (value.Code === "4") {
                  var manhole = {};
                  manhole.fid = fid;
                  manhole.code_idx = value.CodeIdx;
                  manholeArr.push(manhole);
                }

                obsRealArr.push(value.RealId);
                obsArr.push(json);
              }

              json = {};
              model_relation = {};
            }); // return Error("Err")


            return _context.abrupt("return", {
              smart: smartArr,
              smartModel: smartModelArr,
              realId: _lodash["default"].union(arr),
              obs: obsArr,
              manhole: manholeArr,
              obsRealArr: _lodash["default"].union(obsRealArr)
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function csvConvert(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.csvConvert = csvConvert;