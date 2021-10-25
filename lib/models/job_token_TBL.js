"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('job_token_TBL', {
    job_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    flag: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function get() {
        return (0, _moment["default"])(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    tableName: 'job_token_TBL',
    freezeTableName: true
  });
};