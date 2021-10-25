/* jshint indent: 2 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  const obs_caliber_TBL = sequelize.define('obs_caliber_TBL', {
    caliber_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    caliber_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    direction: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    model_idx: {
      type: DataTypes.STRING(11),
      allowNull: true,
      
    }
  }, {
    tableName: 'obs_caliber_TBL'
  });

  // obs_caliber.associate = function(models) {
  //   obs_caliber.belongsTo(models.obs_model, { foreignKey: 'model_idx' });
  // }

  return obs_caliber_TBL;
};
