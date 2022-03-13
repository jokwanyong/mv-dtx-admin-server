'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _fs = _interopRequireDefault(require('fs'));

var _path = _interopRequireDefault(require('path'));

var _sequelize = _interopRequireDefault(require('sequelize'));

var _config = _interopRequireDefault(require('../config/config.json'));

// 'development'
// 'production'
var basename = _path['default'].basename(__filename);

// var env = process.platform === 'linux' ? 'production' : 'development'; // const env = process.env.NODE_ENV;
var env = 'development';

var db = {};
var sequelize = new _sequelize['default'](
  _config['default'][env].database,
  _config['default'][env].username,
  _config['default'][env].password,
  _config['default'][env],
);

_fs['default']
  .readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf('.') !== 0 && file !== 'index.js';
  })
  .forEach(function (file) {
    var model = require(_path['default'].join(__dirname, file))(
      sequelize,
      _sequelize['default'].DataTypes,
    );

    db[model.name] = model; // var model = sequelize.import(path.join(__dirname, file));
    // db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = _sequelize['default'];
db.Op = _sequelize['default'].Op;
db.Admin = require('./admin_TBL')(sequelize, _sequelize['default']); // area

db.Area = require('./area_TBL')(sequelize, _sequelize['default']);
db.Area_Design = require('./area_design_TBL')(sequelize, _sequelize['default']);
db.AreaProgress = require('./area_progress_TBL')(
  sequelize,
  _sequelize['default'],
);
db.Area_Data = require('./area_design_data_TBL')(
  sequelize,
  _sequelize['default'],
);
db.Smart = require('./smart_station_TBL')(sequelize, _sequelize['default']);
db.SmartGps = require('./smart_gps_TBL')(sequelize, _sequelize['default']);
db.Pipe = require('./pipe_TBL')(sequelize, _sequelize['default']);
db.Axis = require('./axis_TBL')(sequelize, _sequelize['default']);
db.Curve = require('./curve_info_TBL')(sequelize, _sequelize['default']);
db.CurveJoint = require('./curve_joint_TBL')(sequelize, _sequelize['default']);
db.ModelRelation = require('./pipe_model_relation_TBL')(
  sequelize,
  _sequelize['default'],
);
db.ComMoCal = require('./com_mo_cal_TBL')(sequelize, _sequelize['default']);
db.Company = require('./company_TBL')(sequelize, _sequelize['default']);
db.Model = require('./model_TBL')(sequelize, _sequelize['default']); // obstruction

db.Obstruction = require('./obstruction_TBL')(sequelize, _sequelize['default']);
db.Obstruction_Type = require('./obstruction_type_TBL')(
  sequelize,
  _sequelize['default'],
); // 종류들

db.Material = require('./material_TBL')(sequelize, _sequelize['default']);
db.CurveType = require('./curve_type_TBL')(sequelize, _sequelize['default']);
db.Category = require('./pipe_category_TBL')(sequelize, _sequelize['default']); // JOB

db.Job = require('./job_TBL')(sequelize, _sequelize['default']);
db.JobToken = require('./job_token_TBL')(sequelize, _sequelize['default']);
db.JobLog = require('./job_log_TBL')(sequelize, _sequelize['default']); // log

db.GpsLog = require('./gps_log_TBL')(sequelize, _sequelize['default']);
db.LogIn = require('./login_TBL')(sequelize, _sequelize['default']);
db.LogInLog = require('./login_log_TBL')(sequelize, _sequelize['default']); // obstruction model

db.ObsModelRelation = require('./obstruction_model_relation_TBL')(
  sequelize,
  _sequelize['default'],
);
db.ObsManhole = require('./obstruction_manhole_model_TBL')(
  sequelize,
  _sequelize['default'],
);
db.ObsRelation = require('./obs_relation_TBL')(
  sequelize,
  _sequelize['default'],
);
db.ObsCompany = require('./obs_company_TBL')(sequelize, _sequelize['default']);
db.ObsModel = require('./obs_model_TBL')(sequelize, _sequelize['default']);
db.ObsCaliber = require('./obs_caliber_TBL')(sequelize, _sequelize['default']); // blueprint

db.AreaBluePoint = require('./area_blue_print_TBL')(
  sequelize,
  _sequelize['default'],
);
db.BluePointCrossPoint = require('./blue_print_crossPoint_TBL')(
  sequelize,
  _sequelize['default'],
);
db.BluePointEndValue = require('./blue_print_endValue_TBL')(
  sequelize,
  _sequelize['default'],
);
db.BluePointMissingNode = require('./blue_print_missingNode_TBL')(
  sequelize,
  _sequelize['default'],
);
db.BluePointMissingValue = require('./blue_print_missingValue_TBL')(
  sequelize,
  _sequelize['default'],
);
db.BluePointStartValue = require('./blue_print_startValue_TBL')(
  sequelize,
  _sequelize['default'],
);
db.BluePointManhole = require('./blue_print_manhole_TBL')(
  sequelize,
  _sequelize['default'],
);
db.BluePointQuantity = require('./blue_print_quantity_TBL')(
  sequelize,
  _sequelize['default'],
);
db.BluePointCertification = require('./blue_print_certification_TBL')(
  sequelize,
  _sequelize['default'],
);
db.Survey = require('./survey_TBL')(sequelize, _sequelize['default']); // 미시공사유

db.Journal = require('./journal_TBL')(sequelize, _sequelize['default']); // valve

db.Valve = require('./blue_print_valve_TBL')(sequelize, _sequelize['default']); // qr

db.QrCode = require('./qr_code_TBL')(sequelize, _sequelize['default']);
db.Factory = require('./factory_TBL')(sequelize, _sequelize['default']); // facility

db.Facility = require('./facility_TBL')(sequelize, _sequelize['default']);
db.FacilityRelation = require('./facility_model_relation_TBL')(
  sequelize,
  _sequelize['default'],
); // facility info table

db.FacilityFormInfo = require('./facility_form_info_TBL')(
  sequelize,
  _sequelize['default'],
);
db.FacilityTypeInfo = require('./facility_type_info_TBL')(
  sequelize,
  _sequelize['default'],
);
db.FacilityUsageInfo = require('./facility_usage_info_TBL')(
  sequelize,
  _sequelize['default'],
);
db.FacilityVersionInfo = require('./facility_info_version_TBL')(
  sequelize,
  _sequelize['default'],
); // app version

db.MobileVersion = require('./mobile_version_TBL')(
  sequelize,
  _sequelize['default'],
); // relation

db.Area.hasMany(db.Area_Design, {
  foreignKey: 'area_id',
});
db.Area_Design.belongsTo(db.Area, {
  foreignKey: 'area_id',
});
db.Area.hasMany(db.AreaProgress, {
  foreignKey: 'area_id',
});
db.AreaProgress.belongsTo(db.Area, {
  foreignKey: 'area_id',
});
db.Area.hasMany(db.Area_Data, {
  foreignKey: 'area_id',
});
db.Area_Data.belongsTo(db.Area, {
  foreignKey: 'area_id',
});
db.BluePointStartValue.hasOne(
  db.AreaBluePoint,
  {
    foreignKey: 'startPoint',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointEndValue.hasOne(
  db.AreaBluePoint,
  {
    foreignKey: 'endPoint',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointCrossPoint.hasOne(
  db.AreaBluePoint,
  {
    foreignKey: 'crossPoint',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointMissingNode.hasOne(
  db.AreaBluePoint,
  {
    foreignKey: 'missingNode',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointMissingValue.hasOne(
  db.AreaBluePoint,
  {
    foreignKey: 'missingValve',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointStartValue.hasMany(
  db.Valve,
  {
    foreignKey: 'idStartValve',
  },
  {
    onDelete: 'cascade',
  },
);
db.Valve.belongsTo(
  db.BluePointStartValue,
  {
    foreignKey: 'idStartValve',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointEndValue.hasMany(
  db.Valve,
  {
    foreignKey: 'idEndValve',
  },
  {
    onDelete: 'cascade',
  },
);
db.Valve.belongsTo(
  db.BluePointEndValue,
  {
    foreignKey: 'idEndValve',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointCrossPoint.hasMany(
  db.Valve,
  {
    foreignKey: 'idCross',
  },
  {
    onDelete: 'cascade',
  },
);
db.Valve.belongsTo(
  db.BluePointCrossPoint,
  {
    foreignKey: 'idCross',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointMissingNode.hasMany(
  db.Valve,
  {
    foreignKey: 'idMissNode',
  },
  {
    onDelete: 'cascade',
  },
);
db.Valve.belongsTo(
  db.BluePointMissingNode,
  {
    foreignKey: 'idMissNode',
  },
  {
    onDelete: 'cascade',
  },
);
db.BluePointMissingValue.hasMany(
  db.Valve,
  {
    foreignKey: 'idMissValue',
  },
  {
    onDelete: 'cascade',
  },
);
db.Valve.belongsTo(
  db.BluePointMissingValue,
  {
    foreignKey: 'idMissValue',
  },
  {
    onDelete: 'cascade',
  },
); // sequelize.sync();

module.exports = db;
