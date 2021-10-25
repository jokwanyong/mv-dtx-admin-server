import express from 'express';
import _ from 'lodash';
import sequelize from '../../../models';
import Config from '../../../util/config';
var User = require('../../../models').User;
var Device = require('../../../models').Device;
const Op = sequelize.Op;
var router = express.Router();

router.get('', async (req, res, next) => {
    try {
        var is_area = req.query.is_area === undefined || null ? true : false;
        var is_smart = req.query.is_smart === undefined || null ? true : false;
        var is_admin = req.query.is_admin === undefined || null ? true : false;
        var area_id = req.query.is_area === undefined || null ? '' : req.query.is_area;
        var sort = req.query._sort === undefined || 'id' ? 'user_id' : req.query._sort;
        var order = req.query._order === undefined ? 'DESC' : req.query._order;
        var  _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

        if(!is_area) {
            var user = await User.findAll({
                attributes: [
                    'user_id',
                    'real_id',
                    'device_id',
                    'area_id',
                    'state',
                    'admin',
                    'create_date'
                ],
                where: {
                    [Op.or]: [
                        {
                            real_id: ''
                        },
                        {
                            user_fid_prefix: ''
                        },
                        {
                            area_id: area_id
                        }
                    ],
                    [Op.and]: [
                        {
                            admin: 0
                        }
                    ]
                },
            });
            const total = user.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', `0-5/${total}`);
            res.setHeader('X-Total-Count', `${total}`);
            
            return res.send(user);
        }
        else if (!is_admin) {
            var user = await User.findAll({
                attributes: [
                    'user_id',
                    'real_id',
                    'device_id',
                    'area_id',
                    'state',
                    'admin',
                    'create_date'
                ],
                where: {
                    [Op.and]: [
                        {
                            admin: 1
                        },
                        {
                            user_fid_prefix : ''
                        }
                    ]
                }
            })

            const total = user.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', `0-5/${total}`);
            res.setHeader('X-Total-Count', `${total}`);
            
            return res.send(user);
        }
        else if(!is_smart) {
            var user = await User.findAll({
                attributes: [
                    'user_id',
                    'real_id',
                    'device_id',
                    'area_id',
                    'state',
                    'admin',
                    'create_date'
                ]
            });

            const total = user.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', `0-5/${total}`);
            res.setHeader('X-Total-Count', `${total}`);
            
            return res.send(user);
        }
        else {
            var user = await User.findAll({
                attributes: [
                    'user_id',
                    'real_id',
                    'device_id',
                    'area_id',
                    'state',
                    'admin',
                    'create_date'
                ],
                order: [['area_id'],[sort, order]],
                offset: _start,
                limit: _end,
            });
            const total = user.length;
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', `0-5/${total}`);
            res.setHeader('X-Total-Count', `${total}`);
            
            return res.send(user);
        }
        
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        var user = await User.findOne({
            where: {
                user_id: req.params.id
            }
        })
        
        var arr = {};
        arr.user_id = user.user_id;
        arr.id = user.user_id;
        arr.user_fid_prefix = user.user_fid_prefix;
        arr.device_id = user.device_id;
        arr.state = user.state;
        arr.admin = user.admin;
        arr.create_date = user.create_date;
        
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);
        res.send(arr);
    } catch (error) {
        res.send({"result": "fail" , "message": error.message});
    }
});

router.get('/user/:id', async (req, res, next) => {
    try {
        var area_id = req.params.id;
        if(area_id !== undefined) {
            // "SELECT user_id FROM area_TBL WHERE area_id = :area_id"
            var user = await sequelize.Area.findAll({
                where: {
                    area_id: area_id
                }
            });
            user = user[0].user_id.split(",")
            var arr = [];
            _.map(user , (e ,i) => {
                var res = {};
                res.id = e
                res.name = e
                arr.push(res);
            })
            var response = {};
            response.user_ids = arr;
            res.send(response);
        }
    } catch (error) {
        res.send({"result": "fail" , "message": error.message});
    }
});

