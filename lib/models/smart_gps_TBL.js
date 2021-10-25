"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('smart_gps_TBL', {
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    device_id: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false
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
    fix: {
      type: DataTypes.INTEGER(2).UNSIGNED,
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'smart_gps_TBL',
    timestamps: false,
    freezeTableName: true
  });
};