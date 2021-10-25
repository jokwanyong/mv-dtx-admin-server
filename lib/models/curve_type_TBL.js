"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('curve_type_TBL', {
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    curve_degree: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'curve_type_TBL',
    timestamps: false,
    freezeTableName: true
  });
};