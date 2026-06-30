const productQueries = require('../queries/productQueries');

const productController = {
    getAllProduct: async (req, res) => {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const result = await productQueries.findAll(page, limit, search);

            const totalData = result.count;
            const products = result.rows;

            return res.successPagination(products, {
                totalData: totalData,
                totalPages: Math.ceil(totalData / limit),
                currentPage: parseInt(page),
                perPage: parseInt(limit),
            }, 'Products retrieved successfully');
        } catch (e) {
            return res.error(e.message, 500);
        }
    },

    detailProduct: async (req, res) => {
        try {
            const product = await productQueries.findOne(req.params.id);
            if (!product) {
                return res.error('Product not found', 404);
            }
            return res.success(product, 'Product successfully retrieved');
        } catch (e) {
            return res.error(e.message, 500);
        }
    },

    createNewProduct: async (req, res) => {
        try {
            // req.body sekarang bisa menerima "is_need_stock": true atau false
            const resultCreate = await productQueries.createProduct(req.body);
            return res.success(resultCreate, 'Product created successfully', 201);
        } catch (e) {
            return res.error(e.message, 500);
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            await productQueries.updateProduct(id, req.body);
            return res.success([], 'Product updated successfully', 200);
        } catch (e) {
            return res.error(e.message, 500);
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const resultDelete = await productQueries.deleteProduct(id);
            return res.success(resultDelete, 'Product deleted successfully', 200);
        } catch (e) {
            return res.error(e.message, 500);
        }
    }
};

module.exports = productController;