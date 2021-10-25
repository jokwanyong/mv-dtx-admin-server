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
     queryInterface.renameColumn('gps_log_TBL','caliber','diameter', {
       type: Sequelize.INTEGER(4)
     }),
     queryInterface.renameColumn('obstruction_TBL','caliber','diameter', {
       type: Sequelize.INTEGER(4)
     }),
     queryInterface.renameColumn('pipe_TBL','caliber','diameter', {
       type: Sequelize.INTEGER(4)
     }),
     queryInterface.renameColumn('smart_station_TBL','caliber','diameter', {
       type: Sequelize.INTEGER(4)
     })
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
      queryInterface.renameColumn('gps_log_TBL','diameter','caliber', {
        type: Sequelize.INTEGER(4)
      }),
      z
    ]
  }
};
