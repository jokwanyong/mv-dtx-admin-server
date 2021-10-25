import express from "express";
import _ from "lodash";
import Config from "../../../util/config";
import sequelize from '../../../models';
import shelljs from 'shelljs';
import moment from 'moment';
import multer from 'multer';
import { insert_data, ConvertGeo } from './blue_point';
import fs from 'fs';
import path from 'path';
const Op = sequelize.Op;
var router = express.Router();

// area 전체 조회
router.get('', async (req, res, next) => {
  try {
    // 
    var is_smart = req.query.is_smart === undefined || null ? true : false;
    // sequelize.Area.belongsTo(sequelize.Area_Design, {foreignKey: 'area_id'});
    sequelize.Area.hasMany(sequelize.Job, { foreignKey: 'area_id'});
    var area = await sequelize.Area.findAll({
      attributes: [
        'area_id',
        ['area_id', 'id'],
        'area_fid_prefix',
        'total_length',
        'start_date',
        'end_date',
        'builder',
        'address',
        'construction',
        'state',
        'unit',
        'curve_type',
        'area_type',
        'default_alt',
        'create_date',
        'email',
        'job_id',
        'job_rid',
        'job_fid_prefix',
        'aerial_photo',
        'coordinates',
        'order',
      ],
      include: [
        {
          model: sequelize.Area_Design,
          required: false
        },
        {
          model: sequelize.Area_Data,
          required: false
        },
        {
          attributes: [
            'job_id',
            'area_id',
            'real_id',
            'smart_model_relation',
            'pipe_model_relation',
            'material',
          ],
          model: sequelize.Job,
          required: false
        },
        {
          model: sequelize.AreaProgress,
          required: false
        }
      ]
    })
    if (!is_smart) {
      var arr = [];
      area.map(e => {
        var smart = {};
        smart.area_id = e.area_id;
        smart.user_id = e.user_id.split(",");
        e.job_id = e.job_id.split(",");
        arr.push(smart);
      });
    } else {
      area.map(e => {
        e.state = String(e.state);
        e.area_type = String(e.area_type);
        e.unit = String(e.unit);
        e.aerial_photo = String(e.aerial_photo);
        e.job_id = e.job_id.split(",");
        e.curve_type = e.curve_type.split(",");
        if(e.email) {
          e.email = e.email.split(",").map(e => {return {"address": e}});
        }
        if(e.coordinates) {
          e.coordinates = e.coordinates.split(",").map(v => String(v));
        }
        _.map(e.area_design_TBLs, data => {
          data.dataValues.min_lat = data.dataValues.min_latlon.coordinates[0].toFixed(12);
          data.dataValues.min_lon = data.dataValues.min_latlon.coordinates[1].toFixed(12);
          data.dataValues.max_lat = data.dataValues.max_latlon.coordinates[0].toFixed(12);
          data.dataValues.max_lon = data.dataValues.max_latlon.coordinates[1].toFixed(12);
          delete data.dataValues.min_latlon;
          delete data.dataValues.max_latlon;
        });

        _.map(e.job_TBLs, data => {
          e.dataValues.smart_model_relation = "1"
          e.dataValues.pipe_model_relation = "1"
          e.dataValues.material = "PE"
        })
        delete e.dataValues.job_TBLs;
      });
    }
    const total = area.length;
    // 관리자 페이지에서 필요한 헤더 값 세팅.
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("Content-Range", `0-5/${total}`);
    res.setHeader("X-Total-Count", `${total}`);
    res.send(area);
  } catch (error) {
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

// 단일 조회
router.get('/:id', async (req, res, next) => {
  try {
    sequelize.Area.belongsTo(sequelize.Area_Design, {foreignKey: 'area_id'});
    sequelize.Area.hasMany(sequelize.Job, { foreignKey: 'area_id'});
    var area_one = await sequelize.Area.findOne({
      attributes: [
        'area_id',
        ['area_id', 'id'],
        'area_fid_prefix',
        'total_length',
        'job_id',
        'job_rid',
        'job_fid_prefix',
        'start_date',
        'end_date',
        'builder',
        'address',
        'construction',
        'state',
        'unit',
        'curve_type',
        'area_type',
        'default_alt',
        'email',
        'create_date',
        'aerial_photo',
        'coordinates',
        'order',
      ],
      where: {
        area_id: req.params.id
      },
      include: [
        {
          model: sequelize.Area_Design,
          required: false
        },
        {
          model: sequelize.Area_Data,
          required: false
        },
        {
          model: sequelize.AreaProgress,
          required: false
        }
      ]
    });

      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
      res.setHeader("Content-Range", `0-5/1`);
      res.setHeader("X-Total-Count", `1`);

      area_one.state = String(area_one.state);
      area_one.area_type = String(area_one.area_type);
      area_one.unit = String(area_one.unit);
      area_one.aerial_photo = String(area_one.aerial_photo);

      area_one.job_id = area_one.job_id.split(",");
      area_one.curve_type = area_one.curve_type.split(",");
      
      if(area_one.email) {
        area_one.email = area_one.email.split(",").map(e => {return {"address": e}});
      }
      if(area_one.coordinates) {
        area_one.coordinates = area_one.coordinates.split(",").map(e => String(e));
      }

      _.map(area_one.area_design_TBLs, data => {
        data.dataValues.min_lat = data.dataValues.min_latlon.coordinates[0].toFixed(12);
        data.dataValues.min_lon = data.dataValues.min_latlon.coordinates[1].toFixed(12);
        data.dataValues.max_lat = data.dataValues.max_latlon.coordinates[0].toFixed(12);
        data.dataValues.max_lon = data.dataValues.max_latlon.coordinates[1].toFixed(12);
        delete data.dataValues.min_latlon;
        delete data.dataValues.max_latlon;
      });

      res.send(area_one);
  } catch (error) {
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

//생성
router.post("", (req, res, next) => {
  try {
    var result;
    var area_id ;
    var area_fid_prefix;

    return sequelize.sequelize.transaction().then(t => {
      return sequelize.Area.findAndCountAll({
        attributes: ['area_id'],  
        where: {
          area_id: {[Op.like]: req.body.area_id + '%'}
        }
      }, {transaction: t}).then(select_Area => {
        area_id = req.body.area_id + _.chain(_.filter(Config.alphabet, ['num',select_Area.count])).head().value().string;
        area_fid_prefix = Config.createEncoding(area_id);
        if(req.body.email) {
          var email_arr = _.map(req.body.email, em => {
            return em.address
          })
        }
        return sequelize.Area.create({
          area_id: area_id,
          area_fid_prefix: area_fid_prefix,
          total_length: req.body.total_length,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          builder: req.body.builder,
          address: req.body.address,
          construction: req.body.construction,
          state: req.body.state,
          unit: req.body.unit,
          curve_type: req.body.curve_type.join(),
          area_type: req.body.area_type,
          default_alt: req.body.default_alt,
          email: email_arr !== undefined ? email_arr.join() : email_arr,
          aerial_photo: req.body.aerial_photo,
          coordinates: req.body.coordinates.join(),
          order: req.body.order,
        }, {transaction: t}).then(afterC => {
          result = afterC;
        })
      })
      .then(() => {
        t.commit();
        // 이미지 및 모델링 경로 생성
        shelljs.exec(`sudo mkdir /efs/dtx_image/gps_images/${area_id} && sudo chmod 777 /efs/dtx_image/gps_images/${area_id}`);
        shelljs.exec(`sudo mkdir /efs/dtx_image/gps_images/${area_id}/thumbnail && sudo chmod 777 /efs/dtx_image/gps_images/${area_id}thumbnail`);
        shelljs.exec(`sudo mkdir /efs/dtx_image/obs_images/${area_id} && sudo chmod 777 /efs/dtx_image/obs_images/${area_id}`);
        shelljs.exec(`sudo mkdir /efs/dtx_image/obs_images/${area_id}/thumbnail && sudo chmod 777 /efs/dtx_image/obs_images/${area_id}thumbnail`);
        shelljs.exec(`sudo mkdir /efs/dtx_model_web/design/${area_id} && sudo chmod 777 /efs/dtx_model_web/design/${area_id}`);
        shelljs.exec(`sudo mkdir /efs/model_data/design/${area_id} && sudo chmod 777 /efs/model_data/design/${area_id}`);
        res.send(result);
      })
      .catch(err => {
        t.rollback();
        console.log("err");
        console.log(err);
        res.send({"result": "fail" , "message": err.message});
      })
    });

  } catch (error) {
    console.log(error)
    res.send({"result": "fail" , "message": error.message});
  }
});


// image save path from multer
const design_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      var parseData = req.body.data === undefined || null ? req.body : JSON.parse(req.body.data);
      var file_path = process.platform === 'linux' ? '/efs/dtx_model_web/design/' : path.join(__dirname.substr(0, __dirname.length - 18), 'public/design/');
      file_path = file_path + parseData.area_id;
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
const json_uploadMiddleware = json_upload.any('file');

// 설계데이터 업로드
router.post('/bluePrint', json_uploadMiddleware, async (req, res, next) => {
  var transaction;
  try {
    if(_.isEmpty(req.files)) { 
      res.send("File Empty");
    }
    else {
      transaction = await sequelize.sequelize.transaction();
      var data = req.body;
      var area_fid_prefix = Config.createEncoding(data.area_id);

      var json = fs.readFileSync(req.files[0].path, 'utf8');
      console.log(area_fid_prefix);
      var result = await insert_data(JSON.parse(json), data.area_id, area_fid_prefix, data.type, req.body.geo_type, transaction);
      console.log(result);
      var area_data_find = await sequelize.Area_Data.findAll({
        where: {
          area_id: req.body.area_id,
          type: req.body.type
        }
      }, {transaction : transaction});
      if(area_data_find.length > 0) {
        console.log("IF");
        console.log("area_data_find", area_data_find);
        await sequelize.Area_Data.update({
          file: req.files[0].originalname
        }, {
          where : {
            area_id: req.body.area_id,
            type: req.body.type
          }
        }, {transaction : transaction});
      }
      else {
        console.log("else");
        console.log("area_data_find", area_data_find);
        await sequelize.Area_Data.create({
          area_id: req.body.area_id,
          type: req.body.type,
          file: req.files[0].originalname
        }, {transaction: transaction})
      }
      await transaction.commit();
      res.send("success");
    }
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});


// 항공사진 업로드 multer setting
const image_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      var image_path = process.platform === 'linux' ? '/efs/dtx_model_web/design/' : path.join(__dirname.substr(0, __dirname.length - 18), 'public/design/') 
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

// 항공사진 업로드 multer setting
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

// 항공사진 업로드
router.post('/design', async (req, res, next) => {
  var transaction;
  try {
    imageUpload(req, res, async function(err) {
      if(err) {
        console.log(err)
        return res.send("ERROR")
      }
      if(_.isEmpty(req.files)) {
        return res.send("image Null")
      }
      else {
        transaction = await sequelize.sequelize.transaction();
        var image_name = [];
  
        _.map(req.files.imgs, img => {
          var name = `${req.body.area_id}/${img.originalname}`;
          console.log(img);
          image_name.push(name);
        });
  
        var area_design_find = await sequelize.Area_Design.findAll({
          where: {
            area_id: req.body.area_id,
            type: req.body.type  
          }
        }, {transaction: transaction});

        // geo_type
        var max = ConvertGeo(req.body.max_lat, req.body.max_lon, req.body.geo_type);
        var min = ConvertGeo(req.body.min_lat, req.body.min_lon, req.body.geo_type);
        if(area_design_find.length > 0) {
          await sequelize.Area_Design.update({
            max_latlon: {type: 'Point', coordinates: max},
            min_latlon: {type: 'Point', coordinates: min},
            imgs: image_name.join()
          }, {where: { area_id: req.body.area_id, type: req.body.type }}, {transaction: transaction})
        }
        else {
          await sequelize.Area_Design.create({
            area_id: req.body.area_id,
            max_latlon: {type: 'Point', coordinates: max},
            min_latlon: {type: 'Point', coordinates: min},
            type: req.body.type,
            imgs: image_name.join()
          }, {transaction: transaction});
        }
        
        await transaction.commit();
        res.send({"result": "success"});
      }
    })
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.log(error);
    res.send({"result": "fail", "error" : error.message});
  }
})

// 관경별 총 길이 
router.post('/progress', async (req, res, next) => {
  var transaction;
  try {
    var result ;
    transaction = await sequelize.sequelize.transaction();
    var [record, created] = await sequelize.AreaProgress.findOrCreate({
      where: {
        area_id: req.body.area_id,
        pipe_type: req.body.pipe_type,
      },
      defaults : {
        area_id: req.body.area_id,
        pipe_type: req.body.pipe_type,
        total_length: req.body.total_length
      },
      transaction: transaction
    });

    console.log("created : " +  created);

    if(!created) {
      await sequelize.AreaProgress.update({
        total_length: req.body.total_length
      }, {
        where: {
          [Op.and] : [
            {
               area_id: req.body.area_id
            },
            {
              pipe_type: req.body.pipe_type
            }
          ]
        },
        transaction: transaction
      });
    } 

    result = await sequelize.AreaProgress.findAll({
      where: {
        area_id: req.body.area_id
      },
      transaction: transaction
    });

    await transaction.commit();

    res.send({"result": "success", "area_progress": result});

  } catch (error) {
    if(transaction) await transaction.rollback();
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

// area 수정
router.put("/:id", (req, res, next) => {
  try {
    var area_fid_prefix = Config.createEncoding(req.params.id);
    var area_id = req.params.id;
    var curve_type = req.body.curve_type;
    var default_alt;
    
    return sequelize.sequelize.transaction().then(t => {
      return sequelize.Area.findOne({
        attributes: ['default_alt'],
        where: {
          area_id: req.params.id
        }
      }, {transaction: t}).then(find => {
        
        if(req.body.email) {
          var email_arr = _.map(req.body.email, em => {
            return em.address
          })
        }
        
        if(req.body.area_type === 1) {
          // 택지아닐경우
          return sequelize.Area.update({
            total_length: req.body.total_length,
            builder: req.body.builder,
            address: req.body.address,
            construction: req.body.construction,
            unit: req.body.unit,
            curve_type: curve_type.join(),
            state: req.body.state,
            area_type: req.body.area_type,
            default_alt: req.body.default_alt,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            create_date: req.body.create_date,
            email: email_arr !== undefined ? email_arr.join() : email_arr,
            aerial_photo: req.body.aerial_photo,
            coordinates: req.body.coordinates.join(),
            order: req.body.order,
          }, {where: {area_id: req.params.id}}, {transaction: t}).then(endAreaUp => {
            return ;
          });
        }
        else {
          // 택지일경우
          default_alt = find;
          return sequelize.Area.update({
            total_length: req.body.total_length,
            builder: req.body.builder,
            address: req.body.address,
            construction: req.body.construction,
            unit: req.body.unit,
            state: req.body.state,
            curve_type: curve_type.join(),
            area_type: req.body.area_type,
            default_alt: req.body.default_alt,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            create_date: req.body.create_date,
            email: email_arr !== undefined ? email_arr.join() : email_arr,
            aerial_photo: req.body.aerial_photo,
            coordinates: req.body.coordinates.join(),
            order: req.body.order,
          },{
            where: {
              area_id: req.params.id
            }
          }, {transaction: t}).then(up => {
            var promises = [];
              //default alt 다를때 smart, pipe depth update
              if(default_alt.default_alt !== req.body.default_alt) {

                var smart_select = sequelize.Smart.findAll({
                  where: {
                    fid: {
                      [Op.like]: '%' + area_fid_prefix + '%'
                    }
                  },
                  transaction: t
                });
                var pipe_select = sequelize.Pipe.findAll({
                  where: {
                    fid: {
                      [Op.like]: '%' + area_fid_prefix + '%'
                    }
                  },
                  transaction: t
                });
                var obstruction_select = sequelize.Obstruction.findAll({
                  where: {
                    fid: {
                      [Op.like]: area_fid_prefix + '%'
                    }
                  },
                  transaction: t
                })
                  promises.push(smart_select);
                  promises.push(pipe_select);
                  promises.push(obstruction_select);
              }

              return Promise.all(promises).then(pro_res => {
                var promises2 = [];
                if(pro_res[0] !== undefined && typeof pro_res[0][0] === 'object') {
                  
                  _.map(pro_res[0], (data, i) => {
                    
                    var smart_depth = Number(req.body.default_alt) - Number(data.alt) - Number(data.instrument_height) * 0.01;
                    var smart_promise = sequelize.Smart.update({
                      depth: smart_depth
                    }, {where: {fid: data.fid}}, {transaction: t})

                    promises2.push(smart_promise)
                  })
                }

                if(pro_res[1] !== undefined && typeof pro_res[1][0] === 'object') {
                  _.map(pro_res[1], (data, i) => {
                    var pipe_depth = data.depth - (default_alt.default_alt - req.body.default_alt);
                    var pipe_promise = sequelize.Pipe.update({
                      depth: pipe_depth
                    }, {where: {fid: data.fid}}, {transaction: t})

                    promises2.push(pipe_promise);
                  })
                }
                if(pro_res[2] !== undefined && typeof pro_res[2][0] === 'object') {
                  _.map(pro_res[2], (data, i) => {
                    var obstruction_depth = Number(req.body.default_alt) - Number(data.alt) - Number(data.instrument_height) * 0.01;
                    
                    var obstruction_promise = sequelize.Obstruction.update({
                      depth: obstruction_depth
                    }, {where: {fid: data.fid}}, {transaction: t})

                    promises2.push(obstruction_promise);
                  })
                }
               return Promise.all(promises2).then(pro_update => {
                  return console.log("END")
                }).catch(err => {return new Error(err)})
              })
          })
        }
      })
      .then(() => {
        t.commit();
        res.send(req.body);
      })
      .catch(err => {
        t.rollback();
        console.log(err);
        res.send({"result": "fail" , "message": error.message});
      })
    })
  } catch (error) {
    console.log(error);
    res.send(err);
  }
});

// area  삭제
// 관련된 모든 테이블에서 모두 삭제
router.delete('/:id', async (req, res, next) => {
  var transaction;
  try {
    transaction = await sequelize.sequelize.transaction();
    //area, job, area_design delete

    var areaOne = await sequelize.Area.findOne({
      attributes: [
        'area_fid_prefix',
      ],
      where: {
        area_id: req.params.id
      },
      transaction: transaction
    });

    var jobInfo = await sequelize.Job.findAll({
      attributes: [
        'real_id'
      ],
      where: {
        area_id: req.params.id
      },
      transaction: transaction
    });

    var result = await sequelize.Area.destroy({
      where: {
        area_id : req.params.id
      },
      transaction: transaction
    });

    await sequelize.Job.destroy({
      where: {
        area_id: req.params.id
      },
      transaction: transaction
    });

    await sequelize.Smart.destroy({
      where: {
          fid: {
              [Op.like]: areaOne.area_fid_prefix + '%'
          }
      },
      transaction: transaction
    });

    await sequelize.ModelRelation.destroy({
        where: {
            fid: {
                [Op.like]: areaOne.area_fid_prefix + '%'
            }
        },
        transaction: transaction
    });

    await sequelize.Pipe.destroy({
        where: {
            fid: {
                [Op.like]: areaOne.area_fid_prefix + '%'
            }
        },
        transaction: transaction
    });

    await sequelize.Axis.destroy({
        where: {
            fid: {
                [Op.like]: areaOne.area_fid_prefix + '%'
            }
        },
        transaction: transaction
    });

    await sequelize.Curve.destroy({
      where: {
          fid: {
              [Op.like]: areaOne.area_fid_prefix + '%'
          }
      },
      transaction: transaction
    });

    await sequelize.CurveJoint.destroy({
      where: {
          fid: {
              [Op.like]: areaOne.area_fid_prefix + '%'
          }
      },
      transaction: transaction
    });

    await sequelize.Obstruction.destroy({
      where: {
          fid: {
              [Op.like]: areaOne.area_fid_prefix + '%'
          }
      },
      transaction: transaction
    });

    await sequelize.ObsModelRelation.destroy({
      where: {
          fid: {
              [Op.like]: areaOne.area_fid_prefix + '%'
          }
      },
      transaction: transaction
    });

    await sequelize.Area_Design.destroy({
      where: {
        area_id: req.params.id
      },
      transaction: transaction
    });

    await sequelize.Area_Data.destroy({
      where: {
        area_id: req.params.id
      },
      transaction: transaction
    });

    await sequelize.Journal.destroy({
      where: {
        area_id: req.params.id
      },
      transaction: transaction
    });

    var bluePoint_find = await sequelize.AreaBluePoint.findOne({
      where: {
          area_id: req.params.id
      },
      transaction: transaction
    });

  if(bluePoint_find) {
      var bluePoint_index = await sequelize.AreaBluePoint.findAll({
          where: {
              area_id: req.params.id,
          },
          transaction: transaction
      });

      _.map(bluePoint_index, async data => {
          if(data.crossPoint !== null) {
              await sequelize.BluePointCrossPoint.destroy({
                  where: {
                      id: data.crossPoint
                  },
                  transaction: transaction
              })
          }
          if(data.missingNode !== null) {
              await sequelize.BluePointMissingNode.destroy({
                  where: {
                      id: data.missingNode
                  },
                  transaction: transaction
              })
          }
          if(data.missingValve !== null) {
              await sequelize.BluePointMissingValue.destroy({
                  where: {
                      id: data.missingValve
                  },
                  transaction: transaction
              })
          }
          if(data.startPoint !== null) {
              await sequelize.BluePointStartValue.destroy({
                  where: {
                      id: data.startPoint
                  },
                  transaction: transaction
              })
          }
          if(data.endPoint !== null) {
              await sequelize.BluePointEndValue.destroy({
                  where: {
                      id: data.endPoint
                  },
                  transaction: transaction
              })
          }
      });
    }



    await transaction.commit();

    _.map(jobInfo, job => {
      shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${job.real_id.toLocaleUpperCase()}`);
    });

    shelljs.exec(`sudo tar -czvf ${area_id}_gps_${moment().tz("Asia/Seoul").format('YYYY-MM-DD')}.tar.gz /efs/dtx_image/gps_images/${area_id}`);

    res.json(result);
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
}); 

module.exports = router;