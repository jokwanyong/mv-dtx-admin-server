"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('curve_info_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    curve_deg: {
      type: "DOUBLE",
      allowNull: false
    },
    curve_latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: false
    },
    curve_pitch: {
      type: "DOUBLE",
      allowNull: false
    },
    curve_depth: {
      type: "DOUBLE",
      allowNull: false
    },
    garbage: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'curve_info_TBL',
    timestamps: false,
    freezeTableName: true
  });
};