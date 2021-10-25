"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('area_design_TBL', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'area_TBL',
        key: 'area_id'
      }
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    min_latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: false
    },
    max_latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: false
    },
    imgs: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('create_date')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('update_date')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    tableName: 'area_design_TBL',
    freezeTableName: true
  });
};