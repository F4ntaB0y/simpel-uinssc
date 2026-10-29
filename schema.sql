-- ====================================================================
-- SKEMA DATABASE MYSQL UNTUK LARAGON - SISTEM PENGADUAN SIMPEL-UINSSC
-- Kerja Praktik 2026 - UIN Siber Syekh Nurjati Cirebon
-- ====================================================================

CREATE DATABASE IF NOT EXISTS db_simpel_uinssc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_simpel_uinssc;

-- --------------------------------------------------------------------
-- 1. TABEL PENGADUAN LAPORAN SARPRAS (REPORTS)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS reports;

CREATE TABLE reports (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    namaPelapor VARCHAR(100) NOT NULL,
    nimNip VARCHAR(50) NOT NULL,
    peranPelapor VARCHAR(50) DEFAULT 'Mahasiswa',
    kontakPelapor VARCHAR(50) DEFAULT '',
    gedung VARCHAR(150) NOT NULL,
    ruangan VARCHAR(150) NOT NULL,
    lat VARCHAR(50) DEFAULT '-6.735000',
    lng VARCHAR(50) DEFAULT '108.533800',
    kategori VARCHAR(100) NOT NULL,
    urgensi VARCHAR(50) DEFAULT 'Sedang',
    deskripsi TEXT NOT NULL,
    foto LONGTEXT NULL,
    status VARCHAR(50) DEFAULT 'Diajukan',
    teknisi VARCHAR(100) DEFAULT 'Belum Ditunjuk',
    catatanAdmin TEXT NULL,
    tanggalLapor DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tanggalUpdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Awal (10 Laporan Demo UINSSC)
INSERT INTO reports (id, namaPelapor, nimNip, peranPelapor, kontakPelapor, gedung, ruangan, lat, lng, kategori, urgensi, deskripsi, status, teknisi, catatanAdmin, tanggalLapor, tanggalUpdate) VALUES
('TRK-2026-001', 'Budi Santoso', '220101844', 'Mahasiswa', '081234567891', 'Laboratorium Terpadu & Pusat ICT', 'Lab Komputer 3 (Lt. 2)', '-6.735000', '108.533800', 'AC & Pendingin', 'Tinggi', 'AC nomor 2 berbunyi kencang dan meneteskan air lumayan deras tepat di atas unit komputer meja 14.', 'Diproses', 'Bambang Sudiro', 'Freon bocor & pembersihan filter sedang dilakukan.', '2026-07-28 09:15:00', '2026-07-28 14:20:00'),
('TRK-2026-002', 'Dr. Ir. Hendra Wijaya', '1985031002', 'Dosen', '08119876543', 'Gedung Cyber UINSSC', 'Ruang Kuliah Cyber.204', '-6.737100', '108.531500', 'Proyektor & Sound System', 'Darurat', 'Proyektor gantung mati total saat jam perkuliahan. Lampu indikator merah berkedip.', 'Diajukan', 'Belum Ditunjuk', 'Laporan baru diterima, menunggu verifikasi lapangan.', '2026-07-30 08:30:00', '2026-07-30 08:30:00'),
('TRK-2026-003', 'Siti Aminah', '230401102', 'Mahasiswa', '085712344321', 'Area Gedung Seberang Kampus Utama', 'Toilet Wanita Lantai 1', '-6.736200', '108.532700', 'Sanitasi & Toilet', 'Sedang', 'Kran air wastafel sebelah kiri tidak bisa diputar dan air terus mengalir terbuang.', 'Selesai', 'Rahmat Hidayat', 'Penggantian seal kran baru telah selesai dikerjakan.', '2026-07-25 11:00:00', '2026-07-26 10:15:00'),
('TRK-2026-004', 'Ahmad Fauzi, M.T.', '1990041501', 'Staf', '081399887766', 'Gedung Rektorat UINSSC', 'Ruang Rapat Utama Lt. 3', '-6.735200', '108.533200', 'Kelistrikan & Lampu', 'Tinggi', 'Lampu LED ceiling berkedip terus dan menimbulkan suara dengung saat rapat berlangsung.', 'Diproses', 'Joko Purnomo', 'Driver ballast LED replacement sedang disiapkan oleh tim kelistrikan.', '2026-07-29 13:45:00', '2026-07-29 16:10:00'),
('TRK-2026-005', 'Nabila Putri', '210203045', 'Mahasiswa', '082155443322', 'Fakultas Ilmu Tarbiyah (FITK)', 'Ruang Dosen Tarbiyah Lt. 2', '-6.734800', '108.533500', 'Jaringan & Internet', 'Darurat', 'Access Point WiFi lokasi FITK lantai 2 tidak memancarkan sinyal SSID kampus.', 'Diajukan', 'Belum Ditunjuk', 'Menunggu pengecekan switch jaringan ICT.', '2026-07-31 10:00:00', '2026-07-31 10:00:00'),
('TRK-2026-006', 'Dedi Kurniawan', '1988022003', 'Staf', '087811223344', 'Fakultas Syariah & Ekonomi (FSEI)', 'Selasar Utama Lt. 1', '-6.735400', '108.533700', 'Bangunan & Infrastruktur', 'Sedang', 'Ubin keramik selasar pecah terangkat membahayakan mahasiswa yang melintas.', 'Selesai', 'Sukarman', 'Pemasangan keramik pengganti dan semen perekat telah selesai rapi.', '2026-07-20 14:10:00', '2026-07-22 09:30:00'),
('TRK-2026-007', 'Dewi Lestari', '220501099', 'Mahasiswa', '089677889900', 'Fakultas Ushuluddin & Adab (FUAD)', 'Ruang Seminar 102', '-6.734500', '108.534000', 'Pintu & Jendela', 'Rendah', 'Engsel pintu kayu belakang macet kencang dan kunci engsel sulit diputar.', 'Diajukan', 'Belum Ditunjuk', 'Laporan tercatat di log perbaikan rutin.', '2026-07-31 11:20:00', '2026-07-31 11:20:00'),
('TRK-2026-008', 'Rizky Pratama', '230102077', 'Mahasiswa', '081299001122', 'Gedung Perpustakaan Pusat', 'Ruang Baca & Komputer Lt. 2', '-6.735600', '108.534200', 'Kelistrikan & Lampu', 'Tinggi', 'Stop kontak meja belajar nomor 5 percikan api kecil saat colokan dilepas.', 'Diproses', 'Joko Purnomo', 'Stop kontak diisolasi sementara dan stop kontak baru disiapkan.', '2026-07-30 15:30:00', '2026-07-30 17:00:00'),
('TRK-2026-009', 'Ust. Farhan Ridwan', '1979061201', 'Dosen', '085211447788', 'Gedung Pascasarjana & Ma\'had', 'Aula Utama Pascasarjana', '-6.734800', '108.530800', 'Proyektor & Sound System', 'Sedang', 'Mic wireless podium sering mendengung (feedback noise) tinggi.', 'Selesai', 'Hendra Wijaya', 'Penyetelan mixer audio dan peredam frekuensi equalizer selesai.', '2026-07-24 08:00:00', '2026-07-24 11:30:00'),
('TRK-2026-010', 'Tri Handoko', '200301144', 'Mahasiswa', '083811992233', 'Kampus 2 Saladara UINSSC', 'Ruang Serbaguna Lt. 1', '-6.744000', '108.525600', 'Bangunan & Infrastruktur', 'Tinggi', 'Terdapat rembesan air hujan dari atap saat hujan deras di dekat panggung utama.', 'Diajukan', 'Belum Ditunjuk', 'Diserahkan ke tim logistik Kampus 2 Saladara.', '2026-07-31 07:15:00', '2026-07-31 07:15:00');

-- --------------------------------------------------------------------
-- 2. TABEL MANAJEMEN AKUN ADMIN, PETUGAS & MITRA (DENGAN PENUGASAN WILAYAH)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS staff_accounts;

CREATE TABLE staff_accounts (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    username VARCHAR(100) NULL,
    password VARCHAR(100) NULL,
    nama VARCHAR(150) NOT NULL,
    role ENUM('admin', 'petugas', 'mitra') NOT NULL DEFAULT 'petugas',
    bidang VARCHAR(150) NOT NULL,
    wa VARCHAR(50) NOT NULL,
    wilayah TEXT NULL COMMENT 'JSON array kode zona wilayah tugas staff',
    status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Akun Admin, Mitra Kampus & Tim Petugas Berserta Zonasi Tugas
INSERT INTO staff_accounts (id, username, password, nama, role, bidang, wa, wilayah, status) VALUES
('ADM-01', 'admin_fauzi', 'admin123', 'Ahmad Fauzi, S.T.', 'admin', 'Admin Sarpras Kampus Utama', '081234560001', '["kampus_utama","gedung_seberang"]', 'Aktif'),
('ADM-02', 'admin_dewi', 'admin123', 'Dewi Sartika, S.Kom.', 'admin', 'Admin Gedung Cyber & IT', '081234560002', '["gedung_cyber","pascasarjana_mahad"]', 'Aktif'),
('MTR-01', 'mitra', 'mitra123', 'Kantin Berkah Sejahtera (Ibu Sumiati)', 'mitra', 'Kantin Kampus & Pujasera', '081288990001', '["kampus_utama"]', 'Aktif'),
('MTR-02', 'mitra_bank', 'mitra123', 'Bank Syariah Mitra Kampus', 'mitra', 'Perbankan & ATM Center Kampus', '081288990002', '["kampus_utama"]', 'Aktif'),
('MTR-03', 'indocare', 'mitra123', 'PT. Indocare Facility Services', 'mitra', 'Vendor Kebersihan & Hygiene', '081288990003', '["kampus_utama","gedung_cyber","gedung_seberang","pascasarjana_mahad","area_saladara"]', 'Aktif'),
('TKN-01', 'bambang', 'petugas123', 'Bambang Sudiro', 'petugas', 'AC & Pendingin (HVAC)', '081298765001', '["kampus_utama","gedung_cyber"]', 'Aktif'),
('TKN-02', 'joko', 'petugas123', 'Joko Purnomo', 'petugas', 'Kelistrikan & Lampu', '081298765002', '["kampus_utama","gedung_seberang","area_saladara"]', 'Aktif'),
('TKN-03', 'rahmat', 'petugas123', 'Rahmat Hidayat', 'petugas', 'Sanitasi & Plumbing', '081298765003', '["kampus_utama","pascasarjana_mahad"]', 'Aktif'),
('TKN-04', 'hendra', 'petugas123', 'Hendra Wijaya', 'petugas', 'Proyektor & Sound System', '081298765004', '["kampus_utama","gedung_cyber"]', 'Aktif'),
('TKN-05', 'sukarman', 'petugas123', 'Sukarman', 'petugas', 'Sipil & Bangunan', '081298765005', '["kampus_utama","gedung_seberang"]', 'Aktif'),
('TKN-06', 'ilham', 'petugas123', 'Ilham Kurnia', 'petugas', 'Jaringan & Internet (ICT)', '081298765006', '["kampus_utama","gedung_cyber","area_saladara"]', 'Aktif'),
('TKN-07', 'agus', 'petugas123', 'Agus Setiawan', 'petugas', 'Pintu, Kunci & Mebel', '081298765007', '["kampus_utama"]', 'Aktif');

-- --------------------------------------------------------------------
-- 3. TABEL WILAYAH KAWASAN KAMPUS & BATAS GEOFENCING (CAMPUS_ZONES)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS campus_zones;

CREATE TABLE campus_zones (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    key_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    color VARCHAR(30) NOT NULL DEFAULT '#10b981',
    icon VARCHAR(50) NOT NULL DEFAULT 'fa-building-columns',
    desc_info TEXT NULL,
    polygon_coordinates LONGTEXT NOT NULL COMMENT 'JSON array koordinat [[lat, lng], ...]',
    status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data 5 Kawasan Resmi Kampus UINSSC Beserta Polygon Geofencing
INSERT INTO campus_zones (id, key_code, name, short_name, color, icon, desc_info, polygon_coordinates) VALUES
('ZONE-01', 'kampus_utama', 'Kawasan Kampus Utama', 'Kampus Utama', '#10b981', 'fa-building-columns', 'Gedung Rektorat, ICT Center, FITK, FUAD, FSEI, Perpus Pusat', '[[-6.7335, 108.5320], [-6.7335, 108.5355], [-6.7370, 108.5355], [-6.7370, 108.5320]]'),
('ZONE-02', 'gedung_cyber', 'Kawasan Gedung Cyber', 'Gedung Cyber', '#06b6d4', 'fa-laptop-code', 'Smart Classrooms, Data Center, Multimedia Lab, Cyber Security Center', '[[-6.7360, 108.5305], [-6.7360, 108.5325], [-6.7385, 108.5325], [-6.7385, 108.5305]]'),
('ZONE-03', 'gedung_seberang', 'Kawasan Kampus Sebrang', 'Kampus Sebrang', '#a855f7', 'fa-school', 'Fasilitas perkuliahan, ruang ormawa, student center seberang jalan utama', '[[-6.7350, 108.5315], [-6.7350, 108.5332], [-6.7375, 108.5332], [-6.7375, 108.5315]]'),
('ZONE-04', 'pascasarjana_mahad', 'Kawasan Pascasarjana & Mahad', 'Pascasarjana & Mahad', '#f59e0b', 'fa-mosque', 'Gedung Pascasarjana, Asrama Ma\'had Al-Jami\'ah, Masjid Kampus', '[[-6.7338, 108.5298], [-6.7338, 108.5318], [-6.7362, 108.5318], [-6.7362, 108.5298]]'),
('ZONE-05', 'area_saladara', 'Kawasan Lab Saladara', 'Lab Saladara', '#ec4899', 'fa-flask-vial', 'Fasilitas Kampus 2 Saladara, Kebun Riset Agrotek, Laboratorium Terbuka', '[[-6.7420, 108.5235], [-6.7420, 108.5275], [-6.7460, 108.5275], [-6.7460, 108.5235]]');

-- --------------------------------------------------------------------
-- 4. TABEL KATEGORI FASILITAS DINAMIS (CATEGORIES)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'fa-wrench',
    color VARCHAR(30) NOT NULL DEFAULT '#005a36',
    sla_hours INT NOT NULL DEFAULT 24,
    deskripsi VARCHAR(255) NULL,
    status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data Kategori Fasilitas Kampus
INSERT INTO categories (id, name, icon, color, sla_hours, deskripsi, status) VALUES
('CAT-01', 'AC & Pendingin', 'fa-snowflake', '#06b6d4', 24, 'Perbaikan unit AC, split duct, kompresor dan kebocoran freon', 'Aktif'),
('CAT-02', 'Kelistrikan & Lampu', 'fa-bolt', '#f59e0b', 12, 'Lampu ruangan, panel MCB, stop kontak, kabel korsleting', 'Aktif'),
('CAT-03', 'Proyektor & Sound System', 'fa-video', '#8b5cf6', 24, 'Proyektor kelas, layar motorized, mic wireless, mixer audio', 'Aktif'),
('CAT-04', 'Sanitasi & Toilet', 'fa-faucet-drip', '#10b981', 12, 'Kran air, closet, wastafel, saluran pembuangan mampet', 'Aktif'),
('CAT-05', 'Jaringan & Internet', 'fa-wifi', '#3b82f6', 6, 'Access Point WiFi, kabel LAN, switch hub, koneksi internet lambat', 'Aktif'),
('CAT-06', 'Bangunan & Infrastruktur', 'fa-building', '#64748b', 48, 'Plafon rusak, ubin keramik pecah, rembesan atap, cat mengelupas', 'Aktif'),
('CAT-07', 'Pintu & Jendela', 'fa-door-open', '#d97706', 24, 'Engsel pintu rusak, handel macet, kaca jendela retak, kunci patah', 'Aktif');

-- --------------------------------------------------------------------
-- 5. TABEL AUDIT LOG & REKAMAN SURVEILLANCE KEAMANAN (AUDIT_LOGS)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS audit_logs;

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    target_id VARCHAR(50) NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    user_agent TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
