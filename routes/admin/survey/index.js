import express from "express";
import _ from "lodash";
import multer from 'multer';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import gm from 'gm';
import imageSize from 'image-size';
import sequelize from '../../../models';
import Config from '../../../util/config';
const Op = sequelize.Op;
var router = express.Router();

// survey data get
// 관리자에는 아직 없음
router.get('', async (req, res) => {
    try {
        
        // page nation, sort, order

        var sort = req.query._sort === undefined || 'id' ? 'fid' : req.query._sort;
        var order = req.query._order === undefined ? 'DESC' : req.query._order;
        var fid = req.query.q === undefined || null ? '' : req.query.q;
        var fids = req.query.area_id === undefined || null ? '' : Config.createEncoding(req.query.area_id);
        var fid ;

        if (req.query.q === 'test') {
            fid = 11419142;
        }
        else if (req.query.q === 'test01') {
            fid = 1141914201;
        }
        else {
            fid = req.query.q === undefined || null ? '' : Config.createEncoding((req.query.q));
        };

        var survey_all = await sequelize.Survey.findAndCountAll({

            where: {
                [Op.and]: [
                    {
                        fid: {
                            [Op.like]: '%' + fid + '%'
                        }
                    },
                    {
                        fid: {
                            [Op.like]: '%' + fids + '%'
                        }
                    }
                ]
            },

            order: [[sort, order]]
        });

        _.map(survey_all.rows, (e,i) => {

            // image array
            var imgs = [];
            
            var image = e.img.split(",");
            
            image.map(survey_all => {
                var img = {};
                img.img = survey_all;
                imgs.push(img);
            })
            e.dataValues.imgs = imgs;
            e.dataValues.lat = e.dataValues.latlon.coordinates[0];
            e.dataValues.lon = e.dataValues.latlon.coordinates[1];

            delete e.dataValues.img;
            delete e.dataValues.latlon;
        })

        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${survey_all.count}`);
        res.setHeader('X-Total-Count', `${survey_all.count}`);  
        res.send(survey_all.rows);

    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// survey data 단일 조회
router.get('/:id', async (req, res) => {
    try {
        var survey_one = await sequelize.Survey.findOne({
            where: {
                fid: req.params.id
            }
        });

        var imgs = []; 
        var image = survey_one.img.split(",");
        image.map(data => {
            var img = {};
            img.img = data;
            imgs.push(img);
        });
        
        survey_one.dataValues.imgs = imgs;
        survey_one.dataValues.id = req.params.id;
        survey_one.dataValues.lat = survey_one.dataValues.latlon.coordinates[0];
        survey_one.dataValues.lon = survey_one.dataValues.latlon.coordinates[1];

        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${1}`);
        res.setHeader('X-Total-Count', `${1}`);  
        res.send(survey_one);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// survey image 저장
const image_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        var image_path = process.platform === 'linux' ? '/efs/dtx_image/gps_images/' : path.join(__dirname.substr(0, __dirname.length - 18), 'public/') 
        image_path = image_path + req.body.area_id
        cb(null, image_path)  
      } catch (error) {
        return cb(new Error("error")); 
      }
    },
    filename: function (req, file, cb) {
      file.uploadedFile = {
        name: file.filename,
        ext: file.mimetype.split('/')[1]
      };
      // cb(null, file.fieldname + '-' + Date.now() + '.' + file.uploadedFile.ext);
      cb(null,file.originalname);
    }
  });
  
  // image Type, Check, maxCount
  const imageUpload = multer({
    fileFilter: function (req, file, cb) {
        let filetypes = /jpeg|jpg|png/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (!(mimetype && extname)) {
          console.log(mimetype, extname)
          return cb(new Error('Invalid IMAGE Type'));  
        }
      cb(null, true);
    },
    storage: image_storage
  }).fields([{
    name: 'imgs',
    maxCount: 3
  }]);

