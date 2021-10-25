'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('blue_print_manhole_TBL', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      area_id: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      type: {
        type: Sequelize.INTEGER(2),
        allowNull: false
      },
      latlon: {
        type: Sequelize.GEOMETRY,
        allowNull: false
      },
      zPre: {
        type: "DOUBLE",
        allowNull: false
      },
      zPost: {
        type: "DOUBLE",
        allowNull: false,
      },
      nodeName: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      diameter: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      holeSize: {
        type: "DOUBLE",
        allowNull: false,
      },
      holeHeight: {
        type: "DOUBLE",
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('user_log_TBL');
  }
};
