import express from 'express';
import _ from "lodash";
import sequelize from '../../../models';
import shelljs from 'shelljs';
import Config from '../../../util/config';

const Op = sequelize.Op;
var router = express.Router();

// 전체 조회.
router.get('', async (req, res, next) => {
    try {

        // all map, page nation, order, sort
        var is_smart = req.query.is_smart === undefined || null ? true : false;
        var sort = req.query._sort === undefined || 'id' ? 'job_id' : req.query._sort;
        var order = req.query._order === undefined || null ? 'DESC' : req.query._order;
        var  _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);
        
        if (!is_smart) {
            // all map
            var job = await sequelize.Job.findAndCountAll({
                attributes: [
                    'job_id',
                    'area_id',
                    'real_id',
                    'job_fid_prefix',
                    'pipe_type',
                    'smart_model_relation',
                    'pipe_model_relation',
                    'material',
                    'admin',
                    'curve_extend',
                    'distance_limit',
                    'short_pipe',
                    'degree_to',
                    'degree_from',
                    'construct_detail',
                    'createdAt'
                ] 
            });

            // 관리자 페이지에서 필요한 헤더 값 세팅.
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', `0-5/${job.count}`);
            res.setHeader('X-Total-Count', `${job.count}`);
            
            return res.send(job.rows);
        }
        else {
            const job = await sequelize.Job.findAndCountAll({
                attributes: [
                    'job_id',
                    'area_id',
                    'real_id',
                    'job_fid_prefix',
                    'pipe_type',
                    'smart_model_relation',
                    'pipe_model_relation',
                    'material',
                    'admin',
                    'curve_extend',
                    'distance_limit',
                    'short_pipe',
                    'degree_to',
                    'degree_from',
                    'construct_detail',
                    'createdAt'
                ],
                order: [['area_id'],[sort, order]],
                offset: _start,
                limit: _end,
            });

            // 관리자 페이지에서 필요한 헤더 값 세팅.
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', `0-5/${job.count}`);
            res.setHeader('X-Total-Count', `${job.count}`);
            _.map(job.rows, (e, i) => {
                e.dataValues.id = e.dataValues.job_id;
                e.dataValues.smart_model_relation = e.dataValues.smart_model_relation.split(",");
                e.dataValues.pipe_model_relation = e.dataValues.pipe_model_relation.split(",");
                e.dataValues.material = String(e.dataValues.material);
            })
            res.send(job.rows);
        }
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 단일 조회.
router.get('/:id', async (req, res, next) => {
    try {
        const job_one = await sequelize.Job.findOne({
            attributes: [
                'job_id',
                'area_id',
                'real_id',
                'job_fid_prefix',
                'pipe_type',
                'smart_model_relation',
                'pipe_model_relation',
                'material',
                'admin',
                'curve_extend',
                'distance_limit',
                'short_pipe',
                'degree_to',
                'degree_from',
                'construct_detail',
                'createdAt'
            ],
            where: {
                [Op.or]: [
                    {
                        job_id: req.params.id
                    },
                    {
                        real_id: req.params.id
                    }
                ]
            }
        });

        // 관리자 페이지 parsing
        job_one.dataValues.id = job_one.dataValues.job_id;
        job_one.dataValues.admin = String(job_one.dataValues.admin);
        job_one.dataValues.smart_model_relation = job_one.dataValues.smart_model_relation.split(",");
        job_one.dataValues.pipe_model_relation = job_one.dataValues.pipe_model_relation.split(",");
        job_one.dataValues.material = String(job_one.dataValues.material);

        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);
        res.send(job_one);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 생성
router.post('', async (req, res, next) => {
    var transaction;
    try {
        var result;
        
        transaction = await sequelize.sequelize.transaction();

        // area 및 job 생성내역
        var findA = await sequelize.Area.findOne({
            where: {
                area_id: req.body.area_id
            }
        }, {transaction: transaction});

        var logAll = await sequelize.JobLog.findAndCountAll({
            where: {
                area_id: req.body.area_id
            }
        })

        /**
         * job 생성내역 조회
         * 해당 area 에 생성됐던 job의 real_id 가 job_id
         * 마지막 job_id + 1 하여 사용.
         * 
         */

         // 일반 사용자.
        if(req.body.admin === 0 || req.body.admin === "0") {
            var count;
            if(logAll.count < 9) {
                count = `0${logAll.count+1}`;
            }
            else {
                count = logAll.count+1;
            }
            // job_id 대문자.
            if(req.body.job_id !== undefined) {
                req.body.job_id = (req.body.job_id).toLocaleUpperCase();
            }
            else {
                req.body.job_id = (req.body.area_id + String(count)).toLocaleUpperCase();
            }
            // password 암호화.
            var password = await Config.createPassword(req.body.password);
            req.body.password = password;
            req.body.real_id = req.body.area_id + String(count);
            req.body.job_fid_prefix = Config.createEncoding(req.body.area_id + String(count));
            req.body.smart_model_relation = req.body.smart_model_relation.join();
            req.body.pipe_model_relation = req.body.pipe_model_relation.join();
            
            var jobCreate = await sequelize.Job.create(req.body, {transaction: transaction});
            result = jobCreate;
            
            // area 에도 생성된 job들의 목록을 추가함.

            var job_id = findA.job_id.length > 0 ? findA.job_id.split(",") : [];
            var job_rid = findA.job_rid.length > 0 ? findA.job_rid.split(",") : [];
            var job_fid_prefix =  findA.job_fid_prefix.length > 0 ? findA.job_fid_prefix.split(",") : [];

            job_id.push(result.job_id)
            job_rid.push(result.real_id)
            job_fid_prefix.push(result.job_fid_prefix)

            await sequelize.Area.update({
                job_id: job_id.join(),
                job_rid: job_rid.join(),
                job_fid_prefix: job_fid_prefix.join()
            },{where: {area_id: findA.area_id}},{transaction: transaction})

            // job_log insert
            await sequelize.JobLog.create(req.body, {transaction: transaction});
        }//관리자
        else {
            if(req.body.job_id !== undefined) {
                req.body.job_id = (req.body.job_id).toLocaleUpperCase();
            }
            else {
                req.body.job_id = (req.body.area_id).toLocaleUpperCase();
            }
            var password = await Config.createPassword(req.body.password);
            req.body.password = password;
            req.body.real_id = req.body.area_id;
            req.body.job_fid_prefix = Config.createEncoding(req.body.area_id);
            var adminC = await sequelize.Job.create(req.body, {transaction: transaction})
            result = adminC;
        }
        await transaction.commit();
        result.id = result.job_id
        res.send(result);
     } catch (error) {
         if(transaction) await transaction.rollback();
         console.log(error);
         res.send({"result": "fail" , "message": error.message});
     }
});

// 수정
router.put('/:id', async (req, res, next) => {
    var transaction;
    try {
        transaction = await sequelize.sequelize.transaction();

        if(req.body.password !== undefined) {
            var password = await Config.createPassword(req.body.password);
            req.body.password = password;
        }
        req.body.smart_model_relation = req.body.smart_model_relation.join() ?? '';
        req.body.pipe_model_relation = req.body.pipe_model_relation.join() ?? '';
        req.body.admin = parseInt(req.body.admin);

        await sequelize.Job.update(req.body, {where: { job_id: req.params.id }},{transaction: transaction});

        var result = await sequelize.Job.findOne({
            attributes: [
                'job_id',
                'area_id',
                'real_id',
                'job_fid_prefix',
                'pipe_type',
                'smart_model_relation',
                'pipe_model_relation',
                'material',
                'admin',
                'curve_extend',
                'distance_limit',
                'short_pipe',
                'degree_to',
                'degree_from',
                'degree_from',
                'construct_detail',
                'createdAt'
            ],
            where: {
                job_id: req.body.job_id
            },
            transaction: transaction
        });

        await transaction.commit();
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);

        // 관리자 페이지용 id.
        result.dataValues.id = result.dataValues.job_id

        // 결과값 return
        res.send(result);

    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 삭제.
router.delete('/:id', async (req, res, next) => {
    var transaction;
    try {
        transaction = await sequelize.sequelize.transaction();

        // job table 에서 삭제.
        // job 삭제시 해당 job 으로 생성된 모든 지하매설물 삭제.

        var jobOne = await sequelize.Job.findOne({
            attributes: [
                'job_id',
                'area_id',
                'real_id',
                'job_fid_prefix',
            ],
            where: {
                job_id: req.params.id
            },
            transaction: transaction
        });

        // area table 에서 해당 job 삭제

        var areaOne = await sequelize.Area.findOne({
            attributes: [
                'area_id',
                'job_id',
                'job_rid',
                'job_fid_prefix',
            ],
            where : {
               area_id: jobOne.area_id
            },
            transaction: transaction
        });

        var job_fid_prefix = areaOne.job_fid_prefix.split(",");
        var job_id = areaOne.job_id.split(",");
        var job_rid = areaOne.job_rid.split(",");

        _.pull(job_id, jobOne.job_id);
        _.pull(job_fid_prefix, jobOne.job_fid_prefix);
        _.pull(job_rid, jobOne.real_id);

        await sequelize.Area.update({
            job_fid_prefix: job_fid_prefix.join(),
            job_id: job_id.join(),
            job_rid: job_rid.join()
        },{where: {area_id: jobOne.area_id}, transaction: transaction});

        await sequelize.Job.destroy({
            where: {
                job_id: req.params.id
            },
            transaction: transaction
        });

        await sequelize.Smart.destroy({
            where: {
                fid: {
                    [Op.like]: jobOne.job_fid_prefix + '%'
                }
            },
            transaction :transaction
        });

        await sequelize.ModelRelation.destroy({
            where: {
                fid: {
                    [Op.like]: jobOne.job_fid_prefix + '%'
                }
            },
            transaction: transaction
        });

        await sequelize.Pipe.destroy({
            where: {
                fid: {
                    [Op.like]: jobOne.job_fid_prefix + '%'
                }
            },
            transaction: transaction
        });

        await sequelize.Axis.destroy({
            where: {
                fid: {
                    [Op.like]: jobOne.job_fid_prefix + '%'
                }
            },
            transaction: transaction
        });

        await sequelize.Curve.destroy({
            where: {
                fid: {
                    [Op.like]: jobOne.job_fid_prefix + '%'
                }
            },
            transaction: transaction
        });

        await sequelize.CurveJoint.destroy({
            where: {
                fid: {
                    [Op.like]: jobOne.job_fid_prefix + '%'
                }
            },
            transaction: transaction
        });

        await sequelize.Obstruction.destroy({
            where: {
                fid: {
                    [Op.like]: jobOne.job_fid_prefix + '%'
                }
            },
            transaction: transaction
          });
          await sequelize.ObsModelRelation.destroy({
            where: {
                fid: {
                    [Op.like]: jobOne.job_fid_prefix + '%'
                }
            },
            transaction: transaction
          });

        await transaction.commit();

        // modeling data 삭제.
        shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${jobOne.real_id.toLocaleUpperCase()}`)
        
        res.send("SUCCESS");

    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;