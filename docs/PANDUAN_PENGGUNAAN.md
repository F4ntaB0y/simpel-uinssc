# PANDUAN PENGGUNAAN APLIKASI SIMPEL-UINSSC
## Sistem Informasi Manajemen Pengaduan Layanan Sarpras Kampus UINSSC

---

### 1. PERAN PELAPOR (MAHASISWA / DOSEN / STAF)

1. **Akses Portal Pelapor**:
   - Buka `index.html` ➡️ Masukkan NIM/NIP atau klik **Portal Pelapor**.
2. **Pengisian Form Pengaduan**:
   - Pilih **Gedung / Kawasan Kampus**, ketik **Ruangan**, dan pilih **Kategori Kerusakan**.
   - Tentukan **Tingkat Urgensi** (*Darurat, Tinggi, Sedang, Rendah*).
   - Tulis deskripsi kronologi kerusakan secara jelas.
   - Unggah **Foto Bukti Kerusakan**.
3. **Penentuan Titik Presisi Peta Spasial GIS**:
   - Klik atau geser marker pin pada peta untuk menentukan koordinat presisi.
   - Tombol **Gunakan Lokasi GPS Saya**: Otomatis mendeteksi lokasi koordinat pengguna saat ini.
   - Tombol **Fokus ke Area Kampus**: Mengarahkan fokus kamera peta kembali ke 5 Kawasan UINSSC.
   - Tombol **Sembunyikan / Tampilkan Masking**: Menyalakan atau mematikan pendaran bayangan gelap latar belakang.
4. **Pelacakan Tiket**:
   - Masukkan ID Tiket (contoh: `TRK-2026-001`) pada kolom lacak tiket untuk melihat perkembangan status perbaikan dan bukti perbaikan teknisi.

---

### 2. PERAN ADMIN SARPRAS KAMPUS

1. **Akses Dashboard Admin**:
   - Buka `index.html` ➡️ Pilih **Pintu Masuk Admin**.
   - Username: `admin`, Password: `admin123`.
2. **Fitur Dashboard Admin**:
   - **Kartu KPI Ringkasan**: Total Laporan, Diajukan, Diproses, dan Selesai.
   - **Grafik Bar Chart**: Statistik tingkat kerusakan per 5 Kawasan Kampus UINSSC secara real-time.
   - **Peta GIS & Heatmap**: Mode Toggle Sakelar antara *Pin Marker* dan *Damage Heatmap Kerusakan (3-Layer Radial Heat Glow)*.
   - **Tabel Kelola Laporan**:
     - Filter berdasarkan **Status** dan **Gedung/Kawasan**.
     - Tombol **Kelola Tiket**: Mengubah Status, Menunjuk Teknisi Penanggung Jawab, Menulis Catatan Sarpras, dan mengunggah **Foto Bukti Hasil Perbaikan**.
     - Tombol **Kirim WA ke Teknisi**: Membuka integrasi WhatsApp dengan format pesan otomatis.
     - Tombol **Export CSV**: Mengunduh seluruh log laporan dalam format CSV.
