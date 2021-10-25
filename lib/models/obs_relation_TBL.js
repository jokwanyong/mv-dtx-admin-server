/* jshint indent: 2 */
'use strict';

module.exports = function (sequelize, DataTypes) {
  var obs_relation_TBL = sequelize.define('obs_relation_TBL', {
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    company_idx: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    model_idx: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    caliber_idx: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'obs_relation_TBL'
  });

  obs_relation_TBL.associate = function (models) {
    obs_relation_TBL.belongsTo(models.obs_company_TBL, {
      foreignKey: 'company_idx'
    });
    obs_relation_TBL.belongsTo(models.obs_model_TBL, {
      foreignKey: 'model_idx'
    });
    obs_relation_TBL.belongsTo(models.obs_caliber_TBL, {
      foreignKey: 'caliber_idx'
    });
  };

  return obs_relation_TBL;
};