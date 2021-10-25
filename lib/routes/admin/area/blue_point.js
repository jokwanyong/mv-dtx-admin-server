"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test_Data = exports.insert_data = exports.ConvertGeo = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _proj = _interopRequireDefault(require("proj4"));

var _models = _interopRequireDefault(require("../../../models"));

var _convertExcelToJson = _interopRequireDefault(require("convert-excel-to-json"));

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var Op = _models["default"].Op;

var ConvertGeo = function ConvertGeo(lat, lon, type) {
  try {
    var firstProjection = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"; // WGS84 - EPSG:4326 

    var secondProjection;

    switch (Number(type)) {
      case 4326:
        return [lat, lon];

      case 5173:
        secondProjection = "+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-115.8,474.99,674.11,1.16,-2.31,-1.63,6.43 +units=m +no_defs";
        break;

      case 5174:
        secondProjection = "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-115.8,474.99,674.11,1.16,-2.31,-1.63,6.43 +units=m +no_defs";
        break;

      case 5176:
        secondProjection = "+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-115.8,474.99,674.11,1.16,-2.31,-1.63,6.43 +units=m +no_defs";
        break;

      case 5185:
        secondProjection = "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
        break;

      case 5186:
        secondProjection = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
        break;

      case 5187:
        secondProjection = "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
        break;

      default:
        break;
    }

    console.log(lon, lat);
    var lec_latlon = (0, _proj["default"])(secondProjection, firstProjection, [Number(lon), Number(lat)]); //lat, lon

    return [lec_latlon[1], lec_latlon[0]];
  } catch (error) {
    console.log(error);
    return;
  }
};

exports.ConvertGeo = ConvertGeo;

var Rectangle = function Rectangle(lon, lat, type) {
  var firstProjection = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"; // WGS84 - EPSG:4326 

  var secondProjection;

  switch (Number(type)) {
    case 4326:
      return [lat, lon];

    case 5173:
      secondProjection = "+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-115.8,474.99,674.11,1.16,-2.31,-1.63,6.43 +units=m +no_defs";
      break;

    case 5174:
      secondProjection = "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-115.8,474.99,674.11,1.16,-2.31,-1.63,6.43 +units=m +no_defs";
      break;

    case 5176:
      secondProjection = "+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-115.8,474.99,674.11,1.16,-2.31,-1.63,6.43 +units=m +no_defs";
      break;

    case 5185:
      secondProjection = "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
      break;

    case 5186:
      secondProjection = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
      break;

    case 5187:
      secondProjection = "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
      break;

    default:
      break;
  }

  var lec_latlon = (0, _proj["default"])(secondProjection, firstProjection, [Number(lon), Number(lat)]); //lat, lon

  console.log(lec_latlon);
  return [lec_latlon[0], lec_latlon[1]];
};

