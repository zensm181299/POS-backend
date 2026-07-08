'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BalanceTransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BalanceTransactionHistory.belongsTo(models.Wallet,{
        foreignKey: 'wallet_id',
        as: 'wallet'
      })
    }
  }
  BalanceTransactionHistory.init({
    id: {
      type: DataTypes.UUID,         // Sinkronkan ke UUID
      defaultValue: DataTypes.UUIDV4, // Sinkronkan generatornya
      primaryKey: true
    },
    wallet_id: DataTypes.UUID,
    type: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    date: DataTypes.DATE,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BalanceTransactionHistory',
    tableName: 'balance_transaction_history',
    underscored: true
  });
  return BalanceTransactionHistory;
};