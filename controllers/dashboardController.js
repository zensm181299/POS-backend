// controllers/dashboardController.js
const dashboardQueries = require('../queries/dashboardQueries');

const dashboardController = {
    getDashboardSummary: async (req, res) => {
        try {
            const now = new Date();

            // 1. Set Batas Waktu Harian (00:00:00 sampai 23:59:59)
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            const endOfDay = new Date(now.setHours(23, 59, 59, 999));

            // 2. Set Batas Waktu Bulanan (Tanggal 1 Jam 00:00 sampai akhir bulan)
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            // 3. Set Batas Waktu Tahunan (1 Januari sampai 31 Desember)
            const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

            // Jalankan query secara paralel agar performa API sangat cepat
            const [dailyStats, monthlyStats, yearlyStats, latestTransactions] = await Promise.all([
                dashboardQueries.getFinancialStats(startOfDay, endOfDay),
                dashboardQueries.getFinancialStats(startOfMonth, endOfMonth),
                dashboardQueries.getFinancialStats(startOfYear, endOfYear),
                dashboardQueries.getLatestTransactions(5)
            ]);

            // Susun response data terpusat untuk dashboard
            const dashboardData = {
                financial_summary: {
                    daily: {
                        pemasukan: parseInt(dailyStats.total_pemasukan),
                        pengeluaran: parseInt(dailyStats.total_pengeluaran),
                        laba: parseInt(dailyStats.total_laba)
                    },
                    monthly: {
                        pemasukan: parseInt(monthlyStats.total_pemasukan),
                        pengeluaran: parseInt(monthlyStats.total_pengeluaran),
                        laba: parseInt(monthlyStats.total_laba)
                    },
                    yearly: {
                        pemasukan: parseInt(yearlyStats.total_pemasukan),
                        pengeluaran: parseInt(yearlyStats.total_pengeluaran),
                        laba: parseInt(yearlyStats.total_laba)
                    }
                },
                recent_transactions: latestTransactions
            };

            return res.success(dashboardData, 'Dashboard summary retrieved successfully');
        } catch (error) {
            return res.error(error.message, 500);
        }
    }
};

module.exports = dashboardController;