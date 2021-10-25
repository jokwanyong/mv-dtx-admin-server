"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  var blue_print_missingNode_TBL = sequelize.define('blue_print_missingNode_TBL', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
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
      type: DataTypes.STRING(45),
      allowNull: false
    },
    nodeType: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    nodeName: {
      type: DataTypes.STRING(45),
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
    tableName: 'blue_print_missingNode_TBL',
    freezeTableName: true
  });

  blue_print_missingNode_TBL.associate = function (models) {// associations can be defined here
  };

  return blue_print_missingNode_TBL;
};