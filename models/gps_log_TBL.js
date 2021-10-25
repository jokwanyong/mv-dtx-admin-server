/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gps_log_TBL', {
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    device_id: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    job_id: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: false
    },
    code: {
      type: DataTypes.INTEGER(1), 
      allowNull: false
    },
    alt: {
      type: "DOUBLE", 
      allowNull: false
    },
    geo: {
      type: "DOUBLE", 
      allowNull: false
    },
    material: {
      type: DataTypes.INTEGER(1), 
      allowNull: false
    },
    diameter: {
      type: DataTypes.INTEGER(4), 
      allowNull: false
    },
    instrument_height: {
      type: DataTypes.INTEGER(4), 
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'gps_log_TBL',
    timestamps: false,
    freezeTableName: true
  });
};
