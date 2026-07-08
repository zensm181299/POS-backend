const { ExpenseTransaction, ExpenseTransactionDetail, Wallet, Product, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

const expenseQueries = {
    // 1. Ambil List Expense dengan Pagination & Filter (BARU)
    findAll: async (page = 1, limit = 10, where = {}) => {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        return await ExpenseTransaction.findAndCountAll({
            limit: limitNum,
            offset: offset,
            where,
            order: [['expense_date', 'DESC']], // Urutkan dari pengeluaran terbaru
            include: [
                {
                    model: Wallet,
                    as: 'wallet',
                    attributes: ['name'] // Hanya ambil nama dompet kas untuk efisiensi
                }
            ]
        });
    },

    // 2. Ambil Detail Lengkap Satu Expense Berdasarkan ID (BARU)
    findById: async (id) => {
        return await ExpenseTransaction.findByPk(id, {
            include: [
                {
                    model: Wallet,
                    as: 'wallet',
                    attributes: ['id', 'name']
                },
                {
                    model: ExpenseTransactionDetail,
                    as: 'details',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['name', 'is_need_stock'] // Menyertakan data produk master
                        }
                    ]
                }
            ]
        });
    },

    // Fungsi create yang sudah Anda buat sebelumnya (Tetap dipertahankan)
    createExpense: async (expenseData, detailItems = []) => {
        const t = await sequelize.transaction();
        try {
            // 1. Validasi & Kurangi Saldo Wallet
            const wallet = await Wallet.findByPk(expenseData.wallet_id, { transaction: t });
            if (!wallet) throw new Error('Wallet tidak ditemukan.');
            
            if (wallet.balance < expenseData.total_expense) {
                throw new Error(`Saldo pada wallet '${wallet.name}' tidak mencukupi untuk pengeluaran ini.`);
            }

            
            console.log({walletBefore:wallet})
            wallet.balance -= parseInt(expenseData.total_expense);
            console.log({walletAfter:wallet})
            await wallet.save({ transaction: t });

            // 2. Simpan Data Transaksi Utama Pengeluaran
            const newExpenseId = uuidv4();
            const finalExpenseData = {
                id: newExpenseId, // 🔍 SUNTIKKAN ID STRING KE DATA INDUK
                ...expenseData
            };
            const newExpense = await ExpenseTransaction.create(finalExpenseData, { transaction: t });

            // 3. Skenario Khusus RESTOCK: Tambah Stok Produk
            if (expenseData.type === 'RESTOCK' && detailItems.length > 0) {
                const formattedDetails = [];

                for (const item of detailItems) {
                    const product = await Product.findByPk(item.product_id, { transaction: t });
                    if (!product) throw new Error(`Produk dengan ID ${item.product_id} tidak ditemukan.`);

                    // Trigger penambahan stok jika produk membutuhkan stok fisik
                    if (product.is_need_stock) {
                        product.stock += parseInt(item.quantity);
                        await product.save({ transaction: t });
                    }

                    formattedDetails.push({
                        ...item,
                        expense_transaction_id: newExpense.id
                    });
                }

                // Masukkan data ke tabel detail secara massal (bulk)
                await ExpenseTransactionDetail.bulkCreate(formattedDetails, { transaction: t });
            }

            await t.commit();
            return newExpense;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
};

module.exports = expenseQueries;