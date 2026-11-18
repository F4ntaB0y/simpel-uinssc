# SIMPEL UINSSC - Sistem Informasi Pelaporan & Pemeliharaan Fasilitas Kampus

> **Sistem Informasi Manajemen Pengaduan & Layanan Sarana Prasarana Kampus**  
> **Universitas Islam Negeri Siber Syekh Nurjati Cirebon (UINSSC)**  
> Proyek Pengembangan Sistem dalam rangka **Program Magang / Kerja Praktik (KP) 2026** pada Unit Pengelolaan Sarana dan Prasarana Kampus UINSSC.

---

## 1. Latar Belakang Proyek Magang

Universitas Islam Negeri Siber Syekh Nurjati Cirebon (UINSSC) sebagai pelopor perguruan tinggi keagamaan Islam berbasis siber memerlukan tata kelola sarana dan prasarana yang tanggap, transparan, dan terukur. Selama ini, proses pelaporan gangguan fasilitas kampus (seperti pendingin ruangan AC, proyektor ruang kuliah, instalasi kelistrikan, sanitasi, dan infrastruktur gedung) menghadapi sejumlah kendala operasional:

1. **Kanal Pengaduan Konvensional:** Keluhan fasilitas disampaikan secara lisan atau percakapan WhatsApp personal yang rentan tercecer tanpa rekam jejak tiket resmi.
2. **Ketiadaan Validasi Spasial:** Rentan timbul laporan bias atau salah lokasi karena pelapor tidak menyertakan bukti fisik dan titik koordinat gedung yang akurat.
3. **Batas Waktu Respon Belum Terstandarisasi:** Belum tersedianya parameter Service Level Agreement (SLA) waktu penyelesaian terukur untuk menilai kinerja divisi pemeliharaan sarpras.
4. **Duplikasi Laporan Kerusakan:** Satu fasilitas rusak dilaporkan berulang kali oleh pihak berbeda sehingga membebani antrean tugas teknisi.

Melalui program magang/kerja praktik ini, dibangun aplikasi web terpadu **SIMPEL UINSSC** guna mengotomasi seluruh siklus pengaduan, verifikasi geofencing presisi, disposisi tugas teknisi, hingga penerbitan lembar bukti PDF ber-QR Code secara elektronik.

---

## 2. Tujuan & Sasaran Proyek

1. **Membangun Portal Pengaduan Publik Mandiri:** Memudahkan mahasiswa, dosen, dan tenaga kependidikan dalam menyampaikan laporan kerusakan fasilitas kampus secara terstruktur.
2. **Menerapkan Validasi Koordinat GPS & Geofencing:** Memastikan seluruh pengaduan yang diajukan terverifikasi secara spasial berada dalam 5 kawasan resmi kampus UINSSC menggunakan formula Haversine.
3. **Menegakkan Standarisasi Waktu Penyelesaian (SLA):** Menetapkan target waktu tanggap bertingkat (mulai dari 2 jam hingga maksimal 48 jam kerja) berdasarkan tingkat keparahan insiden.
4. **Menyediakan Dasbor Analitik & Peta Panas (Damage Heatmap):** Membantu pimpinan unit sarpras memantau beban penanganan, sebaran titik insiden per gedung, serta tren kerusakan fasilitas secara real-time.
5. **Mewujudkan Akuntabilitas Melalui Dokumen Digital:** Menerbitkan nomor tiket pelaporan (TRK), lembar tiket PDF resmi siap cetak, serta verifikasi pemindaian QR Code di lapangan.

---

## 3. Ruang Lingkup Pekerjaan Magang

Selama pelaksanaan program magang, ruang lingkup pekerjaan pengembangan mencakup:
- **Analisis Kebutuhan & Desain Alur Layanan:** Perumusan SOP 5 tahap penanganan tiket (Diajukan, Diverifikasi, Disposisi, Pengerjaan, Selesai).
- **Pengembangan Antarmuka Pengguna (Frontend):** Implementasi desain responsif, ramah mobile, tema identitas institusi (Emerald Green & Gold), dan kapabilitas Progressive Web App (PWA).
- **Integrasi Pemetaan Spasial (GIS):** Pembuatan peta interaktif menggunakan Leaflet.js, penentuan poligon 5 kawasan kampus, dan visualisasi Damage Heatmap.
- **Pengembangan Backend & Basis Data:** Penyusunan endpoint RESTful API berbasis PHP PDO, skema relasional tabel MySQL, sanitasi keamanan data (anti-XSS via DOMPurify), serta pembatasan berkas unggahan maksimal 5 MB.
- **Fitur Keamanan & Otomasi:** Penerapan sesi logout otomatis setelah 20 menit tidak ada aktivitas, mekanisme rate-limiting anti-spam, kompresi gambar berbasis Canvas, serta pembagian peran pengguna (Multi-Role Authentication).

