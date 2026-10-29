# 🏛️ SIMPEL UINSSC - Sistem Informasi Pelaporan Fasilitas Kampus

> **Sistem Informasi Manajemen Pengaduan & Layanan Sarana Prasarana Kampus**  
> **Universitas Islam Negeri Siber Syekh Nurjati Cirebon (UINSSC)**  
> Dibuat untuk memenuhi program **Kerja Praktik 2026** serta pemenuhan standar **6 Unit Kompetensi SKKNI BNSP (Web Developer / Junior Web Developer)**.

---

## 🏆 Pemenuhan 6 Unit Kompetensi SKKNI BNSP

| No | Unit Kompetensi SKKNI | Kode Unit | Implementasi Pada Proyek SIMPEL UINSSC |
| :--- | :--- | :--- | :--- |
| **1** | **Mengimplementasikan User Interface** | `J.620100.017.02` | HTML5 Semantic Elements (`<header>`, `<main>`, `<nav>`, `<aside>`, `<form>`, `<section>`), Layout Responsif Desktop/Tablet/Mobile, Tema Branding *UINSSC Emerald Green (#005A36) & Metallic Gold (#C59235)*, kartu glassmorphism, dan PWA (*Progressive Web App*). |
| **2** | **Menerapkan perintah eksekusi bahasa pemrograman berbasis teks, grafik, dan multimedia** | `J.620100.016.01` | Sanitasi input string & XSS prevention (`DOMPurify` & `escapeHtml`), *Dynamic Multi-Chart Analytics* menggunakan Chart.js (Grafik Tren Bulanan, Distribusi Status, Kawasan, dan Waktu SLA), Peta Interaktif `Leaflet.js`, Poligon Geofencing Dinamis, dan kompresi foto `FileReader API`. |
| **3** | **Menyusun fungsi, file atau sumber daya pemrograman yang lain dalam organisasi yang rapih** | `J.620100.018.02` | Arsitektur modular terorganisir: `index.html` (gateway login), `pages/` (user & admin views), `css/` (user & admin stylesheets), `js/` (logic modular), `api/` (RESTful router & handlers), `config/` (koneksi database), serta `assets/` (logo & favicon). |
| **4** | **Menulis kode dengan prinsip sesuai guidelines dan best practices** | `J.620100.019.02` | Penamaan konvensi `camelCase`, komentar dokumentasi JSDoc terstruktur, penanganan exception `try-catch`, audit trail logging, dan export berkas formal (CSV data & Lembar Rekap Cetak PDF Resmi UINSSC). |
| **5** | **Mengimplementasikan pemrograman terstruktur** | `J.620100.021.02` | Kontrol alur terstruktur (*Sequencing, Conditional Branching, Iteration* metode array modern `filter`, `map`, `reduce`), state management modular, sinkronisasi ganda `localStorage` & MySQL PDO. |
| **6** | **Menggunakan library atau komponen pre-existing** | `J.620100.025.01` | **Leaflet.js 1.9.4** & **Leaflet.heat** (GIS Map, Geofencing Poligon & Heatmap Kerusakan), **Chart.js** (Visualisasi Statistik), **SweetAlert2** (Modal Dialog Interaktif), **DOMPurify** (Sanitasi Keamanan), **Font Awesome 6.4.0**, dan **Google Fonts Plus Jakarta Sans**. |

---

## 📂 Struktur Berkas Proyek (Modular Architecture)

```
c:\Users\ASUS\OneDrive\Desktop\Kerja Praktik 2026\
├── README.md                     # Dokumentasi Resmi Proyek Kerja Praktik & BNSP
├── index.html                    # Gateway Portal / Launcher Login Multi-Role
├── manifest.json                 # Web App Manifest untuk Progressive Web App (PWA)
├── sw.js                         # Service Worker PWA (Offline Caching & Shell Pre-cache)
├── schema.sql                    # Skema Tabel MySQL Laragon (Reports, Zones, Staff, Categories, Audit)
├── api.php                       # Entrypoint API Shortcut
├── api/                          # 📁 Endpoint RESTful API Backend
│   ├── index.php                 # Central API Router / Request Dispatcher
│   ├── reports.php               # Handler CRUD & Sinkronisasi Laporan Sarpras
│   ├── zones.php                 # Handler Geofencing Kawasan Kampus & Poligon
│   ├── categories.php            # Handler Master Kategori & SLA Waktu Penanganan
│   ├── staff.php                 # Handler Manajemen Akun & Penugasan Wilayah Staf
│   └── Bridge API v2 (...).json  # Koleksi Postman / Insomnia API Test
├── config/                       # 📁 Konfigurasi Sistem
│   └── database.php              # Koneksi Database MySQL Laragon via PHP PDO
├── assets/                       # 📁 Resource Media & Identitas Kampus
│   └── img/
│       ├── logo.png              # Logo Resmi Universitas Islam Negeri Siber Cirebon
│       └── favicon.png           # Favicon Tab Browser & Ikon PWA
├── css/                          # 📁 Stylesheets Antarmuka
│   ├── user.css                  # Styling Portal Pelapor Publik & Komponen Universal
│   └── admin.css                 # Styling Khusus Dashboard Sarpras & Panel Admin
├── js/                           # 📁 Script Logika Aplikasi JavaScript
│   ├── user.js                   # Logic Portal Pelapor (GPS, Leaflet, Form, Cetak Tiket PDF)
│   └── admin.js                  # Logic Dashboard Admin (KPI, Peta GIS, Geofence, SOC, WhatsApp)
├── pages/                        # 📁 Halaman Modul Views
│   ├── user.html                 # Antarmuka Pengaduan Publik & Tracking Tiket
│   └── admin.html                # Antarmuka Dashboard Admin Sarpras & Super Admin
└── docs/                         # 📁 Arsip Dokumentasi, Presentasi & Diagram KP
    ├── CHEATSHEET_BNSP.md
    ├── DOKUMENTASI_LAYOUT.md
    ├── DOKUMENTASI_SKKNI.md
    ├── MATERI_PRESENTASI_PPT.md
    ├── PANDUAN_PENGGUNAAN.md
    ├── diagram_sistem.html
    └── flowchart_sistem.png
```

---

## ✨ Fitur-Fitur Utama SIMPEL UINSSC

### 1. 🌐 Multi-Role Authentication & Gateway
- Pemisahan hak akses: **Publik Pelapor (Mahasiswa, Dosen, Tenaga Kependidikan)**, **Admin Sarpras Wilayah**, **Super Admin**, dan **Mitra Kampus**.
- Dilengkapi captcha interaktif dan proteksi brute-force login.

### 2. 🗺️ GIS Map, GPS Geolocation & Multi-Zone Geofencing
- Peta spasial interaktif menggunakan Leaflet.js dengan penentu koordinat presisi.
- Deteksi otomatis 5 kawasan kampus resmi:
  1. **Kawasan Kampus Utama** (Rektorat, FITK, FUAD, FSEI, ICT Center, Perpus)
  2. **Kawasan Gedung Cyber** (Smart Classrooms, Data Center, Multimedia Lab)
  3. **Kawasan Kampus Sebrang** (Ormawa, Student Center, Lab Bahasa)
  4. **Kawasan Pascasarjana & Ma'had** (Gedung Pasca, Ma'had Al-Jami'ah, Masjid)
  5. **Kawasan Lab Saladara** (Kampus 2 Saladara, Riset Agrotek)
- **Editor Poligon Geofencing Dinamis**: Penyesuaian titik batas kawasan secara interaktif (*draggable vertex polygon*).

### 3. 👥 Penugasan Wilayah Staf & Teknisi (Staff Zone Assignment)
- Fitur penugasan multi-wilayah bagi petugas lapangan dan admin sarpras sesuai cakupan kawasan kerjanya.
- Filter otomatis "Wilayah Tugas Saya" untuk memfokuskan antrean tiket per teknisi.

### 4. 📲 WhatsApp Work Order Dispatcher
- Integrasi tombol satu-klik menuju WhatsApp dengan format pesan resmi Surat Perintah Kerja (SPK) ke nomor teknisi bertugas dan konfirmasi status ke pelapor.

### 5. 🖨️ Cetak Bukti PDF & Rekapitulasi Resmi Sarpras
- **Sisi Pelapor**: Cetak tiket PDF bukti pelaporan berlogo resmi kampus dan kode QR pelacakan.
- **Sisi Admin**: Cetak Lembar Rekapitulasi Laporan Resmi Sarpras Kampus lengkap dengan Kop Surat Kemenag RI / UINSSC, KPI penanganan, tabel insiden, dan kolom pengesahan pimpinan.

### 6. 📊 Multi-Chart KPI Analytics & SLA Tracker
- Visualisasi 4 grafik terintegrasi Chart.js: Tren bulanan, status insiden, distribusi beban kawasan, dan kepatuhan SLA.
- Indikator peringatan otomatis untuk tiket perbaikan yang melampaui batas waktu target (*overdue SLA*).

### 7. 🛡️ SOC War Room & Audit Trail Surveillance
- Panel pemantauan keamanan sistem (Security Operations Center) untuk melacak percobaan login, akses istimewa super admin, dan manipulasi data.

### 8. 📱 Progressive Web App (PWA)
- Terdaftar dengan `manifest.json` dan `sw.js` (Service Worker) yang memungkinkan instalasi aplikasi di perangkat Android/iOS/Desktop dengan performa caching offline.

---

## 🚀 Panduan Menjalankan Aplikasi

### Opsi A: Menggunakan Laragon / XAMPP (Direkomendasikan - Full Backend MySQL)
1. Letakkan folder proyek di dalam direktori root server:
   - Laragon: `C:\laragon\www\Kerja Praktik 2026`
   - XAMPP: `C:\xampp\htdocs\Kerja Praktik 2026`
2. Buka **HeidiSQL** atau **phpMyAdmin**, buat database:
   ```sql
   CREATE DATABASE db_simpel_uinssc;
   ```
3. Import berkas `schema.sql` ke dalam database `db_simpel_uinssc`.
4. Sesuaikan kredensial di `config/database.php` (default: host `localhost`, user `root`, password kosong).
5. Buka peramban (browser) dan akses:
   - **Beranda Gateway**: `http://localhost/Kerja%20Praktik%202026/index.html`
   - **Portal Pelapor**: `http://localhost/Kerja%20Praktik%202026/pages/user.html`
   - **Dashboard Admin**: `http://localhost/Kerja%20Praktik%202026/pages/admin.html`

### Opsi B: Menggunakan Local HTTP Server (Python / Node.js)
Aplikasi mendukung mode client-side standalone dengan penyimpanan `localStorage`:
```bash
# Jalankan Python HTTP server di folder proyek
python -m http.server 8080
```
Lalu buka: `http://localhost:8080/index.html`

---

## 🔑 Akun Demo Pengujian Sistem

| Role | Username | Password | Wewenang & Akses |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `admin123` | Akses penuh, manajemen akun & wewenang, editor poligon geofencing, SOC war room, audit logs |
| **Admin Sarpras** | `admin_fauzi` | `admin123` | Pengelolaan tiket perbaikan, delegasi teknisi, cetak rekapitulasi, kawasan tugas Kampus Utama |
| **Admin Sarpras IT** | `admin_dewi` | `admin123` | Pengelolaan tiket perbaikan, kawasan tugas Gedung Cyber & Pascasarjana |
| **Mitra Kantin** | `mitra` | `mitra123` | Pengawasan sarana lingkungan pujasera & kantin |
| **Pelapor Publik** | *(Tanpa Login)* | *(Form Langsung)* | Pelaporan fasilitas via form user, pelacakan tiket, cetak kartu bukti laporan |

---

## 📡 Dokumentasi Endpoint RESTful API

| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| `GET` | `/api/reports.php` | Mengambil seluruh data pengaduan fasilitas dari MySQL |
| `POST` | `/api/reports.php` | Menyinkronkan dataset laporan fasilitas ke MySQL |
| `GET` | `/api/zones.php` | Mengambil seluruh batas poligon geofencing 5 kawasan kampus |
| `POST` | `/api/zones.php` | Memperbarui koordinat poligon batas geofencing kampus |
| `GET` | `/api/categories.php` | Mengambil daftar master kategori fasilitas & durasi SLA |
| `POST` | `/api/categories.php` | Menyimpan perubahan kategori fasilitas |
| `GET` | `/api/staff.php` | Mengambil daftar akun staf/teknisi beserta zonasi wilayah tugas |
| `POST` | `/api/staff.php` | Menyimpan penugasan wilayah dan data personil |

---

&copy; 2026 **UIN Siber Syekh Nurjati Cirebon (UINSSC)**. All Rights Reserved.  
*Program Kerja Praktik & Pemenuhan Standar Sertifikasi Kompetensi SKKNI BNSP Web Developer.*
