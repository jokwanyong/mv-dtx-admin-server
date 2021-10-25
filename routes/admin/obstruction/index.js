import express from "express";
import _ from "lodash";
import shelljs from 'shelljs';
import sequelize from "../../../models";
import Config from "../../../util/config";
import moment from "moment";
import gm from 'gm';
import imageSize from 'image-size';
import fs from "fs";
import path from "path";

const Op = sequelize.Op;
var router = express.Router();

// 맨홀 

// 맨홀 전체 조회.
router.get("", async (req, res) => {
  try {
    // page nation , sort, order
    var sort = req.query._sort === undefined || "id" ? "fid" : req.query._sort;
    var order = req.query._order === undefined ? "DESC" : req.query._order;

    var _end =
      req.query._end === undefined || null ? 0 : Number(req.query._end);
    var _start =
      req.query._start === undefined || null ? 0 : Number(req.query._start);

    var fid;
    if (req.query.q === "test") {
      fid = 11419142;
    } else if (req.query.q === "test01") {
      fid = 1141914201;
    } else {  
      fid =
        req.query.q === undefined || null
          ? ""
          : Config.createEncoding(req.query.q);
    }

    sequelize.Obstruction.hasOne(sequelize.ObsModelRelation, {
      foreignKey: "fid"
    });
    sequelize.ObsModelRelation.hasOne(sequelize.ObsManhole, {
      foreignKey: "idx",
      sourceKey: "manhole_idx"
    });
    sequelize.ObsModelRelation.hasOne(sequelize.ObsRelation, {
      foreignKey: "idx",
      sourceKey: "code_idx"
    });

    sequelize.ObsRelation.belongsTo(sequelize.ObsCompany, {foreignKey: 'company_idx'});
    sequelize.ObsRelation.belongsTo(sequelize.ObsModel, {foreignKey: 'model_idx'});
    var obstruction;
    // area_id 있으면 obstruction tab 에서 요청
    // 없으면 보낸 real_id로 조회
    if(req.query.area_id !== undefined) {
      var fids = req.query.area_id === undefined || null ? '' : Config.createEncoding(req.query.area_id);
      obstruction = await sequelize.Obstruction.findAndCountAll({
        attributes: [
          "fid",
          [sequelize.sequelize.fn('X', sequelize.sequelize.col('obstruction_TBL.latlon')), 'lat'],
          [sequelize.sequelize.fn('Y', sequelize.sequelize.col('obstruction_TBL.latlon')), 'lon'],
          "alt",
          "geo",
          "depth",
          "fix",
          "img",
          [sequelize.sequelize.fn('date_format', sequelize.sequelize.col('obstruction_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'],
          "type",
          "pipe_type",
          "data_id",
          'vdop',
          'hdop',
          "azimuth",
          "heading",
          "pitch",
          "roll",
          "diameter",
          "instrument_height",
          "hole_depth",
          [sequelize.sequelize.col('obstruction_model_relation_TBL.code_idx'), 'code_idx'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL.manhole_idx'), 'manhole_idx'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.width'), 'width'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.diameter'), 'diameter'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.height'), 'height'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_company_TBL.company_name'), 'company_name'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_model_TBL.model_name'), 'model_name'],
        ],
        include: [
          {
            model: sequelize.ObsModelRelation,
            attributes: [],
            include: [
              {
                model: sequelize.ObsManhole,
                attributes: []
              },
              {
                model: sequelize.ObsRelation,
                attributes: [],
                include: [
                  {
                    model: sequelize.ObsCompany,
                    attributes: []
                  },
                  {
                      model: sequelize.ObsModel,
                      attributes: []
                  }
                ]
              }
            ]
          }
        ],
  
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
        order: [[sort, order]],
        offset: _start,
        limit: _end,
        raw: true
      });

      var real_ids = await sequelize.Job.findAndCountAll({
        raw:true 
      });

      _.map(obstruction.rows, e => {

        // image array
        var imgs = [];
  
        var image = e.img.split(",");
  
        image.map(smart_result => {
          var img = {};
          img.img = smart_result;
          imgs.push(img);
        });
        
        e.imgs = imgs;
        e.lat = e.lat.toFixed(12);
        e.lon = e.lon.toFixed(12);

        // real_id 추가
        _.map(real_ids.rows, job => {
          if(e.fid.substr(0,12) === job.job_fid_prefix) {
              e.real_id = job.real_id;
              e.pipe_type = job.pipe_type;
          };
        })
        delete e.img;
      });

    }
    else {
      obstruction = await sequelize.Obstruction.findAndCountAll({
        attributes: [
          "fid",
          [sequelize.sequelize.fn('X', sequelize.sequelize.col('obstruction_TBL.latlon')), 'lat'],
          [sequelize.sequelize.fn('Y', sequelize.sequelize.col('obstruction_TBL.latlon')), 'lon'],
          "alt",
          "geo",
          "depth",
          "fix",
          "img",
          [sequelize.sequelize.fn('date_format', sequelize.sequelize.col('obstruction_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'],
          "type",
          "pipe_type",
          "data_id",
          'vdop',
          'hdop',
          "azimuth",
          "heading",
          "pitch",
          "roll",
          "diameter",
          "instrument_height",
          "hole_depth",
          [sequelize.sequelize.col('obstruction_model_relation_TBL.code_idx'), 'code_idx'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL.manhole_idx'), 'manhole_idx'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.width'), 'width'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.diameter'), 'diameter'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.height'), 'height'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_company_TBL.company_name'), 'company_name'],
          [sequelize.sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_model_TBL.model_name'), 'model_name'],
        ],
        include: [
          {
            model: sequelize.ObsModelRelation,
            attributes: [],
            include: [
              {
                model: sequelize.ObsManhole,
                attributes: []
              },
              {
                model: sequelize.ObsRelation,
                attributes: [],
                include: [
                  {
                    model: sequelize.ObsCompany,
                    attributes: []
                  },
                  {
                      model: sequelize.ObsModel,
                      attributes: []
                  }
                ]
              }
            ]
          }
        ],
  
        where: {
          [Op.and]: [
            {
              fid: {
                [Op.like]: "%" + fid + "%"
              }
            }
          ]
        },
        raw: true
      });

      _.map(obstruction.rows, e => {
        var imgs = [];
  
        var image = e.img.split(",");
  
        image.map(smart_result => {
          var img = {};
          img.img = smart_result;
          imgs.push(img);
        });
        
        e.imgs = imgs;
        e.lat = e.lat.toFixed(12);
        e.lon = e.lon.toFixed(12);
  
        delete e.img;
      });
    }

    
    // 관리자 페이지에서 필요한 헤더 값 세팅.
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("Content-Range", `0-5/${obstruction.count}`);
    res.setHeader("X-Total-Count", `${obstruction.count}`);
    res.send(obstruction.rows);
  } catch (error) {
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

// 단일조회
router.get("/:id", async (req, res, next) => {
  try {
    var obstruction_one = await sequelize.Obstruction.findOne({
      attributes: [
        "fid",
        [sequelize.sequelize.fn('X', sequelize.sequelize.col('obstruction_TBL.latlon')), 'lat'],
        [sequelize.sequelize.fn('Y', sequelize.sequelize.col('obstruction_TBL.latlon')), 'lon'],
        "alt",
        "geo",
        "depth",
        "fix",
        "img",
        [sequelize.sequelize.fn('date_format', sequelize.sequelize.col('obstruction_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'],
        "type",
        "pipe_type",
        "data_id",
        'vdop',
        'hdop',
        "azimuth",
        "heading",
        "pitch",
        "roll",
        "diameter",
        "instrument_height",
        "hole_depth",
        [sequelize.sequelize.col('obstruction_model_relation_TBL.code_idx'), 'code_idx'],
        [sequelize.sequelize.col('obstruction_model_relation_TBL.manhole_idx'), 'manhole_idx'],
        [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.width'), 'width'],
        [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.diameter'), 'diameter'],
        [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.height'), 'height'],
        [sequelize.sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_company_TBL.company_name'), 'company_name'],
        [sequelize.sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_model_TBL.model_name'), 'model_name'],
      ],
      include: [
        {
          model: sequelize.ObsModelRelation,
          attributes: [],
          include: [
            {
              model: sequelize.ObsManhole,
              attributes: []
            },
            {
              model: sequelize.ObsRelation,
              attributes: [],
              include: [
                {
                  model: sequelize.ObsCompany,
                  attributes: []
                },
                {
                    model: sequelize.ObsModel,
                    attributes: []
                }
              ]
            }
          ]
        }
      ],
      where: {
        fid: req.params.id
      },
      raw: true
    });

    obstruction_one.lat =
      obstruction_one.lat.toFixed(12);
    obstruction_one.lon =
      obstruction_one.lon.toFixed(12);

    var imgs = [];
    var image = obstruction_one.img.split(",");
    image.map(data => {
      var img = {};
      img.img = data;
      imgs.push(img);
    });

    obstruction_one.imgs = imgs;
    obstruction_one.id = obstruction_one.fid;
    obstruction_one.type = `${obstruction_one.type}`;
    
    delete obstruction_one.img;

    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("Content-Range", `0-5/${1}`);
    res.setHeader("X-Total-Count", `${1}`);
    res.send(obstruction_one);
  } catch (error) {
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

//생성
router.post("", async (req, res, next) => {
  var transaction;
  try {
    var fid;
    if (req.body.real_id === "test") {
      fid = 11419142;
    } else if (req.body.real_id === "test01") {
      fid = 1141914201;
    } else {
      fid = Config.createEncoding(req.body.real_id);
    }

//     37.679233902595406
// 126.74595697925315

// 37.672212655192
// 126.74119378622

    // fid 생성
    var date = moment()
      .tz("Asia/Seoul")
      .format("YYYY-MM-DD HH:mm:ss");
    fid = `${fid}` + new Date(date).getTime() / 1000;

    sequelize.ObsRelation.belongsTo(sequelize.ObsCompany, {foreignKey: 'company_idx'});
    sequelize.ObsRelation.belongsTo(sequelize.ObsModel, {foreignKey: 'model_idx'});

    var img_name = [];
    var result;
    var point = { type: "Point", coordinates: [req.body.lat, req.body.lon] };
    transaction = await sequelize.sequelize.transaction();
    var find_area = await sequelize.Job.findOne(
      {
        attributes: ["area_id"],
        where: {
          real_id: req.body.real_id
        }
      },
      { transaction: transaction }
    );

    // image path
    // var filePath = `/efs/dtx_image/obs_images/${find_area.area_id}/`;
    var filePath = process.platform === 'linux' ? `/efs/dtx_image/obs_images/${find_area.area_id}/` : path.join(__dirname.substr(0, __dirname.length - 25), `public/${find_area.area_id}/`) 
    // base64 decoding
    _.map(req.body.imgs, (e, i) => {
      var base64Data;
      if (e.src.includes("data:image/png;base64,")) {
        base64Data = e.src.replace(/^data:image\/png;base64,/, "");
      } else {
        base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
      }
      fs.writeFileSync(filePath + e.title, base64Data, "base64", function(err) {
        console.log(err);
      });

      //thumbnail
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
      img_name.push(`obs_images/${find_area.area_id}/${e.title}`);
    });

    if(req.body.hole_depth === undefined) {
      req.body.hole_depth = null;
    };

    await sequelize.Obstruction.create(
      {
        fid: fid,
        latlon: point,
        alt: req.body.alt,
        geo: req.body.geo,
        depth: req.body.depth,
        fix: req.body.fix,
        img: img_name.join(),
        type: req.body.type,
        code: req.body.type,
        pipe_type: req.body.pipe_type,
        data_id: req.body.data_id,
        qid: req.body.qid,
        vdop: req.body.vdop,
        hdop: req.body.hdop,
        azimuth: req.body.azimuth,
        heading: req.body.heading,
        pitch: req.body.pitch,
        roll: req.body.roll,
        diameter: req.body.diameter,
        instrument_height: req.body.instrument_height,
        hole_depth: req.body.hole_depth
      },
      { transaction: transaction }
    );

    switch (req.body.type) {
      case "1":
        //기존관

        await sequelize.ObsModelRelation.create({
          fid: fid
        }, {transaction: transaction });

        break;
      case "2":
      case "3":
        // 원형맨홀, 사각
        var manhole = await sequelize.ObsManhole.findOne({
          where: {
            idx: req.body.manhole_idx
          }
        }, {transaction: transaction});
        req.body.width = manhole.dataValues.width;
        req.body.diameter = manhole.dataValues.diameter;
        req.body.height = manhole.dataValues.height;
        await sequelize.ObsModelRelation.create({
          fid: fid,
          manhole_idx: req.body.manhole_idx
        }, {transaction: transaction});

        break;
      case "4":
      case "5":
      case "6":
        // 밸브, 좌측T 우측T
        var code = await sequelize.ObsRelation.findOne({
          attributes: [
              'idx',
              [sequelize.sequelize.col('obs_company_TBL.company_name'), 'company_name'],
              [sequelize.sequelize.col('obs_model_TBL.model_name'), 'model_name'],
          ],
          include: [
              {
                  model: sequelize.ObsCompany,
                  attributes: []
              },
              {
                  model: sequelize.ObsModel,
                  attributes: []
              }
          ],
          where: {
              idx: req.body.code_idx
          },
          transaction: transaction
      });
      req.body.company_name = code.dataValues.company_name;
      req.body.model_name = code.dataValues.model_name;
        await sequelize.ObsModelRelation.create({
          fid: fid,
          code_idx: req.body.code_idx
        }, {transaction: transaction});
        
        break;
    
      default:
        throw new Error("Error");
        break;
    };

    await transaction.commit();
    
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("Content-Range", `0-5/1`);
    res.setHeader("X-Total-Count", `1`);
    req.body.fid = fid;
    var imgs = [];
    img_name.map(data => {
      var img = {};
      img.img = data;
      imgs.push(img);
    });
    req.body.imgs = imgs;
    // 생성 결과 리턴.
    res.send(req.body);

  } catch (error) {
    if(transaction) await transaction.rollback();
    console.log("error", error);
    res.send({"result": "fail" , "message": error.message});
  }
});

// 수정
router.put("/:id", async (req, res, next) => {
  var transaction;
  try {
    var latlon = { type: "Point", coordinates: [req.body.lat, req.body.lon] };

    var obstruction_result;

    sequelize.Obstruction.hasOne(sequelize.ObsModelRelation, {
      foreignKey: "fid"
    });
    sequelize.ObsModelRelation.hasOne(sequelize.ObsManhole, {
      foreignKey: "idx",
      sourceKey: "manhole_idx"
    });
    sequelize.ObsModelRelation.hasOne(sequelize.ObsRelation, {
      foreignKey: "idx",
      sourceKey: "code_idx"
    });
    sequelize.ObsRelation.belongsTo(sequelize.ObsCompany, {foreignKey: 'company_idx'});
    sequelize.ObsRelation.belongsTo(sequelize.ObsModel, {foreignKey: 'model_idx'});
    // transaction = await sequelize.sequelize.transaction();

    return sequelize.sequelize.transaction().then(t => {
      return sequelize.Job.findOne(
        {
          attributes: ["area_id"],
          where: {
            job_fid_prefix: {[Op.like]: '%' + req.body.fid.substr(0, 10) + '%'}
          }
        },
        { transaction: t }
      )
        .then(findA => {
          // image path
          var filePath = `/efs/dtx_image/obs_images/${findA.area_id}/`;

          // image 수정
          var image_title = [];
          _.map(req.body.imgs, (e, i) => {
            var img = e.img.split("/");
            if (img.length < 2) {
              img.unshift("obs_images/" + findA.area_id);
            }
            image_title.push(_.replace(img.join(), new RegExp(',', 'g'), '/'));
          });

          // new image base64 decoding
          _.map(req.body.newFiles, (e, i) => {
            var base64Data;
            if (e.src.includes("data:image/png;base64,")) {
              base64Data = e.src.replace(/^data:image\/png;base64,/, "");
            } else {
              base64Data = e.src.replace(/^data:image\/jpeg;base64,/, "");
            }
            fs.writeFileSync(filePath + e.title, base64Data, "base64", function(
              err
            ) {
              image_title.push(`obs_images/${findA.area_id}/${e.title}`);
              console.log(err);
            });

            // thumbnail
            base64Data = "";
            e.src = "";
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

          if(req.body.hole_depth === undefined) {
            req.body.hole_depth = null;
          }

          return sequelize.Obstruction.update(
            {
              latlon: latlon,
              alt: req.body.alt,
              geo: req.body.geo,
              depth: req.body.depth,
              fix: req.body.fix,
              measure_date: req.body.measure_date,
              type: req.body.type,
              pipe_type: req.body.pipe_type,
              data_id: req.body.data_id,
              qid: req.body.qid,
              vdop: req.body.vdop,
              hdop: req.body.hdop,
              azimuth: req.body.azimuth,
              heading: req.body.heading,
              pitch: req.body.pitch,
              roll: req.body.roll,
              img: image_title.join(),
              diameter: req.body.diameter,
              instrument_height: req.body.instrument_height,
              hole_depth: req.body.hole_depth,
            },
            {
              where: {
                fid: req.params.id
              },
              transaction: t
            }
          ).then(update => {
            return sequelize.Obstruction.findOne(
              {
                where: {
                  fid: req.params.id
                },
                transaction: t
              }
            ).then(SelObs => {
              return sequelize.ObsModelRelation.findOne({
                where: {
                  fid: req.params.id
                },
                transaction : t
              }).then(findRelation => {
                var promise = [];
                if(!findRelation) {
                  var relation_create = sequelize.ObsModelRelation.create({
                    fid: req.params.id,
                    code_idx: req.body.code_idx,
                    manhole_idx: req.body.manhole_idx
                  }, {transaction: t})
                  promise.push(relation_create);
                }
                else {
                  var relation_update = sequelize.ObsModelRelation.update({
                    code_idx: req.body.code_idx,
                    manhole_idx: req.body.manhole_idx
                  }, { where: {fid: req.params.id}}, {transaction: t});
                  promise.push(relation_update);
                }
                return Promise.all(promise).then(promise_result => {
                  return sequelize.Obstruction.findOne({
                    attributes: [
                      "fid",
                      [sequelize.sequelize.fn('X', sequelize.sequelize.col('obstruction_TBL.latlon')), 'lat'],
                      [sequelize.sequelize.fn('Y', sequelize.sequelize.col('obstruction_TBL.latlon')), 'lon'],
                      "alt",
                      "geo",
                      "depth",
                      "fix",
                      "img",
                      [sequelize.sequelize.fn('date_format', sequelize.sequelize.col('obstruction_TBL.measure_date'), '%Y-%m-%d %H:%i:%s'), 'measure_date'],
                      "measure_date",
                      "type",
                      "pipe_type",
                      "data_id",
                      'vdop',
                      'hdop',
                      "azimuth",
                      "heading",
                      "pitch",
                      "roll",
                      "diameter",
                      "instrument_height",
                      "hole_depth",
                      [sequelize.sequelize.col('obstruction_model_relation_TBL.code_idx'), 'code_idx'],
                      [sequelize.sequelize.col('obstruction_model_relation_TBL.manhole_idx'), 'manhole_idx'],
                      [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.width'), 'width'],
                      [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.diameter'), 'diameter'],
                      [sequelize.sequelize.col('obstruction_model_relation_TBL->obstruction_manhole_model_TBL.height'), 'height'],
                      [sequelize.sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_company_TBL.company_name'), 'company_name'],
                      [sequelize.sequelize.col('obstruction_model_relation_TBL->obs_relation_TBL->obs_model_TBL.model_name'), 'model_name']
                    ],
                    include: [
                      {
                        model: sequelize.ObsModelRelation,
                        attributes: [],
                        include: [
                          {
                            model: sequelize.ObsManhole,
                            attributes: []
                          },
                          {
                            model: sequelize.ObsRelation,
                            attributes: [],
                            include: [
                              {
                                model: sequelize.ObsCompany,
                                attributes: []
                              },
                              {
                                  model: sequelize.ObsModel,
                                  attributes: []
                              }
                            ]
                          }
                        ]
                      }
                    ],
                    where: {
                      fid: req.params.id
                    },
                    transaction: t
                  }).then(update_result => {
                    // update_result.dataValues.lat = update_result.dataValues.latlon.coordinates[0].toFixed(12);
                    // update_result.dataValues.lon = update_result.dataValues.latlon.coordinates[1].toFixed(12);
                    
                    var imgs = [];
                    var image = update_result.img.split(",");
                    image.map(data => {
                      var img = {};
                      img.img = data;
                      imgs.push(img);
                    });
                
                    update_result.dataValues.imgs = imgs;
                    update_result.dataValues.id = update_result.dataValues.fid;
                    update_result.dataValues.type = `${update_result.dataValues.type}`;
                
                    delete update_result.dataValues.img;
                    // update result return
                    obstruction_result = update_result
                  })
                })
              })
            });
          });
        })
        .then(() => {
          t.commit();
          res.send(obstruction_result);
        })
        .catch(err => {
          t.rollback();
          console.log(err);
          res.json(err);
        });
    });
  } catch (error) {
    console.log("error", error);
    res.send({"result": "fail" , "message": error.message});
  }
});

// manhole delete
router.delete("/:id", async (req, res, next) => {
  var transaction;
  try {
    transaction = await sequelize.sequelize.transaction();

    var areaOne = await sequelize.Job.findOne({
      where: {
          job_fid_prefix: {
          [Op.like]: req.params.id.substr(0, 12) + '%'
        }
      },
      transaction: transaction
    });

    await sequelize.Obstruction.destroy({
      where: {
        fid: req.params.id
      },
      transaction: transaction
    });

    await sequelize.ObsModelRelation.destroy({
      where: {
        fid: req.params.id
      },
      transaction: transaction
    });
    
    // modeling delete
    shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/hole/b3dm/high/${req.params.id}`)
    shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/hole/b3dm/low/${req.params.id}`)
    shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/hole/lod/${req.params.id}`)
    shelljs.exec(`sudo rm -rf /efs/dtx_model_web/tilesets/data/${areaOne.real_id.toLocaleUpperCase()}/hole/obj/${req.params.id}`)

    await transaction.commit();

    res.json({ data: "SUCCESS" });
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.log("error", error);
    res.json(error.message);
  }
});

module.exports = router;
