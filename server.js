require('dotenv').config(); // Pastikan environment variables di-load paling atas
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Tambahan Keamanan Header
const rateLimit = require('express-rate-limit'); // Tambahan Keamanan DDoS/Bruteforce
const { sequelize } = require('./models'); // Tambahan untuk verifikasi koneksi DB

const mainRoutes = require('./routes'); 
const responseMiddleware = require('./middleware/responseMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. LAYER KEAMANAN (SECURITY MIDDLEWARE)
// ==========================================
app.use(helmet()); // Mengamankan HTTP headers

// Membatasi request untuk mencegah spamming API / DoS
const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 menit
    max: 100, // Maksimal 100 request per IP
    message: { 
        status: 'error', 
        message: 'Terlalu banyak request dari IP Anda, silakan coba lagi nanti.' 
    }
});
app.use('/api', (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    apiLimiter(req, res, next);
});

// ==========================================
// 2. LAYER BASE MIDDLEWARE & CUSTOM RESPONSE
// ==========================================
app.use(cors({
    origin: 'http://localhost:5173', // Izinkan port frontend kamu
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // Jika kamu butuh kirim cookie/session
}));
app.use(responseMiddleware); // Custom helper res.success / res.error Anda
app.use(express.json());

// ==========================================
// 3. ROUTING LAYER
// ==========================================
app.use('/api', mainRoutes);

// Handling Global jika endpoint yang dituju tidak ada
app.use((req, res) => {
    // Memanfaatkan middleware response Anda untuk return 404
    if (typeof res.error === 'function') {
        return res.error('Endpoint tidak ditemukan', 404);
    }
    return res.status(404).json({ status: 'error', message: 'Endpoint tidak ditemukan' });
});

// ==========================================
// 4. RUN SERVER & DATABASE CHECK
// ==========================================
const startServer = async () => {
    try {
        // Memastikan database terkoneksi sebelum server listening request
        await sequelize.authenticate();
        console.log('✅ Database terhubung dengan sukses (Gaya Underscore Aktif).');

        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan dengan arsitektur baru di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Gagal menyalakan server karena masalah database:', error.message);
        process.exit(1);
    }
};

startServer();