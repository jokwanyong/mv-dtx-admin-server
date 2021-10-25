"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('pipe_model_relation_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    smart_model: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pipe_model: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'pipe_model_relation_TBL',
    timestamps: false,
    freezeTableName: true
  });
};