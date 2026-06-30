'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    static associate(models) {
      TransactionDetail.belongsTo(models.Transaction, {
        foreignKey: 'transaction_id',
        as: 'transaction'
      });
    }
  }
  TransactionDetail.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },                                                
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    product_name_snapshot: DataTypes.STRING, // Sudah dipisah & sinkron
    quantity: DataTypes.INTEGER,              // Sudah dipisah & sinkron
    actual_cost_price: DataTypes.INTEGER,
    actual_selling_price: DataTypes.INTEGER,
    sub_total_hpp: DataTypes.INTEGER,
    sub_total_omset: DataTypes.INTEGER      // Menggunakan huruf 's'
  }, {
    sequelize,
    modelName: 'TransactionDetail',
    tableName: 'transaction_details',
    underscored: true // WAJIB
  });
  return TransactionDetail;
};