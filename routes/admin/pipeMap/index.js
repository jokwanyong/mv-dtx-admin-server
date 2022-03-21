import express from 'express';
import _ from 'lodash';
import Config from '../../../util/config';
import sequelize from '../../../models';

import {
  busan_Rectangle_range,
  busan_Rectangle_WGS84,
} from '../../../util/latlonChanges';

const Op = sequelize.Op;
var router = express.Router();

// all map pipe get
router.get('', async (req, res, next) => {
  try {
    sequelize.Pipe.hasOne(sequelize.Axis, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.Curve, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.Smart, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.ModelRelation, { foreignKey: 'fid' });

    var sort =
      req.query._sort === undefined || null || 'id' ? 'fid' : req.query._sort;
    var order = req.query._order === undefined ? 'DESC' : req.query._order;
    var fid;
    if (req.query.q === 'test') {
      fid = 11419142;
    } else if (req.query.q === 'test01') {
      fid = 1141914201;
    } else {
      fid =
        req.query.q === undefined || null
          ? ''
          : Config.createEncoding(req.query.q);
    }

    var pipe_result = await sequelize.Pipe.findAll({
      attributes: [
        'fid',
        'latlon',
        'alt',
        'geo',
        'distance',
        'material',
        'line_num',
        'type',
        'pipe_type',
        'depth',
        ['depth', 'z'],
        ['depth', 'hole_top_depth'],
        'diameter',
        'remarks',
        'create_date',

        [sequelize.sequelize.col('axis_TBL.azimuth'), 'azimuth'],
        [sequelize.sequelize.col('axis_TBL.heading'), 'heading'],
        [sequelize.sequelize.col('axis_TBL.pitch'), 'pitch'],
        [sequelize.sequelize.col('axis_TBL.roll'), 'roll'],
        [sequelize.sequelize.col('curve_info_TBL.curve_deg'), 'curve_deg'],
        [
          sequelize.sequelize.col('curve_info_TBL.curve_latlon'),
          'curve_latlon',
        ],
        [sequelize.sequelize.col('curve_info_TBL.curve_pitch'), 'curve_pitch'],
        [sequelize.sequelize.col('smart_station_TBL.img'), 'img'],
        [
          sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'),
          'pipe_model',
        ],
      ],
      where: {
        [Op.and]: [
          {
            fid: {
              [Op.like]: '%' + fid + '%',
            },
          },
        ],
      },
      include: [
        {
          model: sequelize.Axis,
          attributes: [
            // 'azimuth',
            // 'heading',
            // 'pitch',
            // 'roll'
          ],
          nested: false,
          required: false,
        },
        {
          model: sequelize.Curve,
          attributes: [
            // 'curve_deg',
            // ['X(curve_latlon)', 'curve_lat'],
            // ['Y(curve_latlon)', 'curve_lon']
          ],
          required: false,
        },
        {
          model: sequelize.Smart,
          attributes: [
            // 'img'
          ],
          paranoid: false,
          required: false,
          nested: false,
        },
        {
          model: sequelize.ModelRelation,
          attributes: [],
        },
      ],
      order: [[sort, order]],
    });

    var real_ids = await sequelize.Job.findAndCountAll({
      raw: true,
    });

    _.map(pipe_result, (data, i) => {
      var imgs = [];
      var image =
        data.dataValues.img === null ? [] : data.dataValues.img.split(',');
      image.map((pipe) => {
        var img = {};
        img.img = pipe;
        imgs.push(img);
      });
      data.dataValues.imgs = imgs;

      var orthogonal = busan_Rectangle_range(
        data.dataValues.latlon.coordinates[1],
        data.dataValues.latlon.coordinates[0],
      );

      data.dataValues.x = orthogonal[1];
      data.dataValues.y = orthogonal[0];

      data.dataValues.lat = data.dataValues.latlon.coordinates[0].toFixed(12);
      data.dataValues.lon = data.dataValues.latlon.coordinates[1].toFixed(12);
      Config.pipe_option.map((op) => {
        if (data.dataValues.pipe_type === op.pipe_type) {
          data.dataValues.pipe_type = op.name;
        }
      });

      _.map(real_ids.rows, (job) => {
        if (data.fid.substr(0, 12) === job.job_fid_prefix) {
          data.dataValues.real_id = job.real_id;
        }
      });

      if (data.dataValues.curve_latlon !== null) {
        data.dataValues.curve_lat =
          data.dataValues.curve_latlon.coordinates[0].toFixed(12);
        data.dataValues.curve_lon =
          data.dataValues.curve_latlon.coordinates[1].toFixed(12);
      }
      delete data.dataValues.latlon;
      delete data.dataValues.curve_latlon;
    });

    const total = pipe_result.length;
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.setHeader('Content-Range', `0-5/${total}`);
    res.setHeader('X-Total-Count', `${total}`);

    res.send(pipe_result);
  } catch (error) {
    console.log(error);
    res.send({ result: 'fail', message: error.message });
  }
});

