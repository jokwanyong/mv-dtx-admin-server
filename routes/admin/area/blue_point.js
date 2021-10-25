import _ from 'lodash';
import proj4 from 'proj4';
import sequelize from '../../../models';
import excelToJson from 'convert-excel-to-json';
import csv from 'csvtojson';
const Op = sequelize.Op;

// 직각좌표 변환
export const ConvertGeo = (lat, lon, type) => {
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
        console.log(lon, lat)
        var lec_latlon = proj4(secondProjection,firstProjection,[Number(lon), Number(lat)]);
        //lat, lon
        return [lec_latlon[1], lec_latlon[0]];
    } catch (error) {
        console.log(error);
        return ;
    }
}

// 직각좌표 변환
const Rectangle = (lon, lat, type) => {
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
    var lec_latlon = proj4(secondProjection,firstProjection,[Number(lon), Number(lat)]);
    //lat, lon
    console.log(lec_latlon)
    return [lec_latlon[0], lec_latlon[1]];
}

// 데이터 삽입
export const insert_data = async (data, area_id, area_fid_prefix, type, geo_type, transaction) => {
    // var transaction;
    try {
        // transaction = await sequelize.sequelize.transaction();
        var bluePoint_find = await sequelize.AreaBluePoint.findOne({
            where: {
                area_id: area_id,
                type: type
            },
            transaction: transaction
        });

        // 데이터 있을시 확인후 삭제
        if(bluePoint_find) {
            var bluePoint_index = await sequelize.AreaBluePoint.findAll({
                where: {
                    area_id: area_id,
                    type: type
                },
                transaction: transaction
            });

            // 삭제
            _.map(bluePoint_index, async data => {
                if(data.crossPoint !== null) {
                    await sequelize.BluePointCrossPoint.destroy({
                        where: {
                            id: data.crossPoint
                        },
                        transaction: transaction
                    })
                }
                if(data.missingNode !== null) {
                    await sequelize.BluePointMissingNode.destroy({
                        where: {
                            id: data.missingNode
                        },
                        transaction: transaction
                    })
                }
                if(data.missingValve !== null) {
                    await sequelize.BluePointMissingValue.destroy({
                        where: {
                            id: data.missingValve
                        },
                        transaction: transaction
                    })
                }
                if(data.startPoint !== null) {
                    await sequelize.BluePointStartValue.destroy({
                        where: {
                            id: data.startPoint
                        },
                        transaction: transaction
                    })
                }
                if(data.endPoint !== null) {
                    await sequelize.BluePointEndValue.destroy({
                        where: {
                            id: data.endPoint
                        },
                        transaction: transaction
                    })
                }
            });
        }
        // 삽입
        var result = [];
        for (const e in data) {
            if (data.hasOwnProperty(e)) {
                const element = data[e];
                var crossPoint_idx;
                var missingNode_idx;
                var missingValve_idx;
                var startPoint_idx;
                var endPoint_idx;
    
                if(element[0].crossPoint !== "none") {
                    var coordinates_missing = Rectangle(element[0].crossPoint[0].x, element[0].crossPoint[0].y, geo_type);
                    var crossPoint_insert = await sequelize.BluePointCrossPoint.create({
                        latlon: {type: 'Point', coordinates: [coordinates_missing[0], coordinates_missing[1]]},
                        zPre: element[0].crossPoint[0].zPre,
                        zPost: element[0].crossPoint[0].zPost,
                        nodeType: element[0].crossPoint[0].nodeType,
                        nodeName: element[0].crossPoint[0].nodeName,
                    }, {transaction: transaction})
                    
                    if(element[0].crossPoint[0].valve !== "none") {
                        var valve_Data = _.map(element[0].crossPoint[0].valve, val_data => {
                            var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
                            var latlon = { type: 'Point', coordinates: [coordinates_valve[0], coordinates_valve[1]]};
                            val_data.latlon = latlon;
                            val_data.idCross = crossPoint_insert.dataValues.id;
                            return val_data;
                        })
                        await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction})
                    }

                    crossPoint_idx = crossPoint_insert.dataValues.id;
                } else {
    
                    crossPoint_idx = null;
                }
    
                if(element[0].missingNode !== "none") {
                    var coordinates_missing = Rectangle(element[0].missingNode[0].x, element[0].missingNode[0].y, geo_type);
                    var missingNode_insert = await sequelize.BluePointMissingNode.create({
                        latlon: {type: 'Point', coordinates: [coordinates_missing[0], coordinates_missing[1]]},
                        zPre: element[0].missingNode[0].zPre,
                        zPost: element[0].missingNode[0].zPost,
                        nodeType: element[0].missingNode[0].nodeType,
                        nodeName: element[0].missingNode[0].nodeName,
                    }, {transaction: transaction})
                    if(element[0].missingNode[0].valve !== "none") {
                        var valve_Data = _.map(element[0].missingNode[0].valve, val_data => {
                            var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
                            var latlon = { type: 'Point', coordinates: [coordinates_valve[0], coordinates_valve[1]]};
                            val_data.latlon = latlon;
                            val_data.idMissNode = missingNode_insert.dataValues.id;
                            return val_data;
                        })
                        await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction})
                    }
                    
                    missingNode_idx = missingNode_insert.dataValues.id;

                } else {
    
                    missingNode_idx = null;
                }
    
                if(element[0].missingValve !== "none") {
                    var coordinates_missing = Rectangle(element[0].missingValve[0].x, element[0].missingValve[0].y, geo_type);
                    var missingValue_insert = await sequelize.BluePointMissingValue.create({
                        latlon: {type: 'Point', coordinates: [coordinates_missing[0], coordinates_missing[1]]},
                        zPre: element[0].missingValve[0].zPre,
                        zPost: element[0].missingValve[0].zPost,
                        nodeType: element[0].missingValve[0].nodeType,
                        nodeName: element[0].missingValve[0].nodeName,
                    }, {transaction: transaction});
    
                    if(element[0].missingValve[0].valve !== "none") {
                        var valve_Data = _.map(element[0].missingValve[0].valve, val_data => {
                            var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
                            var latlon = { type: 'Point', coordinates: [coordinates_valve[0], coordinates_valve[1]]};
                            val_data.latlon = latlon;
                            val_data.idMissValue = missingValue_insert.dataValues.id;
                            return val_data;
                        })
                        await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction})
                    }

                    missingValve_idx = missingValue_insert.dataValues.id;

                }
                else {
                    missingValve_idx = null;
                }
                var coordinates_start = Rectangle(element[0].startPoint[0].x, element[0].startPoint[0].y, geo_type);
                var startPoint_insert = await sequelize.BluePointStartValue.create({
                    latlon: {type: 'Point', coordinates: [coordinates_start[0], coordinates_start[1]]},
                    zPre: element[0].startPoint[0].zPre,
                    zPost: element[0].startPoint[0].zPost,
                    nodeType: element[0].startPoint[0].nodeType,
                    nodeName: element[0].startPoint[0].nodeName,
                }, {transaction: transaction});
                if(element[0].startPoint[0].valve !== "none") {
                    var valve_Data = _.map(element[0].startPoint[0].valve, val_data => {
                        var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
                        var latlon = { type: 'Point', coordinates: [coordinates_valve[0], coordinates_valve[1]]};
                        val_data.latlon = latlon;
                        val_data.idStartValve = startPoint_insert.dataValues.id;
                        return val_data;
                    })
                    await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction});
                }
    
                var coordinates_end = Rectangle(element[0].endPoint[0].x, element[0].endPoint[0].y, geo_type);
                var endPoint_insert = await sequelize.BluePointEndValue.create({
                    latlon: {type: 'Point', coordinates: [coordinates_end[0], coordinates_end[1]]},
                    zPre: element[0].endPoint[0].zPre,
                    zPost: element[0].endPoint[0].zPost,
                    nodeType: element[0].endPoint[0].nodeType,
                    nodeName: element[0].endPoint[0].nodeName,
                }, {transaction: transaction});
    
                if(element[0].endPoint[0].valve !== "none") {
                    var valve_Data = _.map(element[0].endPoint[0].valve, val_data => {
                        var coordinates_valve = Rectangle(val_data.x, val_data.y, geo_type);
                        var latlon = { type: 'Point', coordinates: [coordinates_valve[0], coordinates_valve[1]]};
                        val_data.latlon = latlon;
                        val_data.idEndValve = endPoint_insert.dataValues.id;
                        return val_data;
                    })
                    await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction});
                }
    
                var point_result = await sequelize.AreaBluePoint.create({
                    area_id: area_id,
                    area_fid_prefix: area_fid_prefix, 
                    type: type,
                    crossPoint: crossPoint_idx,
                    missingNode: missingNode_idx,
                    missingValve: missingValve_idx,
                    startPoint: startPoint_insert.dataValues.id,
                    endPoint: endPoint_insert.dataValues.id
                }, {transaction: transaction});
    
                result.push(point_result);
            }
            else {
                throw new Error("BluePrint ERROR");
            }
        }
        // await transaction.commit();
        return result;
    } catch (error) {
        // if(transaction) await transaction.rollback();
        console.log(error);
        throw new Error(error);
    }
};

