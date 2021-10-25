/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('obstruction_model_relation_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    code_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    manhole_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    smart_model: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    pipe_model: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  }, {
    tableName: 'obstruction_model_relation_TBL',
    timestamps: false,
    freezeTableName: true
  });
};
