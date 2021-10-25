import express from 'express';
import _ from 'lodash';
import Config from '../../../util/config';
import sequelize from '../../../models';
import shelljs from 'shelljs';
import moment from 'moment';
import path from 'path';
import multer from 'multer';
import { excelConvert, csvConvert } from './excelConvert';
const Op = sequelize.Op;
var router = express.Router();

// error 방지용 가짜 전체 조회.
router.get('', async (req, res) => {
    try {
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.setHeader('Content-Range', `0-5/${0}`);
        res.setHeader('X-Total-Count', `${0}`);
        res.send([]);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// file 받기.

const design_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        var file_path = process.platform === 'linux' ? '/efs/dtx_excel/admin/' : path.join(__dirname.substr(0, __dirname.length - 23), 'public/excel/');
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
      // cb(null, file.fieldname + '-' + Date.now() + '.' + file.uploadedFile.ext);
      cb(null, file.originalname);
    }
  });
  
const json_upload = multer({storage: design_storage});
// parameter name file
const json_uploadMiddleware = json_upload.any('file');


router.post('/excel', json_uploadMiddleware, async (req, res, next) => {
    console.log("excel upload API");
    var transaction;
    try {
        if(_.isEmpty(req.files)) {
            return res.send("file empty");
        }
        else {
            transaction = await sequelize.sequelize.transaction();
            
            /**
             * 현재 csv 만 가능
             * 보낸 데이터 확인하여 보낸데이터에 있는 real_id 로 데이터 모두 삭제.
             * 이때 맨홀과 연결부 real_id 구분.
             * 데이터 일괄 삽입처리.
             * 에러시 fid 및 measure_date 확인.
             * 
             */

            if(req.files[0].originalname.split(".")[1] === "csv") {
                var data = await csvConvert(req.files[0].path);

                await Promise.all(
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.Smart.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.ModelRelation.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.Pipe.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.Axis.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.Curve.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.CurveJoint.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.obsRealArr.map(real_id => {
                    if(real_id) {
                      return sequelize.Obstruction.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%'
                          }
                        },
                        transaction: transaction
                      })
                    }
                  }),
                  data.obsRealArr.map(real_id => {
                    if(real_id) {
                      return sequelize.ObsModelRelation.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%'
                          }
                        },
                        transaction: transaction
                      })
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${real_id.toLocaleUpperCase()}`)
                    }
                  })
                );

                await sequelize.Smart.bulkCreate(data.smart, {transaction: transaction});
                await sequelize.ModelRelation.bulkCreate(data.smartModel, {transaction: transaction});
                await sequelize.Obstruction.bulkCreate(data.obs, {transaction: transaction});
                await sequelize.ObsModelRelation.bulkCreate(data.manhole, {transaction: transaction});
                await transaction.commit();
            }
            else 
            // if (req.files[0].uploadedFile.ext === "xlsx") 
            {
                var data = excelConvert(req.files[0].path);

                await Promise.all(
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.Smart.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.ModelRelation.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.Pipe.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.Axis.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                        return sequelize.Curve.destroy({
                          where: {
                            fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return sequelize.CurveJoint.destroy({
                        where: {
                          fid: {
                            [Op.like]: Config.createEncoding(real_id) + '%' 
                          }
                        },
                        transaction: transaction
                      });
                    }
                  }),
                  data.realId.map(real_id => {
                    if(real_id) {
                      return shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${real_id.toLocaleUpperCase()}`)
                    }
                  }),
                );
                
                await sequelize.Smart.bulkCreate(data.smart, {transaction: transaction});
                await sequelize.ModelRelation.bulkCreate(data.smartModel, {transaction: transaction});
                await transaction.commit();
            }
          res.send("SUCCESS");
        }
        
    } catch (error) {
        if(transaction) await transaction.rollback();
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;