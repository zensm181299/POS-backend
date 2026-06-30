'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', { // Gunakan nama tabel kecil / snake_case
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING
      },
      category_id: {
        type: Sequelize.UUID // Diubah ke UUID agar sinkron dengan model Anda
      },
      price: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true, // Berikan allowNull true karena pulsa/kuota tidak punya nilai stok tetap
        defaultValue: 0
      },
      is_need_stock: { // TAMBAHAN FIELD BARU
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true // Default-nya true (seperti ATK/BBM), nanti set false untuk Pulsa
      },
      created_at: { // Disinkronkan ke gaya underscore
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: { // Disinkronkan ke gaya underscore
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};