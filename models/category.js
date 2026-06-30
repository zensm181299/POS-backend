'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product, { 
          foreignKey: 'category_id', // Nama kolom foreign key di tabel Product
          as: 'products'            // Nama alias (bebas, nanti dipanggil di query)
      });
    }
  }

  Category.init({
    id: {
      type: DataTypes.UUID,         // Sinkronkan ke UUID
      defaultValue: DataTypes.UUIDV4, // Sinkronkan generatornya
      primaryKey: true
    },
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  });
  return Category;
};