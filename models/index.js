'use strict';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config/config.json';

// 'development'
// 'production'

const basename = path.basename(__filename);
// const env = process.platform === 'linux' ? 'production' : 'development';// const env = process.env.NODE_ENV;
var env = 'development';
const db = {};

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env],
);

fs.readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf('.') !== 0 && file !== 'index.js';
  })
  .forEach(function (file) {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
    // var model = sequelize.import(path.join(__dirname, file));
    // db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

db.Admin = require('./admin_TBL')(sequelize, Sequelize);

// area
db.Area = require('./area_TBL')(sequelize, Sequelize);
db.Area_Design = require('./area_design_TBL')(sequelize, Sequelize);
db.AreaProgress = require('./area_progress_TBL')(sequelize, Sequelize);
db.Area_Data = require('./area_design_data_TBL')(sequelize, Sequelize);

db.Smart = require('./smart_station_TBL')(sequelize, Sequelize);

db.SmartGps = require('./smart_gps_TBL')(sequelize, Sequelize);

db.Pipe = require('./pipe_TBL')(sequelize, Sequelize);
db.Axis = require('./axis_TBL')(sequelize, Sequelize);
db.Curve = require('./curve_info_TBL')(sequelize, Sequelize);
db.CurveJoint = require('./curve_joint_TBL')(sequelize, Sequelize);

db.ModelRelation = require('./pipe_model_relation_TBL')(sequelize, Sequelize);

db.ComMoCal = require('./com_mo_cal_TBL')(sequelize, Sequelize);
db.Company = require('./company_TBL')(sequelize, Sequelize);
db.Model = require('./model_TBL')(sequelize, Sequelize);

// obstruction
db.Obstruction = require('./obstruction_TBL')(sequelize, Sequelize);
db.Obstruction_Type = require('./obstruction_type_TBL')(sequelize, Sequelize);

// 종류들
db.Material = require('./material_TBL')(sequelize, Sequelize);
db.CurveType = require('./curve_type_TBL')(sequelize, Sequelize);
db.Category = require('./pipe_category_TBL')(sequelize, Sequelize);

// JOB
db.Job = require('./job_TBL')(sequelize, Sequelize);
db.JobToken = require('./job_token_TBL')(sequelize, Sequelize);
db.JobLog = require('./job_log_TBL')(sequelize, Sequelize);

// log
db.GpsLog = require('./gps_log_TBL')(sequelize, Sequelize);
db.LogIn = require('./login_TBL')(sequelize, Sequelize);
db.LogInLog = require('./login_log_TBL')(sequelize, Sequelize);

// obstruction model
db.ObsModelRelation = require('./obstruction_model_relation_TBL')(
  sequelize,
  Sequelize,
);
db.ObsManhole = require('./obstruction_manhole_model_TBL')(
  sequelize,
  Sequelize,
);

db.ObsRelation = require('./obs_relation_TBL')(sequelize, Sequelize);
db.ObsCompany = require('./obs_company_TBL')(sequelize, Sequelize);
db.ObsModel = require('./obs_model_TBL')(sequelize, Sequelize);
db.ObsCaliber = require('./obs_caliber_TBL')(sequelize, Sequelize);

// blueprint
db.AreaBluePoint = require('./area_blue_print_TBL')(sequelize, Sequelize);
db.BluePointCrossPoint = require('./blue_print_crossPoint_TBL')(
  sequelize,
  Sequelize,
);
db.BluePointEndValue = require('./blue_print_endValue_TBL')(
  sequelize,
  Sequelize,
);
db.BluePointMissingNode = require('./blue_print_missingNode_TBL')(
  sequelize,
  Sequelize,
);
db.BluePointMissingValue = require('./blue_print_missingValue_TBL')(
  sequelize,
  Sequelize,
);
db.BluePointStartValue = require('./blue_print_startValue_TBL')(
  sequelize,
  Sequelize,
);
db.BluePointManhole = require('./blue_print_manhole_TBL')(sequelize, Sequelize);
db.BluePointQuantity = require('./blue_print_quantity_TBL')(
  sequelize,
  Sequelize,
);
db.BluePointCertification = require('./blue_print_certification_TBL')(
  sequelize,
  Sequelize,
);

db.Survey = require('./survey_TBL')(sequelize, Sequelize);

// 미시공사유
db.Journal = require('./journal_TBL')(sequelize, Sequelize);

// valve
db.Valve = require('./blue_print_valve_TBL')(sequelize, Sequelize);

// qr
db.QrCode = require('./qr_code_TBL')(sequelize, Sequelize);
db.Factory = require('./factory_TBL')(sequelize, Sequelize);

// facility
db.Facility = require('./facility_TBL')(sequelize, Sequelize);
db.FacilityRelation = require('./facility_model_relation_TBL')(
  sequelize,
  Sequelize,
);

// facility info table
db.FacilityFormInfo = require('./facility_form_info_TBL')(sequelize, Sequelize);
db.FacilityTypeInfo = require('./facility_type_info_TBL')(sequelize, Sequelize);
db.FacilityUsageInfo = require('./facility_usage_info_TBL')(
  sequelize,
  Sequelize,
);
db.FacilityVersionInfo = require('./facility_info_version_TBL')(
  sequelize,
  Sequelize,
);

// app version
db.MobileVersion = require('./mobile_version_TBL')(sequelize, Sequelize);

// relation

db.Area.hasMany(db.Area_Design, { foreignKey: 'area_id' });
db.Area_Design.belongsTo(db.Area, { foreignKey: 'area_id' });
db.Area.hasMany(db.AreaProgress, { foreignKey: 'area_id' });
db.AreaProgress.belongsTo(db.Area, { foreignKey: 'area_id' });
db.Area.hasMany(db.Area_Data, { foreignKey: 'area_id' });
db.Area_Data.belongsTo(db.Area, { foreignKey: 'area_id' });

db.BluePointStartValue.hasOne(
  db.AreaBluePoint,
  { foreignKey: 'startPoint' },
  { onDelete: 'cascade' },
);
db.BluePointEndValue.hasOne(
  db.AreaBluePoint,
  { foreignKey: 'endPoint' },
  { onDelete: 'cascade' },
);
db.BluePointCrossPoint.hasOne(
  db.AreaBluePoint,
  { foreignKey: 'crossPoint' },
  { onDelete: 'cascade' },
);
db.BluePointMissingNode.hasOne(
  db.AreaBluePoint,
  { foreignKey: 'missingNode' },
  { onDelete: 'cascade' },
);
db.BluePointMissingValue.hasOne(
  db.AreaBluePoint,
  { foreignKey: 'missingValve' },
  { onDelete: 'cascade' },
);

db.BluePointStartValue.hasMany(
  db.Valve,
  { foreignKey: 'idStartValve' },
  { onDelete: 'cascade' },
);
db.Valve.belongsTo(
  db.BluePointStartValue,
  { foreignKey: 'idStartValve' },
  { onDelete: 'cascade' },
);

db.BluePointEndValue.hasMany(
  db.Valve,
  { foreignKey: 'idEndValve' },
  { onDelete: 'cascade' },
);
db.Valve.belongsTo(
  db.BluePointEndValue,
  { foreignKey: 'idEndValve' },
  { onDelete: 'cascade' },
);

db.BluePointCrossPoint.hasMany(
  db.Valve,
  { foreignKey: 'idCross' },
  { onDelete: 'cascade' },
);
db.Valve.belongsTo(
  db.BluePointCrossPoint,
  { foreignKey: 'idCross' },
  { onDelete: 'cascade' },
);

db.BluePointMissingNode.hasMany(
  db.Valve,
  { foreignKey: 'idMissNode' },
  { onDelete: 'cascade' },
);
db.Valve.belongsTo(
  db.BluePointMissingNode,
  { foreignKey: 'idMissNode' },
  { onDelete: 'cascade' },
);

db.BluePointMissingValue.hasMany(
  db.Valve,
  { foreignKey: 'idMissValue' },
  { onDelete: 'cascade' },
);
db.Valve.belongsTo(
  db.BluePointMissingValue,
  { foreignKey: 'idMissValue' },
  { onDelete: 'cascade' },
);

// sequelize.sync();
module.exports = db;