var insert_data = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data, area_id, area_fid_prefix, type, geo_type, transaction) {
    var bluePoint_find, bluePoint_index, result, e, element, crossPoint_idx, missingNode_idx, missingValve_idx, startPoint_idx, endPoint_idx, coordinates_missing, crossPoint_insert, valve_Data, missingNode_insert, missingValue_insert, coordinates_start, startPoint_insert, coordinates_end, endPoint_insert, point_result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].AreaBluePoint.findOne({
              where: {
                area_id: area_id,
                type: type
              },
              transaction: transaction
            });

          case 3:
            bluePoint_find = _context2.sent;

            if (!bluePoint_find) {
              _context2.next = 9;
              break;
            }

            _context2.next = 7;
            return _models["default"].AreaBluePoint.findAll({
              where: {
                area_id: area_id,
                type: type
              },
              transaction: transaction
            });

          case 7:
            bluePoint_index = _context2.sent;

            _lodash["default"].map(bluePoint_index, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(data.crossPoint !== null)) {
                          _context.next = 3;
                          break;
                        }

                        _context.next = 3;
                        return _models["default"].BluePointCrossPoint.destroy({
                          where: {
                            id: data.crossPoint
                          },
                          transaction: transaction
                        });

                      case 3:
                        if (!(data.missingNode !== null)) {
                          _context.next = 6;
                          break;
                        }

                        _context.next = 6;
                        return _models["default"].BluePointMissingNode.destroy({
                          where: {
                            id: data.missingNode
                          },
                          transaction: transaction
                        });

                      case 6:
                        if (!(data.missingValve !== null)) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 9;
                        return _models["default"].BluePointMissingValue.destroy({
                          where: {
                            id: data.missingValve
                          },
                          transaction: transaction
                        });

                      case 9:
                        if (!(data.startPoint !== null)) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 12;
                        return _models["default"].BluePointStartValue.destroy({
                          where: {
                            id: data.startPoint
                          },
                          transaction: transaction
                        });

                      case 12:
                        if (!(data.endPoint !== null)) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 15;
                        return _models["default"].BluePointEndValue.destroy({
                          where: {
                            id: data.endPoint
                          },
                          transaction: transaction
                        });

                      case 15:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x7) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 9:
            result = [];
            _context2.t0 = _regenerator["default"].keys(data);

          case 11:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 79;
              break;
            }

            e = _context2.t1.value;

            if (!data.hasOwnProperty(e)) {
              _context2.next = 76;
              break;
            }

            element = data[e];

            if (!(element[0].crossPoint !== "none")) {
              _context2.next = 27;
              break;
            }

            coordinates_missing = Rectangle(element[0].crossPoint[0].x, element[0].crossPoint[0].y, geo_type);
            _context2.next = 19;
            return _models["default"].BluePointCrossPoint.create({
              latlon: {
                type: 'Point',
                coordinates: [coordinates_missing[0], coordinates_missing[1]]
              },
              zPre: element[0].crossPoint[0].zPre,
              zPost: element[0].crossPoint[0].zPost,
              nodeType: element[0].crossPoint[0].nodeType,
              nodeName: element[0].crossPoint[0].nodeName
            }, {
              transaction: transaction
            });

          case 19:
            crossPoint_insert = _context2.sent;

            if (!(element[0].crossPoint[0].valve !== "none")) {
              _context2.next = 24;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].crossPoint[0].valve, function (val_data) {
              var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
              var latlon = {
                type: 'Point',
                coordinates: [coordinates_valve[0], coordinates_valve[1]]
              };
              val_data.latlon = latlon;
              val_data.idCross = crossPoint_insert.dataValues.id;
              return val_data;
            });
            _context2.next = 24;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 24:
            crossPoint_idx = crossPoint_insert.dataValues.id;
            _context2.next = 28;
            break;

          case 27:
            crossPoint_idx = null;

          case 28:
            if (!(element[0].missingNode !== "none")) {
              _context2.next = 40;
              break;
            }

            coordinates_missing = Rectangle(element[0].missingNode[0].x, element[0].missingNode[0].y, geo_type);
            _context2.next = 32;
            return _models["default"].BluePointMissingNode.create({
              latlon: {
                type: 'Point',
                coordinates: [coordinates_missing[0], coordinates_missing[1]]
              },
              zPre: element[0].missingNode[0].zPre,
              zPost: element[0].missingNode[0].zPost,
              nodeType: element[0].missingNode[0].nodeType,
              nodeName: element[0].missingNode[0].nodeName
            }, {
              transaction: transaction
            });

          case 32:
            missingNode_insert = _context2.sent;

            if (!(element[0].missingNode[0].valve !== "none")) {
              _context2.next = 37;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].missingNode[0].valve, function (val_data) {
              var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
              var latlon = {
                type: 'Point',
                coordinates: [coordinates_valve[0], coordinates_valve[1]]
              };
              val_data.latlon = latlon;
              val_data.idMissNode = missingNode_insert.dataValues.id;
              return val_data;
            });
            _context2.next = 37;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 37:
            missingNode_idx = missingNode_insert.dataValues.id;
            _context2.next = 41;
            break;

          case 40:
            missingNode_idx = null;

          case 41:
            if (!(element[0].missingValve !== "none")) {
              _context2.next = 53;
              break;
            }

            coordinates_missing = Rectangle(element[0].missingValve[0].x, element[0].missingValve[0].y, geo_type);
            _context2.next = 45;
            return _models["default"].BluePointMissingValue.create({
              latlon: {
                type: 'Point',
                coordinates: [coordinates_missing[0], coordinates_missing[1]]
              },
              zPre: element[0].missingValve[0].zPre,
              zPost: element[0].missingValve[0].zPost,
              nodeType: element[0].missingValve[0].nodeType,
              nodeName: element[0].missingValve[0].nodeName
            }, {
              transaction: transaction
            });

          case 45:
            missingValue_insert = _context2.sent;

            if (!(element[0].missingValve[0].valve !== "none")) {
              _context2.next = 50;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].missingValve[0].valve, function (val_data) {
              var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
              var latlon = {
                type: 'Point',
                coordinates: [coordinates_valve[0], coordinates_valve[1]]
              };
              val_data.latlon = latlon;
              val_data.idMissValue = missingValue_insert.dataValues.id;
              return val_data;
            });
            _context2.next = 50;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 50:
            missingValve_idx = missingValue_insert.dataValues.id;
            _context2.next = 54;
            break;

          case 53:
            missingValve_idx = null;

          case 54:
            coordinates_start = Rectangle(element[0].startPoint[0].x, element[0].startPoint[0].y, geo_type);
            _context2.next = 57;
            return _models["default"].BluePointStartValue.create({
              latlon: {
                type: 'Point',
                coordinates: [coordinates_start[0], coordinates_start[1]]
              },
              zPre: element[0].startPoint[0].zPre,
              zPost: element[0].startPoint[0].zPost,
              nodeType: element[0].startPoint[0].nodeType,
              nodeName: element[0].startPoint[0].nodeName
            }, {
              transaction: transaction
            });

          case 57:
            startPoint_insert = _context2.sent;

            if (!(element[0].startPoint[0].valve !== "none")) {
              _context2.next = 62;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].startPoint[0].valve, function (val_data) {
              var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
              var latlon = {
                type: 'Point',
                coordinates: [coordinates_valve[0], coordinates_valve[1]]
              };
              val_data.latlon = latlon;
              val_data.idStartValve = startPoint_insert.dataValues.id;
              return val_data;
            });
            _context2.next = 62;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 62:
            coordinates_end = Rectangle(element[0].endPoint[0].x, element[0].endPoint[0].y, geo_type);
            _context2.next = 65;
            return _models["default"].BluePointEndValue.create({
              latlon: {
                type: 'Point',
                coordinates: [coordinates_end[0], coordinates_end[1]]
              },
              zPre: element[0].endPoint[0].zPre,
              zPost: element[0].endPoint[0].zPost,
              nodeType: element[0].endPoint[0].nodeType,
              nodeName: element[0].endPoint[0].nodeName
            }, {
              transaction: transaction
            });

          case 65:
            endPoint_insert = _context2.sent;

            if (!(element[0].endPoint[0].valve !== "none")) {
              _context2.next = 70;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].endPoint[0].valve, function (val_data) {
              var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
              var latlon = {
                type: 'Point',
                coordinates: [coordinates_valve[0], coordinates_valve[1]]
              };
              val_data.latlon = latlon;
              val_data.idEndValve = endPoint_insert.dataValues.id;
              return val_data;
            });
            _context2.next = 70;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 70:
            _context2.next = 72;
            return _models["default"].AreaBluePoint.create({
              area_id: area_id,
              area_fid_prefix: area_fid_prefix,
              type: type,
              crossPoint: crossPoint_idx,
              missingNode: missingNode_idx,
              missingValve: missingValve_idx,
              startPoint: startPoint_insert.dataValues.id,
              endPoint: endPoint_insert.dataValues.id
            }, {
              transaction: transaction
            });

          case 72:
            point_result = _context2.sent;
            result.push(point_result);
            _context2.next = 77;
            break;

          case 76:
            throw new Error("BluePrint ERROR");

          case 77:
            _context2.next = 11;
            break;

          case 79:
            return _context2.abrupt("return", result);

          case 82:
            _context2.prev = 82;
            _context2.t2 = _context2["catch"](0);
            // if(transaction) await transaction.rollback();
            console.log(_context2.t2);
            throw new Error(_context2.t2);

          case 86:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 82]]);
  }));

  return function insert_data(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

exports.insert_data = insert_data;

var test_Data = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data, area_id, area_fid_prefix, type) {
    var e, element;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            for (e in data) {
              if (data.hasOwnProperty(e)) {
                element = data[e];
              }
            }

            return _context3.abrupt("return", console.log("SUCCESS"));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function test_Data(_x8, _x9, _x10, _x11) {
    return _ref3.apply(this, arguments);
  };
}();

