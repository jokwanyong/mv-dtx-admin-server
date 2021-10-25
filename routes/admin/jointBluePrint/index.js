import express from "express";
import _ from "lodash";
import sequelize from '../../../models';
const Op = sequelize.Op;
var router = express.Router();

router.get('', async (req, res) => {
    var transaction;
    try {
        transaction = await sequelize.sequelize.transaction();


        var blue_point = await sequelize.AreaBluePoint.findAll({
            include: [
                {
                    model: sequelize.BluePointStartValue,
                    include: [
                        sequelize.Valve
                    ]
                },
                {
                    model: sequelize.BluePointEndValue,
                    include: [
                        sequelize.Valve
                    ]
                },
                {
                    model: sequelize.BluePointCrossPoint,
                    include: [
                        sequelize.Valve
                    ]
                },
                {
                    model: sequelize.BluePointMissingNode,
                    include: [
                        sequelize.Valve
                    ]
                },
                {
                    model: sequelize.BluePointMissingValue,
                    include: [
                        sequelize.Valve
                    ]
                }
            ]
        });

        await transaction.commit();

        res.send(blue_point)
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.get('/:id', async(req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
})

router.post('', async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
})

module.exports = router;