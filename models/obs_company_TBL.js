/* jshint indent: 2 */
'use strict';

var obs_model = require('./obs_model_TBL');

module.exports = function(sequelize, DataTypes) {
  var obs_company_TBL = sequelize.define('obs_company_TBL', {
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
    tableName: 'obs_company_TBL'
  });

  obs_company_TBL.associate = function(models) {
    obs_company_TBL.hasMany(models.obs_company_TBL, { foreignKey: 'company_idx'})
  };

  return obs_company_TBL;
};
