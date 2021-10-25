/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  const qr_code_TBL = sequelize.define('qr_code_TBL', {
    qid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    factory_id: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    area_id: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    idx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    pipe_type: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    diameter: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    latlon: {
      type: DataTypes.GEOMETRY,
      allowNull: true
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    arrive_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    construction_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    check_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refund_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    com_state: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    arrive_state: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    construction_state: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    check_state: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    refund_state: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    refund_reason: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: '0'
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ''
    },
    img: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ''
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
    tableName: 'qr_code_TBL',
    freezeTableName: true
  });

  // qr_code_TBL.associate = function(models) {
  //   qr_code_TBL.belongsTo(models.obs_model, { foreignKey: 'model_idx' });
  // }

  return qr_code_TBL;
};
