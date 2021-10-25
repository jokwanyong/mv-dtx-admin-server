'use strict';
module.exports = (sequelize, DataTypes) => {
  const job_log_TBL = sequelize.define('job_log_TBL', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    job_id: {
      type:DataTypes.STRING(45),
      allowNull: false,
    },
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    job_fid_prefix: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    real_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, 
  {
    tableName: 'job_log_TBL',
    freezeTableName: true
  });
  job_log_TBL.associate = function(models) {
    // associations can be defined here
  };
  return job_log_TBL;
};