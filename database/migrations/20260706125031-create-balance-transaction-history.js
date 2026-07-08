'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('balance_transaction_history', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4 // 🔍 Menjamin UUID terbentuk di level database jika didukung
      },
      wallet_id: {
        type: Sequelize.UUID, // 🔍 Wajib UUID murni
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('balance_transaction_history');
  }
};