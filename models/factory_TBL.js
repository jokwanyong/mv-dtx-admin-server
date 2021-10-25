/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  const factory_TBL = sequelize.define('factory_TBL', {
    factory_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'factory_TBL',
    freezeTableName: true
  });

  // factory_TBL.associate = function(models) {
  //   factory_TBL.belongsTo(models.obs_model, { foreignKey: 'model_idx' });
  // }

  return factory_TBL;
};
