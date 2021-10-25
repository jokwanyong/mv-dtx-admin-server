/* jshint indent: 2 */
import moment from 'moment';

module.exports = function(sequelize, DataTypes) {
  const journal_TBL = sequelize.define('journal_TBL', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    area_fid_prefix: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    text: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function() {
        return moment(this.getDataValue('start_date')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function() {
        return moment(this.getDataValue('end_date')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    state: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    code: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
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
    }
  }, {
    tableName: 'journal_TBL',
    freezeTableName: true
  });
  journal_TBL.associate = function(models) {
    // associations can be defined here
  };
  return journal_TBL;
};
