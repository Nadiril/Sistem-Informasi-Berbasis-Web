const express = require('express');
const app = express();
const db = require('./db');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// POST: Menambahkan sparepart baru
app.post('/api/sparepart', (req, res) => {
    const { kode_sparepart, nama_sparepart, kategori, merk, harga_beli, harga_jual, stok, satuan} = req.body;

    const sql = 'INSERT INTO sparepart (kode_sparepart, nama_sparepart,kategori, merk, harga_beli, harga_jual, stok, satuan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [kode_sparepart, nama_sparepart, kategori, merk, harga_beli, harga_jual, stok, satuan];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Gagal menambahkan sparepart:', err.message);
            return res.status(500).json({
                message: 'Gagal menambahkan sparepart'
            });
        }

        res.status(201).json({
            message: 'Sparepart berhasil ditambahkan',
            kode_sparepart: kode_sparepart
        });
    });
});

// PUT: Mengupdate sparepart berdasarkan kode
app.put('/api/sparepart/:kode_sparepart', (req, res) => {
    const kode = req.params.kode_sparepart;
    const { nama_sparepart, kategori, merk, harga_beli, harga_jual, stok, satuan } = req.body;

    const sql = 'UPDATE sparepart SET nama_sparepart = ?, kategori = ?, merk = ?, harga_beli = ?, harga_jual = ?, stok = ?, satuan = ? WHERE kode_sparepart = ?';
    const values = [nama_sparepart, kategori, merk, harga_beli, harga_jual, stok, satuan, kode];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Gagal mengupdate sparepart:', err.message);
            return res.status(500).json({
                message: 'Gagal mengupdate sparepart'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Sparepart tidak ditemukan'
            });
        }

        res.json({
            message: 'Sparepart berhasil diupdate',
            kode_sparepart: kode
        });
    });
});

// DELETE: Menghapus sparepart berdasarkan kode
app.delete('/api/sparepart/:kode_sparepart', (req, res) => {
    const kode = req.params.kode_sparepart;

    db.query(
        'DELETE FROM sparepart WHERE kode_sparepart = ?',
        [kode],
        (err, result) => {
            if (err) {
                console.error('Gagal menghapus sparepart:', err.message);
                return res.status(500).json({
                    message: 'Gagal menghapus sparepart'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Sparepart tidak ditemukan'
                });
            }

            res.json({
                message: 'Sparepart berhasil dihapus',
                kode_sparepart: kode
            });
        }
    );
});

/* ================================
   REST API karyawan
================================ */
// GET: Mengambil semua karyawan
app.get('/api/karyawan', (req, res) => {
    const sql = 'SELECT * FROM karyawan ORDER BY kode_karyawan';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data API:', err.message);
            return res.status(500).json({
                message: 'Gagal mengambil data karyawan'
            });
        }

        res.json(results);
    });
});
// GET: Mengambil karyawan berdasarkan kode
app.get('/api/karyawan/:kode_karyawan', (req, res) => {
    const kode = req.params.kode_karyawan;

    db.query(
        'SELECT * FROM karyawan WHERE kode_karyawan = ?',
        [kode],
        (err, results) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({
                    message: 'Gagal mengambil data karyawan'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Karyawan tidak ditemukan'
                });
            }

            res.json(results[0]);
        }
    );
});

//post: Menambahkan karyawan baru
app.post('/api/karyawan', (req, res) => {
    const { kode_karyawan, nama_karyawan, alamat, no_telepon, jabatan } = req.body;

    const sql = 'INSERT INTO karyawan (kode_karyawan, nama_karyawan, alamat, no_telepon, jabatan) VALUES (?, ?, ?, ?, ?)';
    const values = [kode_karyawan, nama_karyawan, alamat, no_telepon, jabatan];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Gagal menambahkan karyawan:', err.message);
            return res.status(500).json({
                message: 'Gagal menambahkan karyawan'
            });
        }

        res.status(201).json({
            message: 'Karyawan berhasil ditambahkan',
            kode_karyawan: kode_karyawan
        });
    });
});

