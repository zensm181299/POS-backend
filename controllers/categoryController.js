const categoryQueries = require('../queries/categoryQueries');

const categoryController = {
    getAllCategory: async(req,res) => {
        try {
            const {page=1,limit=10, search} = req.query;
            const result = await categoryQueries.findAll(page,limit,search);

            const totalData = result.count;
            const categories = result.rows;

            return res.successPagination(categories, {
                totalData: totalData,
                totalPages: Math.ceil(totalData / limit),
                currentPage: parseInt(page),
                perPage: parseInt(limit),
            }, 'Categories retrieved successfully');
        } catch (e) {
            return res.error(e.message,500);
        }
    },

    detailCategory: async(req,res) => {
        try {
            const category = await categoryQueries.findOne(req.params.id);
            if(!category) {
                res.error('Category not found',404);
            }
            return res.success(category,'Category success retrieved');
        } catch (e) {
            return res.error(e.message,500);
        }
    },

    createNewCategory: async(req,res) => {
        try {
            const resultCreate = await categoryQueries.createCategory(req.body);
            return res.success(resultCreate,'Category created',201)
        } catch (e) {
            return res.error('Failed to create category',500);
        }
    },

    updateCategory: async(req,res) => {
        try {
            const { id } = req.params
            const resultUpdate = await categoryQueries.updateCategory(id,req.body);
            return res.success([],'Category updated',200)
        } catch (e) {
            return res.error(e.message,500);
        }
    },

    deleteCategory: async(req,res) => {
        try {
            const { id } = req.params
            const resultDelete = await categoryQueries.deleteCategory(id);
            return res.success(resultDelete,'Category deleted',200)
        } catch (e) {
            return res.error('Failed to delete category',500);
        }
    },
}

module.exports = categoryController;