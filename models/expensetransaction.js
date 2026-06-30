'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpenseTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExpenseTransaction.init({
    expense_number: DataTypes.STRING,
    type: DataTypes.STRING,
    total_expens: DataTypes.INTEGER,
    wallet_id: DataTypes.STRING,
    expense_date: DataTypes.DATE,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ExpenseTransaction',
  });
  return ExpenseTransaction;
};