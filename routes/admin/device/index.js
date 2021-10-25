import express from 'express';
import _ from 'lodash';
import Config from '../../../util/config';
import sequelize from 'sequelize';

var Device = require('../../../models').Device;
const Op = sequelize.Op;
var router = express.Router();

router.get('', async (req, res, next) => {
    try {
        var is_user = req.query.is_user === undefined || null ? '' : 0;
        var sort = req.query._sort === undefined || 'id' ? 'device_id' : req.query._sort;
        var order = req.query._order === undefined || null ? 'DESC' : req.query._order;
        var  _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

        const devices = await Device.findAll({
            where: {
                usage:{
                    [Op.like]: is_user+"%"
                }
            },
            order: [[sort, order]],
            offset: _start,
            limit: _end
        });
        const total = devices.length;
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${total}`);
        res.setHeader('X-Total-Count', `${total}`);
       
        res.send(devices);
    } catch (error) {
        res.send({"result": "fail" , "message": error.message});
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        console.log("GET ONE");
        const devices = await Device.findAll({
            where: {
                device_id: req.params.id
            }
        });
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);
        res.send(devices);
    } catch (error) {
        res.send({"result": "fail" , "message": error.message});
    }
})

router.get('/device/:equipment', async (req, res, next) => {
    var arr = {};
    arr.device_id = Config.createDevice(req.params.equipment);
    try {
        var result = await Device.findAll({
            where: {
                device_id: arr.device_id
            }
        })
        if (result.length < 1) {
            var data = [{}];
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('Content-Range', `0-5/${1}`);
            res.setHeader('X-Total-Count', `${1}`);
            data[0].device_id = arr.device_id;
            res.send(data);
        }
        else {
            return res.send('error');
        }
        
    } catch (error) {
        res.send({"result": "fail" , "message": error.message});
    }
});

router.post('', async (req, res, next) => {
    const param = req.body;
    if(param.device_id === false || param.device_id === "press Button") {
        return res.send("ERROR");
    }
    else {
       try {
          var result = await Device.create({
            device_id: param.device_id,
            equipment: param.equipment,
            usage: param.usage
           })
           res.send(result);
       } catch (error) {
           res.send({"result": "fail" , "message": error.message});
       }
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const devices = await Device.destroy({
            where: {
                device_id: req.params.id
            }
        });
        res.send('success');
    } catch (error) {
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;