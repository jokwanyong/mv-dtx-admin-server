"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('smart_station_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: false
    },
    alt: {
      type: "DOUBLE",
      allowNull: false
    },
    geo: {
      type: "DOUBLE",
      allowNull: false
    },
    vdop: {
      type: "DOUBLE",
      allowNull: true
    },
    hdop: {
      type: "DOUBLE",
      allowNull: true
    },
    depth: {
      type: "DOUBLE",
      allowNull: false
    },
    fix: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: true
    },
    joint_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    line_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    diameter: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pipe_type: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
    },
    code: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false
    },
    curve_degree: {
      type: "DOUBLE",
      defaultValue: 0.0
    },
    instrument_height: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
    },
    material: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    qid: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: ''
    },
    data_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    facility_type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    facility_type_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    facility_type_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    facility_usage: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    facility_usage_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    facility_depth: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    measure_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('measure_date')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    tableName: 'smart_station_TBL',
    timestamps: false,
    freezeTableName: true
  });
};