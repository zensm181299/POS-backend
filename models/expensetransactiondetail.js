'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpenseTransactionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExpenseTransactionDetail.init({
    expense_transaction_id: DataTypes.UUID,
    product_id: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    cost_price_per_item: DataTypes.INTEGER,
    sub_total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ExpenseTransactionDetail',
  });
  return ExpenseTransactionDetail;
};