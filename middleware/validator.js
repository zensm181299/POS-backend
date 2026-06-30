// middleware/validator.js

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { body } = req;
        const errors = [];

        // Loop setiap field yang wajib diisi
        schema.forEach((field) => {
            if (!body[field]) {
                errors.push(`${field} wajib diisi.`);
            }
        });

        // Contoh validasi format email (jika ada field 'email')
        if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            errors.push('Format email tidak valid.');
        }

        // Jika ada error, kembalikan response
        if (errors.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Validasi gagal',
                errors: errors
            });
        }

        // Jika lolos, lanjut ke controller
        next();
    };
};

module.exports = { validateRequest };