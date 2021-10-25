import express from "express";
import _ from "lodash";
import sequelize from '../../../models';
const Op = sequelize.Op;
var router = express.Router();

// 현재 미사용

router.get('', async (req, res) => {
    try {
        
    } catch (error) {
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