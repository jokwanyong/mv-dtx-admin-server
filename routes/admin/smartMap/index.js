import express from 'express';
import _ from 'lodash';
import Config from '../../../util/config';
import sequelize from '../../../models';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
const Op = sequelize.Op;
var router = express.Router();

// 관리자 페이지에서 모든 데이터 찍기위한 router

// page nation 없음
router.get('', async (req, res, next) => {
    try {
        var sort = req.query._sort === undefined || 'id' ? 'fid' : req.query._sort;
        var order = req.query._order === undefined ? 'DESC' : req.query._order;
        
        var fid ;
        if (req.query.q === 'test') {
            fid = 11419142;
        }
        else if (req.query.q === 'test01') {
            fid = 1141914201;
        }
        else {
            fid = req.query.q === undefined || null ? '' : Config.createEncoding((req.query.q));
        };
        
        var offset = req.query._start;
        var limit = req.query._end;

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
                'data_id',
                'qid',
                'vdop',
                'hdop',
                'type',
                'curve_degree',
                'diameter',
                'instrument_height',
                'material',
                'measure_date',
                'facility_type',
                'facility_type_name',
                'facility_type_code',
                'facility_usage',
                'facility_usage_name',
                'facility_depth',
                [sequelize.sequelize.col('pipe_model_relation_TBL.smart_model'), 'smart_model'],
                [sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'), 'pipe_model'],
                [sequelize.sequelize.col('curve_joint_TBL.azimuth'), 'azimuth'],
                [sequelize.sequelize.col('curve_joint_TBL.pitch'), 'pitch'],
            ],
            include: [
                {
                    model: sequelize.ModelRelation,
                    attributes: [],
                },
                {
                    model: sequelize.CurveJoint,
                    attributes: [],
                },
            ],
            where: {
                [Op.and]: [
                    {
                        fid: {
                            [Op.like]: fid + '%'
                        }
                    }
                ]
                
            },
            order: [[sort, order]],
        });

        var real_ids = await sequelize.Job.findAndCountAll({
            raw:true
        });

        _.map(smart_result, (e,i) => {
            var imgs = [];
            
            var image = e.img.split(",");
            
            image.map(smart_result => {
                var img = {};
                img.img = smart_result;
                imgs.push(img);
            });

            Config.pipe_option.map(op => {
                if(e.dataValues.pipe_type === op.pipe_type) {
                    e.dataValues.pipe_type = op.name;
                }
            })

            _.map(real_ids.rows, job => {
                if(e.fid.substr(0,12) === job.job_fid_prefix) {
                    e.dataValues.real_id = job.real_id;
                };
            })

            e.dataValues.imgs = imgs;
            e.dataValues.lat = e.dataValues.latlon.coordinates[0].toFixed(12);
            e.dataValues.lon = e.dataValues.latlon.coordinates[1].toFixed(12);
            delete e.dataValues.latlon;
        })
        
        var total = smart_result.length;
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${total}`);
        res.setHeader('X-Total-Count', `${total}`);  
        res.send(smart_result);

    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 한개 조회
router.get('/:id', async (req, res, next) => {
    try {
        var fid = req.params.id;
        var smart_one = await sequelize.Smart.findOne({
            attributes: [
                'fid',
                ['X(latlon)', 'lat'],
                ['Y(latlon)', 'lon'],
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
                'curve_degree',
                'type',
                'img',
                'diameter',
                'instrument_height',
                'material',
                'measure_date',
            ],
            where: {
                fid: fid
            }
        });

        var imgs = []; 
        var image = smart_one.img.split(",");
        image.map(data => {
            var img = {};
            img.img = data;
            imgs.push(img);
        });

        Config.pipe_option.map(op => {
            if(smart_one.dataValues.pipe_type === op.pipe_type) {
                smart_one.dataValues.pipe_type = op.name;
            }
        })

        smart_one.dataValues.imgs = imgs;
        smart_one.dataValues.id = fid;
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/1`);
        res.setHeader('X-Total-Count', `1`);
        res.send(smart_one);
    } catch (error) {
        
    }
});

// 생성 , 수정, 삭제 smart 로 요청.
router.post('', async (req, res, next) => {
    try {
        var fid = Config.createEncoding(req.body.area_id) + "99";
        var date = moment().format("YYYY-MM-DD HH:mm:ss");
        fid = fid + new Date(date).getTime();
        
        var filePath = path.join(__dirname.substr(0, __dirname.length - 18), 'public/');
        var img_name = [];
        _.map(req.body.imgs, (e, i) => {
            var base64Data = e.src.replace(/^data:image\/png;base64,/, "");
            fs.writeFile(filePath+e.title, base64Data, 'base64', function(err) {
                console.log(err);
            })
            img_name.push(e.title);
        });

        var model_relation ;
        var point = { type: 'Point', coordinates: [req.body.lat, req.body.lon]};

        return sequelize.sequelize.transaction().then(t => {
            return sequelize.Smart.create({
                fid: fid,
                latlon: point,
                alt: req.body.alt,
                geo: req.body.geo,
                depth: req.body.depth,
                data_id: req.body.data_id,
                fix: req.body.fix,
                diameter: req.body.diameter,
                instrument_height: req.body.instrument_height,
                material: req.body.material,
                img: img_name.join(),
            }, {transaction:t}).then(insert => {
                return sequelize.Area.findOne({
                    attributes: [
                        'model_relation'
                    ]
                }, {where: {
                    area_fid_prefix: Config.createEncoding(req.body.area_id)
                } }, {transaction:t}).then(findA => {
                    model_relation = findA.model_relation;
                    return sequelize.ModelRelation.create({
                        fid: fid,
                        smart: model_relation,
                        pipe: model_relation
                    }, {transaction: t}).then(modelC => {
                        
                    })
                })
            })
            .then(() => {
                t.commit();
                res.send("SUCCESS");
            })
            .catch(err => {
                t.rollback();
                console.log(err);
                res.send(err);
            })
        })
        
    } catch (error) {
        console.log(error);
        res.send("error");
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        var point = { type: 'Point', coordinates: [req.body.lat, req.body.lon]};
        var update = await sequelize.Smart.update({
            latlon: point,
            alt: req.body.alt,
            geo: req.body.geo,
            depth: req.body.depth,
            fix: req.body.fix,
            joint_num: req.body.joint_num,
            measure_date: req.body.measure_date
        }, {
            where: {
                fid: req.params.id
            }
        });
        res.send(update);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        
        res.send("SUCCESS");
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;