export const test_Data = async (data, area_id, area_fid_prefix, type) => {
    for (const e in data) {
        if (data.hasOwnProperty(e)) {
            const element = data[e];
            
        }
    }
    return console.log("SUCCESS");
};

const convertCsv1 = async () => {
    var transaction;
    try {
        const filePath = '/Users/konwoo/Documents/workspace/node/dtx_admin_server/부산EDC3-3공구오수관_경위도(+1.5m).csv';
        
        var data = await csv({delimiter: [",","\t"]}).fromFile(filePath);
        
        transaction = await sequelize.sequelize.transaction();
        
        var result = [];
        for(const e in data) {
            const element = data[e];
            
            var endType ;
            var startType;
            var diameter ;
            var caliber ;
            if(element.startno.includes("BM")) {
                startType = "사각"
            }
            else {
                startType = "원형"
            }

            if(element.stopno.includes("BM")) {
                endType = "사각"
            }
            else {
                endType = "원형"
            }
            
            if(element.diameter.includes("_")) {
                if(element.diameter.includes("@")) {
                    diameter = element.diameter.split("_");
                    diameter[1] = diameter[1].split("@");
                    diameter[1].map(dia => diameter.push(dia));
                    diameter.splice(1, 1);
                    diameter = _.map(diameter, _.parseInt);
                    // diameter[0] = diameter[0] * diameter[2];
                    // diameter.splice(2,1);
                    diameter = diameter.join();
                }
                else {
                    diameter = element.diameter.split("_");
                    diameter = _.map(diameter, _.parseInt);
                    diameter = diameter.join();
                }
            }
            else {
                diameter = element.diameter;
            }

            // if(element.out.includes("_")) {
            //     caliber = element.out.split("_");
            //     caliber = _.map(caliber, _.parseInt);
            //     caliber = caliber.join();
            // }
            // else {
            //     caliber = element.caliber;
            // }

            var startPoint_insert = await sequelize.BluePointStartValue.create({
                latlon: {type: 'Point', coordinates: [element.startY, element.startX]},
                zPre: element.startZ,
                zPost: 0,
                nodeType: 'normal',
                nodeName: element.startno,
                type: startType
            }, {transaction: transaction});

            var endPoint_insert = await sequelize.BluePointEndValue.create({
                latlon: {type: 'Point', coordinates: [element.stopY, element.stopX]},
                zPre: element.stopZ,
                zPost: 0,
                nodeType: 'normal',
                nodeName: element.stopno,
                type: endType
            }, {transaction: transaction});

            var point_result = await sequelize.AreaBluePoint.create({
                area_id: 'gnseB',
                area_fid_prefix: '1028102838', 
                type: '2',
                crossPoint: null,
                missingNode: null,
                missingValve: null,
                startPoint: startPoint_insert.dataValues.id,
                endPoint: endPoint_insert.dataValues.id,
                diameter: diameter,
                // caliber: caliber
            }, {transaction: transaction});

            result.push(point_result);
        }
        await transaction.commit();
        return result;
    } catch (error) {
        console.log(error)
        if(transaction) await transaction.rollback();
    }
    
};

