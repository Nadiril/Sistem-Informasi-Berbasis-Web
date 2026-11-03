CREATE DATABASE bengkeljaya_db;
use bengkeljaya_db;


create table sparepart(
    kode_sparepart VARCHAR(10) PRIMARY KEY,
    nama_sparepart VARCHAR(100),
    kategori VARCHAR(50),
    merk VARCHAR(50),
    harga_beli DECIMAL(10, 2),
    harga_jual DECIMAL(10, 2),
    stok INT,
    satuan VARCHAR(20)
);








//Memberikan perintah untuk menampilkan struktur tabel pada database
DESC sparepart;
DESC karyawan;
DESC pelanggan;
DESC transaksi;
DESC detail_transaksi;