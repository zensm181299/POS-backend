'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.hasMany(models.TransactionDetail, {
        foreignKey: 'transaction_id',
        as: 'details'
      });
    }
  }
  Transaction.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    invoice_number: DataTypes.STRING, // Tambahkan kolom ini yang sebelumnya hilang
    total_hpp: DataTypes.INTEGER,
    total_omset: DataTypes.INTEGER,
    total_net_profit: DataTypes.INTEGER, // Perbaikan nama field
    payment_method: DataTypes.STRING,
    transaction_date: DataTypes.DATE,
    wallet_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    underscored: true // WAJIB: Agar mapping ke database otomatis pakai snake_case
  });
  return Transaction;
};