// survey 생성
router.post('', async (req, res, next) => {
    var transaction;
    try {
        
        transaction = await sequelize.sequelize.transaction();

        var findArea = await sequelize.Job.findOne({
            attributes: [
                'area_id',
                'real_id',
                'job_fid_prefix',
            ],
            where: {
                real_id : req.body.real_id
            }
        }, {transaction : transaction});

        // image array
        var img_name = [];

        // fid 생성
        var fid = findArea.job_fid_prefix;
        var date = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
        fid = fid + (new Date(date).getTime() / 1000);

        // image 저장
        var filePath = process.platform === 'linux' ? `/efs/dtx_image/gps_images/${findArea.area_id}/` : path.join(__dirname.substr(0, __dirname.length - 18), `public/${findArea.area_id}`) 
        // base64 decoding
        _.map(req.body.imgs, (e, i) => {
            var base64Data;
            if(e.src.includes('data:image/png;base64,')) {
                base64Data = e.src.replace(/^data:image\/png;base64,/, "");
            }
            else {
                base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
            }
            fs.writeFileSync(filePath+e.title, base64Data, 'base64', function(err) {
                console.log(err);
            });

            // thumbnail
            var imagePath = filePath + e.title;
            var savePath = filePath + `thumbnail/${e.title}`
            var dimenstions = imageSize(imagePath);
            base64Data = "";
            e.src = "";
            var width = dimenstions.width * 0.3;
            var height = dimenstions.height * 0.3;
            
            gm(imagePath).thumb(width, height, savePath, function(err) {
                if(err) console.log(err);
                else console.log('done');
            });
            
            img_name.push(findArea.area_id+'/'+e.title);
        });

        var point = {type: 'Point', coordinates: [req.body.lat, req.body.lon]};

        var create_survey = await sequelize.Survey.create({
            fid: fid,
            latlon: point,
            alt: req.body.alt,
            geo: req.body.geo,
            fix: req.body.fix,
            img: img_name.join(),
            measure_date: date,

        }, {transaction: transaction});

        await transaction.commit();

        res.send(create_survey);
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// survey 수정
router.put('/:id', async (req, res, next) => {
    var transaction;
    try {
        transaction = await sequelize.sequelize.transaction();

        var findArea = await sequelize.Job.findOne({
            attributes: [
                'area_id',
                'real_id',
                'job_fid_prefix',
            ],
            where: {
                [Op.like]: '%' + req.body.fid.substr(0, 10) + '%'
            }
        }, {transaction: transaction});

        // image array
        var image_title = [];

        // image path
        var filePath = process.platform === 'linux' ? `/efs/dtx_image/gps_images/${findArea.area_id}/` : path.join(__dirname.substr(0, __dirname.length - 18), `public/${findArea.area_id}`) 

        // base64 decoding
        _.map(req.body.newFiles, (e, i) => {
            var base64Data;
            if(e.src.includes('data:image/png;base64,')) {
                base64Data = e.src.replace(/^data:image\/png;base64,/, "");
            }
            else {
                base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
            }
            fs.writeFileSync(filePath+e.title, base64Data, 'base64', function(err) {
                console.log(err);
            });
            var imagePath = filePath + e.title;
            var savePath = filePath + `thumbnail/${e.title}`
            var dimenstions = imageSize(imagePath);
            base64Data = "";
            e.src = "";
            var width = dimenstions.width * 0.3;
            var height = dimenstions.height * 0.3;
            
            gm(imagePath).thumb(width, height, savePath, function(err) {
                if(err) console.log(err);
                else console.log('done');
            });
        });

        // image 저장
        _.map(req.body.imgs, (e,i) => {
            var img = e.img.split("/");
            if(img.length<2) {
               img.unshift(findA.area_id)
            }
            image_title.push(img.join().replace(",","/"));
        });

        var update_one = await sequelize.Survey.update({
            latlon: {type: 'Point', coordinates: [req.body.lat, req.body.lon]},
            alt: req.body.alt,
            geo: req.body.geo,
            fix: req.body.fix,
            img: image_title.join(),
            measure_date: req.body.measure_date,
        }, {where: {fid: req.params.id}}, {transaction: transaction});

        var result = await sequelize.Survey.findOne({
            where: {
                fid: req.params.id
            }
        }, {transaction: transaction});

        var imgs = []; 
        var image = result.img.split(",");
        image.map(data => {
            var img = {};
            img.img = data;
            imgs.push(img);
        });
        
        result.dataValues.imgs = imgs;
        result.dataValues.id = req.params.id;
        result.dataValues.lat = result.dataValues.latlon.coordinates[0];
        result.dataValues.lon = result.dataValues.latlon.coordinates[1];

        await transaction.commit();
        // 수정 결과 return
        res.send(result);

    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// survey delete
router.delete('/:id', async (req, res, next) => {
    try {
        var delete_one = await sequelize.Survey.destroy({
            where: {
                fid: req.params.id
            }
        });

        res.send(delete_one);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;