// convertCsv1();

const convertCsvManhole = async () => {
    try {
        const filePath = '/Users/konwoo/Documents/workspace/node/dtx_admin_server/오수도_맨홀_201022.csv';

        var data = await csv({delimiter: [",","\t"]}).fromFile(filePath);
        var transaction;
        transaction = await sequelize.sequelize.transaction();
        var result = [];
        for(const e in data) {
            const element = data[e];
            
            var size;
            if(element.size.includes("_")) {
                size = element.size.split("_");
                size = _.map(size, _.parseInt);
                size = size.join();
            }
            else {
                size = parseFloat(element.size);
            }

            var diameter;

            if(element.diameter.includes("_")) {
                if(element.diameter.includes("@")) {
                    diameter = element.diameter.split("_");
                    diameter[1] = diameter[1].split("@");
                    diameter[1].map(dia => diameter.push(dia));
                    diameter.splice(1, 1);
                    diameter = _.map(diameter, _.parseInt);
                    diameter[0] = diameter[0] * diameter[2];
                    diameter.splice(2,1);
                    diameter = diameter.join();
                }
                else {
                    diameter = element.diameter.split("_");
                    diameter = _.map(diameter, _.parseInt);
                    diameter = diameter.join();
                }
            }
            else {
                diameter = element.diameter;
            }
            
            await sequelize.BluePointManhole.create({
                area_id: 'gnseA',
                type: 2,
                latlon: {type: 'Point', coordinates: [element.Y, element.X]},
                zPre: element.Z,
                zPost: 0,
                nodeType: 'normal',
                nodeName: element.no,
                diameter: diameter,
                holeSize: size,
                holeHeight: element.height,
            }, {transaction: transaction})
            
        }
        await transaction.commit();
        return result;
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
    }
    
};

