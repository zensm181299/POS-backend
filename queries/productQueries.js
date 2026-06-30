const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const productQueries = {
    findAll: async (page = 1, limit = 10, search = "") => {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const where = {};

        if (search !== "") {
            where.name = {
                [Op.like]: `%${search}%` 
            };
        }

        return await Product.findAndCountAll({
            limit: limitNum,
            offset: offset,
            order: [['created_at', 'DESC']], // SINKRON: Menggunakan created_at
            where,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            ]           
        });
    },

    findOne: async(id) => {
        return await Product.findByPk(id);
    },

    createProduct: async(productData) => {
        return await Product.create(productData);
    },

    updateProduct: async(id, productData) => {
        return await Product.update(productData, {
            where: { id }
        });
    },

    deleteProduct: async(id) => {
        return await Product.destroy({
            where: { id }
        });
    },

    findByParam: async(param) => {
        const key = Object.keys(param)[0];
        const value = param[key]; // PERBAIKAN: Sebelumnya typo 'values' (kurang huruf s)

        return await Product.findAll({
            where: {
                [key]: value
            }
        });
    },

    findProduct: async(where) => {
       return await Product.findAll({
        where
       }); 
    }
};

module.exports = productQueries;