// all map pipe get one
router.get('/:id', async (req, res, next) => {
  try {
    sequelize.Pipe.hasOne(sequelize.Axis, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.Curve, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.Smart, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.ModelRelation, { foreignKey: 'fid' });

    var pipe_one = await sequelize.Pipe.findOne({
      attributes: [
        'fid',
        'latlon',
        'alt',
        'geo',
        'distance',
        'material',
        'line_num',
        'type',
        'pipe_type',
        'depth',
        ['depth', 'z'],
        ['depth', 'hole_top_depth'],
        'diameter',
        'remarks',
        'diameter',
        'create_date',

        [sequelize.sequelize.col('axis_TBL.azimuth'), 'azimuth'],
        [sequelize.sequelize.col('axis_TBL.heading'), 'heading'],
        [sequelize.sequelize.col('axis_TBL.pitch'), 'pitch'],
        [sequelize.sequelize.col('axis_TBL.roll'), 'roll'],
        [sequelize.sequelize.col('curve_info_TBL.curve_deg'), 'curve_deg'],
        [
          sequelize.sequelize.col('curve_info_TBL.curve_latlon'),
          'curve_latlon',
        ],
        [sequelize.sequelize.col('curve_info_TBL.curve_pitch'), 'curve_pitch'],
        [sequelize.sequelize.col('smart_station_TBL.img'), 'img'],
        [
          sequelize.sequelize.col('pipe_model_relation_TBL.pipe_model'),
          'pipe_model',
        ],
      ],

      include: [
        {
          model: sequelize.Axis,
          attributes: [
            // 'azimuth',
            // 'heading',
            // 'pitch',
            // 'roll'
          ],
          nested: false,
          required: false,
        },
        {
          model: sequelize.Curve,
          attributes: [
            // 'curve_deg',
            // ['X(curve_latlon)', 'curve_lat'],
            // ['Y(curve_latlon)', 'curve_lon']
          ],
          required: false,
        },
        {
          model: sequelize.Smart,
          attributes: [
            // 'img'
          ],
          paranoid: false,
          required: false,
          nested: false,
        },
        {
          model: sequelize.ModelRelation,
          attributes: [],
        },
      ],
      where: {
        fid: req.params.id,
      },
    });

    var imgs = [];
    var image = pipe_one.dataValues.img.split(',');
    image.map((data) => {
      var img = {};
      img.img = data;
      imgs.push(img);
    });

    pipe_one.dataValues.imgs = imgs;

    var orthogonal = busan_Rectangle_range(
      pipe_one.dataValues.latlon.coordinates[1],
      pipe_one.dataValues.latlon.coordinates[0],
    );

    pipe_one.dataValues.x = orthogonal[1];
    pipe_one.dataValues.y = orthogonal[0];

    Config.pipe_option.map((op) => {
      if (pipe_one.dataValues.pipe_type === op.pipe_type) {
        pipe_one.dataValues.pipe_type = op.name;
      }
    });

    pipe_one.dataValues.id = pipe_one.dataValues.fid;
    pipe_one.dataValues.lat =
      pipe_one.dataValues.latlon.coordinates[0].toFixed(12);
    pipe_one.dataValues.lon =
      pipe_one.dataValues.latlon.coordinates[1].toFixed(12);
    pipe_one.dataValues.curve_lon =
      pipe_one.dataValues.curve_latlon.coordinates[0].toFixed(12);
    pipe_one.dataValues.curve_lon =
      pipe_one.dataValues.curve_latlon.coordinates[1].toFixed(12);

    delete pipe_one.dataValues.latlon;
    delete pipe_one.dataValues.curve_latlon;

    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.setHeader('Content-Range', `0-5/${1}`);
    res.setHeader('X-Total-Count', `${1}`);

    res.send(pipe_one);
  } catch (error) {
    console.log('error', error);
    res.send({ result: 'fail', message: error.message });
  }
});