router.post('', (req, res, next) => {
    try {
        var user_id = req.body.user_id.toLocaleUpperCase();
        var password = Config.encrypt(req.body.password);
        var result;
        return sequelize.sequelize.transaction().then(function(t){
            return sequelize.User.create({
                user_id: user_id,
                password: JSON.stringify(password),
                device_id: req.body.device_id,
                admin: req.body.auth
            }, {transaction: t}).then(function(device) {
                if(req.body.auth === 0) {
                    return sequelize.Device.update(
                        {
                            usage: '1'    
                        },{
                            where: {
                                device_id: req.body.device_id
                            }
                        }
                        , {transaction: t}).then(function(User) {
                            console.log(User);
                            return sequelize.User.findOne({
                                where: {
                                    user_id: user_id
                                }
                            }, {transaction: t}).then(function(data) {
                                console.log('user',data);
                            })
                        })
                }
                else {
                    return sequelize.User.findOne({
                        where: {
                            user_id: user_id
                        }
                    }, {transaction: t}).then(data => {
                        console.log('admin',data);
                    })
                }
            }).then(function() {
                t.commit();
                res.send({id: user_id});
            })
            .catch(function(err) {
                console.log(err);
                t.rollback();
                res.json(err);
            });
        })

    } catch (error) {
        console.log(error)
        res.send("error");
    }
});

router.post('/login', async (req, res, next) => {
    try {
        var password = JSON.stringify(Config.encrypt(req.body.password));
        var login = await sequelize.User.findOne({
            where: {
                [Op.and]: [
                    {
                        user_id: req.body.user_id
                    },
                    {
                        password: password
                    }
                ]
            }   
        });
        res.send(login);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
})

router.delete('/:id', (req, res, next) => {
    try {
        var result;
        return sequelize.sequelize.transaction().then(t => {
            return sequelize.User.findOne({
                where: {
                    user_id: req.params.id
                }
            }, {transaction: t}).then(user => {
                return sequelize.User.destroy({
                    where:{
                        user_id: user.user_id
                    }
                }, {transaction: t}).then(device => {
                    return sequelize.Device.update({
                        usage: 0
                    }, {
                        where: {
                            device_id: user.device_id
                        }
                    }, {transaction: t})
                })
            })
            .then(() => {
                t.commit();
                res.send("SUCCESS");
            })
            .catch(err => {
                console.log(err);
                res.send(err);
            })
        })
    } catch (error) {
        res.send(error)
    }
});

router.put('/:id', (req, res, next) => {
    try {
        var user_id = req.body.user_id;
        return sequelize.sequelize.transaction().then(t => {
            return sequelize.User.findOne({
                where: {
                    user_id: user_id
                }
            }, {transaction: t}).then(User => {
                if(User.device_id !== req.body.device_id) {
                    if(req.body.password !== undefined) {
                        var password = JSON.stringify(Config.encrypt(req.body.password));
                        return sequelize.User.update({
                            device_id: req.body.device_id,
                            password: password
                        }, {
                            where: {
                                user_id: user_id
                            }
                        }, {transaction: t}).then(device => {
                            return sequelize.Device.update({
                                usage: 0
                            }, {
                                where: {
                                    device_id: User.device_id
                                }
                            }, {transaction: t}).then(newD => {
                                return sequelize.Device.update({
                                    usage: 1
                                }, {
                                    where: {
                                        device_id: req.body.device_id
                                    }
                                }, {transaction: t})
                            })
                        })
                    }else {
                        return sequelize.User.update({
                            device_id: req.body.device_id
                        }, {
                            where: {
                                user_id: user_id
                            }
                        }, {transaction: t}).then(device2 => {
                            return sequelize.Device.update({
                                usage: 0
                            }, {
                                where: {
                                    device_id: User.device_id
                                }
                            }, {transaction: t}).then(newD2 => {
                                return sequelize.Device.update({
                                    usage: 1
                                }, {
                                    where: {
                                        device_id: req.body.device_id
                                    }
                                }, {transaction: t})
                            })
                        })
                    }
                }else {
                    if(req.body.password !== undefined) {
                        var password = JSON.stringify(Config.encrypt(req.body.password));
                        return sequelize.User.update({
                            password: password
                        }, {
                            where: {
                                user_id: user_id
                            }
                        }, {transaction: t})
                    }
                }
            })
            .then(() => {
                t.commit();
                res.send({id: req.params.id});
            })
            .catch(err => {
                console.log(err);
                res.send(err);
            })
        })
    } catch (error) {
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;