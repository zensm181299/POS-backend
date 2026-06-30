'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { 
          foreignKey: 'category_id',
          as: 'category'
      });
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    category_id: DataTypes.UUID,
    price: DataTypes.INTEGER,
    status: DataTypes.STRING,
    description: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    is_need_stock: { // TAMBAHAN FIELD DI MODEL
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true // WAJIB: Menghubungkan timestamps & field otomatis ke snake_case database
  });
  return Product;
};