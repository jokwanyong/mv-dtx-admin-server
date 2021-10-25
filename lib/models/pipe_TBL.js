"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('pipe_TBL', {
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
    distance: {
      type: "DOUBLE",
      allowNull: false
    },
    material: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    line_num: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    depth: {
      type: "DOUBLE",
      allowNull: false
    },
    pipe_type: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
    },
    diameter: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    remarks: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    instrument_height: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('create_date')).format('YYYY-MM-DD HH:mm:ss');
      }
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
    tableName: 'pipe_TBL',
    timestamps: false,
    freezeTableName: true
  });
};