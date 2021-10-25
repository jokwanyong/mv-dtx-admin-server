/* jshint indent: 2 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  const blue_print_valve_TBL = sequelize.define('blue_print_valve_TBL', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: true,
    },
    valveType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    }
  }, {
    tableName: 'blue_print_valve_TBL',
    freezeTableName: true
  });

  // blue_print_valve_TBL.associate = function(models) {
  //   blue_print_valve_TBL.belongsTo(models.obs_model, { foreignKey: 'model_idx' });
  // }

  return blue_print_valve_TBL;
};
