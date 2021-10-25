/* jshint indent: 2 */
import moment from 'moment';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('obstruction_TBL', {
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
    depth: {
      type: "DOUBLE",
      allowNull: false
    },
    hole_depth: {
      type: "DOUBLE",
      allowNull: true
    },
    fix: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    instrument_height: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: false
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
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
    pipe_type: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
    azimuth: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: 0
    },
    heading: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: 0
    },
    pitch: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: 0
    },
    roll: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: 0
    },
    diameter: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    data_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    material: {
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
    pipe_in_depth: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    pipe_out_depth: {
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
  }, {
    tableName: 'obstruction_TBL',
    timestamps: false,
    freezeTableName: true
  });
};
