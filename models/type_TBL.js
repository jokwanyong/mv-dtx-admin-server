/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('type_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false
    },
    curve_deg: {
      type: "DOUBLE",
      allowNull: false
    }
  }, {
    tableName: 'type_TBL',
    timestamps: false,
    freezeTableName: true
  });
};
