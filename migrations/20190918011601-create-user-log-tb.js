'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_log_TBL', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      site_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_fid_prefix: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      device_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      real_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE  
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_log_TBL');
  }
};