// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_pos_2026';

const authMiddleware = {
    // Memastikan user sudah login & membawa token valid
    verifyToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

        if (!token) {
          return res.status(401).json({ status: 'error', message: 'Akses ditolak, token tidak ditemukan' });
        }

        try {
            const verified = jwt.verify(token, JWT_SECRET);
            req.user = verified; // Menyimpan data user (id, role) ke object request
            next();
        } catch (error) {
            return res.status(403).json({ status: 'error', message: 'Token tidak valid atau kadaluwarsa' });
        }
    },

    // Membatasi akses khusus untuk role tertentu saja (Otorisasi)
    authorizeRoles: (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ 
                    status: 'error', 
                    message: 'Anda tidak memiliki hak akses untuk menu ini' 
                });
            }
            next();
        };
    }
};

module.exports = authMiddleware;