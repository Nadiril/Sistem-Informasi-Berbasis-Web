-- ============================================================
-- Bengkel Jaya — Skema Database
-- MySQL 8 / MariaDB
-- Jalankan: mysql -u root -p < db.sql
--
-- Catatan: semua tabel memakai kode sebagai PRIMARY KEY (bukan id),
-- sesuai kolom yang dipakai REST API di app.js.
-- ============================================================

CREATE DATABASE bengkeljaya_db

USE bengkeljaya_db;

-- ------------------------------------------------------------
-- 1. sparepart
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sparepart (
    kode_sparepart VARCHAR(10) PRIMARY KEY,
    nama_sparepart VARCHAR(100),
    kategori VARCHAR(50),
    merk VARCHAR(50),
    harga_beli DECIMAL(10, 2),
    harga_jual DECIMAL(10, 2),
    stok INT,
    satuan VARCHAR(20)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- 2. karyawan
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS karyawan (
    kode_karyawan VARCHAR(10) PRIMARY KEY,
    nama_karyawan VARCHAR(100) NOT NULL,
    alamat VARCHAR(255),
    no_telepon VARCHAR(20),
    jabatan VARCHAR(50)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- 3. pelanggan
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pelanggan (
    kode_pelanggan VARCHAR(10) PRIMARY KEY,
    nama_pelanggan VARCHAR(100) NOT NULL,
    alamat VARCHAR(255),
    no_telepon VARCHAR(20)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- 4. transaksi (header nota servis / penjualan)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transaksi (
    kode_transaksi VARCHAR(15) PRIMARY KEY,
    tanggal DATE NOT NULL,
    kode_pelanggan VARCHAR(10) NOT NULL,
    kode_karyawan VARCHAR(10),
    total_bayar DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_transaksi_pelanggan
        FOREIGN KEY (kode_pelanggan) REFERENCES pelanggan (kode_pelanggan)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_transaksi_karyawan
        FOREIGN KEY (kode_karyawan) REFERENCES karyawan (kode_karyawan)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- 5. detail_transaksi (rincian sparepart per transaksi)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS detail_transaksi (
    kode_transaksi VARCHAR(15) NOT NULL,
    kode_sparepart VARCHAR(10) NOT NULL,
    jumlah INT NOT NULL DEFAULT 1,
    harga_satuan DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (kode_transaksi, kode_sparepart),
    CONSTRAINT fk_detail_transaksi
        FOREIGN KEY (kode_transaksi) REFERENCES transaksi (kode_transaksi)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detail_sparepart
        FOREIGN KEY (kode_sparepart) REFERENCES sparepart (kode_sparepart)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Verifikasi struktur tabel
-- ------------------------------------------------------------
DESC sparepart;
DESC karyawan;
DESC pelanggan;
DESC transaksi;
DESC detail_transaksi;
