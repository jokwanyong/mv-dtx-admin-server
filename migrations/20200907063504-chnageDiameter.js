'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.changeColumn('smart_station_TBL', 'diameter', {
     type: Sequelize.STRING(45),
     allowNull: false,
   })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.changeColumn('smart_station_TBL', 'diameter', {
    type: Sequelize.INTEGER(4),
    allowNull: false,
  })
  }
};
