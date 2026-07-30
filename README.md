# 🏛️ SIMPEL UIN SSC - Sistem Informasi Pelaporan Fasilitas Kampus

> **Sistem Informasi Pelaporan & Pemeliharaan Fasilitas Kampus UIN Siber Syekh Nurjati Cirebon**  
> Dibuat untuk memenuhi **6 Unit Kompetensi SKKNI BNSP (Web Developer / Junior Web Developer)**.

---

## 🏆 Pemenuhan 6 Unit Kompetensi SKKNI BNSP

| No | Unit Kompetensi SKKNI | Implementasi Pada Proyek |
| :--- | :--- | :--- |
| **1** | **Mengimplementasikan User Interface** | HTML5 Semantic Elements (`<header>`, `<main>`, `<nav>`, `<aside>`, `<form>`), Responsive Layout (Desktop/Tablet/Mobile), UIN SSC Emerald & Gold Theme, Glassmorphic Cards. |
| **2** | **Menerapkan perintah eksekusi bahasa pemrograman berbasis teks, grafik, dan multimedia** | Pengolahan teks/string (Sanitasi `escapeHtml`), Dynamic *Bar Chart Analytics* per gedung, Peta Interaktif `Leaflet.js` & Upload Foto `FileReader API`. |
| **3** | **Menyusun fungsi, file atau sumber daya pemrograman yang lain dalam organisasi yang rapih** | Berkas terpisah & terstruktur: `index.html`, `assets/img/`, `css/`, `js/`, dan `pages/`. |
| **4** | **Menulis kode dengan prinsip sesuai guidelines dan best practices** | Konvensi `camelCase`, pencegahan kerentanan XSS Injection, JSDoc header comments, & WAI-ARIA form accessibility. |
| **5** | **Mengimplementasikan pemrograman terstruktur** | Kontrol alur (*Sequencing*, *Selection/If-Else*, *Iteration/Array Methods* `filter`, `map`, `reduce`), fungsi modular, & persistent `localStorage` database. |
| **6** | **Menggunakan library atau komponen pre-existing** | **Leaflet.js 1.9.4** (GIS Map & Marker), **Font Awesome 6.4.0** (Icons), **Google Fonts** (Plus Jakarta Sans). |

---

## 📂 Struktur Berkas Proyek (Modular Architecture)

```
c:\Users\ASUS\OneDrive\Desktop\BNSP\
├── README.md             # Dokumentasi Resmi Proyek GitHub
├── index.html            # Gateway / System Launcher Beranda Utama
├── assets/               # 📁 Resource Image Assets
│   └── img/
│       ├── logo.png      # Logo Resmi Kampus UIN SSC
│       └── favicon.png   # Favicon Tab Browser
├── css/                  # 📁 Stylesheets CSS
│   ├── user.css          # Styling Portal Pelapor (User Side)
│   └── admin.css         # Styling Dashboard Sarpras (Admin Side)
├── js/                   # 📁 Script Pemrograman JavaScript
│   ├── user.js           # Logic Portal Pelapor (GPS, Map, Form, Print Ticket)
│   └── admin.js          # Logic Dashboard Admin (KPI, Table, Chart)
└── pages/                # 📁 Views / Antarmuka HTML Modul
    ├── user.html         # Halaman Portal Pelapor Publik
    └── admin.html        # Halaman Dashboard Admin Sarpras
```

---

## ✨ Fitur Utama Aplikasi

- 🌐 **Separated User & Admin Portals**: Pemisahan portal publik pelapor (`pages/user.html`) dan dashboard pengelola sarpras (`pages/admin.html`).
- 🎨 **UIN SSC Branding Theme**: Warna khas identitas logo UIN SSC (*Deep Emerald Green #005A36 & Metallic Gold #C59235*).
- 🗺️ **GIS Map & GPS Geolocation**: Peta interaktif Leaflet.js dengan fitur penentu titik presisi lokasi kerusakan dan pengunci GPS otomatis.
- 🖨️ **Cetak Bukti PDF Tiket**: Fitur cetak dokumen PDF tiket pelaporan resmi berlogo UIN SSC.
- 📊 **Dynamic Bar Chart Analytics**: Visualisasi grafik statistik laporan kerusakan fasilitas per gedung kampus secara real-time.
- 📥 **Export CSV Data**: Mengunduh rekap data laporan untuk laporan bulanan sarpras.

---

## 🚀 Cara Menjalankan Aplikasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/F4ntaB0y/simpel-uinssc.git
   ```
2. Buka folder proyek dan jalankan HTTP Server lokal (misal dengan Python):
   ```bash
   python -m http.server 8080
   ```
3. Akses aplikasi melalui browser:
   - **Beranda Gateway**: `http://localhost:8080/index.html`
   - **Portal Pelapor**: `http://localhost:8080/pages/user.html`
   - **Dashboard Admin**: `http://localhost:8080/pages/admin.html`

---

&copy; 2026 UIN Siber Syekh Nurjati Cirebon (UIN SSC). All Rights Reserved.
