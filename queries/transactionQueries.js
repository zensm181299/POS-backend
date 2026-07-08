const { Transaction, TransactionDetail, Product, Wallet, sequelize } = require('../models');

const transactionQueries = {

    findAll: async (page = 1, limit = 10, where = {}) => {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        return await Transaction.findAndCountAll({
            limit: limitNum,
            offset: offset,
            where,
            order: [['transaction_date', 'DESC']],
            include: [
                {
                    model: TransactionDetail,
                    as: 'details',
                    attributes: ['product_name_snapshot', 'quantity', 'actual_selling_price']
                }
            ]
        });
    },

    create: async (transactionData, detailItems) => {
        const t = await sequelize.transaction();
        try {
            for (const item of detailItems) {
                const product = await Product.findByPk(item.product_id, { transaction: t });
                if (!product) throw new Error(`Produk dengan ID ${item.product_id} tidak ditemukan.`);

                if (product.is_need_stock) {
                    if (product.stock < item.quantity) {
                        throw new Error(`Stok untuk produk '${product.name}' tidak mencukupi. Sisa stok: ${product.stock}`);
                    }
                    product.stock -= item.quantity;
                    await product.save({ transaction: t });
                }
            }

            if (transactionData.wallet_id) {
                const wallet = await Wallet.findByPk(transactionData.wallet_id, { transaction: t });
                if (!wallet) {
                    throw new Error('Wallet/Dompet Kas yang dipilih tidak valid atau tidak ditemukan.');
                }

                // Tambahkan saldo wallet dengan total omset (pemasukan kotor) dari transaksi ini
                wallet.balance += parseInt(transactionData.total_omset);
                await wallet.save({ transaction: t });
            }

            const newTransaction = await Transaction.create(transactionData, { transaction: t });

            // Simpan bulk item detail transaksi
            const formattedDetails = detailItems.map(item => ({
                ...item,
                transaction_id: newTransaction.id
            }));
            await TransactionDetail.bulkCreate(formattedDetails, { transaction: t });

            await t.commit();
            return newTransaction;
        } catch (error) {
            await t.rollback(); // Jika wallet crash atau stok gagal, batalkan semuanya!
            throw error;
        }
    },

    findById: async (id) => {
        return await Transaction.findByPk(id, {
            include: [
                {
                    model: TransactionDetail,
                    as: 'details',
                }
            ]
        });
    },

    softDelete: async (id) => {
        return await Transaction.destroy({
            where: { id }
        });
    }
};

module.exports = transactionQueries;