const { Category } = require('../models');
const { Op } = require('sequelize');

const categoryQueries = {
    findAll: async (page = 1, limit = 10, search = "") => {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const where = {};

        if (search !== "") {
            // 2. Gunakan Op.iLike agar pencarian mengandung kata kunci (Fuzzy Search)
            where.name = {
                [Op.like]: `%${search}%` 
            };
        }

        return await Category.findAndCountAll({
            limit: limitNum,
            offset: offset,
            order: [['createdAt', 'DESC']],
            where // Menggunakan fitur ES6 shorthand dengan benar
        });
    },

    findOne: async(id) => {
        return await Category.findByPk(id);
    },

    createCategory: async(categoryData) => {
        return await Category.create(categoryData);
    },

    updateCategory: async(id,categoryData) => {
        return await Category.update(categoryData,{
            where: { id }
        })
    },

    deleteCategory: async(id) => {
        return await Category.destroy({
            where: { id }
        })
    },

    findByParam: async(param) => {
        const key = Object.keys(param)[0];
        const values = param[key];

        return await Category.findAll({
            where: {
                [key]: value
            }
        })
    }
}

module.exports = categoryQueries;