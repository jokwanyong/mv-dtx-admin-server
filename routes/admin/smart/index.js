import express from 'express';
import _ from 'lodash';
import Config from '../../../util/config';
import sequelize from '../../../models';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import gm from 'gm';
import imageSize from 'image-size';
import shelljs from 'shelljs';
import { fileIo } from '../../../util/http';
const Op = sequelize.Op;
var router = express.Router();

// 연결부 조회
router.get('', async (req, res, next) => {
    var transaction;
    try {

        // query string parsing
        var sort = req.query._sort === 'id' || undefined ? 'fid' : req.query._sort;
        var order = req.query._order === undefined ? 'DESC' : req.query._order;
        var fid = req.query.q === undefined || null ? '' : req.query.q;
        var fids = req.query.area_id === undefined || null ? '' : Config.createEncoding(req.query.area_id);
        var  _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);
        
        transaction = await sequelize.sequelize.transaction();
        sequelize.Smart.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});
        sequelize.Smart.hasOne(sequelize.CurveJoint, {foreignKey: 'fid'});
        var smart_result = await sequelize.Smart.findAndCountAll({
            attributes: [
                'fid',
                [sequelize.sequelize.fn('X', sequelize.sequelize.col('smart_station_TBL.latlon')), 'lat'],
                [sequelize.sequelize.fn('Y', sequelize.sequelize.col('smart_station_TBL.latlon')), 'lon'],
                'alt',
                'geo',
                'depth',
                'fix',
                'joint_num',
                'img',
                'pipe_type',
                'data_id',
                'qid',
                'vdop',
                'hdop',
                'type',
                'curve_degree',
                'diameter',
                'instrument_height',
                'material',
                [sequelize.sequelize.col('pipe_model_relation_TBL.smart_model'),'smart_model',], 
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'),'pipe_model',], 
                [sequelize.sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'],
                [sequelize.sequelize.col('curve_joint_TBL.pitch'), 'pitch'],
                'facility_type',
                'facility_type_name',
                'facility_type_code',
                'facility_usage',
                'facility_usage_name',
                'facility_depth',
                'measure_date'
            ],
            where: {
                [Op.and]: [
                    {
                        fid: {
                            [Op.like]: fid + '%'
                        }
                    },
                    {
                        fid: {
                            [Op.like]: fids + '%'
                        }
                    }
                ]
                
            },
            include: [
                {
                    model: sequelize.ModelRelation,
                    attributes: [],
                },
                {
                    model: sequelize.CurveJoint,
                    attributes: [],
                }
            ],
            order: [[sort, order]],
            offset: _start,
            limit: _end,
            raw: true,
            transaction: transaction
        });

        var real_ids = await sequelize.Job.findAndCountAll({
            raw:true,
            transaction: transaction
        });

        _.map(smart_result.rows, (e,i) => {
            e.Images = _.replace(e.img, new RegExp(',','g'), '|');
            // image , 로 split
            var imgs = [];
            var image = e.img.split(",");
            
            image.map(smart_result => {
                var img = {};
                img.img = smart_result;
                imgs.push(img);
            })
            e.imgs = imgs;
            e.PipeType = e.pipe_type;
            Config.pipe_option.map(op => {
                if(op.pipe_type === e.pipe_type) {
                    e.pipe_type = op.name;
                }
            });
            // lat lon 12자리까지만 표시
            e.lat = e.lat.toFixed(12);
            e.lon = e.lon.toFixed(12);

            // real_id 데이터 추가
            _.map(real_ids.rows, job => {
                if(e.fid.substr(0,12) === job.job_fid_prefix) {
                    e.real_id = job.real_id;
                };
            })

            delete e.img;
        });
        await transaction.commit();
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${smart_result.count}`);
        res.setHeader('X-Total-Count', `${smart_result.count}`);  
        res.send(smart_result.rows);

    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.post('/move', async (req, res, next) => {
    var transaction;
    try {
        
        transaction = await sequelize.sequelize.transaction();
        sequelize.Smart.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});
        sequelize.Smart.hasOne(sequelize.CurveJoint, {foreignKey: 'fid'});

        var smart_result = await sequelize.Smart.findAll({
            attributes: [
                'fid',
                'latlon',
                'alt',
                'geo',
                'depth',
                'fix',
                'joint_num',
                'img',
                'pipe_type',
                'diameter',
                'instrument_height',
                'material',
                [sequelize.sequelize.col('pipe_model_relation_TBL.smart_model'),'smart_model',], 
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'),'pipe_model',], 
                [sequelize.sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'],
                [sequelize.sequelize.col('curve_joint_TBL.pitch'), 'pitch'],
                'measure_date'
            ],
            where: {
                [Op.and]: [
                    {
                        fid: {
                            [Op.like]: '172429153705' + '%'
                        }
                    },
                    {
                        diameter: 1000
                    },
                    sequelize.sequelize.where(sequelize.sequelize.fn('date', sequelize.sequelize.col('smart_station_TBL.measure_date')), "2020-05-22")
                ]
                
            },
            include: [
                {
                    model: sequelize.ModelRelation,
                    attributes: [],
                    required: true
                },
                {
                    model: sequelize.CurveJoint,
                    attributes: [],
                    required: false
                }
            ],
            transaction: transaction
        });

        var model_result = await sequelize.Smart.findAll({
            attributes: [
                'fid',
                'latlon',
                'alt',
                'geo',
                'depth',
                'fix',
                'joint_num',
                'img',
                'pipe_type',
                'diameter',
                'instrument_height',
                'material',
                [sequelize.sequelize.col('pipe_model_relation_TBL.smart_model'),'smart_model',], 
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'),'pipe_model',], 
                [sequelize.sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'],
                [sequelize.sequelize.col('curve_joint_TBL.pitch'), 'pitch'],
                'measure_date'
            ],
            where: {
                [Op.and]: [
                    {
                        fid: {
                            [Op.like]: '172429153705' + '%'
                        }
                    },
                    {
                        diameter: 1000
                    },
                    sequelize.sequelize.where(sequelize.sequelize.fn('date', sequelize.sequelize.col('smart_station_TBL.measure_date')), "2020-05-22")
                ]
                
            },
            include: [
                {
                    model: sequelize.ModelRelation,
                    attributes: [],
                    required: true
                },
                {
                    model: sequelize.CurveJoint,
                    attributes: [],
                    required: false
                }
            ],
            transaction: transaction
        });

        var result = smart_result.map(value => {
            return value.dataValues
        });

        var result1 = model_result.map(value => {
            return value.dataValues
        });

        var smart = result.map(value => {
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

        var model = result1.map(value => {
            var returnValues = {};

            returnValues.fid = value.fid.replace(/172429153705/g, "172429153706");
            returnValues.smart_model = value.smart_model;
            returnValues.pipe_model = value.pipe_model;

            return returnValues;
        });

        // await sequelize.Smart.bulkCreate(smart, {transaction: transaction});
        // await sequelize.ModelRelation.bulkCreate(model, {transaction: transaction});

        var fidArr = result.map(value => value.fid);

        // await sequelize.ModelRelation.destroy({
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

        await transaction.commit();

        res.json({smart, model, fidArr});

    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
})

// 연결부 수정
router.get('/:id', async (req, res, next) => {
    try {
        var fid = req.params.id;

        sequelize.Smart.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});

        var smart_one = await sequelize.Smart.findOne({
            attributes: [
                'fid',
                [sequelize.sequelize.fn('X', sequelize.sequelize.col('smart_station_TBL.latlon')), 'lat'],
                [sequelize.sequelize.fn('Y', sequelize.sequelize.col('smart_station_TBL.latlon')), 'lon'],
                'alt',
                'geo',
                'depth',
                'fix',
                'joint_num',
                'pipe_type',
                'data_id',
                'qid',
                'vdop',
                'hdop',
                'type',
                'diameter',
                'instrument_height',
                'material',
                'curve_degree',
                [sequelize.sequelize.col('pipe_model_relation_TBL.smart_model'),'smart_model',],
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'),'pipe_model',],
                'img',
                'facility_type',
                'facility_type_name',
                'facility_type_code',
                'facility_usage',
                'facility_usage_name',
                'facility_depth',
                'measure_date',
            ],
            where: {
                fid: fid
            },
            include: [
                {
                    model: sequelize.ModelRelation,
                    attributes: [
                    ],
                }
            ],
            raw: true
        });

        // img split
        var imgs = []; 
        var image = smart_one.img.split(",");
        image.map(data => {
            var img = {};
            img.img = data;
            imgs.push(img);
        });
        Config.pipe_option.map(op => {
            if(smart_one.pipe_type === op.pipe_type) {
                smart_one.pipe_type = op.name;
            }
        })
        smart_one.imgs = imgs;
        smart_one.id = fid;
        smart_one.lat = smart_one.lat.toFixed(12);
        smart_one.lon = smart_one.lon.toFixed(12);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/1`);
        res.setHeader('X-Total-Count', `1`);
        res.send(smart_one);
    } catch (error) {
        console.log(error)
        res.send({"result": "fail" , "message": error.message});
    }
});

