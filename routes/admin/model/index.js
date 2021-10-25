import express from 'express';
import _ from 'lodash';
import sequelize from '../../../models';
const Op = sequelize.Op;
var router = express.Router();

// 전체 조회.
router.get('', async (req, res, next) => {
    try {
        sequelize.ComMoCal.belongsTo(sequelize.Company, {foreignKey: 'company_idx'});
        sequelize.ComMoCal.belongsTo(sequelize.Model, {foreignKey: 'model_idx'});

        // page nation 
        var  _end = req.query._end === undefined || null ? null : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

        var company_name = req.query.q === undefined || null ? '' : req.query.q;
        var model ;

        // all map 
        var is_smart = req.query.is_smart === undefined ? false : req.query.is_smart;

        if(is_smart) {
            model = await sequelize.ComMoCal.findAndCountAll({
                attributes: [
                    'idx',
                    'company_idx',
                    'model_idx',
                    [sequelize.sequelize.col('company_TBL.company_name'),'company_name'],
                    [sequelize.sequelize.col('model_TBL.model_name'),'model_name'],
                ],
                    
                include: [
                    {
                        attributes: [],
                        model: sequelize.Company,
                        required: true,
                        where: {
                            company_name: {
                                [Op.like]: company_name + '%'
                            }
                        },     
                    },
                    {
                        attributes: [],
                        model: sequelize.Model,              
                        required: false
                    }
                ],
                order: [['company_idx', 'ASC'],['model_idx', 'ASC']],
            });

        }

        else {
            // 전체 조회.
            model = await sequelize.ComMoCal.findAndCountAll({
                attributes: [
                    'idx',
                    'company_idx',
                    'model_idx',
                    [sequelize.sequelize.col('company_TBL.company_name'),'company_name'],
                    [sequelize.sequelize.col('model_TBL.model_name'),'model_name'],
                ],
                    
                include: [
                    {
                        attributes: [],
                        model: sequelize.Company,
                        required: true,
                        where: {
                            company_name: {
                                [Op.like]: company_name + '%'
                            }
                        },     
                    },
                    {
                        attributes: [],
                        model: sequelize.Model,              
                        required: false
                    }
                ],
                order: [['company_idx', 'ASC'],['model_idx', 'ASC']],
                offset: _start,
                limit: _end
            });
        }

        _.map(model.rows, (e,i) => {
            e.dataValues.idx = String(e.dataValues.idx);
            e.dataValues.pipe_model_relation = String(e.dataValues.idx);
            e.dataValues.smart_model_relation = String(e.dataValues.idx);
            if(req.query.is_pipe !== undefined || null) {
                e.dataValues.pipe_model_relation = String(e.dataValues.idx);
            }
            else if (req.query.is_smart !== undefined || null) {
                e.dataValues.smart_model_relation = String(e.dataValues.idx);
            }
        });

        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${model.count}`);
        res.setHeader('X-Total-Count', `${model.count}`);  
        console.log(model.count);
        res.send(model.rows);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// company 모두 얻기
router.get('/company', async (req, res) => {
    try {
        var company = await sequelize.Company.findAll({

        });

        const total = company.length;
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${total}`);
        res.setHeader('X-Total-Count', `${total}`);

        res.send(company);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 단일 조회.
router.get('/:id', async (req, res, next) => {
    try {
        sequelize.ComMoCal.belongsTo(sequelize.Company, {foreignKey: 'company_idx'});
        sequelize.ComMoCal.belongsTo(sequelize.Model, {foreignKey: 'model_idx'});

        var model_one = await sequelize.ComMoCal.findOne({
            
            attributes: [
                'idx',
                'company_idx',
                'model_idx',
                [sequelize.sequelize.col('company_TBL.company_name'),'company_name'],
                [sequelize.sequelize.col('model_TBL.model_name'),'model_name'],
            ],

            include: [
                {
                    attributes: [],
                    model: sequelize.Company,
                    required: false
                },
                {
                    attributes: [],
                    model: sequelize.Model,
                    required: false
                }
            ],
            where: {
                idx: req.params.id
            }
        });

        model_one.dataValues.id = model_one.dataValues.idx;

        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);  
        res.send(model_one);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 모델 단일 조회 company id 로 조회.
router.get('/model/:id', async (req, res) => {
    try {
        var model = await sequelize.Model.findAll({
            where: {
                company_idx: req.params.id
            }
        });

        const total = model.length;
        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${total}`);
        res.setHeader('X-Total-Count', `${total}`);

        res.send(model);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 생성
router.post('', async (req, res, next) => {
    try {
        sequelize.ComMoCal.belongsTo(sequelize.Company, {foreignKey:'company_idx'});
        sequelize.ComMoCal.belongsTo(sequelize.Model, {foreignKey:'model_idx'});

        sequelize.Company.hasMany(sequelize.Model, {foreignKey:'company_idx'});

        var company_idx;
        var model_idx;

        var com_mo_cal_idx;

        return sequelize.sequelize.transaction().then(t => {
            // company name 없으면 생성.
            return sequelize.Company.findOrCreate({
                where:{
                    company_name: req.body.company_name
                },
                defaults: {
                    company_name: req.body.company_name
                },
                transaction: t
            }).spread((company, created) => {
                company_idx = company.dataValues.company_idx;
                // model name 없으면 생성
                return sequelize.Model.findOrCreate({
                    where: {
                        model_name: req.body.model_name,
                        company_idx: company_idx
                    },
                    defaults: {
                        model_name: req.body.model_name,
                        company_idx: company_idx
                    },
                    transaction: t
                }).spread((model, created) => {
                    model_idx = model.dataValues.model_idx;
                    // idx 관계 테이블에 저장.
                    return sequelize.ComMoCal.findOrCreate({
                        where: {
                            company_idx: company_idx,
                            model_idx: model_idx,
                        },
                        defaults: {
                            company_idx: company_idx,
                            model_idx: model_idx,
                        },
                        transaction: t
                    }).spread((ComMoCal, created) => {
                        com_mo_cal_idx = ComMoCal;
                    })
                })
            })
            .then(() => {
                t.commit();
                // 결과값 return
                res.send({id: com_mo_cal_idx.idx});
            })
            .catch(err => {
                t.rollback();
                console.log(err);
                res.json(err);
            })
        })
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 수정
router.put('/:id', async (req, res, next) => {
    try {
        var company_idx;
        var model_idx;
        var result;
        return sequelize.sequelize.transaction().then(t => {
            // 관계테이블 idx 로 company, model idx find
            return sequelize.ComMoCal.findOne({
                where: {
                    idx: req.params.id
                }
            }, {transaction: t}).then(SELComMoCal => {
                // company_idx , mode_idx 로 이름 변경
                company_idx = SELComMoCal.company_idx;
                model_idx = SELComMoCal.model_idx;

                // company_name 변경
                return sequelize.Company.update({
                    company_name: req.body.company_name
                }, {
                    where: {
                        company_idx: company_idx
                    }
                }, {transaction: t}).then(UpCom => {
                    // model_name 변경
                    return sequelize.Model.update({
                        model_name: req.body.model_name
                    }, {
                        where: {
                            model_idx: model_idx
                        }
                    }, {transaction:t}).then(UpCal => {
                        sequelize.ComMoCal.belongsTo(sequelize.Company, {foreignKey: 'company_idx'});
                        sequelize.ComMoCal.belongsTo(sequelize.Model, {foreignKey: 'model_idx'});
                        
                        // update result return
                        return sequelize.ComMoCal.findOne({
                            
                            attributes: [
                                'idx',
                                [sequelize.sequelize.col('com_mo_cal_TBL.idx'),'id'],
                                'company_idx',
                                'model_idx',
                                [sequelize.sequelize.col('company_TBL.company_name'),'company_name'],
                                [sequelize.sequelize.col('model_TBL.model_name'),'model_name'],
                            ],
                
                            include: [
                                {
                                    attributes: [],
                                    model: sequelize.Company,
                                    required: false
                                },
                                {
                                    attributes: [],
                                    model: sequelize.Model,
                                    required: false
                                }
                            ],
                            where: {
                                idx: req.params.id
                            }
                        }, {transaction: t}).then(SelComMoCal => {
                            result = SelComMoCal;
                        });
                    })
                })
            }).then(() => {
                t.commit();
                res.send(result);
            })
            .catch(err => {
                t.rollback();
                console.log(err);
                res.json(err);
            })
        });

    } catch (error) {
        console.log(error);
        res.send(error)
    }
});

// 삭제
router.delete('/:id', async (req, res, next) => {
    try {
        var company_idx;
        var model_idx;

        return sequelize.sequelize.transaction().then(t => {
            // 관계 테이블에서 company_idx , model_idx 생성
            return sequelize.ComMoCal.findOne({
                where: {
                    idx: req.params.id
                }
            }, {transaction: t}).then(DelComMoCal => {
                company_idx = DelComMoCal.company_idx;
                model_idx = DelComMoCal.model_idx;
                // 관계 테이블
                return sequelize.ComMoCal.destroy({
                    where: {
                        idx: req.params.id
                    }
                }, {transaction: t}).then(DelCom => {
                    // company table
                    return sequelize.Company.destroy({
                        where: {
                            company_idx: company_idx
                        }
                    }, {transaction: t}).then(DelMo => {
                            // model table
                            return sequelize.Model.destroy({
                                where: {
                                    model_idx: model_idx
                                }
                            }, {transaction:t}).then(endTransaction => {
                                return;
                            })
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
                res.json(err);
            })
        })
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;