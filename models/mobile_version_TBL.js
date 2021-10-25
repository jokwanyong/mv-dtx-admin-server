/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mobile_version_TBL', {
    idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    app_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    update: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    download_path: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    file_size: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    update_text: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_version: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    os_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    os_version: {
      type: DataTypes.STRING(45),
      allowNull: true,
    }
  }, {
    tableName: 'mobile_version_TBL',
    freezeTableName: true
  });
};