---

## 4. Struktur Berkas Proyek

```
c:\Users\ASUS\OneDrive\Desktop\Kerja Praktik 2026\
├── README.md                     # Dokumentasi Resmi Proyek Magang SIMPEL UINSSC
├── index.html                    # Gateway Portal / Antarmuka Login Multi-Role
├── manifest.json                 # Web App Manifest untuk Progressive Web App (PWA)
├── sw.js                         # Service Worker PWA (Offline Shell & Asset Caching)
├── schema.sql                    # Skema Basis Data Relasional MySQL
├── api.php                       # REST API Dispatcher Shortcut
├── api/                          # Direktori Endpoint RESTful API Backend
│   ├── index.php                 # Central API Router
│   ├── reports.php               # Handler CRUD & Sinkronisasi Laporan Sarpras
│   ├── zones.php                 # Handler Koordinat Poligon Geofencing Kawasan
│   ├── categories.php            # Handler Master Kategori Fasilitas & Waktu SLA
│   ├── staff.php                 # Handler Personil Staf & Penugasan Wilayah Kerja
│   └── Bridge API v2 (...).json  # Koleksi Spesifikasi API Endpoint
├── config/                       # Konfigurasi Koneksi Sistem
│   └── database.php              # Koneksi Basis Data MySQL via PHP PDO
├── assets/                       # Aset Media & Identitas Kampus
│   └── img/
│       ├── logo.png              # Logo Resmi UIN Siber Cirebon
│       └── favicon.png           # Favicon & Ikon Aplikasi PWA
├── css/                          # Stylesheets Antarmuka Pengguna
│   ├── user.css                  # Desain Khusus Portal Pelapor Civitas Kampus
│   └── admin.css                 # Desain Khusus Dashboard Tata Kelola Sarpras
├── js/                           # Skrip Logika Aplikasi Modular
│   ├── user.js                   # Logika Portal Pelapor (GPS, Leaflet, Form, Cetak PDF, Auto-Logout)
│   └── admin.js                  # Logika Dashboard Admin (KPI, Peta GIS, Heatmap, SOC, WhatsApp)
├── pages/                        # Modul Halaman Antarmuka
│   ├── user.html                 # Antarmuka Pengaduan Publik Civitas & Lacak Tiket
│   └── admin.html                # Antarmuka Dashboard Admin Sarpras & Super Admin
└── docs/                         # Dokumen Panduan & Materi Kerja Praktik
    ├── DOKUMENTASI_LAYOUT.md     # Panduan Struktur Antarmuka & Tata Letak
    ├── MATERI_PRESENTASI_PPT.md  # Materi Tayang Sidang / Presentasi Proyek
    ├── PANDUAN_PENGGUNAAN.md     # Panduan Operasional Pengguna
    └── diagram_sistem.html       # Visualisasi Diagram Alur Sistem
```

---

## 5. Fitur Utama Sistem

### A. Portal Civitas Pelapor (Mahasiswa, Dosen, Tendik)
- **Pelaporan Terstruktur:** Formulir pengaduan dengan validasi kategori sarpras, ruang/gedung spesifik, tingkat urgensi, serta deskripsi rinci kerusakan.
- **Deteksi Koordinat GPS & Geofencing:** Peta interaktif Leaflet.js yang mendeteksi posisi pelapor dan mengunci validitas lokasi dalam radius 5 kawasan kampus resmi UINSSC.
- **Unggah Foto Bukti Fisik:** Mendukung berkas foto berformat JPG, PNG, dan WebP dengan batas maksimal 5 MB serta kompresi otomatis berbasis Canvas.
- **Lightbox Pratinjau Gambar:** Pratinjau foto resolusi tinggi terintegrasi tanpa risiko layar putih atau tab kosong.
- **Lacak Progres Real-Time:** Penelusuran status 5 tahapan perkembangan tiket secara transparan.
- **Lembar Bukti PDF & QR Code:** Ekspor berkas tiket resmi format A4 berstempel digital dan dilengkapi kode QR untuk verifikasi instan di lapangan.
- **Keamanan Sesi Pengguna:** Otomatis keluar (logout) apabila tidak ada aktivitas selama lebih dari 20 menit guna melindungi privasi akun civitas.

