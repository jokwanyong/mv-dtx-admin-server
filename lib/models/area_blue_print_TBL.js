"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  var area_blue_print_TBL = sequelize.define('area_blue_print_TBL', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    area_fid_prefix: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    crossPoint: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    missingNode: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    missingValve: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    startPoint: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    endPoint: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    diameter: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    caliber: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    tableName: 'area_blue_print_TBL',
    freezeTableName: true
  });

  area_blue_print_TBL.associate = function (models) {// associations can be defined here
    // area_blue_print_TBL.belongsTo(models.obs_company_TBL, { foreignKey: 'company_idx'})
  };

  return area_blue_print_TBL;
};