// 연결부 생성
router.post('', async (req, res, next) => {
    try {

        // fid 생성
        var fid = Config.createEncoding(req.body.real_id)
        var date = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
        fid = fid + (new Date(date).getTime() / 1000);

        sequelize.Smart.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});
        
        var img_name = [];
       

        var smart_model_relation ;
        var pipe_model_relation ;
        var pipe_type;
        var point = {type: 'Point', coordinates: [req.body.lat, req.body.lon]};

        var insert_smart;

        return sequelize.sequelize.transaction().then(t => {
            return sequelize.Job.findOne({
                attributes: [
                    'pipe_type',
                    'area_id'
                ],
                where: {
                    real_id: req.body.real_id
                } 
            }, {transaction:t}).then(findA => {
                // 37.672212655192
                // 126.74119378622
                pipe_type = findA.pipe_type;
                // var filePath = `/efs/dtx_image/gps_images/${findA.area_id}/`;
                //이미지 저장 
                var filePath = process.platform === 'linux' ? `/efs/dtx_image/gps_images/${findA.area_id}/` : path.join(__dirname.substr(0, __dirname.length - 18), `public/${findA.area_id}/`) 
                _.map(req.body.imgs, (e, i) => {
                    var base64Data;
                    // base64 파싱
                    if(e.src.includes('data:image/png;base64,')) {
                        base64Data = e.src.replace(/^data:image\/png;base64,/, "");
                    }
                    else {
                        base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
                    }
                    fs.writeFileSync(filePath+e.title, base64Data, 'base64', function(err) {
                        console.log(err);
                    })
                    // 썸네일 생성
                    var imagePath = filePath + e.title;
                    var savePath = filePath + `thumbnail/${e.title}`
                    var dimenstions = imageSize(imagePath);
                    base64Data = "";
                    e.src = "";
                    var width = dimenstions.width * 0.3;
                    var height = dimenstions.height * 0.3;
                    
                    gm(imagePath).thumb(width, height, savePath, function(err) {
                        if(err) console.log(err);
                        else console.log('done');
                    });
                    
                    img_name.push(findA.area_id+'/'+e.title);
                });

                // 이미지 생성
                return sequelize.Smart.create({
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
                }, {transaction:t}).then(insert => {
                    insert_smart = insert;
                    // 모델 생성
                    return sequelize.ModelRelation.create({
                        fid: fid,
                        smart_model: req.body.smart_model,
                        pipe_model: req.body.pipe_model,
                    }, {transaction: t}).then(modelC => {
                        
                        var imgs = []; 
                        var image = insert_smart.img.split(",");
                        image.map(data => {
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
                        return ;
                    })
                })
            })
            .then(() => {
                // 결과값 리턴
                t.commit();
                res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
                res.setHeader('Content-Range', `0-5/1`);
                res.setHeader('X-Total-Count', `1`);
                res.send(insert_smart);
            })
            .catch(err => {
                t.rollback();
                console.log(err);
                res.send(err);
            })
        })
        
    } catch (error) {
        t.rollback();
        console.log(error);
        res.send("error");
    }
});

