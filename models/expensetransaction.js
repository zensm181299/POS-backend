'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpenseTransaction extends Model {
    static associate(models) {
      ExpenseTransaction.belongsTo(models.Wallet, { foreignKey: 'wallet_id', as: 'wallet' });
      ExpenseTransaction.hasMany(models.ExpenseTransactionDetail, { foreignKey: 'expense_transaction_id', as: 'details' });
    }
  }
  ExpenseTransaction.init({
    id: {
      type: DataTypes.UUID,         // Sinkronkan ke UUID
      defaultValue: DataTypes.UUIDV4, // Sinkronkan generatornya
      primaryKey: true
    },
    expense_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.ENUM('OPERATIONAL', 'RESTOCK','BILL','OTHER'), allowNull: false },
    total_expense: { type: DataTypes.INTEGER, allowNull: false },
    wallet_id: { type: DataTypes.UUID, allowNull: false },
    notes: DataTypes.STRING,
    expense_date: { type: DataTypes.DATE, allowNull: false }
  }, {
    sequelize,
    modelName: 'ExpenseTransaction',
    tableName: 'expense_transactions',
    underscored: true
  });
  return ExpenseTransaction;
};