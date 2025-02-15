'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('urls', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      original_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      short_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_clicks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('urls');
  },
};
