const expenseQueries = require('../queries/expenseQueries');
const { Op } = require('sequelize');

const expenseController = {
    // 1. Ambil Semua List Pengeluaran dengan Filter Nomor & Tanggal
    getAllExpenses: async (req, res) => {
        try {
            const { page = 1, limit = 10, search, expense_date, type } = req.query;
            let where = {};

            // Filter nomor pengeluaran
            if (search && search.trim() !== "") {
                where.expense_number = { [Op.like]: `%${search}%` };
            }

            // Filter tipe (OPERATIONAL / RESTOCK)
            if (type && ['OPERATIONAL', 'RESTOCK'].includes(type)) {
                where.type = type;
            }

            // Filter rentang tanggal pengeluaran (Between)
            if (expense_date) {
                let dates = expense_date.split(",");
                let start_date = new Date(dates[0]);
                start_date.setHours(0, 0, 0, 0);

                let end_date = dates[1] ? new Date(dates[1]) : new Date(dates[0]);
                end_date.setHours(23, 59, 59, 999);

                where.expense_date = { [Op.between]: [start_date, end_date] };
            }

            const result = await expenseQueries.findAll(page, limit, where);

            return res.successPagination(result.rows, {
                totalData: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: parseInt(page),
                perPage: parseInt(limit),
            }, 'Daftar transaksi pengeluaran berhasil dimuat');
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    // 2. Ambil Detail Berdasarkan ID Pengeluaran
    getExpenseDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const expense = await expenseQueries.findById(id);

            if (!expense) {
                return res.error('Transaksi pengeluaran tidak ditemukan', 404);
            }

            return res.success(expense, 'Detail transaksi pengeluaran berhasil diambil');
        } catch (error) {
            return res.error(error.message, 500);
        }
    },
    
    createExpenseTransaction: async (req, res) => {
        try {
            const { type, wallet_id, notes, expense_date, items, manual_total_expense } = req.body;

            if (!wallet_id) return res.error('Wallet ID wajib dipilih', 400);
            if (!type || !['OPERATIONAL', 'RESTOCK'].includes(type)) {
                return res.error('Tipe pengeluaran harus OPERATIONAL atau RESTOCK', 400);
            }

            let total_expense = 0;
            let processedItems = [];

            // Jika tipenya restock produk, hitung total otomatis dari item keranjang belanja restock
            if (type === 'RESTOCK') {
                if (!items || items.length === 0) {
                    return res.error('Item produk restock tidak boleh kosong', 400);
                }

                items.forEach(item => {
                    const sub_total = parseInt(item.cost_price_per_item) * parseInt(item.quantity);
                    total_expense += sub_total;

                    processedItems.push({
                        product_id: item.product_id,
                        quantity: parseInt(item.quantity),
                        cost_price_per_item: parseInt(item.cost_price_per_item),
                        sub_total
                    });
                });
            } else {
                // Jika operasional biasa, ambil nominal langsung dari input formulir
                if (!manual_total_expense || manual_total_expense <= 0) {
                    return res.error('Total pengeluaran operasional harus lebih dari 0', 400);
                }
                total_expense = parseInt(manual_total_expense);
            }

            const expenseData = {
                expense_number: `EXP/${Date.now()}`,
                type,
                total_expense,
                wallet_id,
                notes: notes || null,
                expense_date: expense_date ? new Date(expense_date) : new Date()
            };

            const result = await expenseQueries.createExpense(expenseData, processedItems);
            return res.success(result, 'Transaksi pengeluaran berhasil dicatat', 201);

        } catch (error) {
            if (error.message.includes('tidak mencukupi') || error.message.includes('tidak ditemukan')) {
                return res.error(error.message, 400);
            }
            return res.error(error.message, 500);
        }
    }
};

module.exports = expenseController;