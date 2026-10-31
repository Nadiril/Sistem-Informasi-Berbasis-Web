const express = require('express');
const app = express();
const db = require('./db');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Menampilkan daftar sparepart
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM sparepart ORDER BY kode_sparepart';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data:', err.message);
            return res.status(500).render('indexSparepart', { spareparts: [], error: 'Gagal mengambil data sparepart' });
        }

        res.render('indexSparepart', { spareparts: results, error: null });
    });
});

/* ================================
   REST API SPAREPART
================================ */

// GET: Mengambil semua sparepart
app.get('/api/sparepart', (req, res) => {
    const sql = 'SELECT * FROM sparepart ORDER BY kode_sparepart';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data API:', err.message);
            return res.status(500).json({
                message: 'Gagal mengambil data sparepart'
            });
        }

        res.json(results);
    });
});

// GET: Mengambil satu sparepart berdasarkan kode
app.get('/api/sparepart/:kode_sparepart', (req, res) => {
    const kode = req.params.kode_sparepart;

    db.query(
        'SELECT * FROM sparepart WHERE kode_sparepart = ?',
        [kode],
        (err, results) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({
                    message: 'Gagal mengambil data sparepart'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Sparepart tidak ditemukan'
                });
            }

            res.json(results[0]);
        }
    );
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});