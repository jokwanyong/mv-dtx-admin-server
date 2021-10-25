import express from 'express';
import _ from 'lodash';
import Config from '../../../util/config';
import sequelize from '../../../models';
import { apkMulterMiddleware } from './apkMulterMiddleware';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

const Op = sequelize.Op;
let router = express.Router();

// 전체조회
router.get('', async (req, res, next) => {
    try {
        let sort = req.query._sort === 'id' || undefined ? 'idx' : req.query._sort;
        let order = req.query._order === undefined ? 'DESC' : req.query._order;
        let  _end = req.query._end === undefined ? 10 : Number(req.query._end);
        let _start = req.query._start === undefined ? 0 : Number(req.query._start);

        let mobile = await sequelize.MobileVersion.findAndCountAll({
            attributes: [
                'idx',
                'app_name',
                'update',
                'download_path',
                'file_size',
                'update_text',
                [sequelize.sequelize.fn('date_format', sequelize.sequelize.col('mobile_version_TBL.update_date'), '%Y-%m-%d %H:%i:%s'), 'update_date'],
                'update_version',
                'os_type',
            ],
            order: [[sort, order]],
            offset: _start,
            limit: _end,
            raw: true,
        })

        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${mobile.count}`);
        res.setHeader('X-Total-Count', `${mobile.count}`);
        res.send(mobile.rows);
    } catch (error) {
        console.log(error)
        res.send({"result": "fail" , "message": error.message});
    }
});

// 생성
router.post('', async (req, res, next) => {
    try {
        // multer
        apkMulterMiddleware(req, res, async function(err) {
            try {
                if(err) console.log(err)
            
                // file empty check
                if(_.isEmpty(req.files)) {
                    throw new Error("file Empty");
                }

                let file_path;

                let file_name ;
                let size ;

                if(req.body.os_type === "1") {
                    file_path =  "/dtx_app/survey/and/";
                }
                else if(req.body.os_type === "2") {
                    file_path =  "/dtx_app/survey/ios/";
                }

                _.map(req.files.apk, file => {
                    console.log(file)
                    file_name = file_path + file.originalname;
                    size = file.size;
                });

                await sequelize.MobileVersion.create({
                    app_name: req.body.app_name,
                    update: req.body.update,
                    download_path: file_name,
                    file_size: size,
                    update_text: req.body.update_text,
                    update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                    update_version: req.body.update_version,
                    os_type: req.body.os_type
                });
                
                res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
                res.setHeader('Content-Range', `0-5/0`);
                res.setHeader('X-Total-Count', `0`);
                res.send("success");
            } catch (error) {
                console.log(error)
                res.send({"result": "fail" , "message": error.message});
            }
            
        })
        
    } catch (error) {
        console.log(error)
        res.send({"result": "fail" , "message": error.message});
    }
})


module.exports = router;