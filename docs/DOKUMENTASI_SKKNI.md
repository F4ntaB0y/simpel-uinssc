# DOKUMENTASI TEKNIS PEMENUHAN SKKNI NO 282 TAHUN 2016
## SIMPEL-UINSSC (Sistem Informasi Manajemen Pengaduan Layanan Sarpras)

Dokumen ini disusun sebagai panduan pemenuhan Unit Kompetensi Sertifikasi BNSP Bidang Pemrograman Web/Software Development berdasarkan **SKKNI No 282 Tahun 2016**.

---

### 📋 PEMETAAN 6 UNIT KOMPETENSI SKKNI NO 282 TAHUN 2016

#### 1. J.620100.005.01 / J.620100.005.02 - Mengimplementasikan User Interface (UI)
- **Implementasi**:
  - `index.html`, `pages/user.html`, `pages/admin.html`, `pages/404.html`.
  - Design Tokens & CSS Variables terpusat di `css/admin.css` & `css/user.css`.
  - Elemen responsif berbasis CSS Grid & Flexbox.
  - Elemen umpan balik pengguna: Badge status warna, Modal edit tiket, Toast notification.

#### 2. J.620100.010.01 / J.620100.010.02 - Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia
- **Implementasi**:
  - Pemrosesan Teks & JSON Data di `js/admin.js` & `js/user.js`.
  - Pemrosesan Spasial & Peta GIS menggunakan Leaflet.js (5 Kawasan Kampus UINSSC & Polygon Geofencing).
  - Damage Heatmap / Cluster Kerusakan 3-Layer Radial Heat Intensity Glow.
  - Pengolahan Foto Bukti Kerusakan/Perbaikan via Base64 `FileReader API`.

#### 3. J.620100.015.01 - Menyusun Fungsi, File atau Sumber Daya Pemrograman yang Lain dalam Organisasi yang Rapi
- **Implementasi**:
  - Berkas dipisahkan secara modular: `config/database.php`, `api.php`, `css/`, `js/`, `pages/`, `docs/`.
  - Fungsi terisolasi yang dapat digunakan kembali (*reusable functions*): `loadReports()`, `saveReports()`, `showToast()`, `escapeHtml()`, `isInsideCampus()`.

#### 4. J.620100.016.01 - Menulis Kode dengan Prinsip Sesuai Guidelines dan Best Practices
- **Implementasi**:
  - Konfigurasi database dipisah bersih di `config/database.php`.
  - Pencegahan celah keamanan XSS menggunakan sanitasi HTML `escapeHtml()`.
  - Standar penamaan *camelCase* untuk variabel & fungsi, serta *UPPER_CASE* untuk konstanta.

#### 5. J.620100.017.02 - Mengimplementasikan Pemrograman Terstruktur
- **Implementasi**:
  - Pemrograman terstruktur berbasis *Sequence* (Runtutan), *Selection* (Percabangan `if-else`), dan *Iteration* (Perulangan Array `.map()`, `.filter()`, `.forEach()`).
  - Algoritma Geofencing Ray-Casting untuk menguji posisi titik lokasi kerusakan.

#### 6. J.620100.019.02 - Menggunakan Library atau Komponen Pre-Existing
- **Implementasi**:
  - Leaflet.js (Peta Spasial GIS).
  - FontAwesome 6 (Ikon Vektor).
  - Google Fonts Plus Jakarta Sans (Tipografi Web).
  - PDO MySQL & Web Storage API (Database & State Management).
