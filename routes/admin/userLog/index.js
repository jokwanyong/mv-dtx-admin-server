import express from 'express';
import _ from 'lodash';
import sequelize from '../../../models';
import Config from '../../../util/config';
const Op = sequelize.Op;
var router = express.Router();

router.get('', async (req, res) => {
    try {

        var sort = req.query._sort === undefined || null ? 'id' : req.query._sort;
        var order = req.query._order === undefined || null ? 'ASC' : req.query._order;
        var  _end = req.query._end === undefined || null ? 100 : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

        var user_log = await sequelize.User_Log.findAndCountAll({

            order: [[sort, order]],
            offset: _start,
            limit: _end
        });

        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${user_log.count}`);
        res.setHeader('X-Total-Count', `${user_log.count}`);  
        res.send(user_log.rows);

    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
})

module.exports = router;