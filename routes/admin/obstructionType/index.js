import express from 'express';
import _ from 'lodash';
import sequelize from '../../../models';
const Op = sequelize.Op;
var router = express.Router();

// 타입 조회

router.get('', async (req, res) => {
    try {
        var obstruction_Type = await sequelize.Obstruction_Type.findAndCountAll({

        });

        _.map(obstruction_Type.rows, (e) => {
            e.dataValues.id = String(e.dataValues.id);
        });

        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${obstruction_Type.count}`);
        res.setHeader('X-Total-Count', `${obstruction_Type.count}`);  
        res.send(obstruction_Type.rows);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.post('', async (req, res, next) => {
    try {
        var result = await sequelize.Obstruction_Type.create({
            type_name: req.body.type_name
        });

        res.send(result);

    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        var result = await sequelize.Obstruction_Type.update({
            type_name: req.body.type_name,
            state: req.body.state,
        }, {
            where: {
                id: req.params.id
            }
        });

        res.send(result);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        var result = await sequelize.Obstruction_Type.destroy({
            where: {
                id: req.params.id
            }
        });

        res.send(result);

    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
})

module.exports = router;