/* jshint indent: 2 */
import moment from 'moment';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('survey_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: false,
    },
    alt: {
      type: "DOUBLE",
      allowNull: false
    },
    geo: {
      type: "DOUBLE",
      allowNull: false
    },
    fix: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ''
    },
    instrument_height: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
    },
    measure_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      get: function() {
        return moment(this.getDataValue('measure_date')).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }, {
    tableName: 'survey_TBL',
    timestamps: true,
    freezeTableName: true
  });
};
