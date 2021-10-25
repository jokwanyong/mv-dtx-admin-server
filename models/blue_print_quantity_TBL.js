/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  const blue_print_quantity_TBL = sequelize.define('blue_print_quantity_TBL', {
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    factory_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    pipe_type: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    diameter: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    distance: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'blue_print_quantity_TBL',
    freezeTableName: true
  });

  // blue_print_quantity_TBL.associate = function(models) {
  //   blue_print_quantity_TBL.belongsTo(models.obs_model, { foreignKey: 'model_idx' });
  // }

  return blue_print_quantity_TBL;
};
