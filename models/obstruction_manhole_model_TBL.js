/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('obstruction_manhole_model_TBL', {
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, 
      references: {
        model: 'obstruction_model_relation_TBL',
        key: 'manhole_idx'
      }
    },
    width: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    diameter: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
    },
  }, {
    tableName: 'obstruction_manhole_model_TBL',
    timestamps: false,
    freezeTableName: true
  });
};
