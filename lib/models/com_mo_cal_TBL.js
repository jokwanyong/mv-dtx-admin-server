"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('com_mo_cal_TBL', {
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    company_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'company_TBL',
        key: 'company_idx'
      }
    },
    model_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'model_TBL',
        key: 'model_idx'
      }
    }
  }, {
    tableName: 'com_mo_cal_TBL',
    timestamps: false,
    freezeTableName: true
  });
};