"use strict";

/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('login_TBL', {
    idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    job_id: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    os_type: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    os_type_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    os_version: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    model: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    device: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    device_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    app_version: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    login_ip: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    login_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'login_TBL',
    freezeTableName: true
  });
};