exports.test_Data = test_Data;

var convertCsv1 = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var transaction, filePath, data, result, e, element, endType, startType, diameter, caliber, startPoint_insert, endPoint_insert, point_result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            filePath = '/Users/konwoo/Documents/workspace/node/dtx_admin_server/부산EDC3-3공구오수관_경위도(+1.5m).csv';
            _context4.next = 4;
            return (0, _csvtojson["default"])({
              delimiter: [",", "\t"]
            }).fromFile(filePath);

          case 4:
            data = _context4.sent;
            _context4.next = 7;
            return _models["default"].sequelize.transaction();

          case 7:
            transaction = _context4.sent;
            result = [];
            _context4.t0 = _regenerator["default"].keys(data);

          case 10:
            if ((_context4.t1 = _context4.t0()).done) {
              _context4.next = 28;
              break;
            }

            e = _context4.t1.value;
            element = data[e];

            if (element.startno.includes("BM")) {
              startType = "사각";
            } else {
              startType = "원형";
            }

            if (element.stopno.includes("BM")) {
              endType = "사각";
            } else {
              endType = "원형";
            }

            if (element.diameter.includes("_")) {
              if (element.diameter.includes("@")) {
                diameter = element.diameter.split("_");
                diameter[1] = diameter[1].split("@");
                diameter[1].map(function (dia) {
                  return diameter.push(dia);
                });
                diameter.splice(1, 1);
                diameter = _lodash["default"].map(diameter, _lodash["default"].parseInt); // diameter[0] = diameter[0] * diameter[2];
                // diameter.splice(2,1);

                diameter = diameter.join();
              } else {
                diameter = element.diameter.split("_");
                diameter = _lodash["default"].map(diameter, _lodash["default"].parseInt);
                diameter = diameter.join();
              }
            } else {
              diameter = element.diameter;
            } // if(element.out.includes("_")) {
            //     caliber = element.out.split("_");
            //     caliber = _.map(caliber, _.parseInt);
            //     caliber = caliber.join();
            // }
            // else {
            //     caliber = element.caliber;
            // }


            _context4.next = 18;
            return _models["default"].BluePointStartValue.create({
              latlon: {
                type: 'Point',
                coordinates: [element.startY, element.startX]
              },
              zPre: element.startZ,
              zPost: 0,
              nodeType: 'normal',
              nodeName: element.startno,
              type: startType
            }, {
              transaction: transaction
            });

          case 18:
            startPoint_insert = _context4.sent;
            _context4.next = 21;
            return _models["default"].BluePointEndValue.create({
              latlon: {
                type: 'Point',
                coordinates: [element.stopY, element.stopX]
              },
              zPre: element.stopZ,
              zPost: 0,
              nodeType: 'normal',
              nodeName: element.stopno,
              type: endType
            }, {
              transaction: transaction
            });

          case 21:
            endPoint_insert = _context4.sent;
            _context4.next = 24;
            return _models["default"].AreaBluePoint.create({
              area_id: 'gnseB',
              area_fid_prefix: '1028102838',
              type: '2',
              crossPoint: null,
              missingNode: null,
              missingValve: null,
              startPoint: startPoint_insert.dataValues.id,
              endPoint: endPoint_insert.dataValues.id,
              diameter: diameter // caliber: caliber

            }, {
              transaction: transaction
            });

          case 24:
            point_result = _context4.sent;
            result.push(point_result);
            _context4.next = 10;
            break;

          case 28:
            _context4.next = 30;
            return transaction.commit();

          case 30:
            return _context4.abrupt("return", result);

          case 33:
            _context4.prev = 33;
            _context4.t2 = _context4["catch"](0);
            console.log(_context4.t2);

            if (!transaction) {
              _context4.next = 39;
              break;
            }

            _context4.next = 39;
            return transaction.rollback();

          case 39:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 33]]);
  }));

  return function convertCsv1() {
    return _ref4.apply(this, arguments);
  };
}(); // convertCsv1();


