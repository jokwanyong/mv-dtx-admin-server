/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('material_TBL', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      abbreviation: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      full_name: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
    }, {
      tableName: 'material_TBL',
      timestamps: false,
      freezeTableName: true
    });
  };
  