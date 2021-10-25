"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('admin_TBL', {
    user_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    user_pw: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    login_ip: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    login_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'admin_TBL',
    timestamps: false,
    freezeTableName: true
  });
};