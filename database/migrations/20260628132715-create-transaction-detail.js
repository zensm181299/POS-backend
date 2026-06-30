'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_details', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // Disamakan menjadi UUID agar sinkron dengan Model
        defaultValue: Sequelize.UUIDV4
      },
      transaction_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'transactions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      product_name_snapshot: { // PERBAIKAN: Dipisah menjadi kolom tersendiri
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {              // PERBAIKAN: Dipisah menjadi kolom tersendiri
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      actual_cost_price: {
        type: Sequelize.INTEGER
      },
      actual_selling_price: {
        type: Sequelize.INTEGER
      },
      sub_total_hpp: {
        type: Sequelize.INTEGER
      },
      sub_total_omset: { // Disamakan menggunakan huruf 's' (omset)
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('transaction_details');
  }
};