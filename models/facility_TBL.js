/* jshint indent: 2 */
import moment from 'moment';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facility_TBL', {
    fid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    latlon: {
      type: DataTypes.GEOMETRY,
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
    data_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    instrument_height: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
    },
    pipe_type: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    material: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    diameter: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    img: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ''
    },
    measure_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      get: function() {
        return moment(this.getDataValue('measure_date')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    facility_form: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    facility_form_name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    facility_usage: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    facility_usage_name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    facility_type: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    facility_type_name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    facility_type_code: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    facility_depth: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    
    hole_cover: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    hole_cover_spec: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    toffe_height: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    hole_material: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    hole_spec: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    hole_height: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    vdop: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    hdop: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'facility_TBL',
    freezeTableName: true
  });
};
