# CHEATSHEET & RINGKASAN JAWABAN WAWANCARA BNSP
## SIMPEL-UINSSC (Sistem Informasi Manajemen Pengaduan Layanan Sarpras)

Dokumen ini berisi **10 Pertanyaan yang Paling Sering Ditanyakan oleh Asesor BNSP** beserta **Jawaban Siap Saji** berbasis kode project SIMPEL-UINSSC Anda.

---

### ❓ 1. Apa latar belakang dan tujuan utama pembuatan aplikasi ini?
> 💡 **Jawaban**:
> *"SIMPEL-UINSSC adalah Sistem Informasi Manajemen Pengaduan Layanan Sarana dan Prasarana berbasis Peta Spasial GIS di UIN Siber Syekh Nurjati Cirebon. Tujuannya adalah mempermudah mahasiswa, dosen, dan staf dalam melaporkan kerusakan fasilitas kampus secara presisi berbasis peta, serta membantu tim Sarpras dalam memantau sebaran kerusakan melalui Peta Panas (Heatmap) dan Grafik Statistik secara real-time."*

---

### ❓ 2. Bagaimana Anda mengimplementasikan User Interface (UI) & UX pada aplikasi ini? (Unit J.620100.005.01)
> 💡 **Jawaban**:
> *"Saya menerapkannya menggunakan HTML5 Semantik, CSS Variables terpusat di `:root` untuk konsistensi warna Emerald & Gold UINSSC, serta layout responsif berbasis CSS Grid & Flexbox. Dari sisi UX, saya menyediakan indikator status warna, toast notification, modal dialog edit, dan fitur Dark Mode / Light Mode."*

---

### ❓ 3. Bagaimana sistem mengolah Peta Spasial GIS dan Geofencing? (Unit J.620100.010.02)
> 💡 **Jawaban**:
> *"Saya menggunakan library **Leaflet.js** untuk menggambar marker pin dan polygon 5 Kawasan Kampus UINSSC. Untuk memastikan titik lokasi pengaduan berada di dalam kawasan kampus, saya menerapkan **Algoritma Geofencing Ray-Casting (`isInsideCampus`)** yang menghitung perpotongan garis koordinat terhadap polygon gedung."*

---

### ❓ 4. Bagaimana cara kerja Damage Heatmap / Peta Panas Kerusakan? (Unit J.620100.010.02)
> 💡 **Jawaban**:
> *"Damage Heatmap dibuat menggunakan teknik rendering 3-layer lingkaran *radial heat intensity glow* pada Leaflet.js. Ukuran radius pendaran dan gradasi warna dipetakan secara dinamis berdasarkan tingkat urgensi laporan (Darurat = Merah radius 55m, Tinggi = Oranye 45m, Sedang = Amber 35m, Rendah = Biru 25m)."*

---

### ❓ 5. Bagaimana Anda menerapkan Pemrograman Terstruktur? (Unit J.620100.017.02)
> 💡 **Jawaban**:
> *"Saya menerapkannya melalui 3 kontrol alur utama:*
> 1. **Sequence (Runtutan)**: Inisialisasi auth ➡️ pemanggilan `loadReports()` ➡️ kalkulasi KPI ➡️ rendering peta ➡️ rendering tabel.
> 2. **Selection (Percabangan)**: Penggunaan `if-else` dan `switch` pada filter gedung, status, serta sakelar mode peta.
> 3. **Iteration (Perulangan)**: Penggunaan fungsi array modern `.map()`, `.filter()`, dan `.forEach()` untuk memproses list pengaduan dan bar chart."*

---

### ❓ 6. Bagaimana alur data antara Frontend (JS) dan Backend (PHP PDO & MySQL)? (Unit J.620100.015.01)
> 💡 **Jawaban**:
> *"Frontend JavaScript mengirimkan permintaan HTTP (`fetch API`) ke script perantara `api.php`. Selanjutnya, `api.php` memanggil koneksi terpisah di `config/database.php` dan mengeksekusi prepared statement PDO MySQL untuk membaca atau menyimpan data ke database Laragon `db_simpel_uinssc`."*

---

### ❓ 7. Bagaimana Anda mengamankan input pengguna dari celah XSS (Cross-Site Scripting)? (Unit J.620100.016.01)
> 💡 **Jawaban**:
> *"Saya menerapkan sanitasi string menggunakan fungsi `escapeHtml()` pada setiap input teks dari pengguna sebelum karakter tersebut di-render ke dalam DOM HTML. Fungsi ini mengonversi karakter berbahaya seperti `< > & "` menjadi karakter entitas HTML aman."*

---

### ❓ 8. Apa saja Library pihak ketiga yang Anda gunakan dan mengapa? (Unit J.620100.019.02)
> 💡 **Jawaban**:
> *"Saya menggunakan 3 library eksternal utama:*
> 1. **Leaflet.js**: Untuk pemetaan spasial GIS dan rendering polygon kampus.
> 2. **FontAwesome 6**: Untuk pustaka ikon vektor multimedia yang ringan.
> 3. **Google Fonts (Plus Jakarta Sans)**: Untuk tipografi web modern yang mudah dibaca."*

---

### ❓ 9. Bagaimana sistem mengolah gambar bukti kerusakan dari pengguna? (Unit J.620100.010.02)
> 💡 **Jawaban**:
> *"Gambar diunggah via elemen `<input type='file'>`, lalu dibaca oleh **FileReader API** browser untuk dikonversi menjadi string **Base64 Data URL**. Data Base64 ini kemudian disimpan ke kolom `foto` bertipe `LONGTEXT` pada database MySQL."*

---

### ❓ 10. Bagaimana aplikasi menjamin ketersediaan jika terjadi gangguan server/offline? (Hybrid Storage)
> 💡 **Jawaban**:
> *"Saya menerapkan arsitektur **Hybrid Storage**. Aplikasi memprioritaskan koneksi API MySQL Laragon, tetapi jika koneksi API terputus atau offline, sistem secara otomatis beralih menggunakan **`window.localStorage`** sebagai penyimpanan cadangan sehingga aplikasi tetap dapat beroperasi tanpa error."*
