
require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'isi_database_anda',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Koneksi database gagal:', err.message);
        return;
    }

    console.log('Berhasil terhubung ke MySQL!');
    connection.release();
});

module.exports = db;
