// controllers/transactionController.js
const { Op } = require('sequelize');
const transactionQueries = require('../queries/transactionQueries');

const transactionController = {

    getAllTransactions: async (req, res) => {
        try {
            const { page = 1, limit = 10, search, transaction_date } = req.query;
            let where = {};

            if (search && search.trim() !== "") {
                where.invoice_number = {
                    [Op.like]: `%${search}%`
                };
            }

            if (transaction_date) {
                let dates = transaction_date.split(",");

                let start_date = new Date(dates[0]);
                start_date.setHours(0, 0, 0, 0);

                let end_date = dates[1] ? new Date(dates[1]) : new Date(dates[0]);
                end_date.setHours(23, 59, 59, 999);

                where.transaction_date = {
                    [Op.between]: [start_date, end_date]
                };
            }

            const result = await transactionQueries.findAll(page, limit, where);

            const totalData = result.rows.length;
            const transactions = result.rows;

            return res.successPagination(transactions, {
                totalData: totalData,
                totalPages: Math.ceil(totalData / limit),
                currentPage: parseInt(page),
                perPage: parseInt(limit),
            }, 'Transactions retrieved successfully');
        } catch (e) {
            return res.error(e.message, 500);
        }
    },

    createTransaction: async (req, res) => {
        try {
            // 1. Ekstrak properti wallet_id (bersifat opsional) dari request body
            const { payment_method, items, transaction_date, wallet_id } = req.body;

            if (!items || items.length === 0) {
                return res.error('Keranjang belanja tidak boleh kosong', 400);
            }

            let total_hpp = 0;
            let total_omset = 0;
            const processedItems = [];

            items.forEach(item => {
                const sub_total_hpp = parseInt(item.actual_cost_price) * parseInt(item.quantity);
                const sub_total_omset = parseInt(item.actual_selling_price) * parseInt(item.quantity);

                total_hpp += sub_total_hpp;
                total_omset += sub_total_omset;

                processedItems.push({
                    product_id: item.product_id,
                    product_name_snapshot: item.product_name_snapshot,
                    quantity: parseInt(item.quantity),
                    actual_cost_price: item.actual_cost_price,
                    actual_selling_price: item.actual_selling_price,
                    sub_total_hpp,
                    sub_total_omset
                });
            });

            const total_net_profit = total_omset - total_hpp;

            // 2. Bungkus data transaksi termasuk properti wallet_id
            const transactionData = {
                invoice_number: `INV/${Date.now()}`,
                total_hpp,
                total_omset,
                total_net_profit,
                payment_method,
                transaction_date: transaction_date ? new Date(transaction_date) : new Date(),
                wallet_id: wallet_id || null // Jika kosong/tidak dipilih, set default ke null
            };

            // Kirim data ke query layer
            const result = await transactionQueries.create(transactionData, processedItems);

            return res.success(result, 'Transaksi sukses disimpan dan keuangan kas diperbarui', 201);
        } catch (error) {
            if (error.message.includes('tidak mencukupi') || error.message.includes('tidak ditemukan') || error.message.includes('tidak valid')) {
                return res.error(error.message, 400);
            }
            return res.error(error.message, 500);
        }
    },

    getDetailTransaction: async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await transactionQueries.findById(id);

            if (!transaction) {
                return res.error('Transaksi tidak ditemukan', 404);
            }

            return res.success(transaction, 'Detail transaksi berhasil diambil');
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    deleteTransaction: async (req, res) => {
        try {
            const { id } = req.params;

            const checkData = await transactionQueries.findById(id);
            if (!checkData) {
                return res.error('Transaksi tidak ditemukan atau sudah dihapus', 404);
            }

            await transactionQueries.softDelete(id);
            return res.success(null, 'Transaksi berhasil dihapus (Soft Delete)');
        } catch (error) {
            return res.error(error.message, 500);
        }
    }
};

module.exports = transactionController;