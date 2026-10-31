# Bengkel Jaya CRUD

Sistem informasi berbasis web sederhana untuk mengelola data bengkel. Dibangun dengan **Node.js + Express + EJS + MySQL**, mengikuti pola CRUD (Create, Read, Update, Delete).

Saat ini modul yang aktif adalah **Sparepart**. Modul berikutnya (**Karyawan**) tinggal mengikuti pola route dan view yang sama.

---

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Runtime | Node.js |
| Web framework | Express 5 |
| Template engine | EJS (server-side rendering) |
| Database | MySQL (driver `mysql2`) |

---

## Cara Menjalankan

1. Pastikan MySQL berjalan di `localhost`
2. Buat database `bengkeljaya_db` dan tabel `sparepart` (kolom: `id_sparepart`, `kode_sparepart`, `nama_sparepart`, `kategori`, `merk`, `harga_beli`, `harga_jual`, `stok`, `satuan`)
3. Sesuaikan koneksi database di `db.js` (host, user, password)
4. Install dependency (jika belum):
   ```bash
   npm install
   ```
5. Jalankan server:
   ```bash
   npm start
   ```
6. Buka `http://localhost:3000`

---

## Struktur Folder

```
bengkeljaya-crud/
├── app.js                  # Server Express + route CRUD sparepart
├── db.js                   # Koneksi ke MySQL
├── package.json            # Dependency & script
└── views/
    ├── indexSparepart.ejs   # Daftar data sparepart
    ├── addSparepart.ejs     # Form tambah sparepart
    └── editSparepart.ejs    # Form edit sparepart
```

---

## Penjelasan Source Code

### `db.js`
Membuat koneksi ke MySQL dengan `mysql2.createConnection` dan mengekspornya agar bisa dipakai semua query di `app.js`.

### `app.js`

Bagian utama terdiri dari 2 hal:

1. **Konfigurasi Express**
   ```js
   app.set('view engine', 'ejs');
   app.use(express.urlencoded({ extended: true })); // membaca data form
   ```

2. **6 route CRUD** — tiap aksi punya route sendiri dan saling berkaitan:

   | Route | Fungsi |
   |---|---|
   | `GET /` | Ambil semua data (`SELECT *`) → render `indexSparepart` |
   | `GET /add` | Tampilkan form tambah → render `addSparepart` |
   | `POST /add` | Ambil isi form dari `req.body` → `INSERT INTO sparepart` |
   | `GET /edit/:id` | Ambil 1 data by id → render `editSparepart` (404 jika tidak ada) |
   | `POST /edit/:id` | Ambil isi form → `UPDATE sparepart WHERE id_sparepart = ?` |
   | `POST /delete/:id` | `DELETE FROM sparepart WHERE id_sparepart = ?` |

   Semua query memakai **parameter `?`**, nilai dari user tidak pernah ditulis langsung ke string SQL.

### `views/*.ejs`
Halaman HTML dengan template EJS. `indexSparepart.ejs` menampilkan tabel data + tombol Edit/Hapus, sedangkan `addSparepart.ejs` dan `editSparepart.ejs` berisi form input.

---

## Alur Route CRUD (Sparepart)

| Aksi | Method | Route | View |
|---|---|---|---|
| Lihat daftar | GET | `/` | `indexSparepart.ejs` |
| Form tambah | GET | `/add` | `addSparepart.ejs` |
| Simpan data baru | POST | `/add` | — |
| Form edit | GET | `/edit/:id` | `editSparepart.ejs` |
| Simpan perubahan | POST | `/edit/:id` | — |
| Hapus data | POST | `/delete/:id` | — |

---

## Menambah Modul Baru (contoh: Karyawan)

Ikuti pola yang sudah ada, dengan prefix route `/karyawan` supaya tidak bentrok dengan sparepart:

1. Buat 3 file view: `indexKaryawan.ejs`, `addKaryawan.ejs`, `editKaryawan.ejs`
2. Tambah 6 route di `app.js` dengan menyalin pola route sparepart, lalu ganti:
   - nama tabel → `karyawan`
   - kolom id → `id_karyawan`
   - isi form → `kode_karyawan`, `nama_karyawan`, `alamat`, `no_hp`, `jabatan`
   - render view → `*Karyawan`

Route yang dibutuhkan:

| Aksi | Method | Route |
|---|---|---|
| Lihat daftar | GET | `/karyawan` |
| Form tambah | GET | `/karyawan/add` |
| Simpan data baru | POST | `/karyawan/add` |
| Form edit | GET | `/karyawan/edit/:id` |
| Simpan perubahan | POST | `/karyawan/edit/:id` |
| Hapus data | POST | `/karyawan/delete/:id` |

---

## Catatan Keamanan

- Semua nilai dari user dikirim sebagai **parameter query (`?`)**, sehingga aman dari **SQL injection**.
- Password database ditulis langsung di `db.js`. Untuk production, sebaiknya pindahkan ke **environment variable** (`.env`).
- Belum ada autentikasi/login — halaman CRUD masih terbuka untuk siapa saja.