// convertCsvManhole();

const delete_data = async (area_id, type) => {
    var transaction;
    try {

        transaction = await sequelize.sequelize.transaction();
        var bluePoint_find = await sequelize.AreaBluePoint.findOne({
            where: {
                area_id: area_id,
                type: type,
            }
        }, {transaction: transaction});

        if(bluePoint_find) {
            var bluePoint_index = await sequelize.AreaBluePoint.findAll({
                where: {
                    area_id: area_id,
                    type: type,
                }
            }, {transaction: transaction});

            _.map(bluePoint_index, async data => {
                if(data.crossPoint !== null) {
                    await sequelize.BluePointCrossPoint.destroy({
                        where: {
                            id: data.crossPoint
                        }
                    }, {transaction: transaction})
                }
                if(data.missingNode !== null) {
                    await sequelize.BluePointMissingNode.destroy({
                        where: {
                            id: data.missingNode
                        }
                    }, {transaction: transaction})
                }
                if(data.missingValve !== null) {
                    await sequelize.BluePointMissingValue.destroy({
                        where: {
                            id: data.missingValve
                        }
                    }, {transaction: transaction})
                }
                if(data.startPoint !== null) {
                    await sequelize.BluePointStartValue.destroy({
                        where: {
                            id: data.startPoint
                        }
                    }, {transaction: transaction})
                }
                if(data.endPoint !== null) {
                    await sequelize.BluePointEndValue.destroy({
                        where: {
                            id: data.endPoint
                        }
                    }, {transaction: transaction})
                }
            });
            console.log("delete Done.");
            await transaction.commit();
        }
        else {
            console.log("not exist");
        }
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        return false;
    }
};

// delete_data('gnseA', 9)