var convertCsvManhole = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var filePath, data, transaction, result, e, element, size, diameter;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            filePath = '/Users/konwoo/Documents/workspace/node/dtx_admin_server/오수도_맨홀_201022.csv';
            _context5.next = 4;
            return (0, _csvtojson["default"])({
              delimiter: [",", "\t"]
            }).fromFile(filePath);

          case 4:
            data = _context5.sent;
            _context5.next = 7;
            return _models["default"].sequelize.transaction();

          case 7:
            transaction = _context5.sent;
            result = [];
            _context5.t0 = _regenerator["default"].keys(data);

          case 10:
            if ((_context5.t1 = _context5.t0()).done) {
              _context5.next = 19;
              break;
            }

            e = _context5.t1.value;
            element = data[e];

            if (element.size.includes("_")) {
              size = element.size.split("_");
              size = _lodash["default"].map(size, _lodash["default"].parseInt);
              size = size.join();
            } else {
              size = parseFloat(element.size);
            }

            if (element.diameter.includes("_")) {
              if (element.diameter.includes("@")) {
                diameter = element.diameter.split("_");
                diameter[1] = diameter[1].split("@");
                diameter[1].map(function (dia) {
                  return diameter.push(dia);
                });
                diameter.splice(1, 1);
                diameter = _lodash["default"].map(diameter, _lodash["default"].parseInt);
                diameter[0] = diameter[0] * diameter[2];
                diameter.splice(2, 1);
                diameter = diameter.join();
              } else {
                diameter = element.diameter.split("_");
                diameter = _lodash["default"].map(diameter, _lodash["default"].parseInt);
                diameter = diameter.join();
              }
            } else {
              diameter = element.diameter;
            }

            _context5.next = 17;
            return _models["default"].BluePointManhole.create({
              area_id: 'gnseA',
              type: 2,
              latlon: {
                type: 'Point',
                coordinates: [element.Y, element.X]
              },
              zPre: element.Z,
              zPost: 0,
              nodeType: 'normal',
              nodeName: element.no,
              diameter: diameter,
              holeSize: size,
              holeHeight: element.height
            }, {
              transaction: transaction
            });

          case 17:
            _context5.next = 10;
            break;

          case 19:
            _context5.next = 21;
            return transaction.commit();

          case 21:
            return _context5.abrupt("return", result);

          case 24:
            _context5.prev = 24;
            _context5.t2 = _context5["catch"](0);

            if (!transaction) {
              _context5.next = 29;
              break;
            }

            _context5.next = 29;
            return transaction.rollback();

          case 29:
            console.log(_context5.t2);

          case 30:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 24]]);
  }));

  return function convertCsvManhole() {
    return _ref5.apply(this, arguments);
  };
}(); // convertCsvManhole();


