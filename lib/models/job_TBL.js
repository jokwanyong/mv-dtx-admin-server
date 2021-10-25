"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('job_TBL', {
    job_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ''
    },
    real_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ''
    },
    job_fid_prefix: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ''
    },
    pipe_type: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ''
    },
    smart_model_relation: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ''
    },
    pipe_model_relation: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ''
    },
    material: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ''
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
    curve_extend: {
      type: "DOUBLE",
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    admin: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    construct_detail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '0'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    tableName: 'job_TBL',
    freezeTableName: true
  });
};