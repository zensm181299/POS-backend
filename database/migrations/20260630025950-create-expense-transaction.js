'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expense_transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      expense_number: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      total_expens: {
        type: Sequelize.INTEGER
      },
      wallet_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      expense_date: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('expense_transactions');
  }
};