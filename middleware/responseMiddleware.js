// middleware/responseMiddleware.js
const response = require('../utils/responseHandler');

const responseMiddleware = (req, res, next) => {
    // Menambahkan method baru ke objek 'res'
    res.success = (data, message, statusCode) => response.success(res, data, message, statusCode);
    res.successPagination = (data, pagination, message) => response.successPagination(res, data, pagination, message);
    res.error = (message, statusCode, errors) => response.error(res, message, statusCode, errors);
    
    next();
};

module.exports = responseMiddleware;