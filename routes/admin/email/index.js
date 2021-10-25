import express from 'express';
import _ from 'lodash';
import sequelize from '../../../models';
import Config from '../../../util/config';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import axios from 'axios';
import { send } from './mailer';
const Op = sequelize.Op;
var router = express.Router();

// error 방지용 전체조회.
router.get('', async (req, res) => {
    try {
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${0}`);
        res.setHeader('X-Total-Count', `${0}`);
        res.send([])
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 보낼 엑셀 파일.
const design_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        var file_path = process.platform === 'linux' ? '/efs/dtx_excel' : path.join(__dirname.substr(0, __dirname.length - 18), 'public/excel/');
        cb(null, file_path)    
      } catch (error) {
        return cb(new Error(error));
      }
    },
    filename: function (req, file, cb) {
      file.uploadedFile = {
        name: file.filename,
        ext: file.mimetype.split('/')[1]
      };
      cb(null, file.originalname);
    }
}); 

const excel_upload = multer({storage: design_storage});
// 파라미터 이름 excel
const excel_uploadMiddleware = excel_upload.any('excel');

// 메일 보내기
router.post('', async (req, res, next) => {
    try {
      var email_address = await sequelize.Area.findOne({
          attributes: [
              'email'
          ],
          where: {
              area_id: req.body.area_id
          }
      });

      // 현재 메일 직접 보내는중.

      // email, subject, htmlcontent, callback
      // multiple 'your-first-email@gmail.com, your-second-email@gmail.com',
      // send(`${email_address.email}`, req.body.title, req.body.contents, req.files[0].filename, req.files[0].path, (err, result) => {
      //     if(err) throw err;
      //     console.log(result);
      // });

      res.send(email_address);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
})

module.exports = router;