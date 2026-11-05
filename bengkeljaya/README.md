# Bengkel Jaya CRUD

Sistem informasi berbasis web sederhana untuk mengelola data bengkel. Dibangun dengan **Node.js + Express 5 + MySQL**, dengan **REST API** di backend dan **frontend statis (HTML/CSS/JavaScript)** yang memanggil API tersebut.

Tiga modul yang sudah aktif: **Sparepart**, **Karyawan**, dan **Pelanggan**. Ketiganya memakai pola CRUD (Create, Read, Update, Delete) yang sama.

---

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Runtime | Node.js |
| Web framework | Express 5 |
| Database | MySQL (driver `mysql2`) |
| Frontend | HTML + CSS + JavaScript (vanilla, tanpa build step) |
| Konfigurasi | `dotenv` (`.env`) |

---

## Cara Menjalankan

1. Pastikan MySQL berjalan di `localhost`.
2. Buat database dan tabel dengan menjalankan `db.sql`:
   ```bash
   mysql -u root -p < db.sql
   ```
   Skrip ini membuat database `bengkeljaya_db` beserta 5 tabel: `sparepart`, `karyawan`, `pelanggan`, `transaksi`, dan `detail_transaksi`. Semua memakai `CREATE TABLE IF NOT EXISTS`, jadi aman dijalankan berulang tanpa menghapus data yang ada.
   - `sparepart`: `kode_sparepart` (PK), `nama_sparepart`, `kategori`, `merk`, `harga_beli`, `harga_jual`, `stok`, `satuan`
   - `karyawan`: `kode_karyawan` (PK), `nama_karyawan`, `alamat`, `no_telepon`, `jabatan`
   - `pelanggan`: `kode_pelanggan` (PK), `nama_pelanggan`, `alamat`, `no_telepon`
   - `transaksi`: `kode_transaksi` (PK), `tanggal`, `kode_pelanggan` (FK), `kode_karyawan` (FK), `total_bayar`
   - `detail_transaksi`: `kode_transaksi` + `kode_sparepart` (PK gabungan), `jumlah`, `harga_satuan`, `subtotal`

3. Buat file `.env` di root project (file ini di-ignore git):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=bengkeljaya_db
   PORT=3000
   ```
   Semua nilai punya default di `db.js`, tapi `DB_NAME` sebaiknya diisi eksplisit.

4. Install dependency (jika belum):
   ```bash
   npm install
   ```

5. Jalankan server:
   ```bash
   npm start      # node app.js
   npm run dev    # nodemon app.js (auto-restart)
   ```

6. Buka `http://localhost:3000`.

---

## Struktur Folder

```
bengkeljaya-crud/
├── app.js              # Server Express + seluruh route REST API
├── db.js               # Connection pool MySQL (dari .env)
├── db.sql              # Skema database
├── public/             # Frontend statis, disajikan di /
│   ├── index.html      # Satu halaman dengan tab Sparepart / Karyawan / Pelanggan
│   ├── app.js          # Konfigurasi entitas, render tabel, modal form, fetch API
│   └── style.css       # Styling
├── package.json        # Dependency & script
└── README.md
```

---

## Konfigurasi Database

`db.js` membuat **connection pool** `mysql2` dengan konfigurasi berikut:

| Env var | Default di `db.js` | Keterangan |
|---|---|---|
| `DB_HOST` | `localhost` | Host MySQL |
| `DB_USER` | `root` | User MySQL |
| `DB_PASSWORD` | _(kosong)_ | Password MySQL |
| `DB_NAME` | `isi_database_anda` | **Wajib diisi** di `.env` |
| `PORT` | `3000` | Port server Express (dibaca di `app.js`) |

Pool memakai `connectionLimit: 10`. Saat start, `db.js` mencoba satu koneksi dan mencetak `Berhasil terhubung ke MySQL!` atau pesan error.

---

## REST API

Base URL: `http://localhost:3000`. Semua request dan response memakai **JSON**. Kolom primary key tiap tabel adalah kode (`kode_sparepart`, `kode_karyawan`, `kode_pelanggan`), bukan `id`.

### Sparepart

| Method | Endpoint | Fungsi | Sukses |
|---|---|---|---|
| GET | `/api/sparepart` | Semua data, urut `kode_sparepart` | 200 |
| GET | `/api/sparepart/:kode_sparepart` | Satu data | 200 / 404 |
| POST | `/api/sparepart` | Tambah data | 201 |
| PUT | `/api/sparepart/:kode_sparepart` | Update data | 200 / 404 |
| DELETE | `/api/sparepart/:kode_sparepart` | Hapus data | 200 / 404 |

Field: `kode_sparepart`, `nama_sparepart`, `kategori`, `merk`, `harga_beli`, `harga_jual`, `stok`, `satuan`.

### Karyawan

