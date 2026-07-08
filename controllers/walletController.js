const walletQueries = require('../queries/walletQueries');

const walletController = {
    getAllWallet: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = "" } = req.query;
            const result = await walletQueries.findAll(page, limit, search);

            const totalData = result.count;
            const wallets = result.rows;

            return res.successPagination(wallets, {
                totalData,
                totalPages: Math.ceil(totalData / limit),
                currentPage: parseInt(page),
                perPage: parseInt(limit),
            }, 'Daftar wallet berhasil dimuat');
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    detailWallet: async (req, res) => {
        try {
            const wallet = await walletQueries.findOne(req.params.id);
            if (!wallet) {
                return res.error('Wallet tidak ditemukan', 404);
            }
            return res.success(wallet, 'Detail wallet berhasil ditemukan');
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    createNewWallet: async (req, res) => {
        try {
            const { name, balance, description } = req.body;
            
            if (!name) return res.error('Nama wallet wajib diisi', 400);

            const resultCreate = await walletQueries.createWallet({ name, balance, description });
            return res.success(resultCreate, 'Wallet baru berhasil ditambahkan', 201);
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    updateWallet: async (req, res) => {
        try {
            const { id } = req.params;
            const wallet = await walletQueries.findOne(id);
            
            if (!wallet) return res.error('Wallet tidak ditemukan', 404);

            await walletQueries.updateWallet(id, req.body);
            return res.success([], 'Data wallet berhasil diperbarui', 200);
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    deleteWallet: async (req, res) => {
        try {
            const { id } = req.params;
            const wallet = await walletQueries.findOne(id);
            
            if (!wallet) return res.error('Wallet tidak ditemukan', 404);

            await walletQueries.deleteWallet(id);
            return res.success([], 'Wallet berhasil dihapus', 200);
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    createNewTransactionWallet: async (req, res) => {
        try {
            const resultCreate = await walletQueries.createHistoryTransaction(req.body);
            if(resultCreate){
                return res.success(resultCreate, 'Transaction baru berhasil ditambahkan', 201);
            } else {
                return res.error('test');
            }
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    detailTransactionWallet: async (req, res) => {
        try {
            console.log('masuk detail')
            const { id } = req.params
            const resultTransaction = await walletQueries.findAllByWalletId(id);
            return res.success(resultTransaction, '');
        } catch (error) {
            return res.error(error.message, 500);
        }
    },
};

module.exports = walletController; 