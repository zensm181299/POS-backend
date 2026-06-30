const { User } = require('../models');

const userQueries = {
    findAll: async(page=1,limit=10) => {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const offset = (pageNum - 1) * limitNum;
        return await User.findAndCountAll({
            limit: limitNum,
            offset: offset,
            order: [['createdAt', 'DESC']] // Opsional: mengurutkan dari yang terbaru
        });
    },

    createUser: async(userData) => {
        return await User.create(userData)
    },

    findOne: async(id) => {
        return await User.findByPk(id)
    },

    updateUser: async (id, userData) => {
        // Menggunakan shorthand { id } agar lebih bersih
        return await User.update(userData, {
            where: { id }
        });
    },

    deleteUser: async(id) => {
        return await User.destroy({
            where: { id }
        })
    },

    findByParam: async (param) => {
        // [Object.keys(param)[0]] akan mengambil nama field (misal: 'email')
        // Object.values(param)[0] akan mengambil nilainya (misal: 'zaenal@gmail.com')
        const key = Object.keys(param)[0];
        const value = param[key];

        return await User.findOne({
            where: {
                [key]: value
            }
        });
    },
}

module.exports = userQueries;