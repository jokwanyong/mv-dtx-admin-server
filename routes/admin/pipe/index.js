import express from 'express';
import _ from 'lodash';
import fse from 'fs-extra';
import shelljs from 'shelljs';
import Config from '../../../util/config';
import sequelize from '../../../models';
import { fileIo } from '../../../util/http';
const Op = sequelize.Op;
var router = express.Router();

// 파이프 조회
router.get('', async (req, res, next) => {
    try {
        sequelize.Pipe.hasOne(sequelize.Axis, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.Curve, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.Smart, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});
        
        // page nation 및 fid 조회
        var sort = req.query._sort === 'id' || undefined ? 'fid' : req.query._sort;
        var order = req.query._order === undefined ? 'DESC' : req.query._order;
        var fid = req.query.q === undefined || null ? '' : req.query.q;
        var fids = req.query.area_id === undefined || null ? '' : Config.createEncoding(req.query.area_id);
        var  _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

        var pipe_result = await sequelize.Pipe.findAndCountAll({
            attributes:[
                'fid',
                [sequelize.sequelize.fn('X', sequelize.sequelize.col('pipe_TBL.latlon')), 'lat'],
                [sequelize.sequelize.fn('Y', sequelize.sequelize.col('pipe_TBL.latlon')), 'lon'],
                'alt',
                'geo',
                'distance',
                'material',
                'line_num',
                'type',
                'pipe_type',
                'depth',
                'diameter',
                'remarks',
                'create_date',

                [sequelize.sequelize.col('axis_TBL.azimuth'),'azimuth'],
                [sequelize.sequelize.col('axis_TBL.heading'),'heading'],
                [sequelize.sequelize.col('axis_TBL.pitch'),'pitch'],
                [sequelize.sequelize.col('axis_TBL.roll'),'roll'],
                [sequelize.sequelize.col('curve_info_TBL.curve_deg'),'curve_deg'],
                [sequelize.sequelize.fn('X', sequelize.sequelize.col('curve_info_TBL.curve_latlon')), 'curve_lat'],
                [sequelize.sequelize.fn('Y', sequelize.sequelize.col('curve_info_TBL.curve_latlon')), 'curve_lon'],
                [sequelize.sequelize.col('curve_info_TBL.curve_pitch'), 'curve_pitch'],
                [sequelize.sequelize.col('smart_station_TBL.img'), 'img'],
                [sequelize.sequelize.col('smart_station_TBL.data_id'), 'data_id'],
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'],
            ],
            where: {
                [Op.and]: [
                    {
                        fid: {
                            [Op.like]: '%' + fid + '%'
                        }
                    },
                    {
                        fid: {
                            [Op.like]: '%' + fids + '%'
                        }
                    }
                ]
                
            },
            include:[
                {
                    model: sequelize.Axis,
                    attributes:[

                    ],
                    nested: false,
                    required: false
                },
                {
                    model: sequelize.Curve,
                    attributes: [

                    ],
                    required: false
                },
                {
                    model: sequelize.Smart,
                    attributes:[
                        // 'img'
                    ],
                },
                {
                    model: sequelize.ModelRelation,
                    attributes: [],
                }
            ],
            order: [[sort, order]],
            offset: _start,
            limit: _end,
            raw: true
        })
        _.map(pipe_result.rows, (data, i) => {
            // image array
            var imgs = [];
            var image = data.img === null || '' ? [] : data.img.split(",");
            image.map(pipe => {
                var img = {};
                img.img = pipe;
                imgs.push(img);
            })
            
            data.imgs = imgs;

            // latlon 12자리 세팅
            data.lat = data.lat.toFixed(12);
            data.lon = data.lon.toFixed(12);

            // pipe type setting
            Config.pipe_option.map(op => {
                if(data.pipe_type === op.pipe_type) {
                    data.pipe_type = op.name;
                }
            });
            
            if(data.curve_lat !== null) {
                data.curve_lat = data.curve_lat.toFixed(12);
                data.curve_lon = data.curve_lon.toFixed(12);
            }
        });

        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${pipe_result.count}`);
        res.setHeader('X-Total-Count', `${pipe_result.count}`);  

        res.send(pipe_result.rows)
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 단일 조회
router.get('/:id', async (req, res, next) => {
    try {
        sequelize.Pipe.hasOne(sequelize.Axis, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.Curve, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.Smart, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});

        var pipe_one = await sequelize.Pipe.findOne({
            attributes:[
                'fid',
                [sequelize.sequelize.fn('X', sequelize.sequelize.col('pipe_TBL.latlon')), 'lat'],
                [sequelize.sequelize.fn('Y', sequelize.sequelize.col('pipe_TBL.latlon')), 'lon'],
                'alt',
                'geo',
                'distance',
                'material',
                'line_num',
                'type',
                'pipe_type',
                'depth',
                'diameter',
                'remarks',
                'create_date',

                [sequelize.sequelize.col('axis_TBL.azimuth'),'azimuth'],
                [sequelize.sequelize.col('axis_TBL.heading'),'heading'],
                [sequelize.sequelize.col('axis_TBL.pitch'),'pitch'],
                [sequelize.sequelize.col('axis_TBL.roll'),'roll'],
                [sequelize.sequelize.col('curve_info_TBL.curve_deg'),'curve_deg'],
                [sequelize.sequelize.fn('X', sequelize.sequelize.col('curve_info_TBL.curve_latlon')), 'curve_lat'],
                [sequelize.sequelize.fn('Y', sequelize.sequelize.col('curve_info_TBL.curve_latlon')), 'curve_lon'],
                [sequelize.sequelize.col('curve_info_TBL.curve_pitch'), 'curve_pitch'],
                [sequelize.sequelize.col('smart_station_TBL.img'), 'img'],
                [sequelize.sequelize.col('smart_station_TBL.data_id'), 'data_id'],
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'],
            ],

            include:[
                {
                    model: sequelize.Axis,
                    attributes:[],
                    nested: false,
                    required: false
                },
                {
                    model: sequelize.Curve,
                    attributes: [],
                    required: false
                },
                {
                    model: sequelize.Smart,
                    attributes:[],
                    paranoid: false,
                    required: false,
                    nested: false,  
                },
                {
                    model: sequelize.ModelRelation,
                    attributes: [],
                }
            ],
            where: {
                fid: req.params.id
            },
            raw: true
        });

        var imgs = []; 
        var image = pipe_one.img.split(",");
        image.map(data => {
            var img = {};
            img.img = data;
            imgs.push(img);
        });

        pipe_one.imgs = imgs;

        Config.pipe_option.map(op => {
            if(pipe_one.pipe_type === op.pipe_type) {
                pipe_one.pipe_type = op.name;
            }
        });

        pipe_one.id = pipe_one.fid;
        pipe_one.lat = Number(pipe_one.lat).toFixed(12);
        pipe_one.lon = Number(pipe_one.lon).toFixed(12);
        
        if(pipe_one.curve_lat !== null) {
            pipe_one.curve_lat = Number(pipe_one.curve_lat).toFixed(12);
            pipe_one.curve_lon = Number(pipe_one.curve_lon).toFixed(12);
        }

        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);  

        res.send(pipe_one);
    } catch (error) {
        console.log("error", error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 파이프 생성은 nodeServer 통해서 만 가능
router.post('', (req, res, next) => {
    res.send("ERR");
});

// 파이프 정보 수정
router.put('/:id', async (req, res, next) => {
    var transaction;
    try {
        var point = { type: 'Point', coordinates: [req.body.lat, req.body.lon]};
        var curve_point = { type: 'Point', coordinates: [req.body.curve_lat, req.body.curve_lon]};

        sequelize.Pipe.hasOne(sequelize.Axis, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.Curve, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.Smart, {foreignKey: 'fid'});
        sequelize.Pipe.hasOne(sequelize.ModelRelation, {foreignKey: 'fid'});

        var pipe_one;
        // pipe, axis, curve, model update

        var transaction = await sequelize.sequelize.transaction();

        var pipeUpdate = await sequelize.Pipe.update({
            alt: req.body.alt,
            material: req.body.material,
            type: req.body.type,
            pipe_type: req.body.pipe_type,
            depth: req.body.depth,
            latlon: point,
            geo: req.body.geo,
            distance: req.body.distance,
            line_num: req.body.line_num,
            diameter: req.body.diameter,
            remarks: req.body.remarks,
            create_date: req.body.create_date,
            measure_date: req.body.measure_date,
        }, {
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        await sequelize.Axis.update({
            azimuth: req.body.azimuth,
            heading: req.body.heading,
            pitch: req.body.pitch,
            roll: req.body.roll
        }, {
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        await sequelize.Curve.update({
            curve_deg: req.body.curve_deg,
            curve_latlon: curve_point,
            curve_pitch: req.body.curve_pitch,
        }, {
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        await sequelize.ModelRelation.update({
            pipe_model: req.body.pipe_model
        }, {
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        // update result return
        var pipeOne = await sequelize.Pipe.findOne({
            attributes:[
                'fid',
                'latlon',
                'alt',
                'geo',
                'distance',
                'material',
                'line_num',
                'type',
                'depth',
                'diameter',
                'remarks',
                [sequelize.sequelize.fn('date_format', sequelize.sequelize.col('pipe_TBL.create_date'), '%Y-%m-%d %H:%i:%s'), 'create_date'],
                [sequelize.sequelize.col('axis_TBL.azimuth'),'azimuth'],
                [sequelize.sequelize.col('axis_TBL.heading'),'heading'],
                [sequelize.sequelize.col('axis_TBL.pitch'),'pitch'],
                [sequelize.sequelize.col('axis_TBL.roll'),'roll'],
                [sequelize.sequelize.col('curve_info_TBL.curve_deg'),'curve_deg'],
                [sequelize.sequelize.col('curve_info_TBL.curve_latlon'), 'curve_latlon'],
                [sequelize.sequelize.col('smart_station_TBL.img'), 'img'],
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'],
            ],

            include:[
                {
                    model: sequelize.Axis,
                    attributes:[
                        // 'azimuth',
                        // 'heading',
                        // 'pitch',
                        // 'roll'
                    ],
                    nested: false,
                    required: false
                },
                {
                    model: sequelize.Curve,
                    attributes: [
                        // 'curve_deg',
                        // ['X(curve_latlon)', 'curve_lat'],
                        // ['Y(curve_latlon)', 'curve_lon']
                    ],
                    required: false
                },
                {
                    model: sequelize.Smart,
                    attributes:[
                        // 'img'
                    ],
                    paranoid: false,
                    required: false,
                    nested: false,  
                },
                {
                    model: sequelize.ModelRelation,
                    attributes: [],
                }
            ],
            where: {
                fid: req.params.id
            },
            raw: true,
            transaction: transaction
        });

        var imgs = []; 
        var image = pipeOne.img.split(",");
        image.map(data => {
            var img = {};
            img.img = data;
            imgs.push(img);
        });

        console.log(pipeOne);

        pipeOne.imgs = imgs;
        
        pipeOne.id = pipeOne.fid;
        pipeOne.lat = pipeOne.latlon.coordinates[0].toFixed(12);
        pipeOne.lon = pipeOne.latlon.coordinates[1].toFixed(12);
        
        if(pipeOne.curve_latlon !== null) {
            pipeOne.curve_lon = pipeOne.curve_latlon.coordinates[0].toFixed(12);
            pipeOne.curve_lon = pipeOne.curve_latlon.coordinates[1].toFixed(12);
        }
        delete pipeOne.latlon;
        delete pipeOne.curve_latlon;

        await transaction.commit();

        res.send(pipeOne);
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.delete('/:id', async (req, res, next) => {
    // pipe, axis, curve delete
    var transaction;
    try {

        transaction = await sequelize.sequelize.transaction();

        var areaOne = await sequelize.Job.findOne({
            where: {
                job_fid_prefix: {
                [Op.like]: req.params.id.substr(0, 12) + '%'
              }
            },
            transaction: transaction
        });

        await sequelize.Pipe.destroy({
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        await sequelize.Axis.destroy({
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        await sequelize.Curve.destroy({
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        await sequelize.CurveJoint.destroy({
            where: {
                fid: req.params.id
            },
            transaction: transaction
        });

        // modeling data delete
        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/pipe/b3dm/high/${req.params.id}`)
        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/pipe/b3dm/low/${req.params.id}`)
        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/pipe/lod/${req.params.id}`)
        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/pipe/obj/${req.params.id}`)
        
        await fileIo(areaOne.real_id, "pipe");
        await transaction.commit();
        res.send("SUCCESS");

    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;