### B. Dasbor Tata Kelola Admin Sarpras & Super Admin
- **Ringkasan Indikator Kinerja (KPI):** Panel metrik pemantauan total laporan, jumlah tiket dalam penanganan, laporan terselesaikan, dan rasio kepatuhan SLA.
- **Peta Spasial GIS & Damage Heatmap:** Visualisasi sebaran kerusakan fasilitas dengan pendaran warna gradien (Merah/Oranye/Kuning/Biru) berdasarkan tingkat urgensi insiden.
- **Editor Poligon Wilayah Kampus:** Kemampuan manajemen titik batas wilayah geofencing interaktif langsung dari peta admin.
- **Penugasan Wilayah Kerja Staf:** Pembagian zonasi pengawasan bagi teknisi lapangan (Kampus Utama, Gedung Cyber, Pascasarjana, dsb.) disertai filter antrean tugas khusus.
- **Disposisi Surat Perintah Kerja (SPK) WhatsApp:** Generator format pesan WhatsApp otomatis ke teknisi penanggung jawab spesialisasi.
- **Pusat Rekapitulasi & Audit Trail (SOC):** Rekapitulasi data laporan ke dalam format cetak lembar resmi ber-Kop Surat atau ekspor CSV, didukung log pengawasan operasional sistem.

---

## 6. Petunjuk Instalasi & Menjalankan Aplikasi

### Opsi 1: Menggunakan Web Server Lokal (Laragon / XAMPP) - Direkomendasikan
1. Salin folder proyek ke dalam direktori publik web server:
   - Laragon: `C:\laragon\www\Kerja Praktik 2026`
   - XAMPP: `C:\xampp\htdocs\Kerja Praktik 2026`
2. Jalankan Apache dan MySQL pada panel server.
3. Buka **phpMyAdmin** atau **HeidiSQL**, buat basis data baru:
   ```sql
   CREATE DATABASE db_simpel_uinssc;
   ```
4. Impor berkas basis data `schema.sql` ke dalam database `db_simpel_uinssc`.
5. Pastikan konfigurasi kredensial pada `config/database.php` telah sesuai:
   ```php
   $host = 'localhost';
   $db   = 'db_simpel_uinssc';
   $user = 'root';
   $pass = '';
   ```
6. Buka peramban web dan akses alamat berikut:
   - **Halaman Masuk (Gateway):** `http://localhost/Kerja%20Praktik%202026/index.html`
   - **Portal Civitas Pelapor:** `http://localhost/Kerja%20Praktik%202026/pages/user.html`
   - **Dashboard Admin Sarpras:** `http://localhost/Kerja%20Praktik%202026/pages/admin.html`

### Opsi 2: Menggunakan Server HTTP Sederhana (Standalone Mode)
Aplikasi mendukung penyimpanan lokal (*localStorage*) untuk pengujian mandiri tanpa konfigurasi database server:
```bash
# Menjalankan HTTP server via Python
python -m http.server 8080
```
Buka peramban pada alamat: `http://localhost:8080/index.html`

---

## 7. Akun Pengujian Sistem (Demo Credentials)

| Peran (Role) | Username | Kata Sandi | Cakupan Wewenang |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `admin123` | Akses penuh, manajemen akun staf, konfigurasi geofencing, audit log SOC, pengaturan SLA |
| **Admin Sarpras Wilayah 1** | `admin_fauzi` | `admin123` | Penanganan tiket fasilitas kawasan Kampus Utama, delegasi teknisi, cetak rekap |
| **Admin Sarpras Wilayah 2** | `admin_dewi` | `admin123` | Penanganan tiket fasilitas kawasan Gedung Cyber & Pascasarjana |
| **Mitra Kampus** | `mitra` | `mitra123` | Pengawasan sarana dan fasilitas area kantin / pujasera |
| **Civitas Pelapor** | *(Akses Publik / SSO)* | *(Formulir Mandiri)* | Pembuatan laporan fasilitas, pelacakan tiket, unduh berkas bukti PDF |

---

## 8. Spesifikasi Endpoint RESTful API

| Metode | Endpoint | Deskripsi Fungsi |
| :--- | :--- | :--- |
| `GET` | `/api/reports.php` | Mengambil daftar seluruh pengaduan fasilitas dari database |
| `POST` | `/api/reports.php` | Menyimpan atau memperbarui data laporan sarpras |
| `GET` | `/api/zones.php` | Mengambil titik koordinat poligon geofencing 5 kawasan kampus |
| `POST` | `/api/zones.php` | Menyimpan pembaruan koordinat poligon geofencing kampus |
| `GET` | `/api/categories.php` | Mengambil daftar kategori fasilitas dan standar durasi SLA |
| `POST` | `/api/categories.php` | Memperbarui master data kategori fasilitas |
| `GET` | `/api/staff.php` | Mengambil data staf teknisi beserta pembagian zonasi wilayah |
| `POST` | `/api/staff.php` | Menyimpan pembaruan personil dan wilayah penugasan |

---

## 9. Hak Cipta & Pengesahan

&copy; 2026 **Universitas Islam Negeri Siber Syekh Nurjati Cirebon (UINSSC)**.  
Laporan Akhir & Hasil Implementasi Sistem Informasi untuk **Program Magang / Kerja Praktik 2026**.