// pipe create 는 nodeServer
router.post('', (req, res, next) => {
  res.send('ERR');
});

// pipe Map 에서는 수정 안함.
router.put('/:id', (req, res, next) => {
  try {
    //   var point = { type: 'Point', coordinates: [req.body.lat, req.body.lon] };

    let x = req.body.x;
    let y = req.body.y;

    let wgs84 = busan_Rectangle_WGS84(y, x);
    let point = { type: 'Point', coordinates: [wgs84[1], wgs84[0]] };

    var curve_point = {
      type: 'Point',
      coordinates: [req.body.curve_lat, req.body.curve_lon],
    };

    sequelize.Pipe.hasOne(sequelize.Axis, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.Curve, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.Smart, { foreignKey: 'fid' });
    sequelize.Pipe.hasOne(sequelize.ModelRelation, { foreignKey: 'fid' });

    var pipe_one;

    // pipe, axis, curve update
    return sequelize.sequelize.transaction().then((t) => {
      return sequelize.Pipe.update(
        {
          alt: req.body.alt,
          material: req.body.material,
          type: req.body.type,
          depth: req.body.depth,
          diameter: req.body.diameter,
          x: req.body.x,
          y: req.body.y,
          latlon: point,
          geo: req.body.geo,
          distance: req.body.distance,
          line_num: req.body.line_num,
          remarks: req.body.remarks,
          create_date: req.body.create_date,
          measure_date: req.body.measure_date,
        },
        {
          where: {
            fid: req.params.id,
          },
        },
        { transaction: t },
      )
        .then((pipeUpdate) => {
          return sequelize.Axis.update(
            {
              azimuth: req.body.azimuth,
              heading: req.body.heading,
              pitch: req.body.pitch,
              roll: req.body.roll,
            },
            {
              where: {
                fid: req.params.id,
              },
            },
            { transaction: t },
          ).then((axisUpdate) => {
            return sequelize.Curve.update(
              {
                curve_deg: req.body.curve_deg,
                curve_latlon: curve_point,
                curve_pitch: req.body.curve_pitch,
              },
              {
                where: {
                  fid: req.params.id,
                },
              },
              { transaction: t },
            ).then((updateCurve) => {
              return sequelize.ModelRelation.update(
                {
                  pipe_model: req.body.pipe_model,
                },
                {
                  where: {
                    fid: req.params.id,
                  },
                },
                { transaction: t },
              ).then((updateModel) => {
                return sequelize.Pipe.findOne(
                  {
                    attributes: [
                      'fid',
                      'latlon',
                      'alt',
                      'geo',
                      'distance',
                      'material',
                      'line_num',
                      'type',
                      'depth',
                      ['de[th', 'z'],
                      ['de[th', 'hole_top_depth'],
                      'x',
                      'y',
                      'diameter',
                      'remarks',
                      'create_date',

                      [sequelize.sequelize.col('axis_TBL.azimuth'), 'azimuth'],
                      [sequelize.sequelize.col('axis_TBL.heading'), 'heading'],
                      [sequelize.sequelize.col('axis_TBL.pitch'), 'pitch'],
                      [sequelize.sequelize.col('axis_TBL.roll'), 'roll'],
                      [
                        sequelize.sequelize.col('curve_info_TBL.curve_deg'),
                        'curve_deg',
                      ],
                      [
                        sequelize.sequelize.col('curve_info_TBL.curve_latlon'),
                        'curve_latlon',
                      ],
                      [sequelize.sequelize.col('smart_station_TBL.img'), 'img'],
                      [
                        sequelize.sequelize.col(
                          'pipe_model_relation_TBL.pipe_model',
                        ),
                        'pipe_model',
                      ],
                    ],

                    include: [
                      {
                        model: sequelize.Axis,
                        attributes: [
                          // 'azimuth',
                          // 'heading',
                          // 'pitch',
                          // 'roll'
                        ],
                        nested: false,
                        required: false,
                      },
                      {
                        model: sequelize.Curve,
                        attributes: [
                          // 'curve_deg',
                          // ['X(curve_latlon)', 'curve_lat'],
                          // ['Y(curve_latlon)', 'curve_lon']
                        ],
                        required: false,
                      },
                      {
                        model: sequelize.Smart,
                        attributes: [
                          // 'img'
                        ],
                        paranoid: false,
                        required: false,
                        nested: false,
                      },
                      {
                        model: sequelize.ModelRelation,
                        attributes: [],
                      },
                    ],
                    where: {
                      fid: req.params.id,
                    },
                  },
                  { transaction: t },
                ).then((pipeOne) => {
                  var imgs = [];
                  var image = pipeOne.dataValues.img.split(',');
                  image.map((data) => {
                    var img = {};
                    img.img = data;
                    imgs.push(img);
                  });

                  pipeOne.dataValues.imgs = imgs;

                  pipeOne.dataValues.id = pipeOne.dataValues.fid;
                  pipeOne.dataValues.lat =
                    pipeOne.dataValues.latlon.coordinates[0].toFixed(12);
                  pipeOne.dataValues.lon =
                    pipeOne.dataValues.latlon.coordinates[1].toFixed(12);
                  pipeOne.dataValues.curve_lon =
                    pipeOne.dataValues.curve_latlon.coordinates[0].toFixed(12);
                  pipeOne.dataValues.curve_lon =
                    pipeOne.dataValues.curve_latlon.coordinates[1].toFixed(12);

                  delete pipeOne.dataValues.latlon;
                  delete pipeOne.dataValues.curve_latlon;

                  return (pipe_one = pipeOne);
                });
              });
            });
          });
        })
        .then(() => {
          t.commit();
          res.send(pipe_one);
        })
        .catch((err) => {
          t.rollback();
          console.log(err);
          res.send(err);
        });
    });
  } catch (error) {
    console.log(error);
    res.send({ result: 'fail', message: error.message });
  }
});

// pipe Map 에서는 삭제 안함.
router.delete('/:id', (req, res, next) => {
  // pipe, axis, curve delete
  try {
    return sequelize.sequelize.transaction().then((t) => {
      return sequelize.Pipe.destroy({
        where: {
          fid: req.params.id,
        },
        transaction: t,
      })
        .then((dePi) => {
          return sequelize.Axis.destroy({
            where: {
              fid: req.params.id,
            },
            transaction: t,
          }).then((deAx) => {
            return sequelize.Curve.destroy({
              where: {
                fid: req.params.id,
              },
              transaction: t,
            }).then((deCurve) => {
              return;
            });
          });
        })
        .then(() => {
          t.commit();
          res.send('SUCCESS');
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    });
  } catch (error) {
    console.log(error);
    res.send({ result: 'fail', message: error.message });
  }
});

module.exports = router;
