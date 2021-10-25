import express from 'express';
import _ from 'lodash';
import Config from '../../../util/config';
import sequelize from '../../../models';

const Op = sequelize.Op;
var router = express.Router();

router.get('', async (req, res, next) => {
    try {
        var is_user = req.query.is_user === undefined || null ? '' : 0;
        var sort = req.query._sort === undefined || 'id' ? 'job_id' : req.query._sort;
        var order = req.query._order === undefined || null ? 'DESC' : req.query._order;
        var  _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

        const devices = await sequelize.JobLog.findAll({
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
        const job_log = await sequelize.JobLog.findOne({
            where: {
                job_id: req.params.id
            }
        });
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);
        res.send(job_log);
    } catch (error) {
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;