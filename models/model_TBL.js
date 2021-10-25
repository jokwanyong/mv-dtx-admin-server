/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_TBL', {
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
      allowNull: false,
      references: {
        model: 'company_TBL',
        key: 'company_idx'
      }
    }
  }, {
    tableName: 'model_TBL',
    timestamps: false,
    freezeTableName: true
  });
};