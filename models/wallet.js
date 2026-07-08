'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wallet.hasMany(models.BalanceTransactionHistory,{
        foreignKey: 'wallet_id',
        as: 'balance_transaction_history'
      })
    }
  }
  Wallet.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Wallet',
    tableName: 'wallets',
    underscored: true
  });
  return Wallet;
};