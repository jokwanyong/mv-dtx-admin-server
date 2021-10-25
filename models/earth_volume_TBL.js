/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('earth_volume_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'smart_station_TBL',
        key: 'fid'
      }
    },
    volume: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'earth_volume_TBL',
    timestamps: false,
    freezeTableName: true
  });
};
