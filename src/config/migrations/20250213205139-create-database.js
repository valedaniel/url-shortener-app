'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createDatabase('url_shortener_app');
  },

  async down(queryInterface) {
    await queryInterface.dropTable('url_shortener_app');
  },
};