// PUT: Mengupdate karyawan berdasarkan kode
app.put('/api/karyawan/:kode_karyawan', (req, res) => {
    const kode = req.params.kode_karyawan;
    const { nama_karyawan, alamat, no_telepon, jabatan } = req.body;

    const sql = 'UPDATE karyawan SET nama_karyawan = ?, alamat = ?, no_telepon = ?, jabatan = ? WHERE kode_karyawan = ?';
    const values = [nama_karyawan, alamat, no_telepon, jabatan, kode];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Gagal mengupdate karyawan:', err.message);
            return res.status(500).json({
                message: 'Gagal mengupdate karyawan'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Karyawan tidak ditemukan'
            });
        }

        res.json({
            message: 'Karyawan berhasil diupdate',
            kode_karyawan: kode
        });
    });
});

// DELETE: Menghapus karyawan berdasarkan kode
app.delete('/api/karyawan/:kode_karyawan', (req, res) => {
    const kode = req.params.kode_karyawan;

    db.query(
        'DELETE FROM karyawan WHERE kode_karyawan = ?',
        [kode],
        (err, result) => {
            if (err) {
                console.error('Gagal menghapus karyawan:', err.message);
                return res.status(500).json({
                    message: 'Gagal menghapus karyawan'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Karyawan tidak ditemukan'
                });
            }

            res.json({
                message: 'Karyawan berhasil dihapus',
                kode_karyawan: kode
            });
        }
    );
}); 

/* ================================
   REST API PELANGGAN
================================ */
// GET: Mengambil semua pelanggan
app.get('/api/pelanggan', (req, res) => {
    const sql = 'SELECT * FROM pelanggan ORDER BY kode_pelanggan';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data API:', err.message);
            return res.status(500).json({
                message: 'Gagal mengambil data pelanggan'
            });
        }

        res.json(results);
    });
});

// GET: Mengambil pelanggan berdasarkan kode
app.get('/api/pelanggan/:kode_pelanggan', (req, res) => {
    const kode = req.params.kode_pelanggan;

    db.query(
        'SELECT * FROM pelanggan WHERE kode_pelanggan = ?',
        [kode],
        (err, results) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({
                    message: 'Gagal mengambil data pelanggan'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Pelanggan tidak ditemukan'
                });
            }

            res.json(results[0]);
        }
    );
});

// POST: Menambahkan pelanggan baru
app.post('/api/pelanggan', (req, res) => {
    const { kode_pelanggan, nama_pelanggan, alamat, no_telepon } = req.body;

    const sql = 'INSERT INTO pelanggan (kode_pelanggan, nama_pelanggan, alamat, no_telepon) VALUES (?, ?, ?, ?)';
    const values = [kode_pelanggan, nama_pelanggan, alamat, no_telepon];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Gagal menambahkan pelanggan:', err.message);
            return res.status(500).json({
                message: 'Gagal menambahkan pelanggan'
            });
        }

        res.status(201).json({
            message: 'Pelanggan berhasil ditambahkan',
            kode_pelanggan: kode_pelanggan
        });
    });
});

// PUT: Mengupdate pelanggan berdasarkan kode
app.put('/api/pelanggan/:kode_pelanggan', (req, res) => {
    const kode = req.params.kode_pelanggan;
    const { nama_pelanggan, alamat, no_telepon } = req.body;

    const sql = 'UPDATE pelanggan SET nama_pelanggan = ?, alamat = ?, no_telepon = ? WHERE kode_pelanggan = ?';
    const values = [nama_pelanggan, alamat, no_telepon, kode];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Gagal mengupdate pelanggan:', err.message);
            return res.status(500).json({
                message: 'Gagal mengupdate pelanggan'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Pelanggan tidak ditemukan'
            });
        }

        res.json({
            message: 'Pelanggan berhasil diupdate',
            kode_pelanggan: kode
        });
    });
});

// DELETE: Menghapus pelanggan berdasarkan kode
app.delete('/api/pelanggan/:kode_pelanggan', (req, res) => {
    const kode = req.params.kode_pelanggan;

    db.query(
        'DELETE FROM pelanggan WHERE kode_pelanggan = ?',
        [kode],
        (err, result) => {
            if (err) {
                console.error('Gagal menghapus pelanggan:', err.message);
                return res.status(500).json({
                    message: 'Gagal menghapus pelanggan'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Pelanggan tidak ditemukan'
                });
            }

            res.json({
                message: 'Pelanggan berhasil dihapus',
                kode_pelanggan: kode
            });
        }
    );
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});