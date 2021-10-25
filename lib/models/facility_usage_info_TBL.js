"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('facility_usage_info_TBL', {
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'facility_usage_info_TBL',
    timestamps: false,
    freezeTableName: true
  });
};