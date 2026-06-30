// queries/dashboardQueries.js
const { Transaction, TransactionDetail, sequelize } = require('../models');
const { Op } = require('sequelize');

const dashboardQueries = {
    // Mengambil statistik keuangan berdasarkan rentang waktu tertentu
    getFinancialStats: async (startDate, endDate) => {
        return await Transaction.findOne({
            attributes: [
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('total_omset')), 0), 'total_pemasukan'],
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('total_hpp')), 0), 'total_pengeluaran'],
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('total_net_profit')), 0), 'total_laba']
            ],
            where: {
                transaction_date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            raw: true
        });
    },

    // Mengambil 5 transaksi terbaru beserta ringkasan itemnya
    getLatestTransactions: async (limit = 5) => {
        return await Transaction.findAll({
            limit: limit,
            order: [['transaction_date', 'DESC']],
            include: [
                {
                    model: TransactionDetail,
                    as: 'details',
                    attributes: ['product_name_snapshot', 'quantity', 'actual_selling_price']
                }
            ]
        });
    }
};

module.exports = dashboardQueries;