var delete_data = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(area_id, type) {
    var transaction, bluePoint_find, bluePoint_index;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context7.sent;
            _context7.next = 6;
            return _models["default"].AreaBluePoint.findOne({
              where: {
                area_id: area_id,
                type: type
              }
            }, {
              transaction: transaction
            });

          case 6:
            bluePoint_find = _context7.sent;

            if (!bluePoint_find) {
              _context7.next = 17;
              break;
            }

            _context7.next = 10;
            return _models["default"].AreaBluePoint.findAll({
              where: {
                area_id: area_id,
                type: type
              }
            }, {
              transaction: transaction
            });

          case 10:
            bluePoint_index = _context7.sent;

            _lodash["default"].map(bluePoint_index, /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        if (!(data.crossPoint !== null)) {
                          _context6.next = 3;
                          break;
                        }

                        _context6.next = 3;
                        return _models["default"].BluePointCrossPoint.destroy({
                          where: {
                            id: data.crossPoint
                          }
                        }, {
                          transaction: transaction
                        });

                      case 3:
                        if (!(data.missingNode !== null)) {
                          _context6.next = 6;
                          break;
                        }

                        _context6.next = 6;
                        return _models["default"].BluePointMissingNode.destroy({
                          where: {
                            id: data.missingNode
                          }
                        }, {
                          transaction: transaction
                        });

                      case 6:
                        if (!(data.missingValve !== null)) {
                          _context6.next = 9;
                          break;
                        }

                        _context6.next = 9;
                        return _models["default"].BluePointMissingValue.destroy({
                          where: {
                            id: data.missingValve
                          }
                        }, {
                          transaction: transaction
                        });

                      case 9:
                        if (!(data.startPoint !== null)) {
                          _context6.next = 12;
                          break;
                        }

                        _context6.next = 12;
                        return _models["default"].BluePointStartValue.destroy({
                          where: {
                            id: data.startPoint
                          }
                        }, {
                          transaction: transaction
                        });

                      case 12:
                        if (!(data.endPoint !== null)) {
                          _context6.next = 15;
                          break;
                        }

                        _context6.next = 15;
                        return _models["default"].BluePointEndValue.destroy({
                          where: {
                            id: data.endPoint
                          }
                        }, {
                          transaction: transaction
                        });

                      case 15:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x14) {
                return _ref7.apply(this, arguments);
              };
            }());

            console.log("delete Done.");
            _context7.next = 15;
            return transaction.commit();

          case 15:
            _context7.next = 18;
            break;

          case 17:
            console.log("not exist");

          case 18:
            _context7.next = 27;
            break;

          case 20:
            _context7.prev = 20;
            _context7.t0 = _context7["catch"](0);

            if (!transaction) {
              _context7.next = 25;
              break;
            }

            _context7.next = 25;
            return transaction.rollback();

          case 25:
            console.log(_context7.t0);
            return _context7.abrupt("return", false);

          case 27:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 20]]);
  }));

  return function delete_data(_x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}(); // delete_data('gnseA', 9)


