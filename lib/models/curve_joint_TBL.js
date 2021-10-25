"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('curve_joint_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    azimuth: {
      type: "DOUBLE",
      allowNull: false
    },
    pitch: {
      type: "DOUBLE",
      allowNull: false
    },
    garbage: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'curve_joint_TBL',
    timestamps: false,
    freezeTableName: true
  });
};