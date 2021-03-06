/* jshint indent: 2 */
import moment from 'moment';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('area_progress_TBL', {
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'area_TBL',
        key: 'area_id'
      }
    },
    pipe_type: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    total_length: {
      type: "DOUBLE",
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function() {
        return moment(this.getDataValue('create_date')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function() {
        return moment(this.getDataValue('update_date')).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }, {
    tableName: 'area_progress_TBL',
    freezeTableName: true
  });
};
