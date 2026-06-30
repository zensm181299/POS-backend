const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Pastikan Anda menyimpan JWT_SECRET di file .env Anda
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_pos_2026';

const authController = {
    // 1. Registrasi User Baru (Hanya bisa diakses Admin jika diperlukan)
    register: async (req, res) => {
        try {
            const { name, username, password, role="admin" } = req.body;
            
            const userExists = await User.findOne({ where: { username } });
            if (userExists) return res.error('Username sudah digunakan', 400);

            const newUser = await User.create({ name, username, password, role });
            
            // Jangan kembalikan password di response
            const dataResponse = { id: newUser.id, name: newUser.name, username: newUser.username, role: newUser.role };
            return res.success(dataResponse, 'User berhasil didaftarkan', 201);
        } catch (error) {
            return res.error(error.message, 500);
        }
    },

    // 2. Login User
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ where: { username } });
            if (!user) return res.error('Username atau password salah', 401);

            const isPasswordValid = await user.validatePassword(password);
            if (!isPasswordValid) return res.error('Username atau password salah', 401);

            // Buat Token JWT berlaku selama 1 hari
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.success({ token, role: user.role, name: user.name }, 'Login berhasil');
        } catch (error) {
            return res.error(error.message, 500);
        }
    }
};

module.exports = authController;