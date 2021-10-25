/* jshint indent: 2 */
import moment from 'moment';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('job_token_TBL', {
    job_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    flag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
  }, {
    tableName: 'job_token_TBL',
    freezeTableName: true
  });
};