/* jshint indent: 2 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  const obs_model_TBL = sequelize.define('obs_model_TBL', {
    model_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    model_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    company_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      
    }
  }, {
    tableName: 'obs_model_TBL'
  });

  obs_model_TBL.associate = function(models) {
    obs_model_TBL.hasMany(models.obs_caliber_TBL, {foreignKey: 'model_idx'});
    // obs_model.belongsTo(models.obs_company, { foreignKey: 'company_idx'});
  };

  return obs_model_TBL;
};
