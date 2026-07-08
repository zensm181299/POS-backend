'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expense_transaction_details', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4 // 🔍 Menjamin UUID terbentuk di level database jika didukung
      },
      expense_transaction_id: {
        type: Sequelize.UUID, // 🔍 Wajib UUID murni
        allowNull: false,
      },
      product_id: {
        type: Sequelize.UUID, // 🔍 Wajib UUID murni
        allowNull: false,
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      cost_price_per_item: { type: Sequelize.INTEGER, allowNull: false },
      sub_total: { type: Sequelize.INTEGER, allowNull: false },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('expense_transaction_details');
  }
};