var kon = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(data, area_id, area_fid_prefix, type) {
    var transaction, bluePoint_find, bluePoint_index, result, e, element, crossPoint_idx, missingNode_idx, missingValve_idx, startPoint_idx, endPoint_idx, crossPoint_insert, valve_Data, missingNode_insert, missingValue_insert, startPoint_insert, endPoint_insert, point_result;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return _models["default"].sequelize.transaction();

          case 3:
            transaction = _context9.sent;
            _context9.next = 6;
            return _models["default"].AreaBluePoint.findOne({
              where: {
                area_id: area_id,
                type: type
              }
            }, {
              transaction: transaction
            });

          case 6:
            bluePoint_find = _context9.sent;

            if (!bluePoint_find) {
              _context9.next = 12;
              break;
            }

            _context9.next = 10;
            return _models["default"].AreaBluePoint.findAll({
              where: {
                area_id: area_id,
                type: type
              }
            }, {
              transaction: transaction
            });

          case 10:
            bluePoint_index = _context9.sent;

            _lodash["default"].map(bluePoint_index, /*#__PURE__*/function () {
              var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(data) {
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        if (!(data.crossPoint !== null)) {
                          _context8.next = 3;
                          break;
                        }

                        _context8.next = 3;
                        return _models["default"].BluePointCrossPoint.destroy({
                          where: {
                            id: data.crossPoint
                          }
                        }, {
                          transaction: transaction
                        });

                      case 3:
                        if (!(data.missingNode !== null)) {
                          _context8.next = 6;
                          break;
                        }

                        _context8.next = 6;
                        return _models["default"].BluePointMissingNode.destroy({
                          where: {
                            id: data.missingNode
                          }
                        }, {
                          transaction: transaction
                        });

                      case 6:
                        if (!(data.missingValve !== null)) {
                          _context8.next = 9;
                          break;
                        }

                        _context8.next = 9;
                        return _models["default"].BluePointMissingValue.destroy({
                          where: {
                            id: data.missingValve
                          }
                        }, {
                          transaction: transaction
                        });

                      case 9:
                        if (!(data.startPoint !== null)) {
                          _context8.next = 12;
                          break;
                        }

                        _context8.next = 12;
                        return _models["default"].BluePointStartValue.destroy({
                          where: {
                            id: data.startPoint
                          }
                        }, {
                          transaction: transaction
                        });

                      case 12:
                        if (!(data.endPoint !== null)) {
                          _context8.next = 15;
                          break;
                        }

                        _context8.next = 15;
                        return _models["default"].BluePointEndValue.destroy({
                          where: {
                            id: data.endPoint
                          }
                        }, {
                          transaction: transaction
                        });

                      case 15:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x19) {
                return _ref9.apply(this, arguments);
              };
            }());

          case 12:
            result = [];
            _context9.t0 = _regenerator["default"].keys(data);

          case 14:
            if ((_context9.t1 = _context9.t0()).done) {
              _context9.next = 74;
              break;
            }

            e = _context9.t1.value;

            if (!data.hasOwnProperty(e)) {
              _context9.next = 72;
              break;
            }

            element = data[e];

            if (!(element[0].crossPoint !== "none")) {
              _context9.next = 29;
              break;
            }

            _context9.next = 21;
            return _models["default"].BluePointCrossPoint.create({
              latlon: {
                type: 'Point',
                coordinates: [element[0].crossPoint[0].x, element[0].crossPoint[0].y]
              },
              zPre: element[0].crossPoint[0].zPre,
              zPost: element[0].crossPoint[0].zPost,
              nodeType: element[0].crossPoint[0].nodeType,
              nodeName: element[0].crossPoint[0].nodeName
            }, {
              transaction: transaction
            });

          case 21:
            crossPoint_insert = _context9.sent;

            if (!(element[0].crossPoint[0].valve !== "none")) {
              _context9.next = 26;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].crossPoint[0].valve, function (val_data) {
              var latlon = {
                type: 'Point',
                coordinates: [val_data.x, val_data.y]
              };
              val_data.latlon = latlon;
              val_data.idCross = crossPoint_insert.dataValues.id;
              return val_data;
            });
            _context9.next = 26;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 26:
            crossPoint_idx = crossPoint_insert.dataValues.id;
            _context9.next = 30;
            break;

          case 29:
            crossPoint_idx = null;

          case 30:
            if (!(element[0].missingNode !== "none")) {
              _context9.next = 41;
              break;
            }

            _context9.next = 33;
            return _models["default"].BluePointMissingNode.create({
              latlon: {
                type: 'Point',
                coordinates: [element[0].missingNode[0].x, element[0].missingNode[0].y]
              },
              zPre: element[0].missingNode[0].zPre,
              zPost: element[0].missingNode[0].zPost,
              nodeType: element[0].missingNode[0].nodeType,
              nodeName: element[0].missingNode[0].nodeName
            }, {
              transaction: transaction
            });

          case 33:
            missingNode_insert = _context9.sent;

            if (!(element[0].missingNode[0].valve !== "none")) {
              _context9.next = 38;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].missingNode[0].valve, function (val_data) {
              var latlon = {
                type: 'Point',
                coordinates: [val_data.x, val_data.y]
              };
              val_data.latlon = latlon;
              val_data.idMissNode = missingNode_insert.dataValues.id;
              return val_data;
            });
            _context9.next = 38;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 38:
            missingNode_idx = missingNode_insert.dataValues.id;
            _context9.next = 42;
            break;

          case 41:
            missingNode_idx = null;

          case 42:
            if (!(element[0].missingValve !== "none")) {
              _context9.next = 53;
              break;
            }

            _context9.next = 45;
            return _models["default"].BluePointMissingValue.create({
              latlon: {
                type: 'Point',
                coordinates: [elemente[0].missingValve[0].x, element[0].missingValve[0].y]
              },
              zPre: element[0].missingValve[0].zPre,
              zPost: element[0].missingValve[0].zPost,
              nodeType: element[0].missingValve[0].nodeType,
              nodeName: element[0].missingValve[0].nodeName
            }, {
              transaction: transaction
            });

          case 45:
            missingValue_insert = _context9.sent;

            if (!(element[0].missingValve[0].valve !== "none")) {
              _context9.next = 50;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].missingValve[0].valve, function (val_data) {
              var latlon = {
                type: 'Point',
                coordinates: [val_data.x, val_data.y]
              };
              val_data.latlon = latlon;
              val_data.idMissValue = missingValue_insert.dataValues.id;
              return val_data;
            });
            _context9.next = 50;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 50:
            missingValve_idx = missingValue_insert.dataValues.id;
            _context9.next = 54;
            break;

          case 53:
            missingValve_idx = null;

          case 54:
            _context9.next = 56;
            return _models["default"].BluePointStartValue.create({
              latlon: {
                type: 'Point',
                coordinates: [element[0].startPoint[0].x, element[0].startPoint[0].y]
              },
              zPre: element[0].startPoint[0].zPre,
              zPost: element[0].startPoint[0].zPost,
              nodeType: element[0].startPoint[0].nodeType,
              nodeName: element[0].startPoint[0].nodeName
            }, {
              transaction: transaction
            });

          case 56:
            startPoint_insert = _context9.sent;

            if (!(element[0].startPoint[0].valve !== "none")) {
              _context9.next = 61;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].startPoint[0].valve, function (val_data) {
              var latlon = {
                type: 'Point',
                coordinates: [val_data.x, val_data.y]
              };
              val_data.latlon = latlon;
              val_data.idStartValve = startPoint_insert.dataValues.id;
              return val_data;
            });
            _context9.next = 61;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 61:
            _context9.next = 63;
            return _models["default"].BluePointEndValue.create({
              latlon: {
                type: 'Point',
                coordinates: [element[0].endPoint[0].x, element[0].endPoint[0].y]
              },
              zPre: element[0].endPoint[0].zPre,
              zPost: element[0].endPoint[0].zPost,
              nodeType: element[0].endPoint[0].nodeType,
              nodeName: element[0].endPoint[0].nodeName
            }, {
              transaction: transaction
            });

          case 63:
            endPoint_insert = _context9.sent;

            if (!(element[0].endPoint[0].valve !== "none")) {
              _context9.next = 68;
              break;
            }

            valve_Data = _lodash["default"].map(element[0].endPoint[0].valve, function (val_data) {
              var latlon = {
                type: 'Point',
                coordinates: [val_data.x, val_data.y]
              };
              val_data.latlon = latlon;
              val_data.idEndValve = endPoint_insert.dataValues.id;
              return val_data;
            });
            _context9.next = 68;
            return _models["default"].Valve.bulkCreate(valve_Data, {
              transaction: transaction
            });

          case 68:
            _context9.next = 70;
            return _models["default"].AreaBluePoint.create({
              area_id: area_id,
              area_fid_prefix: area_fid_prefix,
              type: type,
              crossPoint: crossPoint_idx,
              missingNode: missingNode_idx,
              missingValve: missingValve_idx,
              startPoint: startPoint_insert.dataValues.id,
              endPoint: endPoint_insert.dataValues.id
            }, {
              transaction: transaction
            });

          case 70:
            point_result = _context9.sent;
            result.push(point_result);

          case 72:
            _context9.next = 14;
            break;

          case 74:
            _context9.next = 76;
            return transaction.commit();

          case 76:
            return _context9.abrupt("return", result);

          case 79:
            _context9.prev = 79;
            _context9.t2 = _context9["catch"](0);

            if (!transaction) {
              _context9.next = 84;
              break;
            }

            _context9.next = 84;
            return transaction.rollback();

          case 84:
            console.log(_context9.t2);

          case 85:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 79]]);
  }));

  return function kon(_x15, _x16, _x17, _x18) {
    return _ref8.apply(this, arguments);
  };
}();