const kon = async (data, area_id, area_fid_prefix, type) => {
    var transaction;
    try {
        transaction = await sequelize.sequelize.transaction();
        
        var bluePoint_find = await sequelize.AreaBluePoint.findOne({
            where: {
                area_id: area_id,
                type: type
            }
        }, {transaction: transaction});

        if(bluePoint_find) {
            var bluePoint_index = await sequelize.AreaBluePoint.findAll({
                where: {
                    area_id: area_id,
                    type: type
                }
            }, {transaction: transaction});


            _.map(bluePoint_index, async data => {
                if(data.crossPoint !== null) {
                    await sequelize.BluePointCrossPoint.destroy({
                        where: {
                            id: data.crossPoint
                        }
                    }, {transaction: transaction})
                }
                if(data.missingNode !== null) {
                    await sequelize.BluePointMissingNode.destroy({
                        where: {
                            id: data.missingNode
                        }
                    }, {transaction: transaction})
                }
                if(data.missingValve !== null) {
                    await sequelize.BluePointMissingValue.destroy({
                        where: {
                            id: data.missingValve
                        }
                    }, {transaction: transaction})
                }
                if(data.startPoint !== null) {
                    await sequelize.BluePointStartValue.destroy({
                        where: {
                            id: data.startPoint
                        }
                    }, {transaction: transaction})
                }
                if(data.endPoint !== null) {
                    await sequelize.BluePointEndValue.destroy({
                        where: {
                            id: data.endPoint
                        }
                    }, {transaction: transaction})
                }
            });
        }
        
        var result = [];

        for (const e in data) {
            if (data.hasOwnProperty(e)) {
                const element = data[e];
                var crossPoint_idx;
                var missingNode_idx;
                var missingValve_idx;
                var startPoint_idx;
                var endPoint_idx;
    
                if(element[0].crossPoint !== "none") {
    
                    var crossPoint_insert = await sequelize.BluePointCrossPoint.create({
                        latlon: {type: 'Point', coordinates: [element[0].crossPoint[0].x, element[0].crossPoint[0].y]},
                        zPre: element[0].crossPoint[0].zPre,
                        zPost: element[0].crossPoint[0].zPost,
                        nodeType: element[0].crossPoint[0].nodeType,
                        nodeName: element[0].crossPoint[0].nodeName,
                    }, {transaction: transaction})
                    
                    if(element[0].crossPoint[0].valve !== "none") {
                        var valve_Data = _.map(element[0].crossPoint[0].valve, val_data => {
                            var latlon = { type: 'Point', coordinates: [val_data.x, val_data.y]};
                            val_data.latlon = latlon;
                            val_data.idCross = crossPoint_insert.dataValues.id;
                            return val_data;
                        })
                        await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction})
                    }

                    crossPoint_idx = crossPoint_insert.dataValues.id;
                } else {
    
                    crossPoint_idx = null;
                }
    
                if(element[0].missingNode !== "none") {
    
                    var missingNode_insert = await sequelize.BluePointMissingNode.create({
                        latlon: {type: 'Point', coordinates: [element[0].missingNode[0].x, element[0].missingNode[0].y]},
                        zPre: element[0].missingNode[0].zPre,
                        zPost: element[0].missingNode[0].zPost,
                        nodeType: element[0].missingNode[0].nodeType,
                        nodeName: element[0].missingNode[0].nodeName,
                    }, {transaction: transaction})
                    if(element[0].missingNode[0].valve !== "none") {
                        var valve_Data = _.map(element[0].missingNode[0].valve, val_data => {
                            var latlon = { type: 'Point', coordinates: [val_data.x, val_data.y]};
                            val_data.latlon = latlon;
                            val_data.idMissNode = missingNode_insert.dataValues.id;
                            return val_data;
                        })
                        await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction})
                    }
                    
                    missingNode_idx = missingNode_insert.dataValues.id;

                } else {
    
                    missingNode_idx = null;
                }
    
                if(element[0].missingValve !== "none") {
    
                    var missingValue_insert = await sequelize.BluePointMissingValue.create({
                        latlon: {type: 'Point', coordinates: [elemente[0].missingValve[0].x, element[0].missingValve[0].y]},
                        zPre: element[0].missingValve[0].zPre,
                        zPost: element[0].missingValve[0].zPost,
                        nodeType: element[0].missingValve[0].nodeType,
                        nodeName: element[0].missingValve[0].nodeName,
                    }, {transaction: transaction});
    
                    if(element[0].missingValve[0].valve !== "none") {
                        var valve_Data = _.map(element[0].missingValve[0].valve, val_data => {
                            var latlon = { type: 'Point', coordinates: [val_data.x, val_data.y]};
                            val_data.latlon = latlon;
                            val_data.idMissValue = missingValue_insert.dataValues.id;
                            return val_data;
                        })
                        await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction})
                    }

                    missingValve_idx = missingValue_insert.dataValues.id;

                }
                else {
                    missingValve_idx = null;
                }
                var startPoint_insert = await sequelize.BluePointStartValue.create({
                    latlon: {type: 'Point', coordinates: [element[0].startPoint[0].x, element[0].startPoint[0].y]},
                    zPre: element[0].startPoint[0].zPre,
                    zPost: element[0].startPoint[0].zPost,
                    nodeType: element[0].startPoint[0].nodeType,
                    nodeName: element[0].startPoint[0].nodeName,
                }, {transaction: transaction});
                if(element[0].startPoint[0].valve !== "none") {
                    var valve_Data = _.map(element[0].startPoint[0].valve, val_data => {
                        var latlon = { type: 'Point', coordinates: [val_data.x, val_data.y]};
                        val_data.latlon = latlon;
                        val_data.idStartValve = startPoint_insert.dataValues.id;
                        return val_data;
                    })
                    await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction});
                }
    
                var endPoint_insert = await sequelize.BluePointEndValue.create({
                    latlon: {type: 'Point', coordinates: [element[0].endPoint[0].x, element[0].endPoint[0].y]},
                    zPre: element[0].endPoint[0].zPre,
                    zPost: element[0].endPoint[0].zPost,
                    nodeType: element[0].endPoint[0].nodeType,
                    nodeName: element[0].endPoint[0].nodeName,
                }, {transaction: transaction});
    
                if(element[0].endPoint[0].valve !== "none") {
                    var valve_Data = _.map(element[0].endPoint[0].valve, val_data => {
                        var latlon = { type: 'Point', coordinates: [val_data.x, val_data.y]};
                        val_data.latlon = latlon;
                        val_data.idEndValve = endPoint_insert.dataValues.id;
                        return val_data;
                    })
                    await sequelize.Valve.bulkCreate(valve_Data, {transaction: transaction});
                }
    
                var point_result = await sequelize.AreaBluePoint.create({
                    area_id: area_id,
                    area_fid_prefix: area_fid_prefix, 
                    type: type,
                    crossPoint: crossPoint_idx,
                    missingNode: missingNode_idx,
                    missingValve: missingValve_idx,
                    startPoint: startPoint_insert.dataValues.id,
                    endPoint: endPoint_insert.dataValues.id
                }, {transaction: transaction});
    
                result.push(point_result);
            }
        }
        await transaction.commit();
        return result;
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
    }
};