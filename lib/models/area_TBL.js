"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

var _job_TBL = _interopRequireDefault(require("./job_TBL"));

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  var area_TBL = sequelize.define('area_TBL', {
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    area_fid_prefix: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    total_length: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    job_id: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: ''
    },
    job_rid: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ''
    },
    job_fid_prefix: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ''
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('start_date')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('end_date')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    builder: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    construction: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    distance_limit: {
      type: "DOUBLE",
      allowNull: true
    },
    degree_to: {
      type: "DOUBLE",
      allowNull: true
    },
    degree_from: {
      type: "DOUBLE",
      allowNull: true
    },
    short_pipe: {
      type: "DOUBLE",
      allowNull: true
    },
    unit: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    curve_type: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    curve_extend: {
      type: "DOUBLE",
      allowNull: true
    },
    area_type: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    default_alt: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('create_date')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    aerial_photo: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    coordinates: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    order: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'area_TBL',
    timestamps: false,
    freezeTableName: true
  });

  area_TBL.associate = function (models) {// associations can be defined here
  };

  return area_TBL;
};