"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('axis_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'smart_station_TBL',
        key: 'fid'
      }
    },
    azimuth: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    heading: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    pitch: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    roll: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    garbage: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'axis_TBL',
    timestamps: false,
    freezeTableName: true
  });
};