"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('company_TBL', {
    company_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'company_TBL',
    timestamps: false,
    freezeTableName: true
  });
};