| Method | Endpoint | Fungsi | Sukses |
|---|---|---|---|
| GET | `/api/karyawan` | Semua data, urut `kode_karyawan` | 200 |
| GET | `/api/karyawan/:kode_karyawan` | Satu data | 200 / 404 |
| POST | `/api/karyawan` | Tambah data | 201 |
| PUT | `/api/karyawan/:kode_karyawan` | Update data | 200 / 404 |
| DELETE | `/api/karyawan/:kode_karyawan` | Hapus data | 200 / 404 |

Field: `kode_karyawan`, `nama_karyawan`, `alamat`, `no_telepon`, `jabatan`.

### Pelanggan

| Method | Endpoint | Fungsi | Sukses |
|---|---|---|---|
| GET | `/api/pelanggan` | Semua data, urut `kode_pelanggan` | 200 |
| GET | `/api/pelanggan/:kode_pelanggan` | Satu data | 200 / 404 |
| POST | `/api/pelanggan` | Tambah data | 201 |
| PUT | `/api/pelanggan/:kode_pelanggan` | Update data | 200 / 404 |
| DELETE | `/api/pelanggan/:kode_pelanggan` | Hapus data | 200 / 404 |

Field: `kode_pelanggan`, `nama_pelanggan`, `alamat`, `no_telepon`.

### Format Response

- `GET` daftar → array of object.
- `GET` detail → object.
- `POST` → `201 { "message": "...", "kode_sparepart": "SP-001" }`
- `PUT` / `DELETE` → `200 { "message": "...", "kode_sparepart": "SP-001" }`
- Error → `404 { "message": "Sparepart tidak ditemukan" }` atau `500 { "message": "Gagal ..." }`

Contoh:

```bash
# Ambil semua sparepart
curl http://localhost:3000/api/sparepart

# Tambah sparepart
curl -X POST http://localhost:3000/api/sparepart \
  -H "Content-Type: application/json" \
  -d '{"kode_sparepart":"SP-001","nama_sparepart":"Filter Oli","kategori":"Filter","merk":"Honda","harga_beli":15000,"harga_jual":25000,"stok":10,"satuan":"pcs"}'

# Update sparepart
curl -X PUT http://localhost:3000/api/sparepart/SP-001 \
  -H "Content-Type: application/json" \
  -d '{"nama_sparepart":"Filter Oli","kategori":"Filter","merk":"Honda","harga_beli":15000,"harga_jual":26000,"stok":8,"satuan":"pcs"}'

# Hapus sparepart
curl -X DELETE http://localhost:3000/api/sparepart/SP-001
```

Selain `/api/*`, `express.static('public')` menyajikan `index.html`, `app.js`, dan `style.css` di root `/`.

---

## Frontend

Frontend adalah satu halaman (`public/index.html`) dengan tiga tab. Semua perilakunya diatur oleh objek `entities` di `public/app.js`:

```js
const entities = {
    sparepart: { title, subtitle, kode, columns: [...], fields: [...] },
    karyawan: { ... },
    pelanggan: { ... }
};
```

- `columns` → kolom tabel (mendukung `format: 'rupiah'`).
- `fields` → input pada modal tambah/ubah (`type`, `required`).
- `kode` → nama kolom primary key; dipakai untuk URL `PUT`/`DELETE`.

Alurnya: tab aktif menentukan `currentEntity` → `loadData()` memanggil `GET /api/:entity` → tombol **Tambah** membuka modal kosong, tombol **Ubah** membuka modal terisi (input kode dinonaktifkan) → submit mengirim `POST` atau `PUT` → tombol **Hapus** mengirim `DELETE` setelah konfirmasi.

---

## Menambah Modul Baru (contoh: Transaksi)

1. Tambah entri baru di objek `entities` pada `public/app.js` (title, subtitle, kode, columns, fields). Tab dan form akan ikut menyesuaikan otomatis.
2. Tambah tombol tab di `public/index.html` jika ingin modul tampil sebagai tab:
   ```html
   <button class="tab-button" data-entity="transaksi" type="button">Transaksi</button>
   ```
3. Tambah 5 route di `app.js` mengikuti pola yang sudah ada: `GET` daftar, `GET` detail, `POST`, `PUT`, `DELETE` dengan prefix `/api/transaksi`.
4. Pastikan tabelnya ada di database.

---

## Catatan

- Semua query memakai **placeholder `?`**, jadi nilai dari user tidak pernah disisipkan langsung ke string SQL (aman dari SQL injection).
- Kredensial database sekarang dibaca dari `.env`, tidak lagi hardcode. `.env` sudah masuk `.gitignore`.
- Belum ada autentikasi/login — halaman dan API masih terbuka untuk siapa saja.
- Validasi input masih minimal: API tidak mengecek field wajib atau tipe data, sehingga `POST` dengan body tidak lengkap tetap diteruskan ke MySQL (dan bisa gagal dengan 500 bila kolom `NOT NULL`).
- `ejs` dan `mysql` masih tercatat di `package.json` tetapi **tidak dipakai** oleh kode saat ini (frontend statis, driver yang dipakai `mysql2`). Bisa dihapus dengan `npm uninstall ejs mysql`.
