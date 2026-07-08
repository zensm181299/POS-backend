const { Wallet, BalanceTransactionHistory, sequelize } = require('../models');
const { Op, where } = require('sequelize');

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
            order: [['created_at', 'DESC']],
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
    },

    createHistoryTransaction: async (data) => {
        const t = await sequelize.transaction();
        try {
            if (data.wallet_id) {
                const wallet = await Wallet.findByPk(data.wallet_id, { transaction: t });
                if (!wallet) {
                    throw new Error('Wallet/Dompet Kas yang dipilih tidak valid atau tidak ditemukan.');
                }

                // Tambahkan saldo wallet dengan total omset (pemasukan kotor) dari transaksi ini
                wallet.balance += parseInt(data.amount);
                await wallet.save({ transaction: t });
            }

            const newData = await BalanceTransactionHistory.create(data);

            await t.commit();
            return newData;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    findAllByWalletId: async (walletId) => {
        return await BalanceTransactionHistory.findAll(
            {
                where: {wallet_id: walletId},
            });
    }
};

module.exports = walletQueries;