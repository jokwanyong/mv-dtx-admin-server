import express from 'express';
import _ from 'lodash';
import sequelize from '../../../models';
import Config from '../../../util/config';
const Op = sequelize.Op;
var router = express.Router();

// '1','기존관','1','2019-09-02 15:03:07'
// '2','원형맨홀','1','2019-09-02 15:03:07'
// '3','사각맨홀','1','2019-09-02 15:03:07'
// '4','밸브','1','2019-09-02 15:03:07'
// '5','좌측T자관','1','2019-09-04 14:36:48'
// '6','우측T자관','1','2019-09-04 14:36:52'

// 현재 맨홀만 사용중.

// 전체 조회.
router.get('', async (req, res, next) => {
    var transaction;
    try {

        sequelize.ObsRelation.belongsTo(sequelize.ObsCompany, {foreignKey: 'company_idx'});
        sequelize.ObsRelation.belongsTo(sequelize.ObsModel, {foreignKey: 'model_idx'});

        transaction = await sequelize.sequelize.transaction();

        var result = [];
        var count;

        var obs_model_relation = await sequelize.ObsRelation.findAndCountAll({
            attributes: [
                'idx',
                [sequelize.sequelize.col('obs_company_TBL.company_name'), 'company_name'],
                [sequelize.sequelize.col('obs_model_TBL.model_name'), 'model_name'],
            ],
            include: [
                {
                    model: sequelize.ObsCompany,
                    attributes: []
                },
                {
                    model: sequelize.ObsModel,
                    attributes: []
                }
            ]
        }, {transaction: transaction});

        var obs_manhole = await sequelize.ObsManhole.findAndCountAll({

        },{transaction: transaction});

        // 관리자 페이지 결과 나누기용.
        _.map(obs_model_relation.rows, data => {
            data.dataValues.id = `A${data.dataValues.idx}`;
            result.push(data);
        });

        _.map(obs_manhole.rows, data => {
            data.dataValues.id = `B${data.dataValues.idx}`;
            result.push(data);
        });

        count = obs_model_relation.count + obs_manhole.count;
        transaction.commit();

        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${count}`);
        res.setHeader('X-Total-Count', `${count}`);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 단일 조회.
router.get('/:id', async (req, res, next) => {
    try {
        // 코드값 앞자리 빼기.
        var code = req.params.id.substr(0,1);
        var id = req.params.id.substring(req.params.id.length, 1);

        sequelize.ObsRelation.belongsTo(sequelize.ObsCompany, {foreignKey: 'company_idx'});
        sequelize.ObsRelation.belongsTo(sequelize.ObsModel, {foreignKey: 'model_idx'});

        var result;

        // A 이면 relation
        if(code === "A") {
            var obs_model_relation = await sequelize.ObsRelation.findOne({
                attributes: [
                    'idx',
                    [sequelize.sequelize.col('obs_company_TBL.company_name'), 'company_name'],
                    [sequelize.sequelize.col('obs_model_TBL.model_name'), 'model_name'],
                ],
                include: [
                    {
                        model: sequelize.ObsCompany,
                        attributes: []
                    },
                    {
                        model: sequelize.ObsModel,
                        attributes: []
                    }
                ],
                where: {
                    idx: id
                }
            });
            obs_model_relation.dataValues.id = req.params.id;
            result = obs_model_relation;
        }
        // B 이면 맨홀 
        else if(code === "B") {
            var obs_manhole = await sequelize.ObsManhole.findOne({
                where: {
                    idx: id
                }
            });
            obs_manhole.dataValues.id = req.params.id;
            result = obs_manhole;
        }
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send("ERR");
    }
});

// 생성
router.post('', async (req, res, next) => {
    var transaction;
    try {
        transaction = await sequelize.sequelize.transaction();

        // 맨홀 모델링과 단순 모델링 두개 생성가능
        if(req.body.code === "0") {
            if(req.body.diameter === undefined) {
                req.body.height = null;
            }
            
            var manhole = await sequelize.ObsManhole.findOrCreate({
                where: {
                    width: req.body.width,
                    diameter: req.body.diameter,
                    height: req.body.height
                },
                default: {
                    width: req.body.width,
                    diameter: req.body.diameter,
                    height: req.body.height
                },
                transaction: transaction
            });
            transaction.commit();
            manhole[0].dataValues.id = `B${manhole[0].dataValues.idx}`
            res.send(manhole[0]);
        }
        else {

            var company_idx;
            var model_idx;

            var company = await sequelize.ObsCompany.findOrCreate({
                where: {
                    company_name: req.body.company_name
                },
                default: {
                    company_name: req.body.company_name
                },
                transaction: transaction
            });

            company_idx = company[0].company_idx;

            var model = await sequelize.ObsModel.findOrCreate({
                where: {
                    model_name: req.body.model_name,
                    company_idx: company_idx
                },
                default: {
                    model_name: req.body.model_name,
                    company_idx: company_idx
                },
                transaction: transaction
            });

            model_idx = model[0].model_idx;

            var model_relation = await sequelize.ObsRelation.findOrCreate({
                where: {
                    company_idx: company_idx,
                    model_idx: model_idx,
                },
                default: {
                    company_idx: company_idx,
                    model_idx: model_idx,
                },
                transaction: transaction
            })
            transaction.commit();
            model_relation[0].dataValues.id = `A${model_relation[0].dataValues.idx}`
            res.send(model_relation[0]);
        }
        
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
        var code = req.params.id.substr(0,1);
        var id = req.params.id.substring(req.params.id.length, 1);

        sequelize.ObsRelation.belongsTo(sequelize.ObsCompany, {foreignKey: 'company_idx'});
        sequelize.ObsRelation.belongsTo(sequelize.ObsModel, {foreignKey: 'model_idx'});

        transaction = await sequelize.sequelize.transaction();

        var result;

        if(code === "A") {
            var find_model_index = await sequelize.ObsRelation.findOne({
                where: {
                    idx: id
                }
            }, {transaction: transaction});

            var update_company = await sequelize.ObsCaliber.update({
                company_name: req.body.company_name
            }, {where: {company_idx: find_model_index.company_idx}}, {transaction: transaction});

            var update_model = await sequelize.ObsModel.update({
                model_name: req.body.model_name
            }, {where: {model_idx: find_model_index.model_idx}}, {transaction:transaction});

            var find_update = await sequelize.ObsRelation.findOne({
                attributes: [
                    'idx',
                    [sequelize.sequelize.col('obs_company_TBL.company_name'), 'company_name'],
                    [sequelize.sequelize.col('obs_model_TBL.model_name'), 'model_name'],
                ],
                include: [
                    {
                        model: sequelize.ObsCompany,
                        attributes: []
                    },
                    {
                        model: sequelize.ObsModel,
                        attributes: []
                    }
                ],
                where: {
                    idx: id
                }
            }, {transaction: transaction});
            transaction.commit();
            find_update.dataValues.id = req.params.id;
            result = find_update;
        }
        else if(code === "B") {
            var manhole_update = await sequelize.ObsManhole.update({
                width: req.body.width,
                diameter: req.body.diameter,
                height: req.body.height
            }, {where: {idx: id}}, {transaction: transaction});

            var update_result = await sequelize.ObsManhole.findOne({
             where: {
                 idx: id
             }   
            })
            transaction.commit();
            update_result.dataValues.id = req.params.id;
            result = update_result;
        }

        // 수정결과 리턴
        res.send(result);

    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 삭제
router.delete('/:id', async (req, res, next) => {
    var transaction;
    try {
        var code = req.params.id.substr(0,1);
        var id = req.params.id.substring(req.params.id.length, 1);

        sequelize.ObsRelation.belongsTo(sequelize.ObsCompany, {foreignKey: 'company_idx'});
        sequelize.ObsRelation.belongsTo(sequelize.ObsModel, {foreignKey: 'model_idx'});

        transaction = await sequelize.sequelize.transaction();

        var result;

        if(code === "A") {

            var find_model_index = await sequelize.ObsRelation.findOne({
                where: {
                    idx: id
                },
                transaction: transaction
            });

            var caliber_model_idx = await sequelize.ObsCaliber.findAndCountAll({
                where: {
                    model_idx: find_model_index.model_idx
                },
                transaction: transaction
            });

            if(caliber_model_idx.count < 1) {

                await sequelize.ObsModel.destroy({
                    where: {
                        model_idx: find_model_index.model_idx
                    },
                    transaction: transaction
                });

                var model_company_idx = await sequelize.ObsModel.findAndCountAll({
                where: {
                    company_idx: find_model_index.company_idx
                    },
                    transaction: transaction
                });

                if(model_company_idx.count < 1) {
                    await sequelize.ObsCompany.destroy({
                        where: {
                            company_idx: find_model_index.company_idx
                        },
                        transaction: transaction
                    });
                }
            }
            
            var delete_relation = await sequelize.ObsRelation.destroy({
                where: {
                    idx: id
                },
                transaction: transaction
            });
            await transaction.commit();
            result = delete_relation;
        }
        else if(code === "B") {
            var delete_manhole = await sequelize.ObsManhole.destroy({
                where: {idx: id},
                transaction: transaction
            });
            await transaction.commit();
            result = delete_manhole;
        }

        res.send("SUCCESS");
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;