'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', { // Gunakan nama tabel kecil/snake_case
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      total_hpp: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_omset: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_net_profit: { // Perbaikan typo dari profix ke profit
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      payment_method: {
        type: Sequelize.STRING
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Jika dari frontend tidak dikirim, otomatis pakai waktu saat ini
      },
      wallet_id: {
        type: Sequelize.UUID,
        allowNull: true, // Opsional: boleh null jika kasir tidak memilih dompet tertentu
      },
      created_at: { // Ubah dari createdAt ke created_at
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: { // Ubah dari updatedAt ke updated_at
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};