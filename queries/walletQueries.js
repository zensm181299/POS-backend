const { Wallet } = require('../models');
const { Op } = require('sequelize');

const walletQueries = {
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

        return await Wallet.findAndCountAll({
            limit: limitNum,
            offset: offset,
            order: [['createdAt', 'DESC']],
            where
        });
    },

    findOne: async (id) => {
        return await Wallet.findByPk(id);
    },

    createWallet: async (walletData) => {
        return await Wallet.create(walletData);
    },

    updateWallet: async (id, walletData) => {
        return await Wallet.update(walletData, {
            where: { id }
        });
    },

    deleteWallet: async (id) => {
        return await Wallet.destroy({
            where: { id }
        });
    }
};

module.exports = walletQueries;