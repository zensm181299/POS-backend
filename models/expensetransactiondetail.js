'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpenseTransactionDetail extends Model {
    static associate(models) {
      ExpenseTransactionDetail.belongsTo(models.ExpenseTransaction, { foreignKey: 'expense_transaction_id' });
      ExpenseTransactionDetail.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
  }
  ExpenseTransactionDetail.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    expense_transaction_id: { type: DataTypes.UUID, allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    cost_price_per_item: { type: DataTypes.INTEGER, allowNull: false },
    sub_total: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'ExpenseTransactionDetail',
    tableName: 'expense_transaction_details',
    underscored: true
  });
  return ExpenseTransactionDetail;
};