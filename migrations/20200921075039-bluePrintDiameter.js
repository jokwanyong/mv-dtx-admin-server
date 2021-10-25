'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   
   return Promise.all[     
      queryInterface.addColumn('area_blue_print_TBL','diameter', Sequelize.INTEGER(6).UNSIGNED)
   ]
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all[
      queryInterface.removeColumn('area_blue_print_TBL','diameter')
    ]
  }
};