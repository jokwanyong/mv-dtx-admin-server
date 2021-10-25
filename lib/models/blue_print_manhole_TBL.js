"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  var blue_print_manhole_TBL = sequelize.define('blue_print_manhole_TBL', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: false
    },
    zPre: {
      type: "DOUBLE",
      allowNull: false
    },
    zPost: {
      type: "DOUBLE",
      allowNull: false
    },
    nodeName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    diameter: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    holeSize: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    holeHeight: {
      type: "DOUBLE",
      allowNull: false
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
    tableName: 'blue_print_manhole_TBL',
    freezeTableName: true
  });

  blue_print_manhole_TBL.associate = function (models) {// associations can be defined here
    // blue_print_manhole_TBL.belongsTo(models.obs_company_TBL, { foreignKey: 'company_idx'})
  };

  return blue_print_manhole_TBL;
};