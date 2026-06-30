// utils/responseHandler.js

const responseHandler = {
    // Respons Sukses Umum
    success: (res, data, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            status: 'success',
            message: message,
            data: data
        });
    },

    // Respons Sukses dengan Pagination
    successPagination: (res, data, pagination, message = 'Success') => {
        return res.status(200).json({
            status: 'success',
            message: message,
            data: data,
            pagination: pagination // { totalData, totalPages, currentPage, perPage }
        });
    },

    // Respons Error Umum
    error: (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
        const response = {
            status: 'error',
            message: message
        };
        // Menambahkan detail error jika ada (seperti hasil validasi)
        if (errors) response.errors = errors;
        
        return res.status(statusCode).json(response);
    }
};

module.exports = responseHandler;