// 연결부 수정
router.put('/:id', async (req, res, next) => {
    var transaction;
    try {
        var point = { type: 'Point', coordinates: [req.body.lat, req.body.lon]};
        sequelize.Smart.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});
        sequelize.Smart.hasOne(sequelize.CurveJoint, {foreignKey: 'fid'});

        var smart_result;

        var image_title = [];
        transaction = await sequelize.sequelize.transaction();

        // area id 찾기
        var findA = await sequelize.Job.findOne({
            attributes: ['area_id'],
            where: {
                job_fid_prefix: {
                    [Op.like]: '%' + req.body.fid.substr(0, 10) + '%'
                }  
            },
            transaction: transaction
        });

        // 찾은 area_id 로 이미지 수정시 해당 디렉토리에 저장.
        var filePath = process.platform === 'linux' ? `/efs/dtx_image/gps_images/${findA.area_id}/` : path.join(__dirname.substr(0, __dirname.length - 18), `public/${findA.area_id}/`) 
        _.map(req.body.newFiles, (e, i) => {
            var base64Data;
            if(e.src.includes('data:image/png;base64,')) {
                base64Data = e.src.replace(/^data:image\/png;base64,/, "");
            }
            else {
                base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
            }
            fs.writeFileSync(filePath+e.title, base64Data, 'base64', function(err) {
                console.log(err);
            })
            var imagePath = filePath + e.title;
            var savePath = filePath + `thumbnail/${e.title}`
            var dimenstions = imageSize(imagePath);
            base64Data = "";
            e.src = "";
            var width = dimenstions.width * 0.3;
            var height = dimenstions.height * 0.3;
            
            gm(imagePath).thumb(width, height, savePath, function(err) {
                if(err) console.log(err);
                else console.log('done');
            });
        });
        //이미지 수정시 이미지 텍스트 수정
        _.map(req.body.imgs, (e,i) => {
            console.log(i);
            var img = e.img.split("/");
            if(img.length<2) {
                img.unshift(findA.area_id)
            }
            image_title.push(img.join().replace(",","/"));
        });

        await sequelize.Smart.update({
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

        await sequelize.ModelRelation.update({
            smart_model: req.body.smart_model,
            pipe_model: req.body.pipe_model
        }, {
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        await sequelize.CurveJoint.update({
            azimuth: req.body.azimuth,
            pitch: req.body.pitch
        }, {where: {fid: req.params.id}, transaction: transaction });

        // 결과값 리턴
        var smartOne = await sequelize.Smart.findOne({
            attributes: [
                'fid',
                'latlon',
                'alt',
                'geo',
                'depth',
                'fix',
                'pipe_type',
                'data_id',
                'qid',
                'vdop',
                'hdop',
                'type',
                'curve_degree',
                'joint_num',
                'diameter',
                'instrument_height',
                'material',
                'facility_type',
                'facility_type_name',
                'facility_type_code',
                'facility_usage',
                'facility_usage_name',
                'facility_depth',
                [sequelize.sequelize.col('pipe_model_relation_TBL.smart_model'),'smart_model'],
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'),'pipe_model'],
                'img',
                [sequelize.sequelize.fn('date_format', sequelize.sequelize.col('smart_station_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'],
                [sequelize.sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'],
                [sequelize.sequelize.col('curve_joint_TBL.pitch'), 'pitch'],
            ],
            where: {
                fid: req.params.id
            },
            include: [
                {
                    model: sequelize.ModelRelation,
                    attributes: [
                    ],
                },
                {
                    model: sequelize.CurveJoint,
                    attributes: [],
                }
            ],
            raw: true,
            transaction:transaction
        });

        await transaction.commit();
        
        var imgs = []; 
        var image = smartOne.img.split(",");
        image.map(data => {
            var img = {};
            img.img = data;
            imgs.push(img);
        });

        Config.pipe_option.map(op => {
            if(smartOne.pipe_type === op.pipe_type) {
                smartOne.pipe_type = op.name;
            }
        })

        smartOne.imgs = imgs;
        smartOne.id = smartOne.fid;
        smartOne.lat = smartOne.latlon.coordinates[0].toFixed(12);
        smartOne.lon = smartOne.latlon.coordinates[1].toFixed(12);
        console.log(smartOne);
        res.send(smartOne);
        
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 연결부 삭제
router.delete('/:id', async (req, res, next) => {
    var transaction;
    try {
        sequelize.Smart.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});

        transaction = await sequelize.sequelize.transaction();

        // job 찾기
        var areaOne = await sequelize.Job.findOne({
            where: {
                job_fid_prefix: {
                [Op.like]: req.params.id.substr(0, 12) + '%'
              }
            },
            transaction: transaction
        });


        // 연결부, 모델 삭제

        await sequelize.Smart.destroy({
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        await sequelize.ModelRelation.destroy({
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        // 연결부 모델링 데이터 삭제

        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/joint/b3dm/high/${req.params.id}`);
        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/joint/b3dm/low/${req.params.id}`);
        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/joint/lod/${req.params.id}`);
        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/joint/obj/${req.params.id}`);
        
        // 파일 삭제 여부 알려줌
        await fileIo(areaOne.real_id, "joint");

        await transaction.commit();
        res.send("SUCCESS");
        
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;