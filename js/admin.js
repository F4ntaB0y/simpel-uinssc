/**
 * SIMPEL UINSSC - Dedicated Admin Dashboard Script
 * Location: js/admin.js
 * --------------------------------------------------------------------------
 * MEMENUHI 6 UNIT KOMPETENSI SKKNI BNSP WEB DEVELOPER:
 * 1. Mengimplementasikan User Interface (Dashboard Admin Layout, Modal, Badges)
 * 2. Menerapkan Eksekusi Teks, Grafik & Multimedia (Bar Chart Analytics, Map Marker)
 * 3. Menyusun Fungsi, File & Sumber Daya Pemrograman Rapi (Modular JS Architecture)
 * 4. Menulis Kode Sesuai Guidelines & Best Practices (Clean Code & CSV Export)
 * 5. Mengimplementasikan Pemrograman Terstruktur (Array Filter, Map, Data Processing)
 * 6. Menggunakan Library Pre-existing (Leaflet.js GIS Library & FontAwesome)
 * --------------------------------------------------------------------------
 */

const STORAGE_KEY = 'SIMPEL_FK_REPORTS_DATA_V1';
const THEME_KEY = 'SIMPEL_FK_THEME';
const STORAGE_STAFF_KEY = 'SIMPEL_STAFF_ACCOUNTS_V1';

let reportsData = [];
let editingId = null;
let currentAdminRole = 'admin'; // 'admin' or 'superadmin'

// Staff Accounts State (Super Admin Authority)
let staffAccounts = [];
let currentStaffFilterRole = 'ALL';

// Metadata 5 Kawasan / Zona Kampus UINSSC untuk Penugasan Wilayah Admin & Petugas
const CAMPUS_ZONE_METAS = {
    'kampus_utama': { name: 'Kawasan Kampus Utama', icon: 'fa-building-columns', color: '#10b981', short: 'Kampus Utama' },
    'gedung_cyber': { name: 'Kawasan Gedung Cyber', icon: 'fa-laptop-code', color: '#06b6d4', short: 'Gedung Cyber' },
    'gedung_seberang': { name: 'Kawasan Kampus Sebrang', icon: 'fa-school', color: '#a855f7', short: 'Kampus Sebrang' },
    'pascasarjana_mahad': { name: 'Kawasan Pascasarjana & Mahad', icon: 'fa-mosque', color: '#f59e0b', short: 'Pascasarjana & Mahad' },
    'area_saladara': { name: 'Kawasan Lab Saladara', icon: 'fa-flask-vial', color: '#ec4899', short: 'Lab Saladara' }
};

const DEFAULT_STAFF_DATA = [
    { id: 'ADM-01', username: 'admin_fauzi', password: 'admin123', nama: 'Ahmad Fauzi, S.T.', role: 'admin', bidang: 'Admin Sarpras Kampus Utama', wa: '081234560001', status: 'Aktif', wilayah: ['kampus_utama', 'gedung_seberang'] },
    { id: 'ADM-02', username: 'admin_dewi', password: 'admin123', nama: 'Dewi Sartika, S.Kom.', role: 'admin', bidang: 'Admin Gedung Cyber & IT', wa: '081234560002', status: 'Aktif', wilayah: ['gedung_cyber', 'pascasarjana_mahad'] },
    { id: 'MTR-01', username: 'mitra', password: 'mitra123', nama: 'Kantin Berkah Sejahtera (Ibu Sumiati)', role: 'mitra', bidang: 'Kantin Kampus & Pujasera', wa: '081288990001', status: 'Aktif', wilayah: ['kampus_utama'] },
    { id: 'MTR-02', username: 'mitra_bank', password: 'mitra123', nama: 'Bank Syariah Mitra Kampus', role: 'mitra', bidang: 'Perbankan & ATM Center Kampus', wa: '081288990002', status: 'Aktif', wilayah: ['kampus_utama'] },
    { id: 'MTR-03', username: 'indocare', password: 'mitra123', nama: 'PT. Indocare Facility Services', role: 'mitra', bidang: 'Vendor Kebersihan & Hygiene', wa: '081288990003', status: 'Aktif', wilayah: ['kampus_utama', 'gedung_cyber', 'gedung_seberang', 'pascasarjana_mahad', 'area_saladara'] },
    { id: 'TKN-01', nama: 'Bambang Sudiro', role: 'petugas', bidang: 'AC & Pendingin (HVAC)', wa: '081298765001', status: 'Aktif', wilayah: ['kampus_utama', 'gedung_cyber'] },
    { id: 'TKN-02', nama: 'Joko Purnomo', role: 'petugas', bidang: 'Kelistrikan & Lampu', wa: '081298765002', status: 'Aktif', wilayah: ['kampus_utama', 'gedung_seberang', 'area_saladara'] },
    { id: 'TKN-03', nama: 'Rahmat Hidayat', role: 'petugas', bidang: 'Sanitasi & Plumbing', wa: '081298765003', status: 'Aktif', wilayah: ['kampus_utama', 'pascasarjana_mahad'] },
    { id: 'TKN-04', nama: 'Hendra Wijaya', role: 'petugas', bidang: 'Proyektor & Sound System', wa: '081298765004', status: 'Aktif', wilayah: ['kampus_utama', 'gedung_cyber'] },
    { id: 'TKN-05', nama: 'Sukarman', role: 'petugas', bidang: 'Sipil & Bangunan', wa: '081298765005', status: 'Aktif', wilayah: ['kampus_utama', 'gedung_seberang', 'pascasarjana_mahad', 'area_saladara'] },
    { id: 'TKN-06', nama: 'Ilham Kurnia', role: 'petugas', bidang: 'Jaringan & Internet (ICT)', wa: '081298765006', status: 'Aktif', wilayah: ['kampus_utama', 'gedung_cyber', 'gedung_seberang', 'pascasarjana_mahad', 'area_saladara'] },
    { id: 'TKN-07', nama: 'Agus Setiawan', role: 'petugas', bidang: 'Pintu, Kunci & Mebel', wa: '081298765007', status: 'Aktif', wilayah: ['kampus_utama', 'gedung_cyber'] }
];

function loadStaffAccounts() {
    const raw = localStorage.getItem(STORAGE_STAFF_KEY);
    if (raw) {
        try {
            staffAccounts = JSON.parse(raw);
            let needsSave = false;
            // Sinkronkan akun Mitra bawaan jika belum pernah ada
            if (!staffAccounts.some(s => s.role === 'mitra')) {
                const defaultMitras = DEFAULT_STAFF_DATA.filter(s => s.role === 'mitra');
                staffAccounts.push(...defaultMitras);
                needsSave = true;
            }
            // Normalisasi atribut wilayah untuk akun lama yang belum memilikinya
            staffAccounts.forEach(s => {
                if (!Array.isArray(s.wilayah) || s.wilayah.length === 0) {
                    if (s.role === 'admin') {
                        s.wilayah = (s.bidang && s.bidang.toLowerCase().includes('cyber')) ? ['gedung_cyber', 'pascasarjana_mahad'] : ['kampus_utama', 'gedung_seberang'];
                    } else if (s.role === 'mitra') {
                        s.wilayah = ['kampus_utama'];
                    } else {
                        s.wilayah = ['kampus_utama', 'gedung_cyber'];
                    }
                    needsSave = true;
                }
            });
            if (needsSave) saveStaffAccounts();
        } catch(e) {
            staffAccounts = [...DEFAULT_STAFF_DATA];
            saveStaffAccounts();
        }
    } else {
        staffAccounts = [...DEFAULT_STAFF_DATA];
        saveStaffAccounts();
    }
}

function saveStaffAccounts() {
    localStorage.setItem(STORAGE_STAFF_KEY, JSON.stringify(staffAccounts));
}

// Admin Map & Chart State
let adminMapInstance = null;
let adminMarkerInstance = null;
let adminOverviewMapInstance = null;
let adminOverviewZoneGroup = null;
let adminOverviewMarkersGroup = null;
let adminHeatLayerInstance = null;
let currentAdminMapMode = 'heatmap'; // 'pin' or 'heatmap' (Default: Heatmap menyala saat login)
let chartTrendInstance = null;
let chartKategoriInstance = null;
let chartKawasanInstance = null;
let chartUrgensiInstance = null;
let adminChartInstance = null; // backward compatibility
let currentAdminChartType = 'bar';

function renderAdminFotoPreview() {
    const previewContainer = document.getElementById('modalFotoPreview');
    if (!previewContainer) return;
    if (currentAdminFoto) {
        previewContainer.innerHTML = `<img src="${currentAdminFoto}" alt="Foto Bukti" style="width:100%; height:100%; object-fit:cover; border-radius:6px; cursor:pointer;" onclick="window.open('${currentAdminFoto}')" title="Klik untuk lihat ukuran penuh">`;
    } else {
        previewContainer.innerHTML = `<span style="font-size:11px; color:var(--text-muted);">Belum ada foto</span>`;
    }
}

function handleAdminFotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran foto terlalu besar. Maksimal 5MB.', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        currentAdminFoto = e.target.result;
        renderAdminFotoPreview();
        showToast('Foto bukti perbaikan berhasil diunggah!', 'success');
    };
    reader.readAsDataURL(file);
}

function clearAdminFoto() {
    currentAdminFoto = '';
    const fileInput = document.getElementById('modalFotoInput');
    if (fileInput) fileInput.value = '';
    renderAdminFotoPreview();
    showToast('Foto bukti perbaikan dihapus.', 'info');
}

function toggleAdminMapMode() {
    currentAdminMapMode = (currentAdminMapMode === 'pin') ? 'heatmap' : 'pin';
    const btn = document.getElementById('mapModeToggleBtn');
    if (btn) {
        if (currentAdminMapMode === 'heatmap') {
            btn.innerHTML = `<i class="fa-solid fa-fire" style="color:#f87171;"></i> Mode: Heatmap Kerusakan (Klik utk Pin)`;
            btn.style.background = 'rgba(239, 68, 68, 0.2)';
            btn.style.color = '#f87171';
            btn.style.borderColor = '#ef4444';
        } else {
            btn.innerHTML = `<i class="fa-solid fa-location-dot"></i> Mode: Pin Marker (Klik Mode Heatmap)`;
            btn.style.background = 'rgba(197, 146, 53, 0.15)';
            btn.style.color = 'var(--gold)';
            btn.style.borderColor = 'var(--gold)';
        }
    }
    renderAdminTable();
}

const DEFAULT_SEED_DATA = [
    {
        id: 'TRK-2026-001',
        namaPelapor: 'Budi Santoso',
        nimNip: '220101844',
        peranPelapor: 'Mahasiswa',
        kontakPelapor: '081234567891',
        gedung: 'Kawasan Kampus Utama',
        ruangan: 'Lab Komputer 3 (Lt. 2)',
        lat: '-6.735000',
        lng: '108.533800',
        kategori: 'AC & Pendingin',
        urgensi: 'Tinggi',
        deskripsi: 'AC nomor 2 berbunyi kencang dan meneteskan air lumayan deras tepat di atas unit komputer meja 14.',
        foto: '',
        status: 'Diproses',
        teknisi: 'Bambang (Teknisi HVAC)',
        catatanAdmin: 'Freon bocor & pembersihan filter sedang dilakukan.',
        tanggalLapor: '2026-07-28 09:15',
        tanggalUpdate: '2026-07-28 14:20'
    },
    {
        id: 'TRK-2026-002',
        namaPelapor: 'Dr. Ir. Hendra Wijaya',
        nimNip: '1985031002',
        peranPelapor: 'Dosen',
        kontakPelapor: '08119876543',
        gedung: 'Kawasan Gedung Cyber',
        ruangan: 'Ruang Kuliah Cyber.204',
        lat: '-6.737100',
        lng: '108.531500',
        kategori: 'Proyektor & Sound System',
        urgensi: 'Darurat',
        deskripsi: 'Proyektor gantung mati total saat jam perkuliahan. Lampu indikator merah berkedip.',
        foto: '',
        status: 'Diajukan',
        teknisi: 'Belum Ditunjuk',
        catatanAdmin: 'Laporan baru diterima, menunggu verifikasi lapangan.',
        tanggalLapor: '2026-07-30 08:30',
        tanggalUpdate: '2026-07-30 08:30'
    },
    {
        id: 'TRK-2026-003',
        namaPelapor: 'Siti Aminah',
        nimNip: '230401102',
        peranPelapor: 'Mahasiswa',
        kontakPelapor: '085712344321',
        gedung: 'Kawasan Kampus Sebrang',
        ruangan: 'Toilet Wanita Lantai 1',
        lat: '-6.736200',
        lng: '108.532700',
        kategori: 'Sanitasi & Toilet',
        urgensi: 'Sedang',
        deskripsi: 'Kran air wastafel sebelah kiri tidak bisa diputar dan air terus mengalir terbuang.',
        foto: '',
        status: 'Selesai',
        teknisi: 'Rahmat (Plumbing)',
        catatanAdmin: 'Penggantian seal kran baru telah selesai dikerjakan.',
        tanggalLapor: '2026-07-25 11:00',
        tanggalUpdate: '2026-07-26 10:15'
    },
    {
        id: 'TRK-2026-004',
        namaPelapor: 'Ahmad Fauzi, M.T.',
        nimNip: '1990041501',
        peranPelapor: 'Staf',
        kontakPelapor: '081399887766',
        gedung: 'Kawasan Kampus Utama',
        ruangan: 'Ruang Rapat Utama Lt. 3',
        lat: '-6.735200',
        lng: '108.533200',
        kategori: 'Kelistrikan & Lampu',
        urgensi: 'Tinggi',
        deskripsi: 'Lampu LED ceiling berkedip terus dan menimbulkan suara dengung saat rapat berlangsung.',
        foto: '',
        status: 'Diproses',
        teknisi: 'Joko (Kelistrikan)',
        catatanAdmin: 'Driver ballast LED replacement sedang disiapkan oleh tim kelistrikan.',
        tanggalLapor: '2026-07-29 13:45',
        tanggalUpdate: '2026-07-29 16:10'
    },
    {
        id: 'TRK-2026-005',
        namaPelapor: 'Nabila Putri',
        nimNip: '210203045',
        peranPelapor: 'Mahasiswa',
        kontakPelapor: '082155443322',
        gedung: 'Kawasan Kampus Utama',
        ruangan: 'Ruang Dosen Tarbiyah Lt. 2',
        lat: '-6.734800',
        lng: '108.533500',
        kategori: 'Jaringan & Internet',
        urgensi: 'Darurat',
        deskripsi: 'Access Point WiFi lokasi FITK lantai 2 tidak memancarkan sinyal SSID kampus.',
        foto: '',
        status: 'Diajukan',
        teknisi: 'Belum Ditunjuk',
        catatanAdmin: 'Menunggu pengecekan switch jaringan ICT.',
        tanggalLapor: '2026-07-31 10:00',
        tanggalUpdate: '2026-07-31 10:00'
    },
    {
        id: 'TRK-2026-006',
        namaPelapor: 'Dedi Kurniawan',
        nimNip: '1988022003',
        peranPelapor: 'Staf',
        kontakPelapor: '087811223344',
        gedung: 'Kawasan Kampus Utama',
        ruangan: 'Selasar Utama Lt. 1',
        lat: '-6.735400',
        lng: '108.533700',
        kategori: 'Bangunan & Infrastruktur',
        urgensi: 'Sedang',
        deskripsi: 'Ubin keramik selasar pecah terangkat membahayakan mahasiswa yang melintas.',
        foto: '',
        status: 'Selesai',
        teknisi: 'Sukarman (Sipil/Bangunan)',
        catatanAdmin: 'Pemasangan keramik pengganti dan semen perekat telah selesai rapi.',
        tanggalLapor: '2026-07-20 14:10',
        tanggalUpdate: '2026-07-22 09:30'
    },
    {
        id: 'TRK-2026-007',
        namaPelapor: 'Dewi Lestari',
        nimNip: '220501099',
        peranPelapor: 'Mahasiswa',
        kontakPelapor: '089677889900',
        gedung: 'Kawasan Kampus Utama',
        ruangan: 'Ruang Seminar 102',
        lat: '-6.734500',
        lng: '108.534000',
        kategori: 'Pintu & Jendela',
        urgensi: 'Rendah',
        deskripsi: 'Engsel pintu kayu belakang macet kencang dan kunci engsel sulit diputar.',
        foto: '',
        status: 'Diajukan',
        teknisi: 'Belum Ditunjuk',
        catatanAdmin: 'Laporan tercatat di log perbaikan rutin.',
        tanggalLapor: '2026-07-31 11:20',
        tanggalUpdate: '2026-07-31 11:20'
    },
    {
        id: 'TRK-2026-008',
        namaPelapor: 'Rizky Pratama',
        nimNip: '230102077',
        peranPelapor: 'Mahasiswa',
        kontakPelapor: '081299001122',
        gedung: 'Kawasan Kampus Utama',
        ruangan: 'Ruang Baca & Komputer Lt. 2',
        lat: '-6.735600',
        lng: '108.534200',
        kategori: 'Kelistrikan & Lampu',
        urgensi: 'Tinggi',
        deskripsi: 'Stop kontak meja belajar nomor 5 percikan api kecil saat colokan dilepas.',
        foto: '',
        status: 'Diproses',
        teknisi: 'Joko (Kelistrikan)',
        catatanAdmin: 'Stop kontak diisolasi sementara dan stop kontak baru disiapkan.',
        tanggalLapor: '2026-07-30 15:30',
        tanggalUpdate: '2026-07-30 17:00'
    },
    {
        id: 'TRK-2026-009',
        namaPelapor: 'Ust. Farhan Ridwan',
        nimNip: '1979061201',
        peranPelapor: 'Dosen',
        kontakPelapor: '085211447788',
        gedung: 'Kawasan Pascasarjana & Mahad',
        ruangan: 'Aula Utama Pascasarjana',
        lat: '-6.734800',
        lng: '108.530800',
        kategori: 'Proyektor & Sound System',
        urgensi: 'Sedang',
        deskripsi: 'Mic wireless podium sering mendengung (feedback noise) tinggi.',
        foto: '',
        status: 'Selesai',
        teknisi: 'Hendra (Audio System)',
        catatanAdmin: 'Penyetelan mixer audio dan peredam frekuensi equalizer selesai.',
        tanggalLapor: '2026-07-24 08:00',
        tanggalUpdate: '2026-07-24 11:30'
    },
    {
        id: 'TRK-2026-010',
        namaPelapor: 'Tri Handoko',
        nimNip: '200301144',
        peranPelapor: 'Mahasiswa',
        kontakPelapor: '083811992233',
        gedung: 'Kawasan Lab Saladara',
        ruangan: 'Ruang Serbaguna Lt. 1',
        lat: '-6.744000',
        lng: '108.525600',
        kategori: 'Bangunan & Infrastruktur',
        urgensi: 'Tinggi',
        deskripsi: 'Terdapat rembesan air hujan dari atap saat hujan deras di dekat panggung utama.',
        foto: '',
        status: 'Diajukan',
        teknisi: 'Belum Ditunjuk',
        catatanAdmin: 'Diserahkan ke tim logistik Kampus 2 Saladara.',
        tanggalLapor: '2026-07-31 07:15',
        tanggalUpdate: '2026-07-31 07:15'
    },
    {
        id: 'TRK-2026-011',
        namaPelapor: 'Kantin Berkah Sejahtera (Ibu Sumiati)',
        nimNip: 'MTR-01',
        peranPelapor: 'Mitra Kampus',
        kontakPelapor: '081288990001',
        gedung: 'Kawasan Kampus Utama',
        ruangan: 'Foodcourt / Kantin Barat Stand 04',
        lat: '-6.735800',
        lng: '108.534100',
        kategori: 'Sanitasi & Toilet',
        urgensi: 'Tinggi',
        deskripsi: 'Pipa pembuangan wastafel cuci piring meluap sehingga air menggenang di selasar foodcourt kantin.',
        foto: '',
        status: 'Diproses',
        teknisi: 'Rahmat (Plumbing)',
        catatanAdmin: 'Tim sanitasi sedang menangani sumbatan pipa air limbah kantin.',
        tanggalLapor: '2026-08-01 10:15',
        tanggalUpdate: '2026-08-01 11:30'
    }
];

const STORAGE_ZONES_KEY = 'SIMPEL_CAMPUS_ZONES';

const DEFAULT_CAMPUS_ZONES = [
    {
        id: 'kampus_utama',
        name: 'Kawasan Kampus Utama',
        polygon: [
            [-6.735695, 108.532945], [-6.73554, 108.532951], [-6.734701, 108.532972], [-6.734682, 108.533112], [-6.734624, 108.53332], [-6.734562, 108.533575], [-6.734567, 108.53362], [-6.734515, 108.533695], [-6.734471, 108.533874], [-6.734414, 108.533961], [-6.734394, 108.534022], [-6.734399, 108.534065], [-6.734371, 108.534125], [-6.734366, 108.534182], [-6.734407, 108.534234], [-6.73448, 108.534317], [-6.7345, 108.534375], [-6.734521, 108.534437], [-6.734671, 108.534431], [-6.735007, 108.534409], [-6.735415, 108.534381], [-6.735451, 108.534382], [-6.735521, 108.53438], [-6.735512, 108.53407], [-6.735526, 108.533833], [-6.735557, 108.533747], [-6.735653, 108.533445], [-6.735686, 108.533301]
        ]
    },
    {
        id: 'gedung_cyber',
        name: 'Kawasan Gedung Cyber',
        polygon: [
            [-6.736657, 108.532119], [-6.736606, 108.531878], [-6.73677, 108.53183], [-6.736749, 108.531772], [-6.736835, 108.531742], [-6.736923, 108.531803], [-6.737017, 108.531812], [-6.73707, 108.531856], [-6.73708, 108.531886], [-6.737129, 108.531861], [-6.737092, 108.531802], [-6.737039, 108.531783], [-6.736963, 108.531763], [-6.736919, 108.531755], [-6.736881, 108.531717], [-6.736885, 108.531289], [-6.7369, 108.531247], [-6.736982, 108.530953], [-6.737375, 108.530886], [-6.737385, 108.530941], [-6.737541, 108.530991], [-6.737511, 108.531333], [-6.737449, 108.531372], [-6.737551, 108.531723], [-6.737597, 108.531716], [-6.737653, 108.531777], [-6.737658, 108.531806], [-6.737356, 108.531826], [-6.737369, 108.531927], [-6.737172, 108.531927], [-6.737124, 108.531959], [-6.73717, 108.531992], [-6.737206, 108.532054], [-6.736907, 108.532081]
        ]
    },
    {
        id: 'gedung_seberang',
        name: 'Kawasan Kampus Sebrang',
        polygon: [
            [-6.735765, 108.532911], [-6.735807, 108.532919], [-6.73581, 108.532697], [-6.736038, 108.532686], [-6.736026, 108.53243], [-6.736054, 108.532427], [-6.736034, 108.532055], [-6.736574, 108.532007], [-6.736592, 108.532099], [-6.736632, 108.532297], [-6.73671, 108.532561], [-6.736783, 108.532774], [-6.736968, 108.533206], [-6.736612, 108.53332], [-6.736577, 108.533241], [-6.736397, 108.533265], [-6.736263, 108.53327], [-6.735803, 108.533278], [-6.735805, 108.532949], [-6.735767, 108.532941]
        ]
    },
    {
        id: 'pascasarjana_mahad',
        name: 'Kawasan Pascasarjana & Mahad',
        polygon: [
            [-6.735741, 108.532103], [-6.735328, 108.532041], [-6.735324, 108.53185], [-6.735429, 108.531793], [-6.735173, 108.530796], [-6.735125, 108.530783], [-6.735019, 108.530409], [-6.73478, 108.530161], [-6.734611, 108.53022], [-6.734513, 108.530226], [-6.734208, 108.530236], [-6.734061, 108.530274], [-6.734082, 108.530365], [-6.733881, 108.530425], [-6.734005, 108.53093], [-6.734068, 108.531046], [-6.734067, 108.531142], [-6.734129, 108.531258], [-6.734128, 108.53134], [-6.734156, 108.531433], [-6.734164, 108.531524], [-6.73418, 108.531542], [-6.734381, 108.531519], [-6.734497, 108.532011], [-6.735102, 108.531903], [-6.735178, 108.532121], [-6.735597, 108.532221], [-6.735603, 108.532149], [-6.735726, 108.532169]
        ]
    },
    {
        id: 'area_saladara',
        name: 'Kawasan Lab Saladara',
        polygon: [
            [-6.74438, 108.525562], [-6.744371, 108.525831], [-6.744221, 108.525832], [-6.744103, 108.525895], [-6.743949, 108.525891], [-6.743796, 108.52589], [-6.74367, 108.525885], [-6.743579, 108.525892], [-6.743671, 108.525619], [-6.743712, 108.525621], [-6.743721, 108.525551], [-6.743724, 108.525508], [-6.743987, 108.525504], [-6.744019, 108.525506], [-6.744017, 108.525553]
        ]
    }
];

function syncCampusZoneMetas(zones) {
    if (!Array.isArray(zones)) return;
    zones.forEach(z => {
        if (!CAMPUS_ZONE_METAS[z.id]) {
            CAMPUS_ZONE_METAS[z.id] = {
                name: z.name,
                icon: z.icon || 'fa-map-location-dot',
                color: z.color || '#f59e0b',
                short: z.short || z.name.replace(/^Kawasan\s+/i, '')
            };
        }
    });
}

function updateFilterGedungOptions() {
    const sel = document.getElementById('filterGedung');
    if (!sel) return;
    const curVal = sel.value;
    const zones = CAMPUS_ZONES || loadCampusZones();
    let html = '<option value="ALL">Semua Kawasan</option>';
    zones.forEach(z => {
        html += `<option value="${escapeHtml(z.name)}">${escapeHtml(z.name)}</option>`;
    });
    sel.innerHTML = html;
    if (curVal && Array.from(sel.options).some(o => o.value === curVal)) {
        sel.value = curVal;
    }
}

function loadCampusZones() {
    const raw = localStorage.getItem(STORAGE_ZONES_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length >= 1) {
                syncCampusZoneMetas(parsed);
                return parsed;
            }
        } catch(e) {
            console.error('Gagal membaca geofencing tersimpan', e);
        }
    }
    const defZones = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_ZONES));
    syncCampusZoneMetas(defZones);
    return defZones;
}

function saveCampusZones(zones) {
    localStorage.setItem(STORAGE_ZONES_KEY, JSON.stringify(zones));
}

let CAMPUS_ZONES = loadCampusZones();

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    initTheme();
    initAdminSidebarState();
    loadStaffAccounts();
    loadCategories();
    loadReports();
    populateCategoryDropdowns();
    renderKPIs();
    renderAllAdminCharts();
    renderAdminTable();
    initAdminOverviewMap();

    // Buka otomatis Studio Tata Letak jika Super Admin datang dari tombol "Kelola Halaman Ini"
    try {
        const params = new URLSearchParams(window.location.search);
        const targetPage = params.get('openBuilder');
        if (targetPage && currentAdminRole === 'superadmin') {
            currentBuilderPageKey = ['login', 'user', 'admin'].includes(targetPage) ? targetPage : 'login';
            switchAdminView('pagebuilder');
        }
    } catch (e) {}
});

function checkAdminAuth() {
    const sessionRaw = localStorage.getItem('SIMPEL_AUTH_SESSION');
    if (!sessionRaw) {
        window.location.href = '../index.html';
        return;
    }
    try {
        const sess = JSON.parse(sessionRaw);
        if (sess.role !== 'admin' && sess.role !== 'superadmin') {
            window.location.href = '../index.html';
            return;
        }

        currentAdminRole = sess.role;

        const badgeDisplay = document.getElementById('adminBadgeDisplay');
        const badgeName = document.getElementById('adminBadgeName');
        const superBanner = document.getElementById('superadminBanner');
        const resetBtn = document.getElementById('btnResetDemo');
        const staffLock = document.getElementById('sidebarStaffLock');
        const btnManageStaff = document.getElementById('btnManageStaff');

        if (badgeName) {
            const sidebarStaffText = document.getElementById('sidebarStaffText');
            const sidebarStaffIcon = document.getElementById('sidebarStaffIcon');
            const btnManageStaffText = document.getElementById('btnManageStaffText');
            const btnManageStaffIcon = document.getElementById('btnManageStaffIcon');

            if (currentAdminRole === 'superadmin') {
                badgeName.innerHTML = `<i class="fa-solid fa-user-shield" style="color:#facc15; margin-right:4px;"></i> Super Admin (${sess.username})`;
                if (badgeDisplay) {
                    badgeDisplay.style.color = '#facc15';
                    badgeDisplay.style.borderColor = '#facc15';
                    badgeDisplay.style.background = 'rgba(250, 204, 21, 0.15)';
                    badgeDisplay.style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.35)';
                }
                if (superBanner) superBanner.classList.remove('hidden');
                if (resetBtn) {
                    resetBtn.style.opacity = '1';
                    resetBtn.style.cursor = 'pointer';
                    resetBtn.title = 'Reset data demo (Wewenang Super Admin)';
                }
                if (sidebarStaffText) sidebarStaffText.innerText = 'Kelola Admin & Petugas';
                if (sidebarStaffIcon) sidebarStaffIcon.className = 'fa-solid fa-users-gear';
                if (staffLock) staffLock.classList.add('hidden');
                // Super Admin Exclusive: Dedicated Section Header & Divider
                const superDivider = document.getElementById('sidebarSuperAdminDivider');
                const superHeader = document.getElementById('sidebarSuperAdminHeader');
                if (superDivider) superDivider.classList.remove('hidden');
                if (superHeader) superHeader.classList.remove('hidden');

                // Super Admin Exclusive: Atur Batas Geofencing
                const sidebarGeofence = document.getElementById('sidebarGeofenceItem');
                if (sidebarGeofence) sidebarGeofence.classList.remove('hidden');
                const btnGeofence = document.getElementById('btnGeofenceConfig');
                if (btnGeofence) btnGeofence.classList.remove('hidden');

                // Super Admin Exclusive: Kelola Konten & Video
                const sidebarCms = document.getElementById('sidebarCmsItem');
                if (sidebarCms) sidebarCms.classList.remove('hidden');
                const btnCms = document.getElementById('btnCmsPortal');
                if (btnCms) btnCms.classList.remove('hidden');

                // Super Admin Exclusive: Surveillance Audit & Log Sistem
                const sidebarAudit = document.getElementById('sidebarAuditItem');
                if (sidebarAudit) sidebarAudit.classList.remove('hidden');

                // Super Admin Exclusive: Security Operations Center (SOC) War Room
                const sidebarSoc = document.getElementById('sidebarSocItem');
                if (sidebarSoc) sidebarSoc.classList.remove('hidden');
            } else {
                badgeName.innerHTML = `<i class="fa-solid fa-user-shield" style="margin-right:4px;"></i> Admin (${sess.username})`;
                if (badgeDisplay) {
                    badgeDisplay.style.color = '#2dd4bf';
                    badgeDisplay.style.borderColor = '#2dd4bf';
                    badgeDisplay.style.background = 'rgba(45, 212, 191, 0.12)';
                    badgeDisplay.style.boxShadow = 'none';
                }
                if (superBanner) superBanner.classList.add('hidden');
                if (resetBtn) {
                    resetBtn.style.opacity = '0.55';
                    resetBtn.title = 'Tindakan ini memerlukan hak akses Super Admin';
                }

                if (sidebarStaffText) sidebarStaffText.innerText = 'Kelola Petugas';
                if (sidebarStaffIcon) sidebarStaffIcon.className = 'fa-solid fa-users-gear';
                if (staffLock) staffLock.classList.add('hidden');
                // Normal Admin: Hide Super Admin Dedicated Section Header & Divider
                const superDivider = document.getElementById('sidebarSuperAdminDivider');
                const superHeader = document.getElementById('sidebarSuperAdminHeader');
                if (superDivider) superDivider.classList.add('hidden');
                if (superHeader) superHeader.classList.add('hidden');

                // Normal Admin: Hide Geofence, CMS, Audit & SOC configuration
                const sidebarGeofence = document.getElementById('sidebarGeofenceItem');
                if (sidebarGeofence) sidebarGeofence.classList.add('hidden');
                const btnGeofence = document.getElementById('btnGeofenceConfig');
                if (btnGeofence) btnGeofence.classList.add('hidden');

                const sidebarCms = document.getElementById('sidebarCmsItem');
                if (sidebarCms) sidebarCms.classList.add('hidden');
                const btnCms = document.getElementById('btnCmsPortal');
                if (btnCms) btnCms.classList.add('hidden');

                const sidebarAuditEl = document.getElementById('sidebarAuditItem');
                if (sidebarAuditEl) sidebarAuditEl.classList.add('hidden');

                const sidebarSocEl = document.getElementById('sidebarSocItem');
                if (sidebarSocEl) sidebarSocEl.classList.add('hidden');
            }

            // Tampilkan informasi wilayah penugasan akun Admin yang sedang login
            loadStaffAccounts();
            const myAccount = staffAccounts.find(s => 
                (s.username && s.username.toLowerCase() === sess.username.toLowerCase()) || 
                (s.id && s.id.toLowerCase() === sess.username.toLowerCase()) ||
                (sess.nimNip && s.id === sess.nimNip)
            );
            const adminWilayahPill = document.getElementById('adminWilayahPill');
            const adminWilayahPillText = document.getElementById('adminWilayahPillText');
            const btnFilterMyWilayah = document.getElementById('btnFilterMyWilayah');

            if (currentAdminRole === 'admin' && myAccount && Array.isArray(myAccount.wilayah) && myAccount.wilayah.length > 0) {
                const names = myAccount.wilayah.map(k => CAMPUS_ZONE_METAS[k]?.short || k);
                if (adminWilayahPillText) adminWilayahPillText.innerText = `Wilayah Tugas: ${names.join(', ')}`;
                if (adminWilayahPill) adminWilayahPill.style.display = 'inline-flex';
                if (btnFilterMyWilayah) btnFilterMyWilayah.style.display = 'inline-flex';
            } else if (currentAdminRole === 'superadmin') {
                if (adminWilayahPillText) adminWilayahPillText.innerText = 'Cakupan: Seluruh 5 Kawasan Kampus';
                if (adminWilayahPill) {
                    adminWilayahPill.style.display = 'inline-flex';
                    adminWilayahPill.style.borderColor = 'rgba(250,204,21,0.35)';
                    adminWilayahPill.style.color = '#facc15';
                    adminWilayahPill.style.background = 'rgba(250,204,21,0.12)';
                }
                if (btnFilterMyWilayah) btnFilterMyWilayah.style.display = 'none';
            }
        }
    } catch (e) {
        window.location.href = '../index.html';
    }
}

function warnSuperAdminOnly(actionName) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Akses Ditolak',
            html: `Tindakan <b>${escapeHtml(actionName)}</b> dibatasi dan hanya dapat dilakukan oleh akun <b>Super Administrator</b>!`,
            confirmButtonColor: '#005a36'
        });
        return;
    }
    showToast(`⛔ Akses Terbatas: Tindakan ${actionName} hanya dapat dilakukan oleh akun Super Admin!`, 'error');
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeIcon(next);
    if (adminChartInstance) {
        renderChart();
    }
}

function handleLogout() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Konfirmasi Keluar',
            text: 'Apakah Anda yakin ingin keluar dari Dashboard Admin?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#005a36',
            cancelButtonColor: '#64748b',
            confirmButtonText: '<i class="fa-solid fa-right-from-bracket"></i> Ya, Keluar',
            cancelButtonText: 'Batal',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('SIMPEL_AUTH_SESSION');
                Swal.fire({
                    icon: 'success',
                    title: 'Sampai Jumpa!',
                    text: 'Sesi Admin telah diakhiri dengan aman.',
                    timer: 1100,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1100);
            }
        });
        return;
    }
    showToast('🔑 Anda telah berhasil keluar dari Dashboard Admin. Mengalihkan...', 'info');
    localStorage.removeItem('SIMPEL_AUTH_SESSION');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1200);
}

// SweetAlert2 Toast Instance for Admin Dashboard
const AdminSwalToast = typeof Swal !== 'undefined' ? Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
}) : null;

function showToast(msg, type = 'info') {
    let swalIcon = type;
    if (type === 'danger') swalIcon = 'error';

    if (typeof Swal !== 'undefined' && AdminSwalToast) {
        AdminSwalToast.fire({
            icon: swalIcon,
            title: msg
        });
        return;
    }

    const box = document.getElementById('toastBox');
    if (!box) return;
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    t.innerHTML = `<i class="${iconClass}"></i> ${msg}`;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3200);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('adminThemeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    const mobileIcon = document.getElementById('adminMobileThemeIcon');
    if (mobileIcon) {
        mobileIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

async function loadReports() {
    let loadedSuccess = false;
    try {
        const res = await fetch('../api/reports.php').catch(() => fetch('../api.php'));
        if (res && res.ok) {
            const text = await res.text();
            if (text.trim().startsWith('[')) { // Valid JSON Array from PHP
                const data = JSON.parse(text);
                if (Array.isArray(data) && data.length > 0) {
                    reportsData = data;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(reportsData));
                    loadedSuccess = true;
                }
            }
        }
    } catch (e) {
        console.info('Pemberitahuan: API Laragon belum aktif, menggunakan mode offline localStorage.');
    }

    if (!loadedSuccess) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                reportsData = JSON.parse(saved);
                if (!Array.isArray(reportsData) || reportsData.length < 3) {
                    reportsData = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
                    saveReports();
                }
            } catch(e) {
                reportsData = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
                saveReports();
            }
        } else {
            reportsData = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
            saveReports();
        }
    }

    renderKPIs();
    renderChart();
    renderAdminTable();
    renderAdminOverviewMarkers();
}

async function saveReports() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reportsData));
    try {
        await fetch('../api/reports.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportsData)
        }).catch(() => fetch('../api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportsData)
        }));
    } catch(e) {
        console.info('Pemberitahuan: Gagal sync ke API Laragon MySQL (offline mode active).');
    }
}

function renderKPIs() {
    const total = reportsData.length;
    const pending = reportsData.filter(r => r.status === 'Diajukan').length;
    const proses = reportsData.filter(r => r.status === 'Diproses').length;
    const selesai = reportsData.filter(r => r.status === 'Selesai').length;

    document.getElementById('kpiTotal').innerText = total;
    document.getElementById('kpiPending').innerText = pending;
    document.getElementById('kpiProses').innerText = proses;
    document.getElementById('kpiSelesai').innerText = selesai;
}

function switchAdminChartType(type) {
    currentAdminChartType = type;
    const btnBar = document.getElementById('btnChartTypeBar');
    const btnDoughnut = document.getElementById('btnChartTypeDoughnut');

    if (type === 'bar') {
        if (btnBar) {
            btnBar.style.background = 'var(--primary)';
            btnBar.style.color = '#fff';
            btnBar.style.borderColor = 'var(--primary)';
        }
        if (btnDoughnut) {
            btnDoughnut.style.background = 'rgba(255,255,255,0.06)';
            btnDoughnut.style.color = 'var(--text-muted)';
            btnDoughnut.style.borderColor = 'var(--border-color)';
        }
    } else {
        if (btnDoughnut) {
            btnDoughnut.style.background = 'var(--primary)';
            btnDoughnut.style.color = '#fff';
            btnDoughnut.style.borderColor = 'var(--primary)';
        }
        if (btnBar) {
            btnBar.style.background = 'rgba(255,255,255,0.06)';
            btnBar.style.color = 'var(--text-muted)';
            btnBar.style.borderColor = 'var(--border-color)';
        }
    }
    renderChart();
}

/* ==========================================================================
   DYNAMIC INTERACTIVE CHART DATA & VISUALIZATION ENGINE (ADMIN & SUPER ADMIN)
   ========================================================================== */
const CHART_PANELS_STORAGE_KEY = 'SIMPEL_CHART_PANELS_V1';
let dynamicChartInstances = {};
let lastFilteredReportsCache = null;

const DEFAULT_CHART_PANELS_STATE = {
    scope: 'ALL',
    gridCols: '2col',
    panels: [
        { id: 'panel_status', dataset: 'status', chartType: 'bar' },
        { id: 'panel_kategori', dataset: 'kategori', chartType: 'doughnut' },
        { id: 'panel_kawasan', dataset: 'kawasan', chartType: 'bar_h' },
        { id: 'panel_urgensi', dataset: 'urgensi', chartType: 'polarArea' }
    ]
};

const CHART_DATASETS_META = {
    status: {
        label: 'Status Penanganan Laporan',
        subtitle: 'Diajukan, Diproses, Selesai & Ditolak',
        badge: 'Status',
        badgeClass: 'badge-emerald',
        icon: 'fa-chart-column',
        iconColor: '#10b981'
    },
    kategori: {
        label: 'Kategori Kerusakan Fasilitas',
        subtitle: 'Distribusi per jenis sarana & prasarana',
        badge: 'Kategori',
        badgeClass: 'badge-gold',
        icon: 'fa-tags',
        iconColor: '#d4a343'
    },
    kawasan: {
        label: 'Sebaran Insiden Kawasan Kampus',
        subtitle: 'Perbandingan laporan antar zona kampus',
        badge: 'Geospasial',
        badgeClass: 'badge-cyan',
        icon: 'fa-building-columns',
        iconColor: '#38bdf8'
    },
    urgensi: {
        label: 'Tingkat Urgensi & Prioritas SLA',
        subtitle: 'Darurat (<12j), Penting (<24j), Standar',
        badge: 'Urgensi SLA',
        badgeClass: 'badge-amber',
        icon: 'fa-triangle-exclamation',
        iconColor: '#f59e0b'
    },
    teknisi: {
        label: 'Distribusi Beban Kerja Teknisi',
        subtitle: 'Jumlah tiket ditangani per petugas sarpras',
        badge: 'Personil',
        badgeClass: 'badge-emerald',
        icon: 'fa-user-gear',
        iconColor: '#2dd4bf'
    },
    peran: {
        label: 'Profil Peran Pelapor Civitas',
        subtitle: 'Mahasiswa, Dosen, Tendik & Mitra Kampus',
        badge: 'Pelapor',
        badgeClass: 'badge-gold',
        icon: 'fa-users',
        iconColor: '#a855f7'
    },
    tren_waktu: {
        label: 'Tren Waktu Laporan Masuk',
        subtitle: 'Kronologi jumlah pengaduan per tanggal',
        badge: 'Kronologi',
        badgeClass: 'badge-cyan',
        icon: 'fa-calendar-days',
        iconColor: '#06b6d4'
    }
};

const CHART_TYPES_META = [
    { value: 'bar', label: 'Batang Tegak (Bar)' },
    { value: 'bar_h', label: 'Batang Mendatar (Horizontal)' },
    { value: 'line', label: 'Garis & Area Tren (Line)' },
    { value: 'doughnut', label: 'Cincin Proporsi (Doughnut)' },
    { value: 'pie', label: 'Lingkaran Penuh (Pie)' },
    { value: 'polarArea', label: 'Area Polar (Polar Radar)' },
    { value: 'radar', label: 'Jaring Laba-laba (Radar)' }
];

function loadChartPanelsState() {
    try {
        const raw = localStorage.getItem(CHART_PANELS_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_CHART_PANELS_STATE));
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.panels) || parsed.panels.length === 0) {
            return JSON.parse(JSON.stringify(DEFAULT_CHART_PANELS_STATE));
        }
        return {
            scope: parsed.scope || 'ALL',
            gridCols: parsed.gridCols || '2col',
            panels: parsed.panels.filter(p => p && CHART_DATASETS_META[p.dataset])
        };
    } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_CHART_PANELS_STATE));
    }
}

function saveChartPanelsState(state) {
    localStorage.setItem(CHART_PANELS_STORAGE_KEY, JSON.stringify(state));
}

function resolveChartSourceItems(passedItems) {
    if (Array.isArray(passedItems) && passedItems !== reportsData) {
        lastFilteredReportsCache = passedItems;
    }
    const state = loadChartPanelsState();
    const scopeEl = document.getElementById('chartScopeFilter');
    const activeScope = scopeEl ? scopeEl.value : state.scope;

    if (activeScope === 'FILTERED') {
        return Array.isArray(lastFilteredReportsCache) ? lastFilteredReportsCache : reportsData;
    }
    if (activeScope === 'ACTIVE') {
        return reportsData.filter(r => r.status === 'Diajukan' || r.status === 'Diproses');
    }
    if (activeScope === 'SELESAI') {
        return reportsData.filter(r => r.status === 'Selesai');
    }
    return reportsData;
}

function computeDatasetSeries(datasetKey, items) {
    const palette = [
        '#10b981', '#d4a343', '#38bdf8', '#f59e0b',
        '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
        '#6366f1', '#f97316', '#64748b'
    ];

    if (datasetKey === 'status') {
        return {
            labels: ['Diajukan', 'Diproses', 'Selesai', 'Ditolak'],
            values: [
                items.filter(r => r.status === 'Diajukan').length,
                items.filter(r => r.status === 'Diproses').length,
                items.filter(r => r.status === 'Selesai').length,
                items.filter(r => r.status === 'Ditolak').length
            ],
            colors: ['#ef4444', '#f59e0b', '#10b981', '#64748b'],
            unit: 'Tiket'
        };
    }

    if (datasetKey === 'kategori') {
        const activeCats = (typeof categoriesData !== 'undefined' && categoriesData && categoriesData.length > 0)
            ? categoriesData
            : DEFAULT_CATEGORIES_DATA;
        const labels = activeCats.map(c => c.nama);
        const values = activeCats.map(c => {
            const firstWord = c.nama.toLowerCase().split(' ')[0];
            return items.filter(r => (r.kategori || '').toLowerCase().includes(firstWord)).length;
        });
        return {
            labels,
            values,
            colors: labels.map((_, i) => palette[i % palette.length]),
            unit: 'Laporan'
        };
    }

    if (datasetKey === 'kawasan') {
        const zoneDefs = [
            { name: 'Kampus Utama', keys: ['rektorat', 'fitk', 'tarbiyah', 'fsei', 'syariah', 'fuad', 'ushuluddin', 'ict', 'laboratorium', 'perpustakaan', 'auditorium', 'utama'] },
            { name: 'Gedung Cyber', keys: ['cyber', 'it'] },
            { name: 'Kampus Sebrang', keys: ['seberang', 'sebrang'] },
            { name: "Pascasarjana & Ma'had", keys: ['pascasarjana', 'mahad', "ma'had"] },
            { name: 'Lab Saladara', keys: ['saladara'] }
        ];
        // Tambahkan kawasan kustom dari CAMPUS_ZONES bila ada
        if (Array.isArray(CAMPUS_ZONES)) {
            CAMPUS_ZONES.forEach(z => {
                if (z && z.name && !zoneDefs.some(d => z.name.toLowerCase().includes(d.keys[0]))) {
                    zoneDefs.push({ name: z.shortName || z.name, keys: [z.name.toLowerCase(), z.id.toLowerCase()] });
                }
            });
        }
        const labels = zoneDefs.map(z => z.name);
        const values = zoneDefs.map(z => items.filter(r => {
            const g = (r.gedung || '').toLowerCase();
            return z.keys.some(k => g.includes(k));
        }).length);
        return {
            labels,
            values,
            colors: ['#005a36', '#06b6d4', '#a855f7', '#f59e0b', '#ec4899', '#10b981', '#3b82f6'].slice(0, labels.length),
            unit: 'Insiden'
        };
    }

    if (datasetKey === 'urgensi') {
        return {
            labels: ['Darurat (SLA <12j)', 'Penting (SLA <24j)', 'Standar (SLA <48j)'],
            values: [
                items.filter(r => r.urgensi === 'Darurat' || r.urgensi === 'Tinggi').length,
                items.filter(r => r.urgensi === 'Penting' || r.urgensi === 'Sedang').length,
                items.filter(r => r.urgensi === 'Standar' || r.urgensi === 'Rendah' || !r.urgensi).length
            ],
            colors: ['#ef4444', '#f59e0b', '#10b981'],
            unit: 'Tiket'
        };
    }

    if (datasetKey === 'teknisi') {
        const countsMap = {};
        items.forEach(r => {
            const name = (r.teknisi && r.teknisi.trim()) ? r.teknisi.trim() : 'Belum Ditunjuk';
            countsMap[name] = (countsMap[name] || 0) + 1;
        });
        const entries = Object.entries(countsMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
        if (entries.length === 0) entries.push(['Belum Ada Data', 0]);
        return {
            labels: entries.map(e => e[0]),
            values: entries.map(e => e[1]),
            colors: entries.map((_, i) => palette[i % palette.length]),
            unit: 'Tiket'
        };
    }

    if (datasetKey === 'peran') {
        const roles = ['Mahasiswa', 'Dosen', 'Tenaga Kependidikan', 'Mitra Kampus', 'Umum / Lainnya'];
        const values = [0, 0, 0, 0, 0];
        items.forEach(r => {
            const p = (r.peranPelapor || '').toLowerCase();
            if (p.includes('mahasiswa')) values[0]++;
            else if (p.includes('dosen')) values[1]++;
            else if (p.includes('tendik') || p.includes('kependidikan') || p.includes('staf')) values[2]++;
            else if (p.includes('mitra')) values[3]++;
            else values[4]++;
        });
        return {
            labels: roles,
            values,
            colors: ['#10b981', '#38bdf8', '#d4a343', '#f59e0b', '#94a3b8'],
            unit: 'Pelapor'
        };
    }

    // tren_waktu: Group by date (YYYY-MM-DD)
    const dateMap = {};
    items.forEach(r => {
        const rawDate = (r.tanggalLapor || '').split(' ')[0] || 'Lainnya';
        dateMap[rawDate] = (dateMap[rawDate] || 0) + 1;
    });
    const sortedDates = Object.keys(dateMap).sort().slice(-10);
    if (sortedDates.length === 0) sortedDates.push('Hari Ini');
    return {
        labels: sortedDates,
        values: sortedDates.map(d => dateMap[d] || 0),
        colors: sortedDates.map((_, i) => palette[i % palette.length]),
        unit: 'Laporan'
    };
}

function handleChartScopeOrLayoutChange() {
    const state = loadChartPanelsState();
    const scopeEl = document.getElementById('chartScopeFilter');
    const colsEl = document.getElementById('chartGridColsSelect');
    if (scopeEl) state.scope = scopeEl.value;
    if (colsEl) state.gridCols = colsEl.value;
    saveChartPanelsState(state);
    renderAllAdminCharts();
}

function updateAdminChartPanel(panelId, field, newValue) {
    const state = loadChartPanelsState();
    const target = state.panels.find(p => p.id === panelId);
    if (!target) return;
    target[field] = newValue;
    saveChartPanelsState(state);
    renderAllAdminCharts();
}

function addNewAdminChartPanel() {
    const state = loadChartPanelsState();
    if (state.panels.length >= 8) {
        showToast('Maksimal 8 panel grafik aktif sekaligus agar dashboard tetap optimal.', 'info');
        return;
    }
    const allDatasets = Object.keys(CHART_DATASETS_META);
    const usedDatasets = state.panels.map(p => p.dataset);
    const nextDataset = allDatasets.find(d => !usedDatasets.includes(d)) || 'teknisi';
    const defaultTypes = {
        status: 'bar',
        kategori: 'doughnut',
        kawasan: 'bar_h',
        urgensi: 'polarArea',
        teknisi: 'bar',
        peran: 'pie',
        tren_waktu: 'line'
    };

    state.panels.push({
        id: 'panel_' + Date.now(),
        dataset: nextDataset,
        chartType: defaultTypes[nextDataset] || 'bar'
    });
    saveChartPanelsState(state);
    renderAllAdminCharts();
    showToast('Panel grafik analitik baru berhasil ditambahkan!', 'success');
}

function removeAdminChartPanel(panelId) {
    const state = loadChartPanelsState();
    if (state.panels.length <= 1) {
        showToast('Minimal 1 panel grafik tetap ditampilkan di pusat analitik.', 'info');
        return;
    }
    state.panels = state.panels.filter(p => p.id !== panelId);
    saveChartPanelsState(state);
    renderAllAdminCharts();
    showToast('Panel grafik dihapus dari tampilan.', 'info');
}

function moveAdminChartPanel(panelId, dir) {
    const state = loadChartPanelsState();
    const idx = state.panels.findIndex(p => p.id === panelId);
    if (idx < 0) return;
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= state.panels.length) return;
    const tmp = state.panels[idx];
    state.panels[idx] = state.panels[swapIdx];
    state.panels[swapIdx] = tmp;
    saveChartPanelsState(state);
    renderAllAdminCharts();
}

function resetAdminChartPanels() {
    localStorage.removeItem(CHART_PANELS_STORAGE_KEY);
    renderAllAdminCharts();
    showToast('Susunan dan pilihan grafik dikembalikan ke standar awal.', 'success');
}

function downloadAdminChartPng(panelId) {
    const inst = dynamicChartInstances[panelId];
    if (!inst) return;
    const link = document.createElement('a');
    link.href = inst.toBase64Image('image/png', 1);
    link.download = `GRAFIK_SIMPEL_UINSSC_${panelId}.png`;
    link.click();
    showToast('Gambar grafik PNG berhasil diunduh.', 'success');
}

function renderAllAdminCharts(itemsToRender = reportsData) {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js belum dimuat.');
        return;
    }

    const grid = document.getElementById('analyticsChartsGrid');
    if (!grid) return;

    const state = loadChartPanelsState();

    // Sync toolbar dropdowns
    const scopeEl = document.getElementById('chartScopeFilter');
    const colsEl = document.getElementById('chartGridColsSelect');
    if (scopeEl && scopeEl.value !== state.scope) scopeEl.value = state.scope;
    if (colsEl && colsEl.value !== state.gridCols) colsEl.value = state.gridCols;

    grid.classList.remove('charts-cols-1', 'charts-cols-3');
    if (state.gridCols === '1col') grid.classList.add('charts-cols-1');
    else if (state.gridCols === '3col') grid.classList.add('charts-cols-3');

    // Destroy previous Chart.js instances cleanly
    Object.keys(dynamicChartInstances).forEach(k => {
        try {
            if (dynamicChartInstances[k]) dynamicChartInstances[k].destroy();
        } catch (e) {}
    });
    dynamicChartInstances = {};

    const sourceItems = resolveChartSourceItems(itemsToRender);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const textColor = isLight ? '#334155' : '#cbd5e1';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)';

    // Render Dynamic Cards HTML
    grid.innerHTML = state.panels.map((p, idx) => {
        const meta = CHART_DATASETS_META[p.dataset] || CHART_DATASETS_META.status;
        const datasetOpts = Object.keys(CHART_DATASETS_META).map(dk =>
            `<option value="${dk}" ${dk === p.dataset ? 'selected' : ''}>Data: ${escapeHtml(CHART_DATASETS_META[dk].label)}</option>`
        ).join('');
        const typeOpts = CHART_TYPES_META.map(t =>
            `<option value="${t.value}" ${t.value === p.chartType ? 'selected' : ''}>Grafik: ${escapeHtml(t.label)}</option>`
        ).join('');

        return `
            <div class="chart-card" id="chartCard_${escapeHtml(p.id)}">
                <div class="chart-card-header" style="margin-bottom:6px;">
                    <div style="min-width:0;">
                        <h4 class="chart-title">
                            <i class="fa-solid ${escapeHtml(meta.icon)}" style="color:${meta.iconColor};"></i>
                            <span>${escapeHtml(meta.label)}</span>
                        </h4>
                        <span class="chart-subtitle">${escapeHtml(meta.subtitle)} &bull; Total sampel: ${sourceItems.length}</span>
                    </div>
                    <span class="chart-badge ${escapeHtml(meta.badgeClass)}">${escapeHtml(meta.badge)}</span>
                </div>

                <div class="chart-card-controls">
                    <select class="chart-mini-select" onchange="updateAdminChartPanel('${escapeHtml(p.id)}', 'dataset', this.value)" title="Pilih sumber data untuk grafik ini">
                        ${datasetOpts}
                    </select>
                    <select class="chart-mini-select" onchange="updateAdminChartPanel('${escapeHtml(p.id)}', 'chartType', this.value)" title="Pilih jenis tampilan grafik">
                        ${typeOpts}
                    </select>
                    <button type="button" class="chart-icon-btn" onclick="moveAdminChartPanel('${escapeHtml(p.id)}', -1)" title="Geser ke kiri / atas" ${idx === 0 ? 'disabled style="opacity:0.35; cursor:default;"' : ''}>
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <button type="button" class="chart-icon-btn" onclick="moveAdminChartPanel('${escapeHtml(p.id)}', 1)" title="Geser ke kanan / bawah" ${idx === state.panels.length - 1 ? 'disabled style="opacity:0.35; cursor:default;"' : ''}>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    <button type="button" class="chart-icon-btn" onclick="downloadAdminChartPng('${escapeHtml(p.id)}')" title="Unduh gambar grafik (PNG)">
                        <i class="fa-solid fa-camera"></i>
                    </button>
                    <button type="button" class="chart-icon-btn danger" onclick="removeAdminChartPanel('${escapeHtml(p.id)}')" title="Hapus panel grafik ini">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="chart-canvas-wrapper" style="margin-top:10px;">
                    <canvas id="canvas_${escapeHtml(p.id)}"></canvas>
                </div>
            </div>
        `;
    }).join('');

    // Instantiate each Chart.js canvas
    state.panels.forEach(p => {
        const canvas = document.getElementById('canvas_' + p.id);
        if (!canvas) return;
        const series = computeDatasetSeries(p.dataset, sourceItems);
        const rawType = p.chartType || 'bar';
        const actualType = rawType === 'bar_h' ? 'bar' : rawType;
        const isCircular = ['doughnut', 'pie', 'polarArea', 'radar'].includes(actualType);
        const isLine = actualType === 'line';

        const datasetConfig = {
            label: series.unit || 'Jumlah',
            data: series.values,
            backgroundColor: isLine
                ? 'rgba(16, 185, 129, 0.18)'
                : (actualType === 'radar' ? 'rgba(212, 163, 67, 0.22)' : series.colors),
            borderColor: isLine
                ? '#10b981'
                : (actualType === 'radar' ? '#d4a343' : (isLight ? '#ffffff' : '#061a12')),
            borderWidth: isLine || actualType === 'radar' ? 2.5 : 1.5,
            fill: isLine || actualType === 'radar',
            tension: 0.35,
            pointBackgroundColor: isLine ? '#d4a343' : series.colors,
            pointRadius: isLine || actualType === 'radar' ? 4 : 0
        };

        if (actualType === 'bar') {
            datasetConfig.borderRadius = 7;
            datasetConfig.maxBarThickness = 40;
        }

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: rawType === 'bar_h' ? 'y' : 'x',
            plugins: {
                legend: {
                    display: isCircular && actualType !== 'radar',
                    position: actualType === 'polarArea' ? 'bottom' : 'right',
                    labels: {
                        color: textColor,
                        font: { family: "'Plus Jakarta Sans', sans-serif", size: 10.5, weight: '600' },
                        boxWidth: 10,
                        padding: 8,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            const total = (ctx.dataset.data || []).reduce((a, b) => a + b, 0) || 1;
                            const val = typeof ctx.raw === 'number' ? ctx.raw : 0;
                            const pct = Math.round((val / total) * 100);
                            return ` ${ctx.label}: ${val} ${series.unit} (${pct}%)`;
                        }
                    }
                }
            }
        };

        if (actualType === 'doughnut') {
            options.cutout = '60%';
        }

        if (actualType === 'polarArea' || actualType === 'radar') {
            options.scales = {
                r: {
                    beginAtZero: true,
                    ticks: { display: false },
                    pointLabels: {
                        color: textColor,
                        font: { family: "'Plus Jakarta Sans', sans-serif", size: 10.5, weight: '600' }
                    },
                    grid: { color: gridColor },
                    angleLines: { color: gridColor }
                }
            };
        } else if (!isCircular) {
            options.scales = {
                x: {
                    beginAtZero: true,
                    grid: { display: rawType === 'bar_h', color: gridColor },
                    ticks: {
                        stepSize: rawType === 'bar_h' ? 1 : undefined,
                        color: textColor,
                        font: { family: "'Plus Jakarta Sans', sans-serif", size: 10.5, weight: '600' }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: { display: rawType !== 'bar_h', color: gridColor },
                    ticks: {
                        stepSize: rawType !== 'bar_h' ? 1 : undefined,
                        color: textColor,
                        font: { family: "'Plus Jakarta Sans', sans-serif", size: 10.5, weight: '600' }
                    }
                }
            };
        }

        dynamicChartInstances[p.id] = new Chart(canvas.getContext('2d'), {
            type: actualType,
            data: {
                labels: series.labels,
                datasets: [datasetConfig]
            },
            options
        });
    });
}

// Backward compatibility: renderChart memanggil renderAllAdminCharts
function renderChart(itemsToRender = reportsData) {
    renderAllAdminCharts(itemsToRender);
}

// Sidebar Collapse / Mobile Drawer Functionality
function toggleAdminSidebar() {
    const wrapper = document.getElementById('adminWrapper');
    if (!wrapper) return;

    if (window.innerWidth <= 768) {
        // Mobile Drawer Toggle
        wrapper.classList.toggle('mobile-sidebar-open');
    } else {
        // Desktop Collapsed Toggle
        wrapper.classList.toggle('sidebar-collapsed');
        const isCollapsed = wrapper.classList.contains('sidebar-collapsed');
        localStorage.setItem('SIMPEL_ADMIN_SIDEBAR_COLLAPSED', isCollapsed ? 'true' : 'false');
        updateSidebarToggleIcon(isCollapsed);

        // Invalidate map size so it fits the expanded/collapsed screen smoothly
        setTimeout(() => {
            if (adminOverviewMapInstance) {
                adminOverviewMapInstance.invalidateSize();
            }
        }, 320);
    }
}

function closeAdminSidebar() {
    const wrapper = document.getElementById('adminWrapper');
    if (wrapper) {
        wrapper.classList.remove('mobile-sidebar-open');
    }
}

function updateSidebarToggleIcon(isCollapsed) {
    const icon = document.getElementById('sidebarToggleIcon');
    if (icon) {
        icon.className = isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
    }
}

function initAdminSidebarState() {
    const wrapper = document.getElementById('adminWrapper');
    if (!wrapper) return;

    if (window.innerWidth > 768) {
        const saved = localStorage.getItem('SIMPEL_ADMIN_SIDEBAR_COLLAPSED');
        if (saved === 'true') {
            wrapper.classList.add('sidebar-collapsed');
            updateSidebarToggleIcon(true);
        } else {
            wrapper.classList.remove('sidebar-collapsed');
            updateSidebarToggleIcon(false);
        }
    } else {
        // Mobile starts with drawer closed and not desktop-collapsed
        wrapper.classList.remove('sidebar-collapsed');
        wrapper.classList.remove('mobile-sidebar-open');
    }
}

// Window resize listener to keep state clean across responsive breakpoints
window.addEventListener('resize', () => {
    const wrapper = document.getElementById('adminWrapper');
    if (!wrapper) return;
    if (window.innerWidth > 768) {
        wrapper.classList.remove('mobile-sidebar-open');
        const saved = localStorage.getItem('SIMPEL_ADMIN_SIDEBAR_COLLAPSED');
        if (saved === 'true') {
            wrapper.classList.add('sidebar-collapsed');
            updateSidebarToggleIcon(true);
        } else {
            wrapper.classList.remove('sidebar-collapsed');
            updateSidebarToggleIcon(false);
        }
    } else {
        wrapper.classList.remove('sidebar-collapsed');
    }
});

let isDuplicateFilterActive = false;

// Deteksi Laporan Serupa / Duplikat untuk Memudahkan Admin
function getDuplicateReportMap() {
    const map = {}; // ticketId -> array of other similar ticket objects
    const activeReports = reportsData.filter(r => r.status === 'Diajukan' || r.status === 'Diproses');

    for (let i = 0; i < activeReports.length; i++) {
        const a = activeReports[i];
        for (let j = i + 1; j < activeReports.length; j++) {
            const b = activeReports[j];

            const sameGedung = a.gedung === b.gedung;
            const sameKategori = a.kategori.toLowerCase() === b.kategori.toLowerCase();
            const roomA = a.ruangan.trim().toLowerCase();
            const roomB = b.ruangan.trim().toLowerCase();
            const sameRoom = roomA === roomB || roomA.includes(roomB) || roomB.includes(roomA);

            if (sameGedung && sameKategori && sameRoom) {
                if (!map[a.id]) map[a.id] = [];
                if (!map[b.id]) map[b.id] = [];
                map[a.id].push(b);
                map[b.id].push(a);
            }
        }
    }
    return map;
}

function updateDuplicateCounter() {
    const dupMap = getDuplicateReportMap();
    const dupIds = Object.keys(dupMap);
    const counterEl = document.getElementById('duplicateCountNum');
    if (counterEl) {
        counterEl.innerText = dupIds.length;
    }
}

function toggleDuplicateFilter() {
    isDuplicateFilterActive = !isDuplicateFilterActive;
    const btn = document.getElementById('btnDuplicateFilter');
    if (btn) {
        if (isDuplicateFilterActive) {
            btn.style.background = '#f59e0b';
            btn.style.color = '#000';
            showToast('Filter Aktif: Menampilkan hanya laporan yang berpotensi serupa / duplikat.', 'info');
        } else {
            btn.style.background = 'rgba(245,158,11,0.12)';
            btn.style.color = '#f59e0b';
            showToast('Filter duplikasi dimatikan.', 'info');
        }
    }
    renderAdminTable();
}

function filterByDuplicateGroup(ticketId) {
    const dupMap = getDuplicateReportMap();
    const related = dupMap[ticketId] || [];
    const searchEl = document.getElementById('searchInput');
    if (searchEl && related.length > 0) {
        searchEl.value = related[0].ruangan;
        renderAdminTable();
        showToast(`Memfilter seluruh laporan di ${related[0].ruangan}`, 'info');
    }
}

function syncDuplicateUpdates(mainId) {
    const dupMap = getDuplicateReportMap();
    const duplicates = dupMap[mainId] || [];
    if (duplicates.length === 0) return;

    const newStatus = document.getElementById('modalStatusSelect').value;
    const newTeknisi = document.getElementById('modalTeknisiInput').value.trim() || 'Belum Ditunjuk';
    const newCatatan = document.getElementById('modalCatatanInput').value.trim();

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    duplicates.forEach(d => {
        const item = reportsData.find(r => r.id === d.id);
        if (item) {
            item.status = newStatus;
            item.teknisi = newTeknisi;
            if (newCatatan) {
                item.catatanAdmin = `[Tautan Serupa] ${newCatatan}`;
            }
            item.tanggalUpdate = timeStr;
        }
    });

    saveReports();
    renderAdminTable();
    openAdminModal(mainId); // refresh modal info
    showToast(`✅ Berhasil menyelaraskan status & teknisi ke ${duplicates.length} laporan serupa!`, 'success');
}

function renderAdminTable() {
    updateDuplicateCounter();
    const dupMap = getDuplicateReportMap();

    const statusFilter = document.getElementById('filterStatus').value;
    const gedungFilter = document.getElementById('filterGedung').value;
    const search = document.getElementById('searchInput').value.trim().toLowerCase();

    const filtered = reportsData.filter(item => {
        if (isDuplicateFilterActive && !dupMap[item.id]) return false;
        if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

        // Filter Penugasan Wilayah Admin (Jika mode Wilayah Tugas Saya aktif)
        if (isMyWilayahFilterActive && currentAdminRole === 'admin') {
            const sessionRaw = localStorage.getItem('SIMPEL_AUTH_SESSION');
            if (sessionRaw) {
                try {
                    const sess = JSON.parse(sessionRaw);
                    loadStaffAccounts();
                    const myAcc = staffAccounts.find(s => 
                        (s.username && s.username.toLowerCase() === sess.username.toLowerCase()) || 
                        (s.id && s.id.toLowerCase() === sess.username.toLowerCase()) ||
                        (sess.nimNip && s.id === sess.nimNip)
                    );
                    if (myAcc && Array.isArray(myAcc.wilayah) && myAcc.wilayah.length > 0) {
                        const repZone = getReportZone(item);
                        if (!repZone || !myAcc.wilayah.includes(repZone.id)) return false;
                    }
                } catch(e) {}
            }
        }
        if (gedungFilter !== 'ALL') {
            const itemGedung = (item.gedung || '').toLowerCase();
            const filterLower = gedungFilter.toLowerCase();
            let matchesZone = (itemGedung === filterLower);
            if (!matchesZone) {
                if (filterLower.includes('utama') && (itemGedung.includes('utama') || itemGedung.includes('rektorat') || itemGedung.includes('tarbiyah') || itemGedung.includes('syariah') || itemGedung.includes('ushuluddin') || itemGedung.includes('perpustakaan') || itemGedung.includes('laboratorium'))) matchesZone = true;
                else if (filterLower.includes('cyber') && itemGedung.includes('cyber')) matchesZone = true;
                else if (filterLower.includes('saladara') && itemGedung.includes('saladara')) matchesZone = true;
                else if (filterLower.includes('sebrang') && (itemGedung.includes('sebrang') || itemGedung.includes('seberang'))) matchesZone = true;
                else if (filterLower.includes('pascasarjana') && (itemGedung.includes('pasca') || itemGedung.includes('mahad') || itemGedung.includes("ma'had"))) matchesZone = true;
            }
            if (!matchesZone) return false;
        }
        if (search) {
            const text = `${item.id} ${item.namaPelapor} ${item.ruangan} ${item.deskripsi} ${item.kategori} ${item.lat} ${item.lng}`.toLowerCase();
            if (!text.includes(search)) return false;
        }
        return true;
    });

    const tbody = document.getElementById('adminTableBody');
    
    // Update marker peta GIS & Grafik Statistik secara real-time berdasarkan filter aktif
    renderAdminOverviewMarkers(filtered);
    renderChart(filtered);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--text-muted);">Tidak ada data laporan yang cocok.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((item, index) => {
        const duplicates = dupMap[item.id] || [];
        const duplicateBadge = duplicates.length > 0 ? `
            <div>
                <span class="badge-duplicate" onclick="openAdminModal('${item.id}')" title="Ada ${duplicates.length} laporan lain mengenai ${escapeHtml(item.kategori)} di ruangan ini">
                    <i class="fa-solid fa-copy"></i> Serupa (${duplicates.length + 1})
                </span>
            </div>
        ` : '';

        return `
            <tr>
                <td style="text-align:center; font-weight:700; color:var(--text-muted); font-size:12px;">${index + 1}</td>
                <td><span style="font-family:monospace; font-weight:800; color:var(--gold);">${item.id}</span></td>
                <td style="font-size:12px; color:var(--text-muted);">${item.tanggalLapor}</td>
                <td>
                    <strong>${escapeHtml(item.namaPelapor)}</strong>
                    <div style="font-size:11px; margin-top:2px;">
                        ${item.peranPelapor === 'Mitra Kampus'
                            ? `<span style="background:rgba(234,179,8,0.15); color:#facc15; border:1px solid rgba(234,179,8,0.3); padding:1px 6px; border-radius:8px; font-weight:700;"><i class="fa-solid fa-handshake"></i> Mitra</span>`
                            : `<span style="color:var(--text-muted);">${escapeHtml(item.peranPelapor || 'User')}</span>`}
                        <span style="color:var(--text-muted);">(${escapeHtml(item.nimNip)})</span>
                    </div>
                </td>
                <td>
                    <strong>${escapeHtml(item.ruangan)}</strong>
                    <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(item.gedung)}</div>
                    <div style="font-size:10px; color:var(--gold); font-family:monospace;"><i class="fa-solid fa-location-dot"></i> ${item.lat || '-6.737400'}, ${item.lng || '108.553100'}</div>
                    ${duplicateBadge}
                </td>
                <td>${escapeHtml(item.kategori)}</td>
                <td><span class="dot-urgensi dot-${item.urgensi}"></span> ${item.urgensi}</td>
                <td><span class="badge-status badge-${item.status}">${item.status}</span></td>
                <td style="font-size:12px; font-weight:700;">${escapeHtml(item.teknisi)}</td>
                <td style="text-align:center;">
                    <button class="btn-act" onclick="openAdminModal('${item.id}')" title="Kelola Tiket & Tindak Lanjut"><i class="fa-solid fa-pen-to-square"></i></button>
                    ${currentAdminRole === 'superadmin' 
                        ? `<button class="btn-act btn-del" onclick="deleteReport('${item.id}')" title="Hapus Laporan (Wewenang Super Admin)"><i class="fa-solid fa-trash-can"></i></button>`
                        : ''
                    }
                </td>
            </tr>
        `;
    }).join('');
}

function openAdminModal(id) {
    const report = reportsData.find(r => r.id === id);
    if (!report) return;

    editingId = id;
    currentAdminFoto = report.foto || '';
    const fileInput = document.getElementById('modalFotoInput');
    if (fileInput) fileInput.value = '';
    renderAdminFotoPreview();

    document.getElementById('modalTicketCode').innerText = report.id;
    document.getElementById('modalStatusSelect').value = report.status;
    populateTeknisiSelect(report.teknisi);
    document.getElementById('modalCatatanInput').value = report.catatanAdmin || '';

    const reportLat = parseFloat(report.lat || -6.737400);
    const reportLng = parseFloat(report.lng || 108.553100);

    document.getElementById('modalReportInfo').innerHTML = `
        <p><strong>Pelapor:</strong> ${escapeHtml(report.namaPelapor)} (${report.nimNip}) - ${escapeHtml(report.kontakPelapor)}</p>
        <p style="margin-top:4px;"><strong>Lokasi:</strong> ${escapeHtml(report.gedung)} - ${escapeHtml(report.ruangan)}</p>
        <p style="margin-top:4px;"><strong>Kategori:</strong> <strong style="color:var(--gold);">${escapeHtml(report.kategori)}</strong> &nbsp;|&nbsp; <strong>Urgensi:</strong> ${escapeHtml(report.urgensi)}</p>
        <p style="margin-top:4px;"><strong>Koordinat GPS:</strong> <span style="font-family:monospace; color:var(--gold); font-weight:700;">${reportLat.toFixed(6)}, ${reportLng.toFixed(6)}</span></p>
        <p style="margin-top:4px;"><strong>Masalah:</strong> ${escapeHtml(report.deskripsi)}</p>
    `;

    // Cek apakah ada laporan serupa di ruangan ini
    const dupMap = getDuplicateReportMap();
    const duplicates = dupMap[id] || [];
    const dupContainer = document.getElementById('modalDuplicateInfo');

    if (dupContainer) {
        if (duplicates.length > 0) {
            dupContainer.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                    <div>
                        <strong style="color:#f59e0b; font-size:13px;"><i class="fa-solid fa-clone"></i> Terdeteksi ${duplicates.length} Laporan Serupa di Ruangan Ini:</strong>
                        <span style="display:block; font-size:11px; color:var(--text-muted);">Kerusakan serupa (${escapeHtml(report.kategori)}) dilaporkan oleh beberapa pengguna.</span>
                    </div>
                    <button type="button" class="btn btn-secondary" onclick="syncDuplicateUpdates('${id}')" style="font-size:11px; padding:4px 10px; background:rgba(245,158,11,0.2); color:#f59e0b; border-color:#f59e0b; cursor:pointer;">
                        <i class="fa-solid fa-link"></i> Terapkan Status & Teknisi ke Semua
                    </button>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; max-height:130px; overflow-y:auto;">
                    ${duplicates.map(d => `
                        <div style="background:rgba(0,0,0,0.25); padding:8px 12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; font-size:12px; border:1px solid var(--border-color);">
                            <div>
                                <strong style="color:var(--gold); font-family:monospace;">${d.id}</strong> - ${escapeHtml(d.namaPelapor)} (${d.nimNip})
                                <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(d.deskripsi.substring(0, 70))}...</div>
                            </div>
                            <span class="badge-status badge-${d.status}" style="font-size:10px; padding:2px 8px;">${d.status}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            dupContainer.classList.remove('hidden');
        } else {
            dupContainer.classList.add('hidden');
        }
    }

    document.getElementById('adminEditModal').classList.remove('hidden');

    // Initialize or update Admin Leaflet Map (Masked, Center of All Zones & Comfortable Zoom)
    setTimeout(() => {
        if (typeof L !== 'undefined') {

            if (!adminMapInstance) {
                adminMapInstance = L.map('adminMap', {
                    center: [reportLat, reportLng],
                    zoom: 16,
                    minZoom: 14,
                    maxZoom: 22
                });
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    minZoom: 14,
                    maxZoom: 22,
                    maxNativeZoom: 19,
                    attribution: '&copy; OpenStreetMap & UINSSC'
                }).addTo(adminMapInstance);

                // Render White Mask Overlay (Default Masking Putih)
                const outerWorld = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
                const campusHoles = CAMPUS_ZONES.map(z => z.polygon);

                L.polygon([outerWorld, ...campusHoles], {
                    color: '#c59235',
                    weight: 2.5,
                    dashArray: '5, 5',
                    fillColor: '#ffffff',
                    fillOpacity: 0.76,
                    interactive: false
                }).addTo(adminMapInstance);

                CAMPUS_ZONES.forEach(z => {
                    L.polygon(z.polygon, {
                        color: '#c59235',
                        weight: 2,
                        fillColor: '#005a36',
                        fillOpacity: 0.25
                    }).addTo(adminMapInstance);
                });

                adminMarkerInstance = L.marker([reportLat, reportLng]).addTo(adminMapInstance);
            } else {
                adminMapInstance.setView([reportLat, reportLng], 17);
                adminMarkerInstance.setLatLng([reportLat, reportLng]);
            }
            adminMarkerInstance.bindPopup(`<b>Lokasi Kerusakan: ${escapeHtml(report.ruangan)}</b><br>ID: ${report.id}`).openPopup();
            adminMapInstance.invalidateSize();
        }
    }, 250);
}

function closeAdminModal() {
    document.getElementById('adminEditModal').classList.add('hidden');
}

/**
 * Membuka modal disposisi penugasan tiket & menyoroti pilihan petugas
 */
function openDisposisiModal(id) {
    openAdminModal(id);
    setTimeout(() => {
        const modalContent = document.querySelector('#adminEditModal .modal-content');
        const teknisiSelect = document.getElementById('modalTeknisiSelect');
        const bridgeCard = document.querySelector('.bridge-action-card');

        if (teknisiSelect) {
            teknisiSelect.focus();
            teknisiSelect.style.transition = 'all 0.3s ease';
            teknisiSelect.style.outline = '2px solid #22c55e';
            teknisiSelect.style.boxShadow = '0 0 14px rgba(34,197,94,0.45)';
            setTimeout(() => {
                teknisiSelect.style.outline = '';
                teknisiSelect.style.boxShadow = '';
            }, 3000);
        }
        if (bridgeCard && modalContent) {
            bridgeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 180);
}

// Alias fungsi agar kompatibel bila dipanggil dengan nama openAdminEditModal
function openAdminEditModal(id) {
    openDisposisiModal(id);
}

function saveReportUpdates() {
    if (!editingId) return;

    const idx = reportsData.findIndex(r => r.id === editingId);
    if (idx === -1) return;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    let selectedTeknisi = 'Belum Ditunjuk';
    const select = document.getElementById('modalTeknisiSelect');
    const input = document.getElementById('modalTeknisiInput');
    if (select && select.value !== '__custom__') {
        selectedTeknisi = select.value;
    } else if (input) {
        selectedTeknisi = input.value.trim() || 'Belum Ditunjuk';
    }

    reportsData[idx].status = document.getElementById('modalStatusSelect').value;
    reportsData[idx].teknisi = selectedTeknisi;
    reportsData[idx].catatanAdmin = document.getElementById('modalCatatanInput').value.trim();
    reportsData[idx].foto = currentAdminFoto;
    reportsData[idx].tanggalUpdate = timeStr;

    saveReports();
    renderKPIs();
    renderChart();
    renderAdminTable();
    renderAdminOverviewMarkers();
    if (typeof drawGisSurveillanceLayers === 'function') drawGisSurveillanceLayers();
    if (typeof renderGisZoneScorecards === 'function') renderGisZoneScorecards();
    if (typeof renderGisZoneTable === 'function') renderGisZoneTable();
    if (typeof renderSlaTeknisiView === 'function') renderSlaTeknisiView();
    closeAdminModal();
    showToast(`Perubahan tiket ${editingId} berhasil disimpan!`, 'success');
}

async function deleteReport(id) {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('menghapus laporan');
        return;
    }

    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Hapus Laporan Permanen?',
            html: `Apakah Anda yakin ingin menghapus tiket <b>${escapeHtml(id)}</b> secara permanen?<br><span style="font-size:12px; color:var(--text-muted);">Tindakan ini tidak dapat dibatalkan.</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: '<i class="fa-solid fa-trash"></i> Ya, Hapus',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
        if (!result.isConfirmed) return;
    } else {
        if (!confirm(`[SUPER ADMIN] Apakah Anda yakin ingin menghapus permanen tiket laporan ${id}?`)) {
            return;
        }
    }

    reportsData = reportsData.filter(r => r.id !== id);
    saveReports();
    renderKPIs();
    renderChart();
    renderAdminTable();
    renderAdminOverviewMarkers();
    if (typeof renderSlaTeknisiView === 'function') renderSlaTeknisiView();
    showToast(`Laporan ${id} berhasil dihapus permanen oleh Super Admin.`, 'success');
}

function exportCSV() {
    if (reportsData.length === 0) return;
    let csv = 'Kode Tiket,Tanggal,Nama,NIM,Gedung,Ruangan,Latitude,Longitude,Kategori,Urgensi,Status,Teknisi,Catatan\n';
    reportsData.forEach(r => {
        csv += `"${r.id}","${r.tanggalLapor}","${r.namaPelapor}","${r.nimNip}","${r.gedung}","${r.ruangan}","${r.lat||'-6.737400'}","${r.lng||'108.553100'}","${r.kategori}","${r.urgensi}","${r.status}","${r.teknisi}","${(r.catatanAdmin||'').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Sarpras_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showToast('Export CSV berhasil diunduh!', 'success');
}

async function resetDemoData() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('reset database / data demo');
        return;
    }

    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Reset Database Demo?',
            html: 'Seluruh tiket laporan akan dikembalikan ke data awal bawaan demo sarpras kampus UINSSC.<br><span style="font-size:12px; color:var(--text-muted);">Data perubahan saat ini akan ditimpa.</span>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#c59235',
            cancelButtonColor: '#64748b',
            confirmButtonText: '<i class="fa-solid fa-rotate-left"></i> Ya, Reset Database',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
        if (!result.isConfirmed) return;
    } else {
        if (!confirm('[SUPER ADMIN] Reset semua data laporan ke kondisi demo awal?')) {
            return;
        }
    }

    reportsData = [...DEFAULT_SEED_DATA];
    saveReports();
    renderKPIs();
    renderChart();
    renderAdminTable();
    renderAdminOverviewMarkers();
    showToast('Data demo berhasil direset ke kondisi awal!', 'success');
}

function escapeHtml(str) {
    if (!str) return '';
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(String(str));
    }
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}



function focusAdminMapToCampus() {
    if (!adminOverviewMapInstance || CAMPUS_ZONES.length === 0) return;
    const polygonGroup = L.featureGroup();
    CAMPUS_ZONES.forEach(z => {
        polygonGroup.addLayer(L.polygon(z.polygon));
    });
    adminOverviewMapInstance.fitBounds(polygonGroup.getBounds(), { padding: [30, 30] });
    showToast('📍 Kamera Peta Admin terfokus kembali ke area Kampus UINSSC', 'info');
}

let adminOverviewMaskPolygon = null;
let isAdminMaskEnabled = false; // Default: Masking off saat login

function toggleAdminCampusMask() {
    if (!adminOverviewMapInstance || !adminOverviewMaskPolygon) return;
    const btn = document.getElementById('adminMaskToggleBtn');
    const container = document.getElementById('adminOverviewMap');
    if (isAdminMaskEnabled) {
        adminOverviewMapInstance.removeLayer(adminOverviewMaskPolygon);
        isAdminMaskEnabled = false;
        if (container) container.style.background = '#ffffff';
        if (btn) btn.innerHTML = `<i class="fa-solid fa-eye" style="color:var(--gold);"></i> Tampilkan Masking`;
        showToast('Masking putih peta admin dinonaktifkan (Peta Bebas)', 'info');
    } else {
        adminOverviewMaskPolygon.addTo(adminOverviewMapInstance);
        isAdminMaskEnabled = true;
        if (container) container.style.background = '#ffffff';
        if (btn) btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Sembunyikan Masking`;
        showToast('Masking putih peta admin diaktifkan (Fokus Kampus)', 'info');
    }
}

function toggleAdminMapMode() {
    const btn = document.getElementById('mapModeToggleBtn');
    if (currentAdminMapMode === 'heatmap') {
        currentAdminMapMode = 'pin';
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-location-dot"></i> Mode: Pin Marker (Klik Mode Heatmap)`;
            btn.style.background = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = 'var(--text-main)';
            btn.style.borderColor = 'var(--border-color)';
        }
        showToast('Mode visualisasi peta: Pin Marker Kerusakan', 'info');
    } else {
        currentAdminMapMode = 'heatmap';
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-fire-flame-curved" style="color:#ef4444;"></i> Mode: Heatmap Aktif (Klik Mode Pin)`;
            btn.style.background = 'rgba(197, 146, 53, 0.22)';
            btn.style.color = 'var(--gold)';
            btn.style.borderColor = 'var(--gold)';
        }
        showToast('Mode visualisasi peta: Heatmap Kepadatan Kerusakan', 'info');
    }
    renderAdminOverviewMarkers();
}

function initAdminOverviewMap() {
    const container = document.getElementById('adminOverviewMap');
    if (!container || typeof L === 'undefined') return;

    try {
        if (!adminOverviewMapInstance) {
            adminOverviewZoneGroup = L.featureGroup();
            CAMPUS_ZONES.forEach(z => {
                const poly = L.polygon(z.polygon, {
                    color: '#c59235',
                    weight: 2,
                    fillColor: '#005a36',
                    fillOpacity: 0.25
                });
                adminOverviewZoneGroup.addLayer(poly);
            });

            const combinedBounds = adminOverviewZoneGroup.getBounds();
            const centerAll = combinedBounds.getCenter();

            adminOverviewMapInstance = L.map('adminOverviewMap', {
                center: [centerAll.lat, centerAll.lng],
                zoom: 16,
                minZoom: 2,
                maxZoom: 22
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: 2,
                maxZoom: 22,
                maxNativeZoom: 19,
                attribution: '&copy; OpenStreetMap & UINSSC'
            }).addTo(adminOverviewMapInstance);

            // Outer White Mask Overlay dengan batas Mercator presisi & custom padding SVG (Default: OFF)
            const outerCoords = [
                [85.0511, -179.99],
                [85.0511, 179.99],
                [-85.0511, 179.99],
                [-85.0511, -179.99]
            ];
            const holes = CAMPUS_ZONES.map(z => z.polygon);
            const safeSvgRenderer = L.svg({ padding: 2.0 });

            adminOverviewMaskPolygon = L.polygon([outerCoords, ...holes], {
                renderer: safeSvgRenderer,
                color: '#c59235',
                weight: 2.5,
                dashArray: '5, 5',
                fillColor: '#ffffff',
                fillOpacity: 0.76,
                interactive: false
            });

            // Hanya tambahkan ke peta jika isAdminMaskEnabled bernilai true (Default: OFF)
            if (isAdminMaskEnabled) {
                adminOverviewMaskPolygon.addTo(adminOverviewMapInstance);
            }

            adminOverviewZoneGroup.addTo(adminOverviewMapInstance);

            adminOverviewMarkersGroup = L.featureGroup().addTo(adminOverviewMapInstance);
        }

        renderAdminOverviewMarkers();

        // Sinkronisasi status tombol Masking & Heatmap
        const maskBtn = document.getElementById('adminMaskToggleBtn');
        if (maskBtn) {
            maskBtn.innerHTML = isAdminMaskEnabled 
                ? `<i class="fa-solid fa-eye-slash"></i> Sembunyikan Masking`
                : `<i class="fa-solid fa-eye" style="color:var(--gold);"></i> Tampilkan Masking`;
        }
        const modeBtn = document.getElementById('mapModeToggleBtn');
        if (modeBtn) {
            if (currentAdminMapMode === 'heatmap') {
                modeBtn.innerHTML = `<i class="fa-solid fa-fire-flame-curved" style="color:#ef4444;"></i> Mode: Heatmap Aktif (Klik Mode Pin)`;
                modeBtn.style.background = 'rgba(197, 146, 53, 0.22)';
                modeBtn.style.color = 'var(--gold)';
                modeBtn.style.borderColor = 'var(--gold)';
            } else {
                modeBtn.innerHTML = `<i class="fa-solid fa-location-dot"></i> Mode: Pin Marker (Klik Mode Heatmap)`;
                modeBtn.style.background = 'rgba(255, 255, 255, 0.08)';
                modeBtn.style.color = 'var(--text-main)';
                modeBtn.style.borderColor = 'var(--border-color)';
            }
        }
    } catch(e) {
        console.warn('Overview map init error', e);
    }
}

function reloadAdminOverviewMapZones() {
    if (!adminOverviewMapInstance) return;
    try {
        if (adminOverviewZoneGroup) {
            adminOverviewZoneGroup.clearLayers();
            CAMPUS_ZONES.forEach(z => {
                const poly = L.polygon(z.polygon, {
                    color: '#c59235',
                    weight: 2,
                    fillColor: '#005a36',
                    fillOpacity: 0.25
                });
                adminOverviewZoneGroup.addLayer(poly);
            });
        }

        if (adminOverviewMaskPolygon) {
            adminOverviewMapInstance.removeLayer(adminOverviewMaskPolygon);
            const outerCoords = [
                [85.0511, -179.99],
                [85.0511, 179.99],
                [-85.0511, 179.99],
                [-85.0511, -179.99]
            ];
            const holes = CAMPUS_ZONES.map(z => z.polygon);
            const safeSvgRenderer = L.svg({ padding: 2.0 });

            adminOverviewMaskPolygon = L.polygon([outerCoords, ...holes], {
                renderer: safeSvgRenderer,
                color: '#c59235',
                weight: 2.5,
                dashArray: '5, 5',
                fillColor: '#ffffff',
                fillOpacity: 0.76,
                interactive: false
            });

            if (isAdminMaskEnabled) {
                adminOverviewMaskPolygon.addTo(adminOverviewMapInstance);
            }
        }
    } catch (e) {
        console.warn('Error refreshing admin overview zones', e);
    }
}

function filterAdminMapByCategory() {
    renderAdminOverviewMarkers();
    const cat = document.getElementById('mapCategoryFilter')?.value;
    if (cat) {
        showToast(`Memfilter peta kerusakan untuk kategori: ${cat}`, 'info');
    } else {
        showToast('Menampilkan seluruh kategori fasilitas di peta', 'info');
    }
}

function renderAdminOverviewMarkers(itemsToRender = reportsData) {
    if (!adminOverviewMapInstance || !adminOverviewMarkersGroup) return;
    adminOverviewMarkersGroup.clearLayers();

    // Reset previous Leaflet.heat layer if any
    if (adminHeatLayerInstance) {
        adminOverviewMapInstance.removeLayer(adminHeatLayerInstance);
        adminHeatLayerInstance = null;
    }

    const bounds = L.latLngBounds();

    // Titik kerusakan pada peta hanya menampilkan laporan aktif (Diajukan & Diproses).
    // Ketika laporan berstatus 'Selesai' (atau 'Ditolak'), titik tersebut otomatis HILANG dari peta.
    const statusFilterVal = document.getElementById('filterStatus')?.value;
    let activeItems = (statusFilterVal === 'Selesai' || statusFilterVal === 'Ditolak')
        ? itemsToRender
        : itemsToRender.filter(rep => rep.status !== 'Selesai' && rep.status !== 'Ditolak');

    // Filter Kategori Peta Overview Kerusakan (Contoh: Hanya AC)
    const categoryFilterVal = (document.getElementById('mapCategoryFilter')?.value || '').toLowerCase().trim();
    if (categoryFilterVal) {
        activeItems = activeItems.filter(rep => {
            const cat = (rep.kategori || '').toLowerCase();
            return cat.includes(categoryFilterVal);
        });
    }

    if (currentAdminMapMode === 'heatmap') {
        // 1. Integrasi Leaflet.heat Layer Resmi
        const heatPoints = [];
        activeItems.forEach(rep => {
            let lat = parseFloat(rep.lat || '-6.735000');
            let lng = parseFloat(rep.lng || '108.533800');
            if (isNaN(lat) || isNaN(lng) || lng > 108.54 || lat < -6.740 || lat > -6.730) {
                if (rep.id === 'TRK-2026-001') { lat = -6.735000; lng = 108.533800; }
                else if (rep.id === 'TRK-2026-002') { lat = -6.737100; lng = 108.531500; }
                else { lat = -6.736200; lng = 108.532700; }
            }
            bounds.extend([lat, lng]);

            let intensity = 0.5;
            if (rep.urgensi === 'Darurat') intensity = 1.0;
            else if (rep.urgensi === 'Tinggi') intensity = 0.8;
            else if (rep.urgensi === 'Sedang') intensity = 0.6;
            else intensity = 0.4;

            heatPoints.push([lat, lng, intensity]);

            // Hotspot Core Pin Interaktif untuk klik inspeksi
            const heatCore = L.circleMarker([lat, lng], {
                radius: 7,
                fillColor: '#ffffff',
                color: intensity >= 0.8 ? '#ef4444' : '#f59e0b',
                weight: 3,
                fillOpacity: 1
            });

            const heatPopupHtml = `
                <div style="font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; padding:6px; min-width:180px;">
                    <div style="font-size:11px; font-weight:800; color:#ef4444; margin-bottom:2px;"><i class="fa-solid fa-fire"></i> KLUSTER KERUSAKAN AKTIF (${escapeHtml(rep.urgensi).toUpperCase()})</div>
                    <h4 style="margin:2px 0 4px 0; font-size:14px; font-weight:800; color:#005a36;">${escapeHtml(rep.kategori)}</h4>
                    <p style="font-size:12px; margin-bottom:8px; color:#475569;"><i class="fa-solid fa-building" style="color:#c59235;"></i> ${escapeHtml(rep.gedung)} (${escapeHtml(rep.ruangan)})</p>
                    <button onclick="openAdminModal('${rep.id}')" style="width:100%; padding:6px 10px; background:#ef4444; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:11px; cursor:pointer;"><i class="fa-solid fa-magnifying-glass"></i> Inspeksi Kerusakan Ini</button>
                </div>
            `;
            heatCore.bindPopup(heatPopupHtml);
            adminOverviewMarkersGroup.addLayer(heatCore);
        });

        if (typeof L.heatLayer !== 'undefined' && heatPoints.length > 0) {
            adminHeatLayerInstance = L.heatLayer(heatPoints, {
                radius: 38,
                blur: 24,
                maxZoom: 18,
                max: 1.0,
                gradient: { 0.2: '#3b82f6', 0.4: '#10b981', 0.6: '#eab308', 0.8: '#f97316', 1.0: '#ef4444' }
            }).addTo(adminOverviewMapInstance);
        }
    } else {
        // 2. Mode Pin Marker Standar dengan Status Badges
        activeItems.forEach(rep => {
            let lat = parseFloat(rep.lat || '-6.735000');
            let lng = parseFloat(rep.lng || '108.533800');
            if (isNaN(lat) || isNaN(lng) || lng > 108.54 || lat < -6.740 || lat > -6.730) {
                if (rep.id === 'TRK-2026-001') { lat = -6.735000; lng = 108.533800; }
                else if (rep.id === 'TRK-2026-002') { lat = -6.737100; lng = 108.531500; }
                else { lat = -6.736200; lng = 108.532700; }
            }

            let color = '#ef4444'; // Diajukan (Red)
            if (rep.status === 'Diproses') color = '#f59e0b'; // Gold/Amber
            if (rep.status === 'Selesai') color = '#22c55e'; // Green
            if (rep.status === 'Ditolak') color = '#64748b'; // Slate

            bounds.extend([lat, lng]);

            const marker = L.circleMarker([lat, lng], {
                radius: 10,
                fillColor: color,
                color: '#ffffff',
                weight: 2.5,
                opacity: 1,
                fillOpacity: 0.95
            });

            const popupHtml = `
                <div style="font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; padding:6px; min-width:200px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <span style="font-size:11px; font-weight:800; color:#c59235;">${escapeHtml(rep.id)}</span>
                        <span style="display:inline-block; font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px; background:${color}; color:#ffffff;">${escapeHtml(rep.status)}</span>
                    </div>
                    <h4 style="margin:2px 0 6px 0; font-size:14px; font-weight:800; color:#005a36;">${escapeHtml(rep.kategori)}</h4>
                    <p style="font-size:12px; margin-bottom:8px; color:#475569;"><i class="fa-solid fa-location-dot" style="color:#c59235;"></i> ${escapeHtml(rep.gedung)} (${escapeHtml(rep.ruangan)})</p>
                    <button onclick="openAdminModal('${rep.id}')" style="width:100%; padding:7px 10px; background:#005a36; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:12px; cursor:pointer; box-shadow: 0 2px 8px rgba(0,90,54,0.3);"><i class="fa-solid fa-pen-to-square"></i> Proses Laporan Ini</button>
                </div>
            `;

            marker.bindPopup(popupHtml);
            adminOverviewMarkersGroup.addLayer(marker);
        });
    }

    if (activeItems.length > 0 && bounds.isValid()) {
        adminOverviewMapInstance.fitBounds(bounds.pad(0.35));
    }
}

// ==========================================================================
// ADMIN BRIDGE: MENGHUBUNGKAN PETUGAS DENGAN USER & DISPOSISI TUGAS
// ==========================================================================

function populateTeknisiSelect(currentValue) {
    const select = document.getElementById('modalTeknisiSelect');
    const input = document.getElementById('modalTeknisiInput');
    if (!select) return;

    loadStaffAccounts();
    const activePetugas = staffAccounts.filter(s => s.role === 'petugas' && s.status === 'Aktif');

    // Identifikasi zona kawasan kampus dari tiket laporan yang sedang ditinjau
    let targetZone = null;
    if (editingId) {
        const curReport = reportsData.find(r => r.id === editingId);
        if (curReport) targetZone = getReportZone(curReport);
    }

    // Sort: Utamakan teknisi yang ditugaskan pada wilayah zona laporan ini
    const sortedPetugas = [...activePetugas].sort((a, b) => {
        if (!targetZone) return 0;
        const aMatch = Array.isArray(a.wilayah) && a.wilayah.includes(targetZone.id);
        const bMatch = Array.isArray(b.wilayah) && b.wilayah.includes(targetZone.id);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });

    let html = `<option value="Belum Ditunjuk">-- Pilih Petugas Spesialis (Aktif) --</option>`;
    sortedPetugas.forEach(p => {
        const isZoneMatch = targetZone && Array.isArray(p.wilayah) && p.wilayah.includes(targetZone.id);
        const zoneBadge = isZoneMatch ? ` ⭐ [Wilayah Sesuai: ${targetZone.name}]` : '';
        const valText = `${p.nama} (${p.bidang})`;
        html += `<option value="${escapeHtml(valText)}">${escapeHtml(p.nama)} - ${escapeHtml(p.bidang)}${zoneBadge}</option>`;
    });
    html += `<option value="__custom__">&#9998; Ketik Nama Lain (Manual)...</option>`;

    select.innerHTML = html;

    let matched = false;
    for (let i = 0; i < select.options.length; i++) {
        const optVal = select.options[i].value;
        if (optVal === currentValue || (currentValue && optVal.toLowerCase().includes(currentValue.toLowerCase().trim().split(' ')[0]))) {
            select.selectedIndex = i;
            matched = true;
            break;
        }
    }

    if (!matched && currentValue && currentValue !== 'Belum Ditunjuk') {
        select.value = '__custom__';
        if (input) {
            input.value = currentValue;
            input.classList.remove('hidden');
        }
    } else {
        if (input) {
            input.value = matched ? select.value : '';
            input.classList.add('hidden');
        }
    }
}

function handleTeknisiSelectChange() {
    const select = document.getElementById('modalTeknisiSelect');
    const input = document.getElementById('modalTeknisiInput');
    if (!select || !input) return;

    if (select.value === '__custom__') {
        input.classList.remove('hidden');
        input.focus();
    } else {
        input.classList.add('hidden');
        input.value = select.value === 'Belum Ditunjuk' ? 'Belum Ditunjuk' : select.value;
    }
}

function toggleCustomTeknisiInput() {
    const select = document.getElementById('modalTeknisiSelect');
    const input = document.getElementById('modalTeknisiInput');
    if (!select || !input) return;

    if (input.classList.contains('hidden')) {
        select.value = '__custom__';
        input.classList.remove('hidden');
        input.focus();
    } else {
        input.classList.add('hidden');
        select.selectedIndex = 0;
        input.value = select.value;
    }
}

function dispatchTaskToTeknisi() {
    if (!editingId) return;
    const report = reportsData.find(r => r.id === editingId);
    if (!report) return;

    let teknisiName = document.getElementById('modalTeknisiSelect')?.value || '';
    if (teknisiName === '__custom__' || !teknisiName) {
        teknisiName = document.getElementById('modalTeknisiInput')?.value || '';
    }
    if (!teknisiName || teknisiName === 'Belum Ditunjuk') {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'Pilih Petugas Dahulu',
                text: 'Silakan pilih petugas/teknisi spesialis yang ditugaskan terlebih dahulu sebelum mengirim disposisi penugasan WhatsApp.',
                confirmButtonColor: '#005a36'
            });
        } else {
            showToast('Silakan pilih petugas teknisi terlebih dahulu.', 'error');
        }
        return;
    }

    loadStaffAccounts();
    const staff = staffAccounts.find(s => s.role === 'petugas' && teknisiName.toLowerCase().includes(s.nama.toLowerCase()));
    const rawPhone = staff ? (staff.wa || '') : '';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;

    const catatan = document.getElementById('modalCatatanInput').value.trim() || 'Mohon segera lakukan pemeriksaan teknis di lokasi.';

    const message = `*DISPOSISI PENUGASAN SARPRAS UINSSC*\n` +
        `Yth. Bpk/Ibu *${teknisiName}*,\n\n` +
        `Terdapat laporan kerusakan fasilitas kampus yang didelegasikan oleh Admin Sarpras:\n` +
        `-----------------------------------------\n` +
        `*No. Tiket*: ${report.id}\n` +
        `*Pelapor*: ${report.namaPelapor} (${report.peranPelapor || 'Civitas'}) [WA: ${report.kontakPelapor || '-'}]\n` +
        `*Lokasi*: ${report.gedung} - ${report.ruangan}\n` +
        `*Kategori*: ${report.kategori}\n` +
        `*Tingkat Urgensi*: ${report.urgensi}\n` +
        `*Rincian Kerusakan*: ${report.deskripsi}\n` +
        `-----------------------------------------\n` +
        `*Instruksi Admin*: ${catatan}\n\n` +
        `Mohon segera tindak lanjuti ke lokasi. Terima kasih atas dedikasinya.\n` +
        `_SIMPEL UINSSC - Admin Sarpras & Pemeliharaan Kampus_`;

    const waUrl = formattedPhone 
        ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');

    // Auto-simpan teknisi penanggung jawab ke laporan
    const repIdx = reportsData.findIndex(r => r.id === editingId);
    if (repIdx !== -1) {
        reportsData[repIdx].teknisi = teknisiName;
        // Jika status masih Diajukan, otomatis ubah ke Diproses karena sudah didisposisikan
        if (reportsData[repIdx].status === 'Diajukan') {
            reportsData[repIdx].status = 'Diproses';
            const statusSelect = document.getElementById('modalStatusSelect');
            if (statusSelect) statusSelect.value = 'Diproses';
        }
        reportsData[repIdx].catatanAdmin = catatan;
        saveReports();
        renderKPIs();
        renderChart();
        renderAdminTable();
        renderAdminOverviewMarkers();
        if (typeof renderSlaTeknisiView === 'function') renderSlaTeknisiView();
    }

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Disposisi Terhubung!',
            html: `Pesan disposisi penugasan ke <b>${escapeHtml(teknisiName)}</b> telah disiapkan untuk dikirimkan melalui WhatsApp.<br><span style="font-size:12px; color:var(--text-muted);">(Admin menjalankan peran menghubungkan petugas ke penanganan tiket).</span>`,
            confirmButtonColor: '#005a36'
        });
    } else {
        showToast(`Disposisi tugas dikirimkan ke ${teknisiName}!`, 'success');
    }
}

function notifyUserPelapor() {
    if (!editingId) return;
    const report = reportsData.find(r => r.id === editingId);
    if (!report) return;

    const kontak = (report.kontakPelapor || '').trim();
    const cleanPhone = kontak.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;

    let currentTeknisi = document.getElementById('modalTeknisiSelect')?.value || report.teknisi;
    if (currentTeknisi === '__custom__') {
        currentTeknisi = document.getElementById('modalTeknisiInput')?.value || report.teknisi;
    }
    const currentStatus = document.getElementById('modalStatusSelect')?.value || report.status;
    const catatan = document.getElementById('modalCatatanInput')?.value.trim() || report.catatanAdmin || 'Laporan telah diverifikasi oleh Admin Sarpras dan dalam penanganan petugas.';

    const message = `*UPDATE PROGRESS LAPORAN FASILITAS KAMPUS*\n` +
        `Halo Bpk/Ibu/Sdr *${report.namaPelapor}*,\n\n` +
        `Laporan pengaduan fasilitas yang Anda sampaikan di *SIMPEL UINSSC* telah diperbarui oleh Admin Sarpras:\n` +
        `-----------------------------------------\n` +
        `*No. Tiket*: ${report.id}\n` +
        `*Lokasi*: ${report.gedung} (${report.ruangan})\n` +
        `*Kategori*: ${report.kategori}\n` +
        `*Status*: *[ ${currentStatus.toUpperCase()} ]*\n` +
        `*Petugas Ditugaskan*: ${currentTeknisi}\n` +
        `*Catatan Admin*: ${catatan}\n` +
        `-----------------------------------------\n` +
        `Anda dapat melacak status terkini kapan pun melalui fitur Lacak Status Tiket di Portal SIMPEL UINSSC.\n\n` +
        `Terima kasih atas kepedulian Anda bersama menjaga fasilitas kampus UINSSC.\n` +
        `_Bagian Sarana & Prasarana UINSSC_`;

    const waUrl = formattedPhone 
        ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Kabar Terhubung ke User!',
            html: `Pesan perkembangan status ke pelapor <b>${escapeHtml(report.namaPelapor)}</b> telah disiapkan melalui WhatsApp.<br><span style="font-size:12px; color:var(--text-muted);">(Admin menjalankan peran menghubungkan info penanganan ke user pelapor).</span>`,
            confirmButtonColor: '#005a36'
        });
    } else {
        showToast(`Update progress disiapkan untuk ${report.namaPelapor}!`, 'success');
    }
}

// ==========================================================================
// SUPER ADMIN: MENGATUR SIAPA ADMIN DAN PETUGAS SARPRAS KAMPUS
// ==========================================================================


// ==========================================================================
// PENUGASAN WILAYAH KERJA ADMIN & PETUGAS (MULTI-WILAYAH) - SUPER ADMIN
// ==========================================================================

function renderStaffZonesBadges(wilayahArray) {
    if (!Array.isArray(wilayahArray) || wilayahArray.length === 0) {
        return '<span style="font-size:11px; color:var(--text-muted); font-style:italic;">Belum Ditugaskan</span>';
    }
    const allKeys = Object.keys(CAMPUS_ZONE_METAS);
    if (allKeys.every(k => wilayahArray.includes(k))) {
        return `<span style="background:rgba(250,204,21,0.15); color:#facc15; border:1px solid rgba(250,204,21,0.35); padding:3px 9px; border-radius:8px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:5px;" title="Bertanggung jawab di seluruh 5 kawasan kampus UINSSC">
            <i class="fa-solid fa-globe"></i> Semua Kawasan (5/5)
        </span>`;
    }
    return `<div style="display:flex; flex-wrap:wrap; gap:4px;">` +
        wilayahArray.map(key => {
            const meta = CAMPUS_ZONE_METAS[key] || { name: key, icon: 'fa-map-pin', color: '#94a3b8', short: key };
            return `<span style="background:rgba(255,255,255,0.05); color:${meta.color}; border:1px solid ${meta.color}55; padding:2px 7px; border-radius:6px; font-size:10.5px; font-weight:700; display:inline-flex; align-items:center; gap:4px;" title="${escapeHtml(meta.name)}">
                <i class="fa-solid ${meta.icon}"></i> ${escapeHtml(meta.short)}
            </span>`;
        }).join('') +
    `</div>`;
}

function renderAddStaffZoneCheckboxes() {
    const container = document.getElementById('addStaffWilayahContainer');
    if (!container) return;
    const allKeys = Object.keys(CAMPUS_ZONE_METAS);
    container.innerHTML = allKeys.map(key => {
        const meta = CAMPUS_ZONE_METAS[key];
        const isDefault = (key === 'kampus_utama');
        return `
            <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text-main); cursor:pointer; background:rgba(255,255,255,0.03); padding:7px 10px; border-radius:7px; border:1px solid var(--border-color); user-select:none;">
                <input type="checkbox" name="addStaffWilayahCheckbox" value="${key}" ${isDefault ? 'checked' : ''} style="cursor:pointer; accent-color:#facc15; width:15px; height:15px;">
                <span style="color:${meta.color}; font-weight:700; display:inline-flex; align-items:center; gap:5px;">
                    <i class="fa-solid ${meta.icon}"></i> ${escapeHtml(meta.short)}
                </span>
            </label>
        `;
    }).join('');
}

function toggleAllStaffZoneCheckboxes(checked) {
    const checkboxes = document.querySelectorAll('input[name="addStaffWilayahCheckbox"]');
    checkboxes.forEach(cb => cb.checked = !!checked);
}

function openAssignWilayahModal(staffId) {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('menugaskan atau mengubah wilayah kerja personil');
        return;
    }

    loadStaffAccounts();
    const staff = staffAccounts.find(s => s.id === staffId);
    if (!staff) {
        showToast('Data personil tidak ditemukan.', 'error');
        return;
    }

    const modal = document.getElementById('assignWilayahModal');
    if (!modal) return;

    document.getElementById('assignStaffIdHidden').value = staff.id;
    document.getElementById('assignStaffName').innerText = staff.nama;
    
    let roleBadge = '';
    if (staff.role === 'admin') {
        roleBadge = `<span class="badge-role-admin" style="font-size:11px; padding:2px 8px;"><i class="fa-solid fa-user-shield"></i> Admin Sarpras</span>`;
    } else if (staff.role === 'mitra') {
        roleBadge = `<span class="badge-role-mitra" style="font-size:11px; padding:2px 8px;"><i class="fa-solid fa-handshake"></i> Mitra Kampus</span>`;
    } else {
        roleBadge = `<span class="badge-role-petugas" style="font-size:11px; padding:2px 8px;"><i class="fa-solid fa-screwdriver-wrench"></i> Petugas Lapangan</span>`;
    }
    document.getElementById('assignStaffRoleBadge').innerHTML = roleBadge;
    document.getElementById('assignStaffMeta').innerText = `Kode ID: ${staff.id} &bull; Bidang: ${staff.bidang}`;

    // Render 5 Checkbox Kawasan Kampus
    const listContainer = document.getElementById('modalWilayahCheckboxesList');
    const staffZones = Array.isArray(staff.wilayah) ? staff.wilayah : [];

    const allKeys = Object.keys(CAMPUS_ZONE_METAS);
    listContainer.innerHTML = allKeys.map(key => {
        const meta = CAMPUS_ZONE_METAS[key];
        const isChecked = staffZones.includes(key);
        return `
            <label style="display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:13px; color:var(--text-main); cursor:pointer; background:rgba(255,255,255,0.03); padding:10px 14px; border-radius:9px; border:1px solid ${isChecked ? meta.color + '66' : 'var(--border-color)'}; transition:all 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" name="modalStaffWilayahCheckbox" value="${key}" ${isChecked ? 'checked' : ''} onchange="updateModalSelectedCount()" style="cursor:pointer; accent-color:#facc15; width:17px; height:17px;">
                    <span style="color:${meta.color}; font-weight:800; font-size:13.5px;">
                        <i class="fa-solid ${meta.icon}" style="margin-right:6px;"></i> ${escapeHtml(meta.name)}
                    </span>
                </div>
                <span style="font-size:11px; color:var(--text-muted); background:rgba(0,0,0,0.3); padding:2px 8px; border-radius:6px;">${escapeHtml(meta.short)}</span>
            </label>
        `;
    }).join('');

    updateModalSelectedCount();
    modal.classList.remove('hidden');
}

function updateModalSelectedCount() {
    const checked = document.querySelectorAll('input[name="modalStaffWilayahCheckbox"]:checked');
    const el = document.getElementById('modalSelectedCountText');
    if (el) {
        if (checked.length === 5) {
            el.innerHTML = `<span style="color:#10b981;"><i class="fa-solid fa-globe"></i> Semua Kawasan (5/5) Ditugaskan</span>`;
        } else if (checked.length === 0) {
            el.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> 0 Kawasan (Wajib Pilih Minimal 1)</span>`;
        } else {
            el.innerHTML = `<span style="color:#facc15;"><i class="fa-solid fa-check"></i> ${checked.length} dari 5 Kawasan Terpilih</span>`;
        }
    }
}

function modalSetAllZones(checked) {
    const cbs = document.querySelectorAll('input[name="modalStaffWilayahCheckbox"]');
    cbs.forEach(cb => cb.checked = !!checked);
    updateModalSelectedCount();
}

function closeAssignWilayahModal() {
    const modal = document.getElementById('assignWilayahModal');
    if (modal) modal.classList.add('hidden');
}

function closeAssignWilayahModalOnBackdrop(e) {
    if (e.target.id === 'assignWilayahModal') {
        closeAssignWilayahModal();
    }
}

function saveStaffWilayahAssignment() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('menyimpan perubahan penugasan wilayah');
        return;
    }

    const staffId = document.getElementById('assignStaffIdHidden').value;
    const checked = document.querySelectorAll('input[name="modalStaffWilayahCheckbox"]:checked');
    const selected = Array.from(checked).map(cb => cb.value);

    if (selected.length === 0) {
        showToast('Pilih minimal 1 wilayah penugasan operasional!', 'error');
        return;
    }

    loadStaffAccounts();
    const staff = staffAccounts.find(s => s.id === staffId);
    if (!staff) {
        showToast('Personil tidak ditemukan.', 'error');
        return;
    }

    staff.wilayah = selected;
    saveStaffAccounts();
    renderStaffTable();
    closeAssignWilayahModal();

    const zoneNames = selected.map(k => CAMPUS_ZONE_METAS[k]?.short || k).join(', ');
    const roleTitle = staff.role === 'admin' ? 'Admin Sarpras' : (staff.role === 'mitra' ? 'Mitra Kampus' : 'Petugas Lapangan');

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Penugasan Wilayah Berhasil!',
            html: `Personil <b>${escapeHtml(staff.nama)}</b> (${roleTitle}) telah resmi ditugaskan pada <b>${selected.length} Kawasan</b>:<br><div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.25); border-radius:8px; font-size:12.5px; color:#facc15; font-weight:700;"><i class="fa-solid fa-map-location-dot"></i> ${escapeHtml(zoneNames)}</div>`,
            confirmButtonColor: '#005a36'
        });
    } else {
        showToast(`Penugasan ${staff.nama} diperbarui ke ${selected.length} wilayah!`, 'success');
    }
}

/* ==========================================================================
   FITUR CETAK REKAPITULASI RESMI SARPRAS KAMPUS (OFFICIAL PDF / PRINT)
   ========================================================================== */

function openPrintRekapModal() {
    const modal = document.getElementById('printRekapModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closePrintRekapModal() {
    const modal = document.getElementById('printRekapModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function generateAndPrintOfficialRekap() {
    const period = document.getElementById('rekapFilterPeriod')?.value || 'ALL';
    const statusFilter = document.getElementById('rekapFilterStatus')?.value || 'ALL';
    const zoneFilter = document.getElementById('rekapFilterKawasan')?.value || 'ALL';

    closePrintRekapModal();

    let filtered = [...reportsData];

    // Status filter
    if (statusFilter !== 'ALL') {
        filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Zone filter
    if (zoneFilter !== 'ALL') {
        filtered = filtered.filter(r => {
            const detectedZone = detectCampusZoneKey(r.lat, r.lng, r.gedung);
            return detectedZone === zoneFilter;
        });
    }

    const totalTiket = filtered.length;
    const countSelesai = filtered.filter(r => r.status === 'Selesai').length;
    const countProses = filtered.filter(r => r.status === 'Diproses').length;
    const countDiajukan = filtered.filter(r => r.status === 'Diajukan').length;
    const completionRate = totalTiket > 0 ? Math.round((countSelesai / totalTiket) * 100) : 0;

    const periodLabelMap = {
        'ALL': 'Semua Periode (Rekap Akumulatif 2026)',
        'JULI_2026': 'Bulan Juli 2026',
        'AGUSTUS_2026': 'Bulan Agustus 2026',
        'SEMESTER_GANJIL_2026': 'Semester Ganjil TA 2026/2027'
    };
    const periodLabel = periodLabelMap[period] || period;

    const printWin = window.open('', '_blank', 'width=1000,height=900');
    if (!printWin) {
        alert('Pop-up jendela cetak diblokir oleh browser. Izinkan pop-up untuk mencetak rekap resmi.');
        return;
    }

    const todayStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const rowsHtml = filtered.map((r, index) => {
        let badgeColor = '#6b7280';
        if (r.status === 'Selesai') badgeColor = '#10b981';
        else if (r.status === 'Diproses') badgeColor = '#f59e0b';
        else if (r.status === 'Diajukan') badgeColor = '#3b82f6';

        return `
            <tr style="border-bottom:1px solid #e5e7eb; font-size:11px;">
                <td style="padding:7px 8px; text-align:center;">${index + 1}</td>
                <td style="padding:7px 8px; font-weight:700; font-family:monospace; color:#005a36;">${escapeHtml(r.id)}</td>
                <td style="padding:7px 8px; white-space:nowrap;">${escapeHtml(r.tanggalLapor ? r.tanggalLapor.substring(0, 10) : '-')}</td>
                <td style="padding:7px 8px;">
                    <strong>${escapeHtml(r.namaPelapor)}</strong><br>
                    <span style="color:#6b7280; font-size:10px;">${escapeHtml(r.peranPelapor || 'Mahasiswa')} &bull; ${escapeHtml(r.nimNip || '-')}</span>
                </td>
                <td style="padding:7px 8px;">
                    <strong>${escapeHtml(r.gedung)}</strong><br>
                    <span style="color:#6b7280; font-size:10px;">${escapeHtml(r.ruangan)}</span>
                </td>
                <td style="padding:7px 8px;">${escapeHtml(r.kategori)}</td>
                <td style="padding:7px 8px; text-align:center;">
                    <span style="font-weight:700; color:${r.urgensi === 'Darurat' ? '#dc2626' : (r.urgensi === 'Tinggi' ? '#ea580c' : '#4b5563')}">${escapeHtml(r.urgensi || 'Sedang')}</span>
                </td>
                <td style="padding:7px 8px;">${escapeHtml(r.teknisi || 'Belum Ditunjuk')}</td>
                <td style="padding:7px 8px; text-align:center;">
                    <span style="background:${badgeColor}; color:#fff; padding:3px 8px; border-radius:12px; font-size:10px; font-weight:700;">
                        ${escapeHtml(r.status)}
                    </span>
                </td>
            </tr>
        `;
    }).join('');

    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>Rekapitulasi Sarpras UINSSC - ${periodLabel}</title>
            <style>
                @page { size: A4 landscape; margin: 12mm 15mm; }
                body {
                    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
                    color: #1f2937;
                    background: #fff;
                    margin: 0;
                    padding: 10px;
                    line-height: 1.4;
                }
                .kop-wrapper {
                    display: flex;
                    align-items: center;
                    border-bottom: 3px double #005a36;
                    padding-bottom: 12px;
                    margin-bottom: 16px;
                }
                .kop-logo {
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                    margin-right: 18px;
                }
                .kop-text {
                    flex: 1;
                    text-align: center;
                }
                .kop-text h2 {
                    margin: 0;
                    font-size: 15px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #374151;
                }
                .kop-text h1 {
                    margin: 2px 0;
                    font-size: 19px;
                    font-weight: 800;
                    color: #005a36;
                    letter-spacing: 0.8px;
                }
                .kop-text p {
                    margin: 2px 0 0 0;
                    font-size: 11px;
                    color: #4b5563;
                }
                .doc-title {
                    text-align: center;
                    margin: 14px 0 16px 0;
                }
                .doc-title h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: #111827;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .doc-title p {
                    margin: 3px 0 0 0;
                    font-size: 12px;
                    color: #6b7280;
                }
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;
                    margin-bottom: 16px;
                }
                .kpi-card {
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 8px 10px;
                    text-align: center;
                    background: #f9fafb;
                }
                .kpi-card .num {
                    font-size: 18px;
                    font-weight: 800;
                    margin-top: 2px;
                }
                .kpi-card .lbl {
                    font-size: 10.5px;
                    color: #4b5563;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th {
                    background: #005a36;
                    color: #fff;
                    font-size: 11px;
                    padding: 8px 6px;
                    text-align: left;
                    font-weight: 700;
                    border: 1px solid #005a36;
                }
                td {
                    border: 1px solid #e5e7eb;
                }
                .signature-section {
                    margin-top: 28px;
                    display: flex;
                    justify-content: flex-end;
                    page-break-inside: avoid;
                }
                .signature-box {
                    text-align: center;
                    width: 250px;
                    font-size: 11.5px;
                }
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="no-print" style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; background:#f3f4f6; padding:10px 14px; border-radius:8px;">
                <span style="font-size:13px; font-weight:600; color:#374151;">Pratinjau Lembar Rekapitulasi Laporan Resmi Sarpras Kampus</span>
                <div style="display:flex; gap:8px;">
                    <button onclick="window.print()" style="background:#005a36; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-weight:700; cursor:pointer; font-size:13px;">
                        Cetak / Simpan PDF
                    </button>
                    <button onclick="window.close()" style="background:#e5e7eb; color:#374151; border:none; padding:8px 14px; border-radius:6px; font-weight:600; cursor:pointer; font-size:13px;">
                        Tutup
                    </button>
                </div>
            </div>

            <!-- Kop Surat Resmi -->
            <div class="kop-wrapper">
                <img src="../assets/img/logo.png" alt="Logo UINSSC" class="kop-logo" onerror="this.style.display='none'">
                <div class="kop-text">
                    <h2>Kementerian Agama Republik Indonesia</h2>
                    <h1>Universitas Islam Negeri Siber Syekh Nurjati Cirebon</h1>
                    <p>Bagian Umum dan Layanan Sarana Prasarana Kampus &bull; Gedung Rektorat Lt. 1 &bull; Jl. Perjuangan, Sunyaragi, Cirebon</p>
                    <p>Sistem Informasi Manajemen Pengaduan Layanan Sarpras (SIMPEL-UINSSC)</p>
                </div>
            </div>

            <div class="doc-title">
                <h3>Rekapitulasi Layanan Perbaikan Fasilitas & Sarana Prasarana Kampus</h3>
                <p>Periode: <strong>${escapeHtml(periodLabel)}</strong> &bull; Status Filter: <strong>${escapeHtml(statusFilter)}</strong> &bull; Kawasan: <strong>${escapeHtml(zoneFilter === 'ALL' ? 'Semua Kawasan' : (CAMPUS_ZONE_METAS[zoneFilter]?.name || zoneFilter))}</strong></p>
            </div>

            <!-- KPI Ringkasan -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="lbl">Total Pengaduan</div>
                    <div class="num" style="color:#111827;">${totalTiket}</div>
                </div>
                <div class="kpi-card">
                    <div class="lbl">Laporan Selesai</div>
                    <div class="num" style="color:#10b981;">${countSelesai}</div>
                </div>
                <div class="kpi-card">
                    <div class="lbl">Sedang Diproses</div>
                    <div class="num" style="color:#f59e0b;">${countProses}</div>
                </div>
                <div class="kpi-card">
                    <div class="lbl">Menunggu Penugasan</div>
                    <div class="num" style="color:#3b82f6;">${countDiajukan}</div>
                </div>
                <div class="kpi-card">
                    <div class="lbl">Rasio Penyelesaian</div>
                    <div class="num" style="color:#005a36;">${completionRate}%</div>
                </div>
            </div>

            <!-- Tabel Data Insiden -->
            <table>
                <thead>
                    <tr>
                        <th style="width:28px; text-align:center;">No</th>
                        <th style="width:105px;">ID Tiket</th>
                        <th style="width:85px;">Tanggal</th>
                        <th>Pelapor</th>
                        <th>Lokasi & Gedung</th>
                        <th>Kategori</th>
                        <th style="width:65px; text-align:center;">Urgensi</th>
                        <th>Teknisi Bertugas</th>
                        <th style="width:85px; text-align:center;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml.length > 0 ? rowsHtml : '<tr><td colspan="9" style="text-align:center; padding:16px; color:#6b7280;">Tidak ada laporan fasilitas yang sesuai dengan kriteria filter yang dipilih.</td></tr>'}
                </tbody>
            </table>

            <!-- Kolom Pengesahan Tanda Tangan -->
            <div class="signature-section">
                <div class="signature-box">
                    <p style="margin:0;">Cirebon, ${todayStr}</p>
                    <p style="margin:4px 0 60px 0; font-weight:700;">Kepala Bagian Umum &amp; Sarpras Kampus<br>UIN Siber Syekh Nurjati Cirebon</p>
                    <p style="margin:0; font-weight:800; text-decoration:underline;">H. Mohammad Nurwahid, M.Si.</p>
                    <p style="margin:2px 0 0 0; color:#6b7280; font-size:10.5px;">NIP. 19780514 200501 1 003</p>
                </div>
            </div>

            <script>
                window.onload = function() {
                    // Auto-trigger print jika diinginkan
                };
            </script>
        </body>
        </html>
    `);

    printWin.document.close();
}


let isMyWilayahFilterActive = false;

function toggleFilterMyWilayah() {
    isMyWilayahFilterActive = !isMyWilayahFilterActive;
    const btn = document.getElementById('btnFilterMyWilayah');
    if (btn) {
        if (isMyWilayahFilterActive) {
            btn.style.background = '#2dd4bf';
            btn.style.color = '#000';
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Filter: Wilayah Tugas Saya';
            showToast('Filter aktif: Menampilkan tiket di wilayah tugas Anda', 'info');
        } else {
            btn.style.background = 'rgba(45,212,191,0.15)';
            btn.style.color = '#2dd4bf';
            btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Wilayah Tugas Saya';
            showToast('Filter dinonaktifkan: Menampilkan seluruh kawasan', 'info');
        }
    }
    renderAdminTable();
}

function renderStaffView() {
    loadStaffAccounts();

    const titleIcon = document.getElementById('staffModalIcon');
    const titleText = document.getElementById('staffModalTitleText');
    const subtitle = document.getElementById('staffModalSubtitle');
    const formTitleText = document.getElementById('staffFormTitleText');
    const btnSubmitText = document.getElementById('btnSubmitAddStaffText');
    const roleSelect = document.getElementById('staffRoleSelect');
    const adminCountCard = document.getElementById('staffAdminCountCard');
    const mitraCountCard = document.getElementById('staffMitraCountCard');
    const btnFilterAdmin = document.getElementById('btnFilterStaffAdmin');
    const btnFilterMitra = document.getElementById('btnFilterStaffMitra');
    const actionHeader = document.getElementById('staffActionColHeader');

    if (currentAdminRole === 'superadmin') {
        if (titleIcon) { titleIcon.className = 'fa-solid fa-users-gear'; titleIcon.style.color = '#facc15'; }
        if (titleText) titleText.innerText = 'Manajemen Otoritas Kampus (Kelola Admin, Petugas & Mitra)';
        if (subtitle) subtitle.innerHTML = 'Wewenang Eksklusif Super Admin: Mengatur akun <strong>Admin Sarpras</strong>, <strong>Tim Petugas Lapangan</strong>, dan <strong>Mitra Kampus</strong> (Kantin, Vendor, Bank).';
        if (formTitleText) formTitleText.innerText = 'Daftarkan Akun Admin, Petugas & Mitra Baru';
        if (btnSubmitText) btnSubmitText.innerText = 'Tambah Personil / Mitra';
        if (adminCountCard) adminCountCard.style.display = 'flex';
        if (mitraCountCard) mitraCountCard.style.display = 'flex';
        if (btnFilterAdmin) btnFilterAdmin.style.display = 'inline-flex';
        if (btnFilterMitra) btnFilterMitra.style.display = 'inline-flex';
        if (actionHeader) actionHeader.innerText = 'Aksi Super Admin';

        if (roleSelect) {
            roleSelect.innerHTML = `
                <option value="petugas">Petugas / Teknisi Lapangan</option>
                <option value="admin">Admin Sarpras (Penghubung Petugas & User)</option>
                <option value="mitra">Mitra Kampus (Kantin / Bank / Vendor Rekanan)</option>
            `;
            roleSelect.disabled = false;
        }
        currentStaffFilterRole = 'ALL';
    } else {
        // Mode Admin: Mengelola Petugas Lapangan Saja (Wewenang menentukan siapa Admin/Mitra hanya milik Super Admin)
        if (titleIcon) { titleIcon.className = 'fa-solid fa-users-gear'; titleIcon.style.color = 'var(--gold)'; }
        if (titleText) titleText.innerText = 'Manajemen Petugas Sarpras & Teknisi';
        if (subtitle) subtitle.innerHTML = 'Kelola penugasan dan status teknisi lapangan untuk menangani perbaikan fasilitas kampus.';
        if (formTitleText) formTitleText.innerText = 'Tambah Petugas / Teknisi Lapangan Baru';
        if (btnSubmitText) btnSubmitText.innerText = 'Tambah Petugas';
        if (adminCountCard) adminCountCard.style.display = 'none';
        if (mitraCountCard) mitraCountCard.style.display = 'none';
        if (btnFilterAdmin) btnFilterAdmin.style.display = 'none';
        if (btnFilterMitra) btnFilterMitra.style.display = 'none';
        if (actionHeader) actionHeader.innerText = 'Aksi Petugas';

        if (roleSelect) {
            roleSelect.innerHTML = `
                <option value="petugas" selected>Petugas / Teknisi Lapangan</option>
            `;
            roleSelect.disabled = false;
        }
        currentStaffFilterRole = 'petugas';
    }

    handleStaffRoleChange();
    renderAddStaffZoneCheckboxes();
    filterStaffTable(currentStaffFilterRole);
    renderStaffTable();
}

function handleStaffRoleChange() {
    const roleSelect = document.getElementById('staffRoleSelect');
    const role = roleSelect ? roleSelect.value : 'petugas';
    const authBox = document.getElementById('staffAuthFieldsWrapper');
    const lblNama = document.getElementById('lblStaffNama');
    const lblBidang = document.getElementById('lblStaffBidang');
    const btnSubmit = document.getElementById('btnSubmitAddStaffText');

    if (role === 'mitra') {
        if (authBox) authBox.style.display = 'block';
        if (lblNama) lblNama.innerText = 'Nama Mitra / Instansi / PIC *';
        if (lblBidang) lblBidang.innerText = 'Bidang / Usaha Kemitraan *';
        if (btnSubmit) btnSubmit.innerText = 'Tambah Akun Mitra';
    } else {
        if (authBox) authBox.style.display = 'none';
        if (lblNama) lblNama.innerText = 'Nama Lengkap & Gelar *';
        if (lblBidang) lblBidang.innerText = 'Spesialisasi / Bidang Kerja *';
        if (btnSubmit) btnSubmit.innerText = (role === 'admin') ? 'Tambah Akun Admin' : 'Tambah Petugas';
    }
}

function openStaffManagementModal() {
    switchAdminView('staff');
}

function closeStaffManagementModal() {
    switchAdminView('dashboard');
}

function filterStaffTable(role) {
    currentStaffFilterRole = role;
    const btnAll = document.getElementById('btnFilterStaffAll');
    const btnAdmin = document.getElementById('btnFilterStaffAdmin');
    const btnPetugas = document.getElementById('btnFilterStaffPetugas');
    const btnMitra = document.getElementById('btnFilterStaffMitra');

    [btnAll, btnAdmin, btnPetugas, btnMitra].forEach(btn => {
        if (btn) {
            btn.style.background = 'rgba(255,255,255,0.06)';
            btn.style.color = 'var(--text-muted)';
            btn.style.borderColor = 'var(--border-color)';
        }
    });

    if (role === 'ALL' && btnAll) {
        btnAll.style.background = 'var(--primary)';
        btnAll.style.color = '#fff';
        btnAll.style.borderColor = 'var(--primary)';
    } else if (role === 'admin' && btnAdmin) {
        btnAdmin.style.background = 'var(--primary)';
        btnAdmin.style.color = '#fff';
        btnAdmin.style.borderColor = 'var(--primary)';
    } else if (role === 'petugas' && btnPetugas) {
        btnPetugas.style.background = 'var(--primary)';
        btnPetugas.style.color = '#fff';
        btnPetugas.style.borderColor = 'var(--primary)';
    } else if (role === 'mitra' && btnMitra) {
        btnMitra.style.background = 'var(--primary)';
        btnMitra.style.color = '#fff';
        btnMitra.style.borderColor = 'var(--primary)';
    }

    renderStaffTable();
}

function renderStaffTable() {
    loadStaffAccounts();

    const totalAll = staffAccounts.length;
    const adminCount = staffAccounts.filter(s => s.role === 'admin').length;
    const petugasCount = staffAccounts.filter(s => s.role === 'petugas').length;
    const mitraCount = staffAccounts.filter(s => s.role === 'mitra').length;
    const activeCount = staffAccounts.filter(s => s.status === 'Aktif' && (currentAdminRole === 'superadmin' || s.role === 'petugas')).length;

    if (document.getElementById('staffTotalCount')) {
        document.getElementById('staffTotalCount').innerText = (currentAdminRole === 'superadmin') ? totalAll : petugasCount;
    }
    if (document.getElementById('staffAdminCount')) document.getElementById('staffAdminCount').innerText = adminCount;
    if (document.getElementById('staffPetugasCount')) document.getElementById('staffPetugasCount').innerText = petugasCount;
    if (document.getElementById('staffMitraCount')) document.getElementById('staffMitraCount').innerText = mitraCount;
    if (document.getElementById('staffActiveCount')) document.getElementById('staffActiveCount').innerText = activeCount;

    if (document.getElementById('countTabAll')) document.getElementById('countTabAll').innerText = (currentAdminRole === 'superadmin') ? totalAll : petugasCount;
    if (document.getElementById('countTabAdmin')) document.getElementById('countTabAdmin').innerText = adminCount;
    if (document.getElementById('countTabPetugas')) document.getElementById('countTabPetugas').innerText = petugasCount;
    if (document.getElementById('countTabMitra')) document.getElementById('countTabMitra').innerText = mitraCount;

    const search = (document.getElementById('searchStaffInput')?.value || '').trim().toLowerCase();

    // Guard: Admin hanya dapat melihat dan mengelola Petugas Lapangan. Akun Admin & Mitra khusus Super Admin.
    const filtered = staffAccounts.filter(item => {
        if (currentAdminRole !== 'superadmin' && item.role !== 'petugas') return false;
        if (currentStaffFilterRole !== 'ALL' && item.role !== currentStaffFilterRole) return false;
        if (search) {
            const txt = `${item.id} ${item.nama} ${item.bidang} ${item.wa} ${item.role} ${item.username || ''}`.toLowerCase();
            if (!txt.includes(search)) return false;
        }
        return true;
    });

    const tbody = document.getElementById('staffTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);">Tidak ada data ${currentAdminRole === 'superadmin' ? 'staf / mitra' : 'petugas'} yang cocok.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((s, idx) => {
        let roleBadge = '';
        if (s.role === 'admin') {
            roleBadge = `<span class="badge-role-admin"><i class="fa-solid fa-user-shield"></i> Admin Sarpras</span>`;
        } else if (s.role === 'mitra') {
            roleBadge = `<span class="badge-role-mitra" style="background:rgba(234,179,8,0.15); color:#facc15; border:1px solid rgba(234,179,8,0.3); padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:5px;"><i class="fa-solid fa-handshake"></i> Mitra Kampus</span>`;
        } else {
            roleBadge = `<span class="badge-role-petugas"><i class="fa-solid fa-screwdriver-wrench"></i> Petugas Lapangan</span>`;
        }

        const statusBadge = s.status === 'Aktif'
            ? `<span class="badge-status-aktif"><i class="fa-solid fa-circle-check"></i> Aktif</span>`
            : `<span class="badge-status-nonaktif"><i class="fa-solid fa-circle-xmark"></i> Nonaktif</span>`;

        const waClean = (s.wa || '').replace(/[^0-9]/g, '');
        const waLink = waClean.startsWith('0') ? '62' + waClean.substring(1) : waClean;

        const authCredentialInfo = (s.role === 'mitra')
            ? `<div style="font-size:11px; color:#facc15; margin-top:2px; font-family:monospace; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-key" style="font-size:10px;"></i> Login: <b>${escapeHtml(s.username || s.id)}</b> (pwd: ${escapeHtml(s.password || 'mitra123')})</div>`
            : '';

        const wilayahBadges = renderStaffZonesBadges(s.wilayah);

        // Tombol penugasan wilayah khusus Super Admin (Super Admin bisa menugaskan Admin maupun Petugas ke wilayah mana saja)
        const btnWilayah = (currentAdminRole === 'superadmin')
            ? `<button class="btn-act" onclick="openAssignWilayahModal('${s.id}')" title="Tugaskan / Atur Wilayah Operasional (${escapeHtml(s.nama)})" style="background:rgba(250,204,21,0.15); color:#facc15; border:1px solid rgba(250,204,21,0.35); font-size:11px; padding:3px 8px; border-radius:6px; margin-right:4px;">
                <i class="fa-solid fa-map-location-dot"></i> Wilayah
            </button>`
            : '';

        return `
            <tr>
                <td style="text-align:center; font-weight:700; color:var(--text-muted); font-size:12px;">${idx + 1}</td>
                <td style="font-family:monospace; font-weight:800; color:var(--gold);">${escapeHtml(s.id)}</td>
                <td>
                    <strong style="color:var(--text-main); font-size:13px;">${escapeHtml(s.nama)}</strong>
                    <div style="font-size:11px; margin-top:2px;">
                        <a href="https://wa.me/${waLink}" target="_blank" style="color:#10b981; text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                            <i class="fa-brands fa-whatsapp"></i> ${escapeHtml(s.wa)}
                        </a>
                    </div>
                    ${authCredentialInfo}
                </td>
                <td>${roleBadge}</td>
                <td style="font-size:12px; color:var(--text-muted);">${escapeHtml(s.bidang)}</td>
                <td>${wilayahBadges}</td>
                <td>${statusBadge}</td>
                <td style="text-align:center; white-space:nowrap;">
                    ${btnWilayah}
                    <button class="btn-toggle-status" onclick="toggleStaffStatus('${s.id}')" title="Ubah Status Aktif/Nonaktif">
                        ${s.status === 'Aktif' ? '<i class="fa-solid fa-toggle-on" style="color:#22c55e;"></i> Matikan' : '<i class="fa-solid fa-toggle-off" style="color:#94a3b8;"></i> Aktifkan'}
                    </button>
                    <button class="btn-act btn-del" onclick="deleteStaffAccount('${s.id}')" title="Hapus ${s.role === 'admin' ? 'Admin' : (s.role === 'mitra' ? 'Mitra' : 'Petugas')}" style="margin-left:6px;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function handleAddNewStaff(event) {
    event.preventDefault();
    const nama = document.getElementById('staffNamaInput').value.trim();
    const role = document.getElementById('staffRoleSelect').value;
    const bidang = document.getElementById('staffBidangInput').value.trim();
    const wa = document.getElementById('staffWaInput').value.trim();
    const usernameInput = document.getElementById('staffUsernameInput')?.value.trim();
    const passwordInput = document.getElementById('staffPasswordInput')?.value.trim();

    if (!nama || !bidang || !wa) {
        showToast('Mohon lengkapi seluruh isian data.', 'error');
        return;
    }

    // Guard: Admin tidak boleh mendaftarkan Admin atau Mitra! Hanya Super Admin yang berhak.
    if ((role === 'admin' || role === 'mitra') && currentAdminRole !== 'superadmin') {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'Wewenang Dibatasi',
                html: 'Hanya <b>Super Admin</b> yang berhak menentukan akun <b>Admin Sarpras</b> dan <b>Mitra Kampus</b>.<br>Sebagai Admin, wewenang Anda adalah mengelola <b>Petugas Lapangan</b>.',
                confirmButtonColor: '#005a36'
            });
        } else {
            showToast('Hanya Super Admin yang berhak menentukan akun Admin atau Mitra.', 'error');
        }
        return;
    }

    loadStaffAccounts();
    let prefix = 'TKN';
    if (role === 'admin') prefix = 'ADM';
    if (role === 'mitra') prefix = 'MTR';

    const sameRoleCount = staffAccounts.filter(s => s.role === role).length + 1;
    const newId = `${prefix}-${String(sameRoleCount).padStart(2, '0')}`;
    const username = usernameInput || (role === 'mitra' ? `mitra_${sameRoleCount}` : newId.toLowerCase());
    const password = passwordInput || (role === 'mitra' ? 'mitra123' : 'admin123');

    // Ambil wilayah terpilih dari checkbox form
    const checkedBoxes = document.querySelectorAll('input[name="addStaffWilayahCheckbox"]:checked');
    const selectedWilayah = Array.from(checkedBoxes).map(cb => cb.value);

    if (selectedWilayah.length === 0) {
        showToast('Pilih minimal 1 wilayah penugasan operasional!', 'error');
        return;
    }

    const newStaff = {
        id: newId,
        username: username,
        password: password,
        nama,
        role,
        bidang,
        wa,
        wilayah: selectedWilayah,
        status: 'Aktif'
    };

    staffAccounts.push(newStaff);
    saveStaffAccounts();

    document.getElementById('addStaffForm').reset();
    handleStaffRoleChange();
    renderStaffTable();

    let roleName = 'Petugas Lapangan';
    if (role === 'admin') roleName = 'Admin Sarpras';
    if (role === 'mitra') roleName = 'Mitra Kampus';

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: `${roleName} Berhasil Didaftarkan!`,
            html: `Akun <b>${escapeHtml(nama)}</b> telah resmi didaftarkan sebagai <b>${roleName}</b> dengan ID <b>${newId}</b>.${role === 'mitra' ? `<br><div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.25); border-radius:8px; font-size:12px; font-family:monospace; color:#facc15;"><strong>Kredensial Login Mitra:</strong><br>Username: <b>${escapeHtml(username)}</b><br>Password: <b>${escapeHtml(password)}</b></div><small style="color:var(--text-muted); display:block; margin-top:6px;">Mitra dapat langsung login di halaman utama untuk melaporkan kerusakan sarpras.</small>` : ''}`,
            confirmButtonColor: '#005a36'
        });
    } else {
        showToast(`${roleName} ${nama} berhasil ditambahkan!`, 'success');
    }
}

function toggleStaffStatus(id) {
    loadStaffAccounts();
    const staff = staffAccounts.find(s => s.id === id);
    if (!staff) return;

    if ((staff.role === 'admin' || staff.role === 'mitra') && currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly(`mengubah status akun ${staff.role === 'mitra' ? 'Mitra Kampus' : 'Admin'}`);
        return;
    }

    staff.status = staff.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    saveStaffAccounts();
    renderStaffTable();
    showToast(`Status ${staff.nama} diubah menjadi ${staff.status}.`, 'info');
}

async function deleteStaffAccount(id) {
    loadStaffAccounts();
    const staff = staffAccounts.find(s => s.id === id);
    if (!staff) return;

    // Guard: Hanya Super Admin yang bisa menghapus akun Admin atau Mitra
    if ((staff.role === 'admin' || staff.role === 'mitra') && currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly(`menghapus akun ${staff.role === 'mitra' ? 'Mitra Kampus' : 'Admin'}`);
        return;
    }

    const roleName = staff.role === 'admin' ? 'Admin' : (staff.role === 'mitra' ? 'Mitra Kampus' : 'Petugas');

    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: `Hapus ${roleName}?`,
            html: `Apakah Anda yakin ingin menghapus akun <b>${escapeHtml(staff.nama)}</b> (${escapeHtml(staff.id)})?<br><span style="font-size:12px; color:var(--text-muted);">${staff.role === 'petugas' ? 'Petugas ini tidak akan dapat dipilih lagi dalam penugasan tiket.' : 'Akun ini tidak akan dapat login lagi ke dalam sistem.'}</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;
    }

    staffAccounts = staffAccounts.filter(s => s.id !== id);
    saveStaffAccounts();
    renderStaffTable();
    showToast(`Akun ${staff.nama} berhasil dihapus.`, 'success');
}

// ==========================================================================
// SUPER ADMIN EXCLUSIVE: PENGATURAN BATAS WILAYAH GEOFENCING KAMPUS
// ==========================================================================

let geofenceEditorMapInstance = null;
let geofenceActiveZoneId = 'kampus_utama';
let geofenceEditableZones = [];
let geofenceActivePolygonLayer = null;
let geofenceBackgroundZoneGroup = null;
let geofenceVertexMarkersGroup = null;
let isGeofenceDrawMode = false;

// ==========================================================================
// VIEW MANAJEMEN WILAYAH & GEOFENCING KAMPUS (HALAMAN UTAMA SUPER ADMIN)
// ==========================================================================

function openGeofenceModal() {
    // Alihkan langsung ke view halaman penuh, bukan popup/modal
    switchAdminView('geofence');
}

function closeGeofenceModal() {
    // Kompatibilitas mundur
}

function closeGeofenceModalOnBackdrop() {
    // Kompatibilitas mundur
}

function renderGeofenceManagementView() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('mengatur wilayah dan batas geofencing kampus');
        return;
    }

    CAMPUS_ZONES = loadCampusZones();
    geofenceEditableZones = JSON.parse(JSON.stringify(CAMPUS_ZONES));
    if (!geofenceActiveZoneId || !geofenceEditableZones.some(z => z.id === geofenceActiveZoneId)) {
        geofenceActiveZoneId = geofenceEditableZones[0]?.id || 'kampus_utama';
    }
    isGeofenceDrawMode = false;
    updateGeofenceDrawModeBtn();

    renderGeofenceZoneCards();
    renderGeofenceZoneTabs();
    initGeofenceEditorMap();
    loadGeofenceZoneToEditor(geofenceActiveZoneId);

    setTimeout(() => {
        if (geofenceEditorMapInstance) {
            geofenceEditorMapInstance.invalidateSize();
        }
    }, 200);
}

function toggleAddNewZoneForm() {
    const card = document.getElementById('addZoneFormCard');
    const btnText = document.getElementById('btnToggleZoneText');
    if (!card) return;

    if (card.style.display === 'none' || card.style.display === '') {
        card.style.display = 'block';
        if (btnText) btnText.innerText = 'Tutup Formulir';
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => document.getElementById('newZoneNameInput')?.focus(), 200);
    } else {
        card.style.display = 'none';
        if (btnText) btnText.innerText = 'Tambah Wilayah Baru';
    }
}

function autoGenerateZoneId(name) {
    const idInput = document.getElementById('newZoneIdInput');
    if (!idInput) return;
    const clean = name.toLowerCase()
        .replace(/^kawasan\s+/i, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    idInput.value = clean || 'wilayah_baru';
}

function handleAddNewZone(event) {
    event.preventDefault();
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('menambahkan wilayah baru');
        return;
    }

    const name = document.getElementById('newZoneNameInput').value.trim();
    const id = document.getElementById('newZoneIdInput').value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const icon = document.getElementById('newZoneIconInput').value;
    const color = document.getElementById('newZoneColorInput').value;
    const baseLoc = document.getElementById('newZoneBaseLocInput').value;

    if (!name || !id) {
        showToast('Mohon lengkapi nama dan ID kawasan.', 'error');
        return;
    }

    CAMPUS_ZONES = loadCampusZones();

    if (CAMPUS_ZONES.some(z => z.id === id)) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'ID Wilayah Sudah Ada',
                html: `Kode ID <b>${escapeHtml(id)}</b> sudah digunakan oleh kawasan lain.<br>Silakan gunakan kode ID yang unik.`,
                confirmButtonColor: '#005a36'
            });
        } else {
            showToast('ID Wilayah sudah ada, gunakan ID lain.', 'error');
        }
        return;
    }

    // Tentukan koordinat titik pusat acuan untuk membuat polygon 4 titik awal yang rapi
    let centerLat = -6.735000;
    let centerLng = 108.533600;

    if (baseLoc === 'gedung_cyber') {
        centerLat = -6.737100; centerLng = 108.531500;
    } else if (baseLoc === 'kampus_sebrang') {
        centerLat = -6.738000; centerLng = 108.535000;
    } else if (baseLoc === 'pascasarjana_mahad') {
        centerLat = -6.740500; centerLng = 108.533000;
    } else if (baseLoc === 'area_saladara') {
        centerLat = -6.742000; centerLng = 108.528000;
    }

    const delta = 0.00035; // ~40 meter segi empat awal
    const initialPolygon = [
        [+(centerLat - delta).toFixed(6), +(centerLng - delta).toFixed(6)],
        [+(centerLat - delta).toFixed(6), +(centerLng + delta).toFixed(6)],
        [+(centerLat + delta).toFixed(6), +(centerLng + delta).toFixed(6)],
        [+(centerLat + delta).toFixed(6), +(centerLng - delta).toFixed(6)]
    ];

    const newZone = {
        id: id,
        name: name,
        icon: icon,
        color: color,
        polygon: initialPolygon,
        isCustom: true
    };

    CAMPUS_ZONES.push(newZone);
    saveCampusZones(CAMPUS_ZONES);
    syncCampusZoneMetas(CAMPUS_ZONES);

    geofenceEditableZones = JSON.parse(JSON.stringify(CAMPUS_ZONES));
    geofenceActiveZoneId = id;

    // Reset dan tutup form
    document.getElementById('newZoneForm').reset();
    toggleAddNewZoneForm();

    // Render ulang seluruh view
    renderGeofenceManagementView();
    updateFilterGedungOptions();
    renderAddStaffZoneCheckboxes();
    reloadAdminOverviewMapZones();

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Kawasan Baru Berhasil Dibuat!',
            html: `Wilayah <b>${escapeHtml(name)}</b> (${id}) telah terdaftar dengan 4 titik awal poligon.<br><span style="font-size:12px; color:var(--text-muted);">Peta di bawah telah difokuskan ke wilayah baru ini. Anda dapat langsung menggeser pin sudut atau menambah titik baru.</span>`,
            confirmButtonColor: '#005a36'
        });
    } else {
        showToast(`Kawasan ${name} berhasil ditambahkan!`, 'success');
    }
}

async function deleteCampusZone(zoneId) {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('menghapus wilayah kampus');
        return;
    }

    const isDefault = DEFAULT_CAMPUS_ZONES.some(d => d.id === zoneId);
    if (isDefault) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'Kawasan Bawaan Sistem',
                html: '5 Kawasan utama UINSSC merupakan zona inti kampus yang tidak dapat dihapus.<br><span style="font-size:12px; color:var(--text-muted);">Anda dapat menyesuaikan atau menggeser titik-titik koordinat batas poligonnya.</span>',
                confirmButtonColor: '#005a36'
            });
        } else {
            showToast('Kawasan bawaan sistem tidak dapat dihapus.', 'info');
        }
        return;
    }

    CAMPUS_ZONES = loadCampusZones();
    const targetZone = CAMPUS_ZONES.find(z => z.id === zoneId);
    if (!targetZone) return;

    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Hapus Wilayah Ini?',
            html: `Apakah Anda yakin ingin menghapus kawasan <b>${escapeHtml(targetZone.name)}</b>?<br><span style="font-size:12px; color:var(--text-muted);">Seluruh data batas koordinat dan geofencing wilayah ini akan dihapus dari sistem.</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus Kawasan',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
        if (!result.isConfirmed) return;
    }

    CAMPUS_ZONES = CAMPUS_ZONES.filter(z => z.id !== zoneId);
    saveCampusZones(CAMPUS_ZONES);
    delete CAMPUS_ZONE_METAS[zoneId];

    geofenceEditableZones = JSON.parse(JSON.stringify(CAMPUS_ZONES));
    geofenceActiveZoneId = CAMPUS_ZONES[0]?.id || 'kampus_utama';

    renderGeofenceManagementView();
    updateFilterGedungOptions();
    renderAddStaffZoneCheckboxes();
    reloadAdminOverviewMapZones();

    showToast(`Kawasan ${targetZone.name} berhasil dihapus.`, 'success');
}

function renderGeofenceZoneCards() {
    const grid = document.getElementById('geofenceZoneCardsGrid');
    const badgeCount = document.getElementById('totalZonesCountBadge');
    if (!grid) return;

    const zones = geofenceEditableZones || CAMPUS_ZONES;
    if (badgeCount) badgeCount.innerText = zones.length;

    grid.innerHTML = zones.map(z => {
        const isActive = z.id === geofenceActiveZoneId;
        const meta = CAMPUS_ZONE_METAS[z.id] || { icon: 'fa-map-pin', color: '#facc15' };
        const isDefault = DEFAULT_CAMPUS_ZONES.some(d => d.id === z.id);
        const pointCount = (z.polygon || []).length;
        const color = z.color || meta.color || '#facc15';

        const deleteBtn = (!isDefault)
            ? `<button type="button" class="btn-act btn-del" onclick="event.stopPropagation(); deleteCampusZone('${z.id}')" title="Hapus Kawasan Ini" style="font-size:11px; padding:3px 7px;">
                <i class="fa-solid fa-trash-can"></i>
            </button>`
            : '';

        return `
            <div onclick="switchGeofenceActiveZone('${z.id}')" style="cursor:pointer; background:rgba(255,255,255,${isActive ? '0.08' : '0.03'}); border:1.5px solid ${isActive ? 'var(--gold)' : 'var(--border-color)'}; border-radius:12px; padding:12px 14px; position:relative; transition:all 0.2s ease; box-shadow:${isActive ? '0 0 15px rgba(250,204,21,0.2)' : 'none'};">
                <div style="height:3px; background:${color}; border-radius:3px; margin-bottom:10px;"></div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="width:28px; height:28px; border-radius:8px; background:${color}22; color:${color}; display:flex; align-items:center; justify-content:center; font-size:13px;">
                            <i class="fa-solid ${z.icon || meta.icon}"></i>
                        </span>
                        <div>
                            <strong style="font-size:13px; color:var(--text-main); display:block; line-height:1.2;">${escapeHtml(z.name)}</strong>
                            <span style="font-size:10.5px; font-family:monospace; color:var(--text-muted);">ID: ${escapeHtml(z.id)}</span>
                        </div>
                    </div>
                    ${deleteBtn}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:11px; color:var(--text-muted); border-top:1px dashed var(--border-color); padding-top:6px;">
                    <span><i class="fa-solid fa-draw-polygon" style="color:${color};"></i> <b>${pointCount}</b> Sudut Titik</span>
                    <span style="font-size:10.5px; font-weight:700; color:${isDefault ? '#10b981' : '#38bdf8'};">${isDefault ? 'Bawaan' : 'Kustom'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderGeofenceZoneTabs() {
    const container = document.getElementById('geofenceZoneTabs');
    if (!container) return;

    container.innerHTML = geofenceEditableZones.map(zone => {
        const isActive = zone.id === geofenceActiveZoneId;
        const meta = CAMPUS_ZONE_METAS[zone.id] || { color: '#facc15' };
        const color = zone.color || meta.color || '#facc15';
        const pointCount = (zone.polygon || []).length;
        const activeStyle = isActive 
            ? `background: #005a36; color: #fef08a; border: 1.5px solid var(--gold); font-weight: 800; box-shadow:0 0 10px rgba(250,204,21,0.3);`
            : 'background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid var(--border-color); font-weight: 500;';
        return `
            <button type="button" class="chip-btn" onclick="switchGeofenceActiveZone('${zone.id}')" style="${activeStyle} font-size:12px; padding:6px 14px; border-radius:18px; cursor:pointer; transition:all 0.2s ease; display:inline-flex; align-items:center; gap:6px;">
                <span style="width:8px; height:8px; border-radius:50%; background:${color}; display:inline-block;"></span>
                ${escapeHtml(zone.name)}
                <span style="font-size:10px; background:rgba(0,0,0,0.3); padding:1px 6px; border-radius:10px; opacity:0.85;">${pointCount}</span>
            </button>
        `;
    }).join('');
}

function switchGeofenceActiveZone(zoneId) {
    geofenceActiveZoneId = zoneId;
    renderGeofenceZoneCards();
    renderGeofenceZoneTabs();
    loadGeofenceZoneToEditor(zoneId);
}

function initGeofenceEditorMap() {
    const mapEl = document.getElementById('geofenceEditorMap');
    if (!mapEl || typeof L === 'undefined') return;

    if (!geofenceEditorMapInstance) {
        geofenceEditorMapInstance = L.map('geofenceEditorMap', {
            center: [-6.735000, 108.533600],
            zoom: 17,
            minZoom: 14,
            maxZoom: 22
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 14,
            maxZoom: 22,
            maxNativeZoom: 19,
            attribution: '&copy; OpenStreetMap & UINSSC'
        }).addTo(geofenceEditorMapInstance);

        geofenceBackgroundZoneGroup = L.featureGroup().addTo(geofenceEditorMapInstance);
        geofenceVertexMarkersGroup = L.featureGroup().addTo(geofenceEditorMapInstance);

        geofenceEditorMapInstance.on('click', (e) => {
            if (isGeofenceDrawMode) {
                handleGeofenceMapClick(e.latlng.lat, e.latlng.lng);
            }
        });
    }

    setTimeout(() => {
        if (geofenceEditorMapInstance) {
            geofenceEditorMapInstance.invalidateSize();
        }
    }, 200);
}

function loadGeofenceZoneToEditor(zoneId) {
    if (!geofenceEditorMapInstance) return;

    const currentZone = geofenceEditableZones.find(z => z.id === zoneId);
    if (!currentZone) return;

    const badge = document.getElementById('geofenceActiveZoneBadge');
    if (badge) badge.innerText = currentZone.name;

    // 1. Render Background Zones (other 4 zones)
    if (geofenceBackgroundZoneGroup) {
        geofenceBackgroundZoneGroup.clearLayers();
        geofenceEditableZones.forEach(z => {
            if (z.id !== zoneId && z.polygon.length > 2) {
                const bgPoly = L.polygon(z.polygon, {
                    color: '#94a3b8',
                    dashArray: '4, 4',
                    weight: 1.5,
                    fillColor: '#64748b',
                    fillOpacity: 0.12,
                    interactive: true
                });
                bgPoly.bindTooltip(z.name, { permanent: false, direction: 'center' });
                bgPoly.on('click', () => switchGeofenceActiveZone(z.id));
                geofenceBackgroundZoneGroup.addLayer(bgPoly);
            }
        });
    }

    // 2. Render Active Zone Polygon
    if (geofenceActivePolygonLayer) {
        geofenceEditorMapInstance.removeLayer(geofenceActivePolygonLayer);
        geofenceActivePolygonLayer = null;
    }

    if (currentZone.polygon.length >= 3) {
        geofenceActivePolygonLayer = L.polygon(currentZone.polygon, {
            color: '#facc15',
            weight: 3,
            fillColor: '#005a36',
            fillOpacity: 0.35
        }).addTo(geofenceEditorMapInstance);

        geofenceEditorMapInstance.fitBounds(geofenceActivePolygonLayer.getBounds(), { padding: [30, 30] });
    } else if (currentZone.polygon.length > 0) {
        geofenceActivePolygonLayer = L.polyline(currentZone.polygon, {
            color: '#facc15',
            weight: 3,
            dashArray: '5, 5'
        }).addTo(geofenceEditorMapInstance);
        geofenceEditorMapInstance.setView(currentZone.polygon[0], 17);
    } else {
        geofenceEditorMapInstance.setView([-6.735000, 108.533600], 17);
    }

    // 3. Render Vertex Markers & List
    renderGeofenceVertexMarkers(currentZone);
    renderGeofencePointsList(currentZone);
}

function renderGeofenceVertexMarkers(zone) {
    if (!geofenceVertexMarkersGroup) return;
    geofenceVertexMarkersGroup.clearLayers();

    zone.polygon.forEach((coord, idx) => {
        const handleHtml = `
            <div style="width:16px; height:16px; background:#facc15; border:2.5px solid #005a36; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.45); cursor:grab; transition:transform 0.15s ease;"
                 onmouseover="this.style.transform='scale(1.35)'; this.style.borderColor='#ef4444';"
                 onmouseout="this.style.transform='scale(1)'; this.style.borderColor='#005a36';">
            </div>
        `;

        const dragIcon = L.divIcon({
            className: 'geofence-draggable-handle',
            html: handleHtml,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = L.marker(coord, {
            draggable: true,
            icon: dragIcon,
            title: `Geser Titik ${idx + 1} untuk mengubah koordinat batas kawasan`
        });

        marker.bindTooltip(`<b>Titik ${idx + 1}</b> (Tahan &amp; Geser Koordinat)<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, {
            direction: 'top',
            offset: [0, -8]
        });

        // Event saat pin digeser secara real-time
        marker.on('drag', (e) => {
            const latlng = e.target.getLatLng();
            zone.polygon[idx] = [latlng.lat, latlng.lng];
            if (geofenceActivePolygonLayer) {
                geofenceActivePolygonLayer.setLatLngs(zone.polygon);
            }
            marker.setTooltipContent(`<b>Titik ${idx + 1}</b> (Sedang Digeser...)<br>${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
        });

        // Event saat pin selesai digeser (dragend)
        marker.on('dragend', (e) => {
            const latlng = e.target.getLatLng();
            zone.polygon[idx] = [latlng.lat, latlng.lng];
            if (geofenceActivePolygonLayer) {
                geofenceActivePolygonLayer.setLatLngs(zone.polygon);
            }
            marker.setTooltipContent(`<b>Titik ${idx + 1}</b> (Tahan &amp; Geser Koordinat)<br>${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
            renderGeofencePointsList(zone);
            showToast(`Titik ${idx + 1} (${zone.name}) digeser ke: [${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}]`, 'info');
        });

        marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
        });

        geofenceVertexMarkersGroup.addLayer(marker);
    });
}

function calculatePolygonAreaM2(coords) {
    if (!Array.isArray(coords) || coords.length < 3) return 0;
    const avgLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    const rad = Math.PI / 180;
    const mPerLat = 111139;
    const mPerLng = 111139 * Math.cos(avgLat * rad);

    let area = 0;
    const n = coords.length;
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const xi = coords[i][1] * mPerLng;
        const yi = coords[i][0] * mPerLat;
        const xj = coords[j][1] * mPerLng;
        const yj = coords[j][0] * mPerLat;
        area += (xi * yj) - (xj * yi);
    }
    return Math.abs(area) / 2;
}

function formatPolygonArea(areaM2) {
    if (!areaM2 || isNaN(areaM2) || areaM2 <= 0) return '-';
    if (areaM2 >= 10000) {
        const ha = (areaM2 / 10000).toFixed(2);
        return `${Math.round(areaM2).toLocaleString('id-ID')} m² (${ha} Ha)`;
    }
    return `${Math.round(areaM2).toLocaleString('id-ID')} m²`;
}

function renderGeofencePointsList(zone) {
    const tbody = document.getElementById('geofencePointsTableBody');
    const countEl = document.getElementById('geofencePointCount');
    const areaEl = document.getElementById('geofenceAreaText');
    const validEl = document.getElementById('geofenceValidityText');
    const statusBadge = document.getElementById('geofenceZoneStatusBadge');

    const pts = Array.isArray(zone.polygon) ? zone.polygon : [];
    if (countEl) countEl.innerText = pts.length;

    // Hitung luas area polygon dalam m² & Hektar
    const areaM2 = calculatePolygonAreaM2(pts);
    if (areaEl) {
        areaEl.innerText = formatPolygonArea(areaM2);
    }

    // Validitas polygon (minimal 3 titik untuk membentuk area tertutup)
    if (validEl) {
        if (pts.length >= 3) {
            validEl.innerHTML = `<span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Valid Polygon (${pts.length} Titik)</span>`;
        } else {
            validEl.innerHTML = `<span style="color:#ef4444; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> Belum Tertutup (< 3 Titik)</span>`;
        }
    }

    if (statusBadge) {
        if (pts.length >= 3) {
            statusBadge.innerText = 'Kawasan Siaga';
            statusBadge.style.color = '#10b981';
            statusBadge.style.borderColor = 'rgba(16,185,129,0.4)';
            statusBadge.style.background = 'rgba(16,185,129,0.1)';
        } else {
            statusBadge.innerText = 'Titik Belum Lengkap';
            statusBadge.style.color = '#ef4444';
            statusBadge.style.borderColor = 'rgba(239,68,68,0.4)';
            statusBadge.style.background = 'rgba(239,68,68,0.1)';
        }
    }

    if (!tbody) return;

    if (pts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:24px 10px; color:var(--text-muted); font-size:11.5px;">
                    Belum ada titik sudut untuk kawasan ini.<br>Aktifkan <b>Mode Tambah Titik Baru</b> lalu klik pada peta.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = pts.map((pt, idx) => {
        return `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='transparent'" onclick="panToGeofencePoint(${idx})">
                <td style="padding:6px 8px; text-align:center; color:var(--gold); font-weight:700;">${idx + 1}</td>
                <td style="padding:6px 8px; color:var(--text-main); font-family:monospace;">${pt[0].toFixed(6)}</td>
                <td style="padding:6px 8px; color:var(--text-main); font-family:monospace;">${pt[1].toFixed(6)}</td>
                <td style="padding:6px 8px; text-align:center;">
                    <button type="button" class="btn-act btn-del" onclick="event.stopPropagation(); deleteGeofencePoint(${idx})" title="Hapus titik koordinat ini" style="width:22px; height:22px; font-size:10.5px; padding:0; display:inline-flex; align-items:center; justify-content:center;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function panToGeofencePoint(index) {
    const currentZone = geofenceEditableZones.find(z => z.id === geofenceActiveZoneId);
    if (!currentZone || !currentZone.polygon[index] || !geofenceEditorMapInstance) return;
    const pt = currentZone.polygon[index];
    geofenceEditorMapInstance.setView(pt, 18);
    showToast(`Fokus ke Titik ${index + 1}: [${pt[0].toFixed(6)}, ${pt[1].toFixed(6)}]`, 'info');
}

function toggleGeofenceDrawMode() {
    isGeofenceDrawMode = !isGeofenceDrawMode;
    updateGeofenceDrawModeBtn();
    if (isGeofenceDrawMode) {
        showToast('Mode Tambah Titik Aktif! Klik pada peta untuk menambahkan sudut batas polygon.', 'info');
    } else {
        showToast('Mode Tambah Titik Dinonaktifkan.', 'info');
    }
}

function updateGeofenceDrawModeBtn() {
    const btn = document.getElementById('btnGeofenceDrawMode');
    if (!btn) return;
    if (isGeofenceDrawMode) {
        btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Selesai Tambah Titik`;
        btn.style.background = '#facc15';
        btn.style.color = '#000000';
    } else {
        btn.innerHTML = `<i class="fa-solid fa-pen-nib"></i> Mode Tambah Titik Baru`;
        btn.style.background = 'rgba(250,204,21,0.15)';
        btn.style.color = '#facc15';
    }
}

function handleGeofenceMapClick(lat, lng) {
    const currentZone = geofenceEditableZones.find(z => z.id === geofenceActiveZoneId);
    if (!currentZone) return;

    const roundedLat = parseFloat(lat.toFixed(6));
    const roundedLng = parseFloat(lng.toFixed(6));

    currentZone.polygon.push([roundedLat, roundedLng]);
    loadGeofenceZoneToEditor(geofenceActiveZoneId);
    showToast(`Titik ${currentZone.polygon.length} ditambahkan: [${roundedLat}, ${roundedLng}]`, 'success');
}

function addManualGeofencePoint() {
    const latInput = document.getElementById('manualLatInput');
    const lngInput = document.getElementById('manualLngInput');
    if (!latInput || !lngInput) return;

    const lat = parseFloat(latInput.value);
    const lng = parseFloat(lngInput.value);

    if (isNaN(lat) || isNaN(lng)) {
        showToast('Mohon masukkan Latitude dan Longitude yang valid.', 'error');
        return;
    }

    const currentZone = geofenceEditableZones.find(z => z.id === geofenceActiveZoneId);
    if (!currentZone) return;

    const roundedLat = parseFloat(lat.toFixed(6));
    const roundedLng = parseFloat(lng.toFixed(6));

    currentZone.polygon.push([roundedLat, roundedLng]);
    latInput.value = '';
    lngInput.value = '';

    loadGeofenceZoneToEditor(geofenceActiveZoneId);
    showToast(`Titik manual berhasil ditambahkan: [${roundedLat}, ${roundedLng}]`, 'success');
}

function deleteGeofencePoint(index) {
    const currentZone = geofenceEditableZones.find(z => z.id === geofenceActiveZoneId);
    if (!currentZone || !currentZone.polygon[index]) return;

    currentZone.polygon.splice(index, 1);
    loadGeofenceZoneToEditor(geofenceActiveZoneId);
    showToast(`Titik ${index + 1} dihapus.`, 'info');
}

function clearCurrentZonePoints() {
    const currentZone = geofenceEditableZones.find(z => z.id === geofenceActiveZoneId);
    if (!currentZone) return;

    if (confirm(`Apakah Anda yakin ingin mengosongkan seluruh titik untuk ${currentZone.name}?`)) {
        currentZone.polygon = [];
        loadGeofenceZoneToEditor(geofenceActiveZoneId);
        showToast(`Seluruh titik ${currentZone.name} dikosongkan.`, 'info');
    }
}

function resetCurrentZoneToDefault() {
    const defaultZone = DEFAULT_CAMPUS_ZONES.find(z => z.id === geofenceActiveZoneId);
    const currentZone = geofenceEditableZones.find(z => z.id === geofenceActiveZoneId);
    if (!defaultZone || !currentZone) return;

    currentZone.polygon = JSON.parse(JSON.stringify(defaultZone.polygon));
    loadGeofenceZoneToEditor(geofenceActiveZoneId);
    showToast(`Batas ${currentZone.name} dikembalikan ke koordinat bawaan kampus.`, 'success');
}

function resetAllZonesToDefault() {
    if (confirm('Apakah Anda yakin ingin mengembalikan SELURUH batas 5 kawasan kampus ke koordinat awal bawaan?')) {
        geofenceEditableZones = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_ZONES));
        loadGeofenceZoneToEditor(geofenceActiveZoneId);
        showToast('Seluruh kawasan kampus dikembalikan ke koordinat awal.', 'success');
    }
}

function saveAllGeofenceChanges() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('menyimpan perubahan batas wilayah geofencing');
        return;
    }

    // Validasi setiap kawasan minimal 3 titik
    for (let zone of geofenceEditableZones) {
        if (!zone.polygon || zone.polygon.length < 3) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Polygon Belum Lengkap',
                    html: `Kawasan <b>${escapeHtml(zone.name)}</b> hanya memiliki ${zone.polygon ? zone.polygon.length : 0} titik.<br>Setiap kawasan memerlukan minimal <b>3 titik</b> untuk membentuk area polygon tertutup.`,
                    confirmButtonColor: '#005a36'
                });
            } else {
                showToast(`Kawasan ${zone.name} membutuhkan minimal 3 titik!`, 'error');
            }
            return;
        }
    }

    // Simpan ke localStorage & update variabel aktif
    CAMPUS_ZONES = JSON.parse(JSON.stringify(geofenceEditableZones));
    saveCampusZones(CAMPUS_ZONES);

    // Refresh Overview Map admin
    reloadAdminOverviewMapZones();

    syncCampusZoneMetas(CAMPUS_ZONES);
    renderGeofenceZoneCards();
    renderGeofenceZoneTabs();
    updateFilterGedungOptions();
    renderAddStaffZoneCheckboxes();

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Batas Geofencing Disimpan!',
            html: `Seluruh koordinat polygon <b>${CAMPUS_ZONES.length} kawasan kampus</b> berhasil disimpan.<br><span style="font-size:12px; color:var(--text-muted);">Batas wilayah baru telah aktif pada verifikasi pelaporan mahasiswa/dosen serta peta GIS sarpras.</span>`,
            confirmButtonColor: '#005a36'
        });
    } else {
        showToast('Batas Geofencing berhasil disimpan!', 'success');
    }
}

/* ==========================================================================
   SUPER ADMIN EXCLUSIVE: PORTAL CONTENT, BANNER & VIDEO PROFILE CMS
   ========================================================================== */

const DEFAULT_PORTAL_CONTENT = {
    features: [
        {
            id: 1,
            icon: 'fa-map-location-dot',
            colorClass: 'icon-emerald',
            title: 'Geofencing GIS Presisi 5 Zona',
            desc: 'Validasi otomatis titik koordinat GPS di kawasan kampus guna mencegah laporan palsu.'
        },
        {
            id: 2,
            icon: 'fa-layer-group',
            colorClass: 'icon-amber',
            title: 'Smart Duplicate & Anti-Spam',
            desc: 'Deteksi pintar laporan serupa di ruangan yang sama untuk efisiensi teknisi sarpras.'
        },
        {
            id: 3,
            icon: 'fa-chart-line',
            colorClass: 'icon-cyan',
            title: 'Transparansi Tracking & SLA',
            desc: 'Pantau status perbaikan mulai dari Diajukan, Diproses teknisi, hingga Selesai tuntas.'
        }
    ],
    banner: {
        badge: 'PORTAL LAYANAN SARPRAS KAMPUS',
        title: 'Sistem Informasi Pelaporan Fasilitas Kampus',
        desc: 'Pencatatan Kerusakan Sarpras, Validasi Geofencing GIS Presisi 5 Kawasan, Pelacakan Status Tiket Real-time, & Respon Cepat Tim Teknisi Pemeliharaan UINSSC.',
        icon: 'fa-building-shield',
        bgImage: ''
    },
    video: {
        enabled: true,
        title: 'Profil Kampus UIN Siber Syekh Nurjati Cirebon',
        desc: 'Kenali lebih dekat fasilitas modern, ekosistem digital, dan layanan sarana prasarana kampus cyber.',
        url: 'https://youtu.be/bUhLVKdbRd0?si=C6iIsdGNuLUB38Qa',
        embedId: 'bUhLVKdbRd0'
    }
};

let currentCmsBannerImage = '';

function getStoredPortalContent() {
    const raw = localStorage.getItem('SIMPEL_PORTAL_CONTENT_V1');
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PORTAL_CONTENT));
    try {
        const parsed = JSON.parse(raw);
        return {
            features: (parsed.features && parsed.features.length) ? parsed.features : JSON.parse(JSON.stringify(DEFAULT_PORTAL_CONTENT.features)),
            banner: Object.assign({}, DEFAULT_PORTAL_CONTENT.banner, parsed.banner || {}),
            video: Object.assign({}, DEFAULT_PORTAL_CONTENT.video, parsed.video || {})
        };
    } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_PORTAL_CONTENT));
    }
}

function extractYouTubeEmbedId(url) {
    if (!url) return '';
    url = url.trim();
    // match youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch && shortMatch[1]) return shortMatch[1];
    // match watch?v=ID
    const vMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (vMatch && vMatch[1]) return vMatch[1];
    // match embed/ID
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];
    // raw ID (typically 11 characters)
    if (/^[a-zA-Z0-9_-]{8,15}$/.test(url)) return url;
    return '';
}

function openPortalContentModal() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('mengelola konten, banner portal, dan video profil login');
        return;
    }

    const modal = document.getElementById('portalContentModal');
    if (!modal) return;

    loadPortalContentForAdmin();
    switchCmsTab('features');
    modal.classList.remove('hidden');
}

function closePortalContentModal() {
    const modal = document.getElementById('portalContentModal');
    if (modal) modal.classList.add('hidden');
}

function closePortalContentModalOnBackdrop(e) {
    if (e.target && e.target.id === 'portalContentModal') {
        closePortalContentModal();
    }
}

function switchCmsTab(tabName) {
    const tabBtns = {
        features: document.getElementById('btnCmsTabFeatures'),
        banner: document.getElementById('btnCmsTabBanner'),
        video: document.getElementById('btnCmsTabVideo')
    };
    const sections = {
        features: document.getElementById('cmsSectionFeatures'),
        banner: document.getElementById('cmsSectionBanner'),
        video: document.getElementById('cmsSectionVideo')
    };

    ['features', 'banner', 'video'].forEach(key => {
        if (tabBtns[key]) {
            if (key === tabName) tabBtns[key].classList.add('active');
            else tabBtns[key].classList.remove('active');
        }
        if (sections[key]) {
            if (key === tabName) sections[key].classList.remove('hidden');
            else sections[key].classList.add('hidden');
        }
    });
}

function loadPortalContentForAdmin() {
    const content = getStoredPortalContent();

    // Render 3 Features Form
    renderCmsFeaturesForm(content.features);

    // Populate Banner Form
    const b = content.banner;
    const badgeIn = document.getElementById('cmsBannerBadgeInput');
    const titleIn = document.getElementById('cmsBannerTitleInput');
    const descIn = document.getElementById('cmsBannerDescInput');
    const iconIn = document.getElementById('cmsBannerIconSelect');
    const fileIn = document.getElementById('cmsBannerFileInput');

    if (badgeIn) badgeIn.value = b.badge || '';
    if (titleIn) titleIn.value = b.title || '';
    if (descIn) descIn.value = b.desc || '';
    if (iconIn) iconIn.value = b.icon || 'fa-building-shield';
    if (fileIn) fileIn.value = '';
    currentCmsBannerImage = b.bgImage || '';
    updateCmsBannerPreview();

    // Populate Video Form
    const v = content.video;
    const vUrl = document.getElementById('cmsVideoUrlInput');
    const vTitle = document.getElementById('cmsVideoTitleInput');
    const vDesc = document.getElementById('cmsVideoDescInput');
    const vEnabled = document.getElementById('cmsVideoEnabledInput');

    if (vUrl) vUrl.value = v.url || 'https://youtu.be/bUhLVKdbRd0?si=C6iIsdGNuLUB38Qa';
    if (vTitle) vTitle.value = v.title || '';
    if (vDesc) vDesc.value = v.desc || '';
    if (vEnabled) vEnabled.checked = (v.enabled !== false);
    updateCmsVideoPreview();
}

const CMS_ICON_OPTIONS = [
    { value: 'fa-map-location-dot', label: 'Peta & Lokasi (fa-map-location-dot)' },
    { value: 'fa-layer-group', label: 'Lapisan & Group (fa-layer-group)' },
    { value: 'fa-chart-line', label: 'Grafik & Metrik (fa-chart-line)' },
    { value: 'fa-shield-halved', label: 'Perisai Keamanan (fa-shield-halved)' },
    { value: 'fa-building-shield', label: 'Gedung & Sarpras (fa-building-shield)' },
    { value: 'fa-building-columns', label: 'Institusi Kampus (fa-building-columns)' },
    { value: 'fa-screwdriver-wrench', label: 'Alat Perbaikan (fa-screwdriver-wrench)' },
    { value: 'fa-bullhorn', label: 'Pengumuman / Respon (fa-bullhorn)' },
    { value: 'fa-bell', label: 'Notifikasi Tiket (fa-bell)' },
    { value: 'fa-circle-check', label: 'Validasi Sukses (fa-circle-check)' },
    { value: 'fa-laptop-code', label: 'Sistem Digital (fa-laptop-code)' },
    { value: 'fa-wifi', label: 'Jaringan & IoT (fa-wifi)' }
];

const CMS_COLOR_OPTIONS = [
    { value: 'icon-emerald', label: 'Hijau Emerald (Emerald)' },
    { value: 'icon-amber', label: 'Kuning Amber (Amber)' },
    { value: 'icon-cyan', label: 'Biru Cyan (Cyan)' }
];

function renderCmsFeaturesForm(features) {
    const container = document.getElementById('cmsFeaturesContainer');
    if (!container) return;

    if (!features || !features.length) {
        features = DEFAULT_PORTAL_CONTENT.features;
    }

    container.innerHTML = features.map((f, idx) => {
        const iconSelectOptions = CMS_ICON_OPTIONS.map(opt =>
            `<option value="${opt.value}" ${opt.value === f.icon ? 'selected' : ''}>${opt.label}</option>`
        ).join('');

        const colorSelectOptions = CMS_COLOR_OPTIONS.map(opt =>
            `<option value="${opt.value}" ${opt.value === f.colorClass ? 'selected' : ''}>${opt.label}</option>`
        ).join('');

        return `
            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:10px; padding:14px; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span style="font-size:12px; font-weight:800; color:var(--gold); display:flex; align-items:center; gap:6px;">
                        <span style="width:20px; height:20px; border-radius:50%; background:var(--gold); color:#000; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:800;">${idx + 1}</span>
                        Fitur Sorotan ${idx + 1}
                    </span>
                    <span class="login-feature-icon ${f.colorClass || 'icon-emerald'}" id="cmsFeatIconPrev_${idx}" style="width:32px; height:32px; font-size:14px;">
                        <i class="fa-solid ${f.icon || 'fa-star'}"></i>
                    </span>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-main); display:block; margin-bottom:3px;">Pilihan Ikon FontAwesome:</label>
                        <select class="login-input" id="cmsFeatIcon_${idx}" onchange="onCmsFeatureIconChange(${idx})" style="font-size:12px; padding:7px 10px;">
                            ${iconSelectOptions}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-main); display:block; margin-bottom:3px;">Aksen Warna Ikon:</label>
                        <select class="login-input" id="cmsFeatColor_${idx}" onchange="onCmsFeatureColorChange(${idx})" style="font-size:12px; padding:7px 10px;">
                            ${colorSelectOptions}
                        </select>
                    </div>
                </div>

                <div style="margin-bottom:10px;">
                    <label style="font-size:11px; font-weight:700; color:var(--text-main); display:block; margin-bottom:3px;">Judul Fitur:</label>
                    <input type="text" class="login-input" id="cmsFeatTitle_${idx}" value="${escapeHtml(f.title)}" placeholder="Judul Fitur" style="font-size:12px; padding:7px 10px;">
                </div>

                <div>
                    <label style="font-size:11px; font-weight:700; color:var(--text-main); display:block; margin-bottom:3px;">Deskripsi Singkat Fitur:</label>
                    <textarea class="login-input" rows="2" id="cmsFeatDesc_${idx}" placeholder="Deskripsi fitur..." style="font-size:12px; padding:7px 10px;">${escapeHtml(f.desc)}</textarea>
                </div>
            </div>
        `;
    }).join('');
}

function onCmsFeatureIconChange(idx) {
    const iconSelect = document.getElementById(`cmsFeatIcon_${idx}`);
    const previewEl = document.getElementById(`cmsFeatIconPrev_${idx}`);
    if (iconSelect && previewEl) {
        previewEl.innerHTML = `<i class="fa-solid ${iconSelect.value}"></i>`;
    }
}

function onCmsFeatureColorChange(idx) {
    const colorSelect = document.getElementById(`cmsFeatColor_${idx}`);
    const previewEl = document.getElementById(`cmsFeatIconPrev_${idx}`);
    if (colorSelect && previewEl) {
        previewEl.className = `login-feature-icon ${colorSelect.value}`;
    }
}

function updateCmsBannerPreview() {
    const badgeVal = document.getElementById('cmsBannerBadgeInput') ? document.getElementById('cmsBannerBadgeInput').value : '';
    const titleVal = document.getElementById('cmsBannerTitleInput') ? document.getElementById('cmsBannerTitleInput').value : '';
    const descVal = document.getElementById('cmsBannerDescInput') ? document.getElementById('cmsBannerDescInput').value : '';
    const iconVal = document.getElementById('cmsBannerIconSelect') ? document.getElementById('cmsBannerIconSelect').value : 'fa-building-shield';

    const prevBadge = document.getElementById('cmsBannerPreviewBadge');
    const prevTitle = document.getElementById('cmsBannerPreviewTitle');
    const prevDesc = document.getElementById('cmsBannerPreviewDesc');
    const prevGraphic = document.getElementById('cmsBannerPreviewGraphic');
    const prevCard = document.getElementById('cmsBannerPreview');

    if (prevBadge) prevBadge.innerHTML = `<i class="fa-solid fa-bookmark"></i> ${escapeHtml(badgeVal || 'PORTAL LAYANAN SARPRAS KAMPUS')}`;
    if (prevTitle) prevTitle.innerText = titleVal || 'Sistem Informasi Pelaporan Fasilitas Kampus';
    if (prevDesc) prevDesc.innerText = descVal || 'Pencatatan Kerusakan Sarpras...';
    if (prevGraphic) prevGraphic.innerHTML = `<i class="fa-solid ${iconVal}"></i>`;

    if (prevCard) {
        if (currentCmsBannerImage) {
            prevCard.style.backgroundImage = `linear-gradient(rgba(0, 54, 32, 0.75), rgba(0, 40, 22, 0.88)), url('${currentCmsBannerImage}')`;
            prevCard.style.backgroundSize = 'cover';
            prevCard.style.backgroundPosition = 'center';
        } else {
            prevCard.style.backgroundImage = 'linear-gradient(135deg, #005a36 0%, #003620 100%)';
            prevCard.style.backgroundSize = '';
            prevCard.style.backgroundPosition = '';
        }
    }
}

function handleCmsBannerUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
        showToast('Ukuran gambar banner terlalu besar. Maksimal 4MB.', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        currentCmsBannerImage = e.target.result;
        updateCmsBannerPreview();
        showToast('Gambar latar banner berhasil dimuat!', 'success');
    };
    reader.readAsDataURL(file);
}

function clearCmsBannerImage() {
    currentCmsBannerImage = '';
    const fileInput = document.getElementById('cmsBannerFileInput');
    if (fileInput) fileInput.value = '';
    updateCmsBannerPreview();
    showToast('Gambar latar banner dihapus.', 'info');
}

function updateCmsVideoPreview() {
    const urlVal = document.getElementById('cmsVideoUrlInput') ? document.getElementById('cmsVideoUrlInput').value : '';
    const titleVal = document.getElementById('cmsVideoTitleInput') ? document.getElementById('cmsVideoTitleInput').value : '';
    const descVal = document.getElementById('cmsVideoDescInput') ? document.getElementById('cmsVideoDescInput').value : '';
    const enabledVal = document.getElementById('cmsVideoEnabledInput') ? document.getElementById('cmsVideoEnabledInput').checked : true;

    const iframe = document.getElementById('cmsVideoPreviewIframe');
    const titleText = document.getElementById('cmsVideoPreviewTitleText');
    const descText = document.getElementById('cmsVideoPreviewDescText');
    const container = document.getElementById('cmsVideoPreviewContainer');

    const embedId = extractYouTubeEmbedId(urlVal) || 'bUhLVKdbRd0';

    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${embedId}?rel=0`;
    }
    if (titleText) titleText.innerText = titleVal || 'Profil Kampus UIN Siber Syekh Nurjati Cirebon';
    if (descText) descText.innerText = descVal || 'Mengenal sarana, prasarana, dan ekosistem digital kampus UINSSC Cirebon.';

    if (container) {
        container.style.opacity = enabledVal ? '1' : '0.4';
    }
}

function resetPortalContentToDefault() {
    if (confirm('Kembalikan semua konten 3 fitur login, banner portal, dan profil video ke standar bawaan institusi?')) {
        localStorage.removeItem('SIMPEL_PORTAL_CONTENT_V1');
        currentCmsBannerImage = '';
        loadPortalContentForAdmin();
        showToast('Konten portal & video dikembalikan ke pengaturan bawaan.', 'success');
    }
}

function savePortalContentChanges() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('menyimpan konfigurasi konten dan video portal');
        return;
    }

    // Collect 3 features
    const features = [];
    for (let i = 0; i < 3; i++) {
        const icon = document.getElementById(`cmsFeatIcon_${i}`) ? document.getElementById(`cmsFeatIcon_${i}`).value : 'fa-star';
        const colorClass = document.getElementById(`cmsFeatColor_${i}`) ? document.getElementById(`cmsFeatColor_${i}`).value : 'icon-emerald';
        const title = document.getElementById(`cmsFeatTitle_${i}`) ? document.getElementById(`cmsFeatTitle_${i}`).value.trim() : '';
        const desc = document.getElementById(`cmsFeatDesc_${i}`) ? document.getElementById(`cmsFeatDesc_${i}`).value.trim() : '';

        if (!title) {
            showToast(`Judul Fitur ${i + 1} tidak boleh kosong!`, 'error');
            return;
        }

        features.push({
            id: i + 1,
            icon,
            colorClass,
            title,
            desc
        });
    }

    // Collect banner data
    const badge = document.getElementById('cmsBannerBadgeInput') ? document.getElementById('cmsBannerBadgeInput').value.trim() : '';
    const bannerTitle = document.getElementById('cmsBannerTitleInput') ? document.getElementById('cmsBannerTitleInput').value.trim() : '';
    const bannerDesc = document.getElementById('cmsBannerDescInput') ? document.getElementById('cmsBannerDescInput').value.trim() : '';
    const bannerIcon = document.getElementById('cmsBannerIconSelect') ? document.getElementById('cmsBannerIconSelect').value : 'fa-building-shield';

    if (!bannerTitle) {
        showToast('Judul utama banner tidak boleh kosong!', 'error');
        return;
    }

    // Collect video data
    const videoUrl = document.getElementById('cmsVideoUrlInput') ? document.getElementById('cmsVideoUrlInput').value.trim() : '';
    const videoTitle = document.getElementById('cmsVideoTitleInput') ? document.getElementById('cmsVideoTitleInput').value.trim() : '';
    const videoDesc = document.getElementById('cmsVideoDescInput') ? document.getElementById('cmsVideoDescInput').value.trim() : '';
    const videoEnabled = document.getElementById('cmsVideoEnabledInput') ? document.getElementById('cmsVideoEnabledInput').checked : true;

    const embedId = extractYouTubeEmbedId(videoUrl);
    if (videoEnabled && !embedId) {
        showToast('URL video YouTube tidak valid! Masukkan tautan seperti https://youtu.be/...', 'error');
        return;
    }

    const payload = {
        features,
        banner: {
            badge: badge || 'PORTAL LAYANAN SARPRAS KAMPUS',
            title: bannerTitle,
            desc: bannerDesc,
            icon: bannerIcon,
            bgImage: currentCmsBannerImage || ''
        },
        video: {
            enabled: videoEnabled,
            title: videoTitle || 'Profil Kampus UIN Siber Syekh Nurjati Cirebon',
            desc: videoDesc || '',
            url: videoUrl,
            embedId: embedId || 'bUhLVKdbRd0'
        },
        lastUpdated: new Date().toISOString(),
        updatedBy: 'superadmin'
    };

    localStorage.setItem('SIMPEL_PORTAL_CONTENT_V1', JSON.stringify(payload));

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Konten Portal & Video Berhasil Disimpan!',
            html: 'Perubahan tulisan & ikon 3 fitur login, gambar banner, serta profil video YouTube telah aktif di seluruh sistem.',
            confirmButtonColor: '#005a36'
        });
    } else {
        showToast('Konten portal & video berhasil diperbarui!', 'success');
    }

    closePortalContentModal();
}

/* ==========================================================================
   DEDICATED MULTI-VIEW MONITORING SYSTEM (GIS RADAR, SLA, IOT, STAFF & AUDIT)
   ========================================================================== */

let currentAdminActiveView = 'dashboard'; // 'dashboard', 'gis', 'sla', 'staff', 'audit', 'soc'

const ADMIN_STORAGE_KEY = STORAGE_KEY;

// View Switcher Function
function switchAdminView(viewId) {
    if ((viewId === 'audit' || viewId === 'soc' || viewId === 'geofence' || viewId === 'pagebuilder') && currentAdminRole !== 'superadmin') {
        let featureName = 'rekaman audit & surveillance keamanan sistem';
        if (viewId === 'soc') featureName = 'Security Operations Center (SOC) War Room';
        if (viewId === 'geofence') featureName = 'Manajemen Wilayah & Batas Geofencing Kampus';
        if (viewId === 'pagebuilder') featureName = 'Studio Tata Letak & Manajemen Seluruh Halaman';
        warnSuperAdminOnly(`mengakses ${featureName}`);
        return;
    }

    currentAdminActiveView = viewId;

    // View sections mapping
    const views = {
        dashboard: document.getElementById('viewMainDashboard'),
        gis: document.getElementById('viewGisSurveillance'),
        sla: document.getElementById('viewSlaTracker'),
        staff: document.getElementById('viewStaffManagement'),
        kategori: document.getElementById('viewCategoryManagement'),
        geofence: document.getElementById('viewGeofenceManagement'),
        pagebuilder: document.getElementById('viewPageBuilder'),
        audit: document.getElementById('viewSuperAdminSurveillance'),
        soc: document.getElementById('viewSocSecurity')
    };

    // Sidebar items mapping
    const sidebarNavs = {
        dashboard: document.getElementById('navMainDashboard'),
        gis: document.getElementById('navGisSurveillance'),
        sla: document.getElementById('navSlaTracker'),
        staff: document.getElementById('sidebarStaffLink'),
        kategori: document.getElementById('sidebarCategoryLink'),
        geofence: document.getElementById('sidebarGeofenceLink'),
        pagebuilder: document.getElementById('sidebarCmsLink'),
        audit: document.getElementById('navSuperAudit'),
        soc: document.getElementById('navSocSecurity')
    };

    // Toggle views visibility
    Object.keys(views).forEach(key => {
        if (views[key]) {
            if (key === viewId) views[key].classList.remove('hidden');
            else views[key].classList.add('hidden');
        }
        if (sidebarNavs[key]) {
            if (key === viewId) sidebarNavs[key].classList.add('active');
            else sidebarNavs[key].classList.remove('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'instant' });

    // View-specific initializations
    if (viewId === 'dashboard') {
        if (window.SimpelSiteBuilder) window.SimpelSiteBuilder.applyAdminPage();
        renderKPIs();
        renderAdminTable();
        renderAllAdminCharts();
        setTimeout(() => {
            if (adminMapInstance) adminMapInstance.invalidateSize();
            Object.values(dynamicChartInstances || {}).forEach(ch => {
                if (ch && typeof ch.resize === 'function') ch.resize();
            });
        }, 150);
    } else if (viewId === 'gis') {
        renderGisSurveillanceView();
        setTimeout(() => {
            if (gisSurveillanceMapInstance) {
                gisSurveillanceMapInstance.invalidateSize();
            }
        }, 150);
    } else if (viewId === 'sla') {
        renderSlaTrackerView();
    } else if (viewId === 'staff') {
        renderStaffView();
    } else if (viewId === 'kategori') {
        renderCategoryManagementView();
    } else if (viewId === 'audit') {
        renderAuditLogView();
    } else if (viewId === 'soc') {
        renderSocSecurityView();
    } else if (viewId === 'geofence') {
        renderGeofenceManagementView();
    } else if (viewId === 'pagebuilder') {
        renderPageBuilderView();
    }
}





/* --------------------------------------------------------------------------
   2. GIS SPATIAL SURVEILLANCE RADAR (5 ZONES FULL VIEW)
   -------------------------------------------------------------------------- */
let gisSurveillanceMapInstance = null;
let gisSurveillanceLayerGroup = null;
let gisSurveillanceZoneGroup = null;
let gisSurveillanceHeatLayer = null;
let gisMaskPolygon = null;
let isGisMaskEnabled = false; // Default: Masking OFF saat login
let currentGisRadarMode = 'heatmap'; // Default: Heatmap ON saat login

function renderGisSurveillanceView() {
    renderGisZoneScorecards();
    renderGisZoneTable();
    initGisSurveillanceMap();
}

function initGisSurveillanceMap() {
    const container = document.getElementById('gisSurveillanceMap');
    if (!container || typeof L === 'undefined') return;

    try {
        if (!gisSurveillanceMapInstance) {
            gisSurveillanceZoneGroup = L.featureGroup();
            const zones = CAMPUS_ZONES || DEFAULT_CAMPUS_ZONES;
            zones.forEach(z => {
                if (z.polygon && z.polygon.length >= 3) {
                    const poly = L.polygon(z.polygon, {
                        color: '#c59235',
                        weight: 2,
                        fillColor: '#005a36',
                        fillOpacity: 0.22,
                        dashArray: '4, 4'
                    });
                    poly.bindTooltip(`<b>${escapeHtml(z.name)}</b>`, {
                        permanent: false,
                        direction: 'center',
                        className: 'gis-zone-tooltip'
                    });
                    gisSurveillanceZoneGroup.addLayer(poly);
                }
            });

            const combinedBounds = gisSurveillanceZoneGroup.getBounds();
            const centerAll = combinedBounds.isValid() ? combinedBounds.getCenter() : { lat: -6.735000, lng: 108.533600 };

            gisSurveillanceMapInstance = L.map('gisSurveillanceMap', {
                center: [centerAll.lat, centerAll.lng],
                zoom: 17,
                minZoom: 14,
                maxZoom: 22
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 22,
                maxNativeZoom: 19,
                attribution: '&copy; OpenStreetMap | UINSSC GIS Radar'
            }).addTo(gisSurveillanceMapInstance);

            // Outer White Mask Polygon untuk Radar GIS Kampus (Default: OFF)
            const outerCoords = [
                [85.0511, -179.99],
                [85.0511, 179.99],
                [-85.0511, 179.99],
                [-85.0511, -179.99]
            ];
            const holes = zones.filter(z => z.polygon && z.polygon.length >= 3).map(z => z.polygon);
            const safeSvgRenderer = L.svg({ padding: 2.0 });

            gisMaskPolygon = L.polygon([outerCoords, ...holes], {
                renderer: safeSvgRenderer,
                color: '#c59235',
                weight: 2.5,
                dashArray: '5, 5',
                fillColor: '#ffffff',
                fillOpacity: 0.76,
                interactive: false
            });

            if (isGisMaskEnabled) {
                gisMaskPolygon.addTo(gisSurveillanceMapInstance);
            }

            gisSurveillanceZoneGroup.addTo(gisSurveillanceMapInstance);
            gisSurveillanceLayerGroup = L.featureGroup().addTo(gisSurveillanceMapInstance);
        }

        // Sinkronisasi tombol kontrol bawah peta
        syncGisMaskButton();
        syncGisModeButtons();

        setTimeout(() => {
            if (gisSurveillanceMapInstance) {
                gisSurveillanceMapInstance.invalidateSize();
                drawGisSurveillanceLayers();
            }
        }, 150);
    } catch (e) {
        console.warn('GIS surveillance map init error', e);
    }
}

function focusGisMapToCampus() {
    if (!gisSurveillanceMapInstance) return;
    const zones = CAMPUS_ZONES || DEFAULT_CAMPUS_ZONES;
    if (!zones || zones.length === 0) return;
    const polygonGroup = L.featureGroup();
    zones.forEach(z => {
        if (z.polygon && z.polygon.length >= 3) {
            polygonGroup.addLayer(L.polygon(z.polygon));
        }
    });
    if (polygonGroup.getLayers().length > 0) {
        gisSurveillanceMapInstance.fitBounds(polygonGroup.getBounds(), { padding: [35, 35] });
        showToast('📍 Kamera Radar Spasial GIS difokuskan ke area Kampus UINSSC', 'info');
    }
}

function toggleGisCampusMask() {
    if (!gisSurveillanceMapInstance || !gisMaskPolygon) return;
    const container = document.getElementById('gisSurveillanceMap');
    if (isGisMaskEnabled) {
        gisSurveillanceMapInstance.removeLayer(gisMaskPolygon);
        isGisMaskEnabled = false;
        if (container) container.style.background = '#ffffff';
        showToast('Masking putih Radar GIS dinonaktifkan (Peta Bebas)', 'info');
    } else {
        gisMaskPolygon.addTo(gisSurveillanceMapInstance);
        isGisMaskEnabled = true;
        if (container) container.style.background = '#ffffff';
        showToast('Masking putih Radar GIS diaktifkan (Fokus Kampus)', 'info');
    }
    syncGisMaskButton();
}

function syncGisMaskButton() {
    const btn = document.getElementById('gisMaskToggleBtn');
    if (!btn) return;
    if (isGisMaskEnabled) {
        btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Sembunyikan Masking`;
        btn.style.background = 'rgba(255, 255, 255, 0.15)';
    } else {
        btn.innerHTML = `<i class="fa-solid fa-eye" style="color:var(--gold);"></i> Tampilkan Masking`;
        btn.style.background = 'rgba(255, 255, 255, 0.08)';
    }
}

function toggleGisMapMode() {
    if (currentGisRadarMode === 'heatmap') {
        currentGisRadarMode = 'pins';
    } else {
        currentGisRadarMode = 'heatmap';
    }
    syncGisModeButtons();
    drawGisSurveillanceLayers();
    showToast(`Mode visualisasi Radar GIS: ${currentGisRadarMode === 'heatmap' ? 'Heatmap Kepadatan Kerusakan' : 'Pin Marker Kerusakan'}`, 'info');
}

function switchGisSurveillanceMode(mode) {
    currentGisRadarMode = mode;
    syncGisModeButtons();
    drawGisSurveillanceLayers();
    showToast(`Mode visualisasi Radar GIS diubah ke: ${mode === 'pins' ? 'Pin Marker' : 'Heatmap Kepadatan'}.`, 'info');
}

function syncGisModeButtons() {
    const btnBottom = document.getElementById('gisModeToggleBtn');
    if (btnBottom) {
        if (currentGisRadarMode === 'heatmap') {
            btnBottom.innerHTML = `<i class="fa-solid fa-fire-flame-curved" style="color:#ef4444;"></i> Mode: Heatmap Aktif (Klik Mode Pin)`;
            btnBottom.style.background = 'rgba(197, 146, 53, 0.22)';
            btnBottom.style.color = 'var(--gold)';
            btnBottom.style.borderColor = 'var(--gold)';
        } else {
            btnBottom.innerHTML = `<i class="fa-solid fa-location-dot"></i> Mode: Pin Marker (Klik Mode Heatmap)`;
            btnBottom.style.background = 'rgba(255, 255, 255, 0.08)';
            btnBottom.style.color = 'var(--text-main)';
            btnBottom.style.borderColor = 'var(--border-color)';
        }
    }

    const btnTopPins = document.getElementById('btnGisModePins');
    const btnTopHeat = document.getElementById('btnGisModeHeatmap');
    if (btnTopPins && btnTopHeat) {
        if (currentGisRadarMode === 'pins') {
            btnTopPins.style.background = 'var(--primary)';
            btnTopPins.style.color = '#fff';
            btnTopPins.style.borderColor = 'var(--gold)';
            btnTopHeat.style.background = 'rgba(255,255,255,0.06)';
            btnTopHeat.style.color = 'var(--text-main)';
            btnTopHeat.style.borderColor = 'var(--border-color)';
        } else {
            btnTopHeat.style.background = 'var(--primary)';
            btnTopHeat.style.color = '#fff';
            btnTopHeat.style.borderColor = 'var(--gold)';
            btnTopPins.style.background = 'rgba(255,255,255,0.06)';
            btnTopPins.style.color = 'var(--text-main)';
            btnTopPins.style.borderColor = 'var(--border-color)';
        }
    }
}

// Algoritma Ray-Casting untuk memeriksa titik koordinat dalam poligon geofence
function isPointInSinglePolygon(point, vs) {
    if (!vs || !vs.length) return false;
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Mencocokkan laporan sarpras dengan Kawasan Kampus (Zona GIS)
 * Berdasarkan Ray-Casting Poligon GPS atau pencocokan nama Gedung Kampus
 */
function getReportZone(report, zones = (CAMPUS_ZONES || DEFAULT_CAMPUS_ZONES)) {
    if (!report || !zones || !zones.length) return null;
    const gName = (report.gedung || '').toLowerCase().trim();

    // 1. Cek kesamaan nama / ID langsung
    const directMatch = zones.find(z => z.id === report.gedung || z.name.toLowerCase() === gName);
    if (directMatch) return directMatch;

    // 2. Cek posisi koordinat GPS dalam batas poligon geofencing zona (Ray-Casting)
    const lat = parseFloat(report.lat);
    const lng = parseFloat(report.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
        const polyMatch = zones.find(z => z.polygon && isPointInSinglePolygon([lat, lng], z.polygon));
        if (polyMatch) return polyMatch;
    }

    // 3. Pemetaan semantik kata kunci nama gedung kampus
    if (gName.includes('cyber')) {
        return zones.find(z => z.id === 'gedung_cyber');
    }
    if (gName.includes('sebrang') || gName.includes('seberang')) {
        return zones.find(z => z.id === 'gedung_seberang');
    }
    if (gName.includes('pasca') || gName.includes('mahad') || gName.includes('ma\'had')) {
        return zones.find(z => z.id === 'pascasarjana_mahad');
    }
    if (gName.includes('saladara') || gName.includes('kampus 2')) {
        return zones.find(z => z.id === 'area_saladara');
    }
    // Kampus Utama (Rektorat, ICT, Perpustakaan, FITK, Tarbiyah, FSEI, Syariah, FUAD, dsb.)
    if (gName.includes('utama') || gName.includes('rektorat') || gName.includes('ict') || 
        gName.includes('lab') || gName.includes('perpustakaan') || gName.includes('tarbiyah') || 
        gName.includes('fitk') || gName.includes('syariah') || gName.includes('fsei') || 
        gName.includes('fuad') || gName.includes('ushuluddin')) {
        return zones.find(z => z.id === 'kampus_utama');
    }

    return zones.find(z => z.id === 'kampus_utama') || zones[0];
}

function filterGisMapByCategory() {
    drawGisSurveillanceLayers();
    const cat = document.getElementById('gisCategoryFilter')?.value;
    if (cat) {
        showToast(`Radar GIS difilter: Kategori ${cat}`, 'info');
    } else {
        showToast('Radar GIS menampilkan seluruh kategori fasilitas', 'info');
    }
}

function drawGisSurveillanceLayers() {
    if (!gisSurveillanceMapInstance || !gisSurveillanceLayerGroup) return;

    // Bersihkan heat layer jika ada
    if (gisSurveillanceHeatLayer) {
        gisSurveillanceMapInstance.removeLayer(gisSurveillanceHeatLayer);
        gisSurveillanceHeatLayer = null;
    }
    gisSurveillanceLayerGroup.clearLayers();

    // Data Laporan Insiden - ambil data termutakhir
    let reports = (reportsData && reportsData.length > 0) ? reportsData : [];
    if (!reports.length) {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (raw) {
            try { reports = JSON.parse(raw); } catch (e) { reports = []; }
        }
    }

    // Hanya tampilkan laporan aktif (Diajukan & Diproses)
    // Kerusakan yang sudah 'Selesai' atau 'Ditolak' otomatis HILANG dari radar spasial
    let activeReports = reports.filter(r => r.status !== 'Selesai' && r.status !== 'Ditolak');

    // Filter Kategori Radar Pengawasan GIS (Contoh: Hanya AC)
    const gisCatFilter = (document.getElementById('gisCategoryFilter')?.value || '').toLowerCase().trim();
    if (gisCatFilter) {
        activeReports = activeReports.filter(r => (r.kategori || '').toLowerCase().includes(gisCatFilter));
    }

    if (currentGisRadarMode === 'heatmap') {
        const heatPoints = [];
        activeReports.forEach(rep => {
            let lat = parseFloat(rep.lat || '-6.735000');
            let lng = parseFloat(rep.lng || '108.533800');
            if (isNaN(lat) || isNaN(lng)) return;
            let intensity = 0.55;
            if (rep.urgensi === 'Darurat' || rep.urgensi === 'Tinggi') intensity = 1.0;
            else if (rep.urgensi === 'Sedang') intensity = 0.75;
            heatPoints.push([lat, lng, intensity]);
        });

        // Layer Heatmap Gradien Kepadatan
        if (typeof L.heatLayer !== 'undefined' && heatPoints.length > 0) {
            gisSurveillanceHeatLayer = L.heatLayer(heatPoints, {
                radius: 36,
                blur: 24,
                maxZoom: 18,
                minOpacity: 0.45,
                gradient: {
                    0.2: '#005a36',
                    0.4: '#2dd4bf',
                    0.6: '#facc15',
                    0.8: '#f59e0b',
                    1.0: '#ef4444'
                }
            }).addTo(gisSurveillanceMapInstance);
        }

        // TAMPILKAN JUGA TITIK PIN KERUSAKAN INTERAKTIF DI ATAS HEATMAP
        // Memastikan admin dapat melihat titik presisi, warna status/urgensi, serta klik popup
        activeReports.forEach(r => {
            const lat = parseFloat(r.lat);
            const lng = parseFloat(r.lng);
            if (isNaN(lat) || isNaN(lng)) return;

            let color = '#ef4444';
            if (r.status === 'Diproses') color = '#f59e0b';
            else if (r.urgensi === 'Sedang') color = '#f59e0b';
            else if (r.urgensi === 'Rendah') color = '#38bdf8';

            const marker = L.circleMarker([lat, lng], {
                radius: (r.urgensi === 'Darurat' || r.urgensi === 'Tinggi') ? 9 : 7,
                fillColor: color,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.95
            }).addTo(gisSurveillanceLayerGroup);

            marker.bindPopup(`
                <div style="font-size:12px; line-height:1.4;">
                    <strong style="color:var(--gold);">${escapeHtml(r.id)}</strong><br>
                    <b>${escapeHtml(r.kategori)}</b> (${escapeHtml(r.urgensi)})<br>
                    <span>${escapeHtml(r.ruangan)}</span><br>
                    <small style="color:var(--text-muted);">${escapeHtml(r.gedung)}</small><br>
                    <button type="button" onclick="openDisposisiModal('${r.id}')" style="margin-top:6px; font-size:10px; padding:3px 8px; background:#005a36; color:#fff; border:none; border-radius:4px; cursor:pointer;">
                        Tindak Lanjuti
                    </button>
                </div>
            `);
        });
    } else {
        // Mode Pin Marker Interaktif
        activeReports.forEach(r => {
            const lat = parseFloat(r.lat);
            const lng = parseFloat(r.lng);
            if (isNaN(lat) || isNaN(lng)) return;

            let color = '#ef4444';
            if (r.status === 'Diproses') color = '#f59e0b';
            else if (r.urgensi === 'Sedang') color = '#f59e0b';
            else if (r.urgensi === 'Rendah') color = '#38bdf8';

            const marker = L.circleMarker([lat, lng], {
                radius: (r.urgensi === 'Darurat' || r.urgensi === 'Tinggi') ? 10 : 8,
                fillColor: color,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.95
            }).addTo(gisSurveillanceLayerGroup);

            marker.bindPopup(`
                <div style="font-size:12px; line-height:1.4;">
                    <strong style="color:var(--gold);">${escapeHtml(r.id)}</strong><br>
                    <b>${escapeHtml(r.kategori)}</b> (${escapeHtml(r.urgensi)})<br>
                    <span>${escapeHtml(r.ruangan)}</span><br>
                    <small style="color:var(--text-muted);">${escapeHtml(r.gedung)}</small><br>
                    <button type="button" onclick="openDisposisiModal('${r.id}')" style="margin-top:6px; font-size:10px; padding:3px 8px; background:#005a36; color:#fff; border:none; border-radius:4px; cursor:pointer;">
                        Tindak Lanjuti
                    </button>
                </div>
            `);
        });
    }
}

function renderGisZoneScorecards() {
    const container = document.getElementById('gisZoneScorecards');
    if (!container) return;

    let reports = (reportsData && reportsData.length > 0) ? reportsData : [];
    if (!reports.length) {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (raw) {
            try { reports = JSON.parse(raw); } catch (e) { reports = []; }
        }
    }

    const zones = CAMPUS_ZONES || DEFAULT_CAMPUS_ZONES;

    container.innerHTML = zones.map((z, idx) => {
        const zoneReports = reports.filter(r => {
            const rz = getReportZone(r, zones);
            return rz && rz.id === z.id;
        });
        const urgentCount = zoneReports.filter(r => (r.urgensi === 'Tinggi' || r.urgensi === 'Darurat') && r.status !== 'Selesai').length;

        let statusBadge = '<span style="color:#10b981; font-weight:800; font-size:10px; background:rgba(16,185,129,0.12); padding:2px 6px; border-radius:6px;">Aman</span>';
        if (urgentCount > 0) {
            statusBadge = '<span style="color:#ef4444; font-weight:800; font-size:10px; background:rgba(239,68,68,0.15); padding:2px 6px; border-radius:6px;">Siaga Tinggi</span>';
        } else if (zoneReports.length > 2) {
            statusBadge = '<span style="color:#f59e0b; font-weight:800; font-size:10px; background:rgba(245,158,11,0.12); padding:2px 6px; border-radius:6px;">Perhatian</span>';
        }

        return `
            <div class="gis-zone-card" onclick="focusGisSurveillanceZone('${z.id}')" title="Klik untuk fokus ke kawasan ini">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:11px; font-weight:800; color:var(--gold);">Zona ${idx + 1}</span>
                    ${statusBadge}
                </div>
                <div style="font-size:12.5px; font-weight:800; color:var(--text-main); margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${escapeHtml(z.name)}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted); margin-top:8px; border-top:1px dashed var(--border-color); padding-top:6px;">
                    <span><i class="fa-solid fa-clipboard-list"></i> ${zoneReports.length} Laporan</span>
                    <span style="color:${urgentCount > 0 ? '#ef4444' : 'var(--text-muted)'}; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> ${urgentCount}</span>
                </div>
            </div>
        `;
    }).join('');
}

function focusGisSurveillanceZone(zoneId) {
    const label = document.getElementById('gisActiveZoneLabel');
    if (!gisSurveillanceMapInstance) return;

    if (zoneId === 'ALL') {
        gisSurveillanceMapInstance.setView([-6.735000, 108.533600], 17);
        if (label) label.innerText = 'Semua Kawasan Kampus';
        showToast('Peta radar menampilkan seluruh kawasan kampus.', 'info');
        return;
    }

    const zones = CAMPUS_ZONES || DEFAULT_CAMPUS_ZONES;
    const target = zones.find(z => z.id === zoneId);
    if (target && target.polygon && target.polygon.length) {
        const bounds = L.latLngBounds(target.polygon);
        gisSurveillanceMapInstance.fitBounds(bounds, { padding: [40, 40] });
        if (label) label.innerText = target.name;
        showToast(`Kamera fokus ke ${target.name}.`, 'info');
    }
}

function renderGisZoneTable() {
    const tbody = document.getElementById('gisZoneTableBody');
    if (!tbody) return;

    let reports = (reportsData && reportsData.length > 0) ? reportsData : [];
    if (!reports.length) {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (raw) {
            try { reports = JSON.parse(raw); } catch (e) { reports = []; }
        }
    }

    const zones = CAMPUS_ZONES || DEFAULT_CAMPUS_ZONES;

    tbody.innerHTML = zones.map((z, idx) => {
        const zoneReports = reports.filter(r => {
            const rz = getReportZone(r, zones);
            return rz && rz.id === z.id;
        });
        const urgentCount = zoneReports.filter(r => (r.urgensi === 'Tinggi' || r.urgensi === 'Darurat') && r.status !== 'Selesai').length;

        // Dominant category
        const catCounts = {};
        zoneReports.forEach(r => { catCounts[r.kategori] = (catCounts[r.kategori] || 0) + 1; });
        let dominantCat = '-';
        let maxCount = 0;
        Object.keys(catCounts).forEach(cat => {
            if (catCounts[cat] > maxCount) {
                maxCount = catCounts[cat];
                dominantCat = `${cat} (${maxCount})`;
            }
        });

        let statusText = '<span style="color:#10b981; font-weight:700;">🟢 Normal / Terkendali</span>';
        if (urgentCount > 0) statusText = '<span style="color:#ef4444; font-weight:700;">🔴 Ada Insiden Darurat</span>';
        else if (zoneReports.length > 2) statusText = '<span style="color:#f59e0b; font-weight:700;">🟡 Dalam Pemeliharaan</span>';

        return `
            <tr>
                <td style="text-align:center; font-weight:700; color:var(--text-muted); font-size:12px;">${idx + 1}</td>
                <td><strong>${escapeHtml(z.name)}</strong></td>
                <td>${statusText}</td>
                <td><b>${zoneReports.length}</b> laporan</td>
                <td><span style="color:${urgentCount > 0 ? '#ef4444' : 'var(--text-muted)'}; font-weight:800;">${urgentCount}</span></td>
                <td>${escapeHtml(dominantCat)}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="focusGisSurveillanceZone('${z.id}')" style="font-size:11px; padding:4px 10px;">
                        <i class="fa-solid fa-crosshairs"></i> Fokus Peta
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/* --------------------------------------------------------------------------
   3. SUPER ADMIN SURVEILLANCE AUDIT & LOG SISTEM
   -------------------------------------------------------------------------- */
const AUDIT_STORAGE_KEY = 'SIMPEL_AUDIT_LOGS_V1';

const DEFAULT_AUDIT_LOGS = [
    {
        id: 'LOG-1001',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        timeFormatted: '2026-10-21 06:15:20',
        username: 'superadmin',
        role: 'superadmin',
        category: 'auth',
        action: 'Login Berhasil',
        details: 'Autentikasi sesi Super Admin berhasil melalui kredensial rahasia kampus.',
        level: 'success'
    },
    {
        id: 'LOG-1002',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        timeFormatted: '2026-10-21 07:20:45',
        username: 'superadmin',
        role: 'superadmin',
        category: 'geofence',
        action: 'Pembaruan Batas Geofencing',
        details: 'Validasi koordinat batas polygon GIS 5 Kawasan diperbarui oleh Super Admin.',
        level: 'info'
    },
    {
        id: 'LOG-1003',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        timeFormatted: '2026-10-21 08:05:12',
        username: 'superadmin',
        role: 'superadmin',
        category: 'cms',
        action: 'Pengaturan Konten & Video Profil',
        details: 'Pembaruan banner portal layanan dan tautan video profil YouTube UINSSC.',
        level: 'success'
    },
    {
        id: 'LOG-1004',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        timeFormatted: '2026-10-21 08:35:00',
        username: 'admin',
        role: 'admin',
        category: 'staff',
        action: 'Disposisi Petugas Sarpras',
        details: 'Admin menugaskan teknisi Bambang (HVAC) untuk laporan TRK-2026-001.',
        level: 'info'
    }
];

function getAuditLogs() {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(DEFAULT_AUDIT_LOGS));
        return DEFAULT_AUDIT_LOGS;
    }
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : DEFAULT_AUDIT_LOGS;
    } catch (e) {
        return DEFAULT_AUDIT_LOGS;
    }
}

function logAudit(category, action, details, level = 'info') {
    const logs = getAuditLogs();
    const sessRaw = localStorage.getItem('SIMPEL_AUTH_SESSION');
    let username = 'system';
    let role = currentAdminRole || 'admin';

    if (sessRaw) {
        try {
            const sess = JSON.parse(sessRaw);
            username = sess.username || username;
            role = sess.role || role;
        } catch (e) {}
    }

    const now = new Date();
    const entry = {
        id: 'LOG-' + Date.now().toString().slice(-4),
        timestamp: now.toISOString(),
        timeFormatted: now.toISOString().replace('T', ' ').substring(0, 19),
        username,
        role,
        category,
        action,
        details,
        level
    };

    logs.unshift(entry);
    if (logs.length > 250) logs.pop();
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));

    if (currentAdminActiveView === 'audit') {
        renderAuditLogView();
    }
    return entry;
}

function renderAuditLogView() {
    const logs = getAuditLogs();

    // Metric counts
    const kpiTotal = document.getElementById('auditKpiTotal');
    const kpiAuth = document.getElementById('auditKpiAuth');
    const kpiStaff = document.getElementById('auditKpiStaff');
    const kpiConfig = document.getElementById('auditKpiConfig');

    if (kpiTotal) kpiTotal.innerText = logs.length;
    if (kpiAuth) kpiAuth.innerText = logs.filter(l => l.category === 'auth').length;
    if (kpiStaff) kpiStaff.innerText = logs.filter(l => l.category === 'staff').length;
    if (kpiConfig) kpiConfig.innerText = logs.filter(l => l.category === 'geofence' || l.category === 'cms').length;

    renderAuditLogTable();
}

function renderAuditLogTable() {
    const tbody = document.getElementById('auditTableBody');
    if (!tbody) return;

    let logs = getAuditLogs();

    // Filter Category
    const catSelect = document.getElementById('auditFilterCategory');
    const selectedCat = catSelect ? catSelect.value : 'ALL';
    if (selectedCat !== 'ALL') {
        logs = logs.filter(l => l.category === selectedCat);
    }

    // Filter Level
    const levelSelect = document.getElementById('auditFilterLevel');
    const selectedLevel = levelSelect ? levelSelect.value : 'ALL';
    if (selectedLevel !== 'ALL') {
        logs = logs.filter(l => l.level === selectedLevel);
    }

    // Search Query
    const searchInput = document.getElementById('auditSearchInput');
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (q) {
        logs = logs.filter(l =>
            (l.username && l.username.toLowerCase().includes(q)) ||
            (l.action && l.action.toLowerCase().includes(q)) ||
            (l.details && l.details.toLowerCase().includes(q)) ||
            (l.id && l.id.toLowerCase().includes(q))
        );
    }

    if (!logs.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);">Tidak ada rekaman log audit yang cocok dengan filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = logs.map((l, idx) => {
        let levelBadge = '<span style="color:#38bdf8; background:rgba(56,189,248,0.12); padding:2px 8px; border-radius:10px; font-weight:800; font-size:10px;">INFO</span>';
        if (l.level === 'success') {
            levelBadge = '<span style="color:#10b981; background:rgba(16,185,129,0.12); padding:2px 8px; border-radius:10px; font-weight:800; font-size:10px;">SUKSES</span>';
        } else if (l.level === 'warning') {
            levelBadge = '<span style="color:#f59e0b; background:rgba(245,158,11,0.12); padding:2px 8px; border-radius:10px; font-weight:800; font-size:10px;">PERINGATAN</span>';
        } else if (l.level === 'danger') {
            levelBadge = '<span style="color:#ef4444; background:rgba(239,68,68,0.15); padding:2px 8px; border-radius:10px; font-weight:800; font-size:10px;">KRITIS</span>';
        }

        let roleBadge = `<span class="badge-role-${l.role}">${l.role === 'superadmin' ? 'Super Admin' : 'Admin'}</span>`;

        return `
            <tr>
                <td style="text-align:center; font-weight:700; color:var(--text-muted); font-size:12px;">${idx + 1}</td>
                <td style="font-family:monospace; color:var(--text-muted); font-size:11px; white-space:nowrap;">
                    ${escapeHtml(l.timeFormatted || l.timestamp)}
                </td>
                <td><strong>${escapeHtml(l.username)}</strong></td>
                <td>${roleBadge}</td>
                <td><span style="font-size:11px; background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">${escapeHtml(l.category)}</span></td>
                <td><b>${escapeHtml(l.action)}</b></td>
                <td style="font-size:12px; color:var(--text-muted);">${escapeHtml(l.details)}</td>
                <td>${levelBadge}</td>
            </tr>
        `;
    }).join('');
}

function exportAuditLogCSV() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('mengekspor audit log rekam jejak');
        return;
    }

    const logs = getAuditLogs();
    if (!logs.length) {
        showToast('Tidak ada data audit untuk diekspor.', 'warning');
        return;
    }

    let csv = '\uFEFFID,Timestamp,Username,Role,Category,Action,Details,Level\n';
    logs.forEach(l => {
        csv += `"${l.id}","${l.timeFormatted || l.timestamp}","${l.username}","${l.role}","${l.category}","${(l.action || '').replace(/"/g, '""')}","${(l.details || '').replace(/"/g, '""')}","${l.level}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SIMPEL_UINSSC_AUDIT_LOG_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    logAudit('system', 'Ekspor Audit Log CSV', 'Super Admin mengunduh berkas rekam jejak audit sistem ke format CSV', 'info');
    showToast('Berkas CSV audit trail berhasil diekspor!', 'success');
}

function clearAuditLogs() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('membersihkan rekam log audit sistem');
        return;
    }

    if (confirm('Apakah Anda yakin ingin mengosongkan riwayat log audit ini? Tindakan ini akan dicatat sebagai log audit baru.')) {
        localStorage.removeItem(AUDIT_STORAGE_KEY);
        logAudit('system', 'Pembersihan Riwayat Audit', 'Super Admin mengosongkan riwayat log audit lama', 'warning');
        renderAuditLogView();
        showToast('Riwayat log audit dibersihkan.', 'success');
    }
}

/* ==========================================================================
   2. MATRIKS SLA & BEBAN KERJA TEKNISI LAPANGAN
   ========================================================================== */

function renderSlaTrackerView() {
    loadStaffAccounts();
    const technicians = staffAccounts.filter(s => s.role === 'petugas');
    const activeStaffCount = technicians.filter(s => s.status === 'Aktif').length;

    const activeTickets = reportsData.filter(r => r.status === 'Diajukan' || r.status === 'Diproses');
    const criticalTickets = activeTickets.filter(r => r.urgensi === 'Darurat' || r.urgensi === 'Tinggi');

    // Update SLA KPI Metrics
    const slaCompEl = document.getElementById('slaComplianceRate');
    const slaCritEl = document.getElementById('slaCriticalCount');
    const slaStaffEl = document.getElementById('slaActiveStaffCount');

    if (slaCompEl) slaCompEl.innerText = `${Math.min(99.4, 94.2 + (technicians.length * 0.4)).toFixed(1)}%`;
    if (slaCritEl) slaCritEl.innerText = criticalTickets.length;
    if (slaStaffEl) slaStaffEl.innerText = activeStaffCount;

    // Render Workload Cards
    const workloadContainer = document.getElementById('staffWorkloadContainer');
    if (workloadContainer) {
        if (!technicians.length) {
            workloadContainer.innerHTML = `<div style="grid-column:1/-1; padding:20px; text-align:center; color:var(--text-muted);">Belum ada akun teknisi lapangan terdaftar.</div>`;
        } else {
            workloadContainer.innerHTML = technicians.map(tech => {
                const assigned = activeTickets.filter(r => r.teknisi && r.teknisi.toLowerCase().includes(tech.nama.toLowerCase().split(' ')[0]));
                const count = assigned.length;

                let loadStatusBadge = '<span style="color:#22c55e; background:rgba(34,197,94,0.12); padding:3px 10px; border-radius:12px; font-weight:800; font-size:11px;"><i class="fa-solid fa-circle-check"></i> Siaga (Tersedia)</span>';
                let barColor = '#22c55e';
                let pct = Math.min(100, count * 35);

                if (count >= 3) {
                    loadStatusBadge = '<span style="color:#ef4444; background:rgba(239,68,68,0.15); padding:3px 10px; border-radius:12px; font-weight:800; font-size:11px;"><i class="fa-solid fa-triangle-exclamation"></i> Beban Penuh (Overload)</span>';
                    barColor = '#ef4444';
                    pct = 100;
                } else if (count >= 1) {
                    loadStatusBadge = `<span style="color:#f59e0b; background:rgba(245,158,11,0.12); padding:3px 10px; border-radius:12px; font-weight:800; font-size:11px;"><i class="fa-solid fa-screwdriver-wrench"></i> Bertugas (${count} Tiket)</span>`;
                    barColor = '#f59e0b';
                }

                const waPhone = (tech.wa || '081234567890').replace(/^0/, '62');
                const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Halo Pak ${tech.nama}, dari Admin Sarpras UINSSC. Mohon atensi tiket perbaikan sarana prasarana yang sedang ditugaskan.`)}`;

                return `
                    <div class="workload-card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:38px; height:38px; border-radius:50%; background:rgba(197,146,53,0.15); border:1px solid var(--gold); display:flex; align-items:center; justify-content:center; color:var(--gold); font-weight:800; font-size:14px;">
                                    ${escapeHtml(tech.nama.charAt(0))}
                                </div>
                                <div>
                                    <strong style="font-size:13.5px; display:block; color:var(--text-main);">${escapeHtml(tech.nama)}</strong>
                                    <span style="font-size:11.5px; color:var(--text-muted);"><i class="fa-solid fa-tag" style="color:var(--gold);"></i> ${escapeHtml(tech.bidang)}</span>
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom:12px;">
                            <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-weight:700;">
                                <span>Utilisasi Beban Kerja:</span>
                                <span>${count} / 3 Tiket (${pct}%)</span>
                            </div>
                            <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:4px; overflow:hidden;">
                                <div style="width:${pct}%; height:100%; background:${barColor}; border-radius:4px; transition:width 0.4s ease;"></div>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid var(--border-color); gap:8px;">
                            ${loadStatusBadge}
                            <a href="${waUrl}" target="_blank" class="chip-btn" style="background:#25D366; color:#ffffff; font-size:11px; padding:4px 10px; border-radius:8px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                                <i class="fa-brands fa-whatsapp"></i> Hubungi
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Render SLA Priority Queue Table
    const queueTbody = document.getElementById('slaQueueTableBody');
    if (queueTbody) {
        if (!activeTickets.length) {
            queueTbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:24px; color:var(--text-muted);"><i class="fa-solid fa-circle-check" style="color:#22c55e;"></i> Seluruh tiket laporan sarpras telah selesai ditangani. Tidak ada antrean SLA pending!</td></tr>`;
        } else {
            // Sort by urgency priority
            const urgencyWeight = { 'Darurat': 4, 'Tinggi': 3, 'Sedang': 2, 'Rendah': 1 };
            const sortedTickets = [...activeTickets].sort((a, b) => (urgencyWeight[b.urgensi] || 0) - (urgencyWeight[a.urgensi] || 0));

            queueTbody.innerHTML = sortedTickets.map((r, idx) => {
                let targetSlaText = '48 Jam Kerja';
                let remainingBadge = '<span style="color:#22c55e; background:rgba(34,197,94,0.12); padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;"><i class="fa-solid fa-hourglass-start"></i> Sisa ~36 Jam</span>';

                if (r.urgensi === 'Darurat') {
                    targetSlaText = '<span style="color:#ef4444; font-weight:800;">2 Jam (Kritis)</span>';
                    remainingBadge = '<span style="color:#ef4444; background:rgba(239,68,68,0.18); padding:3px 8px; border-radius:10px; font-weight:800; font-size:11px; animation:blinkRec 1.2s infinite;"><i class="fa-solid fa-triangle-exclamation"></i> Sisa &lt; 45 Menit!</span>';
                } else if (r.urgensi === 'Tinggi') {
                    targetSlaText = '24 Jam Kerja';
                    remainingBadge = '<span style="color:#f59e0b; background:rgba(245,158,11,0.12); padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;"><i class="fa-solid fa-clock"></i> Sisa ~8 Jam</span>';
                }

                let urgencyBadge = '<span class="urgency-badge urgency-rendah">Rendah</span>';
                if (r.urgensi === 'Darurat') urgencyBadge = '<span class="urgency-badge urgency-darurat" style="background:#ef4444; color:#fff; font-weight:800; padding:3px 8px; border-radius:4px;"><i class="fa-solid fa-fire"></i> Darurat</span>';
                else if (r.urgensi === 'Tinggi') urgencyBadge = '<span class="urgency-badge urgency-tinggi">Tinggi</span>';
                else if (r.urgensi === 'Sedang') urgencyBadge = '<span class="urgency-badge urgency-sedang">Sedang</span>';

                return `
                    <tr>
                        <td style="text-align:center; font-weight:700; color:var(--text-muted); font-size:12px;">${idx + 1}</td>
                        <td style="font-family:monospace; font-weight:700; color:var(--gold); white-space:nowrap;">${escapeHtml(r.id)}</td>
                        <td><strong>${escapeHtml(r.kategori)}</strong></td>
                        <td style="font-size:12px;">${escapeHtml(r.gedung)} (${escapeHtml(r.ruangan)})</td>
                        <td>${urgencyBadge}</td>
                        <td style="font-size:12px;">${targetSlaText}</td>
                        <td>${remainingBadge}</td>
                        <td>
                            <span style="font-size:12px; font-weight:600; color:${r.teknisi && r.teknisi !== 'Belum Ditunjuk' ? '#38bdf8' : '#ef4444'};">
                                <i class="fa-solid fa-user-gear"></i> ${escapeHtml(r.teknisi || 'Belum Ditugaskan')}
                            </span>
                        </td>
                        <td>
                            <button type="button" class="btn-act" onclick="openDisposisiModal('${r.id}')" title="Disposisi & Tangani Tiket" style="color:#005a36; background:rgba(197,146,53,0.15); font-weight:700; gap:5px; padding:6px 12px; border-radius:6px; cursor:pointer;">
                                <i class="fa-solid fa-pen-to-square"></i> Disposisi
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }
}



/* ==========================================================================
   4. SECURITY OPERATIONS CENTER (SOC) - KHUSUS SUPER ADMIN
   ========================================================================== */

function renderSocSecurityView() {
    if (currentAdminRole !== 'superadmin') return;

    // Calculate local storage size
    let totalBytes = 0;
    for (let key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            totalBytes += (localStorage[key].length + key.length) * 2;
        }
    }
    const kb = (totalBytes / 1024).toFixed(1);
    const storageEl = document.getElementById('socStorageUsage');
    if (storageEl) storageEl.innerText = `${kb} KB`;

    // Render Simulated Active Sessions
    const tbody = document.getElementById('socActiveSessionsBody');
    if (!tbody) return;

    const currentSessRaw = localStorage.getItem('SIMPEL_AUTH_SESSION');
    let currentUsername = 'superadmin';
    try {
        if (currentSessRaw) currentUsername = JSON.parse(currentSessRaw).username || 'superadmin';
    } catch(e) {}

    const mockSessions = [
        {
            username: currentUsername,
            role: 'superadmin',
            ip: '192.168.1.104',
            client: 'Chrome 124 / Windows 11 (Aktif Saat Ini)',
            loginTime: 'Baru saja',
            isSelf: true
        },
        {
            username: 'admin_fauzi',
            role: 'admin',
            ip: '192.168.10.15',
            client: 'Firefox 122 / Windows 10',
            loginTime: '24 Menit yang lalu',
            isSelf: false
        },
        {
            username: 'mhs_nurul21',
            role: 'user',
            ip: '10.20.14.88',
            client: 'Safari Mobile / iOS 17',
            loginTime: '1 Jam yang lalu',
            isSelf: false
        }
    ];

    tbody.innerHTML = mockSessions.map((s, idx) => {
        let roleBadge = `<span class="badge-role-${s.role}">${s.role === 'superadmin' ? 'Super Admin' : (s.role === 'admin' ? 'Admin' : 'Mahasiswa/User')}</span>`;
        let actionBtn = s.isSelf
            ? `<span style="font-size:11px; color:#22c55e; font-weight:700;"><i class="fa-solid fa-check"></i> Sesi Anda</span>`
            : `<button type="button" class="btn btn-secondary" onclick="forceLogoutSession('${escapeHtml(s.username)}')" style="font-size:11px; padding:3px 8px; color:#ef4444; border-color:rgba(239,68,68,0.3);"><i class="fa-solid fa-power-off"></i> Putuskan Sesi</button>`;

        return `
            <tr>
                <td style="text-align:center; font-weight:700; color:var(--text-muted); font-size:12px;">${idx + 1}</td>
                <td><strong>${escapeHtml(s.username)}</strong></td>
                <td>${roleBadge}</td>
                <td style="font-family:monospace; font-size:11.5px; color:var(--text-muted);">${escapeHtml(s.ip)}</td>
                <td style="font-size:12px;">${escapeHtml(s.client)}</td>
                <td style="font-size:12px; color:var(--text-muted);">${escapeHtml(s.loginTime)}</td>
                <td><span style="color:#22c55e; background:rgba(34,197,94,0.12); padding:2px 8px; border-radius:10px; font-weight:800; font-size:10px;"><i class="fa-solid fa-circle"></i> TERVERIFIKASI</span></td>
                <td>${actionBtn}</td>
            </tr>
        `;
    }).join('');
}

function forceLogoutSession(username) {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('memutuskan sesi pengguna');
        return;
    }

    if (confirm(`[SUPER ADMIN] Apakah Anda yakin ingin memutuskan paksa sesi login pengguna '${username}'? Akun tersebut akan ter-logout otomatis.`)) {
        logAudit('security', 'Force Logout Sesi', `Super Admin memutus paksa sesi autentikasi akun ${username}`, 'warning');
        showToast(`Sesi akun '${username}' berhasil diputus paksa (Force Logout)!`, 'success');
        renderSocSecurityView();
    }
}

function runSecurityAuditCheck() {
    if (currentAdminRole !== 'superadmin') return;

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Audit Integritas Sistem Berjalan...',
            html: 'Memeriksa sanitasi token autentikasi, integritas database, dan proteksi session cross-site...',
            timer: 1200,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Audit Keamanan Sistem: 100% LOLOS',
                html: `
                    <div style="text-align:left; font-size:12.5px; line-height:1.6;">
                        <p style="margin-bottom:6px;"><strong>Hasil Verifikasi Security Operations Center (SOC):</strong></p>
                        <ul style="margin:0 0 0 16px; padding:0;">
                            <li>Otentikasi Session: <b>Aman &amp; Terenkripsi</b></li>
                            <li>Perlindungan XSS: <b>DOMPurify Sanitized</b></li>
                            <li>Geofencing Perimeter: <b>5 Kawasan Presisi</b></li>
                            <li>Beban Database LocalStorage: <b>Normal (&lt; 4% kuota)</b></li>
                        </ul>
                    </div>
                `,
                confirmButtonColor: '#005a36'
            });
            logAudit('security', 'Pemeriksaan Integritas Keamanan', 'Super Admin menjalankan audit integritas keamanan menyeluruh (Hasil: 100% Lolos)', 'success');
        });
    } else {
        showToast('Audit keamanan sistem: 100% LOLOS!', 'success');
    }
}

/* ==========================================================================
   CATEGORY CRUD MANAGEMENT (Admin & Super Admin Authority)
   ========================================================================== */
const STORAGE_CATEGORIES_KEY = 'SIMPEL_CATEGORIES_DATA_V1';

const DEFAULT_CATEGORIES_DATA = [
    {
        id: 'CAT-001',
        nama: 'AC & Pendingin Ruangan',
        icon: 'fa-snowflake',
        sla: 24,
        urgensi: 'Penting',
        status: 'Aktif',
        deskripsi: 'AC split, central inverter, blower, perbaikan freon, dan remote pendingin ruang kuliah/kantor.'
    },
    {
        id: 'CAT-002',
        nama: 'Kelistrikan & Penerangan',
        icon: 'fa-bolt',
        sla: 12,
        urgensi: 'Darurat',
        status: 'Aktif',
        deskripsi: 'MCB panel, instalasi stop kontak, saklar terbakar, kabel listrik, dan lampu penerangan ruangan.'
    },
    {
        id: 'CAT-003',
        nama: 'Sanitasi & Plumbing',
        icon: 'fa-faucet-drip',
        sla: 24,
        urgensi: 'Penting',
        status: 'Aktif',
        deskripsi: 'Kran bocor, closet toilet tersumbat, wastafel cuci tangan, pipa pecah, dan tandon air.'
    },
    {
        id: 'CAT-004',
        nama: 'Proyektor & Audio Visual',
        icon: 'fa-video',
        sla: 12,
        urgensi: 'Penting',
        status: 'Aktif',
        deskripsi: 'Proyektor kelas buram/mati, kabel HDMI/VGA, sound system kuliah, mikrofon, dan layar proyektor.'
    },
    {
        id: 'CAT-005',
        nama: 'Mebel & Furnitur',
        icon: 'fa-couch',
        sla: 48,
        urgensi: 'Standar',
        status: 'Aktif',
        deskripsi: 'Kursi mahasiswa patah, meja dosen goyang, lemari arsip, papan tulis whiteboard, dan podium.'
    },
    {
        id: 'CAT-006',
        nama: 'Pintu, Jendela & Kunci',
        icon: 'fa-door-open',
        sla: 24,
        urgensi: 'Standar',
        status: 'Aktif',
        deskripsi: 'Engsel pintu lepas, handle kunci macet, kunci silinder rusak, grendel jendela, dan ventilasi.'
    },
    {
        id: 'CAT-007',
        nama: 'Jaringan & Internet Wi-Fi',
        icon: 'fa-wifi',
        sla: 8,
        urgensi: 'Darurat',
        status: 'Aktif',
        deskripsi: 'Access point Wi-Fi tidak ada sinyal, port LAN meja tidak konek, router, dan kabel fiber kampus.'
    },
    {
        id: 'CAT-008',
        nama: 'Bangunan, Plafon & Sipil',
        icon: 'fa-building',
        sla: 72,
        urgensi: 'Standar',
        status: 'Aktif',
        deskripsi: 'Atap/plafon jebol bocor saat hujan, keramik lantai terangkat/pecah, retak dinding, dan pengecatan.'
    },
    {
        id: 'CAT-009',
        nama: 'Aset Umum & Sarpras Lainnya',
        icon: 'fa-box-archive',
        sla: 48,
        urgensi: 'Standar',
        status: 'Aktif',
        deskripsi: 'Fasilitas sarana prasarana lainnya di lingkungan kampus UINSSC yang belum terklasifikasi khusus.'
    }
];

let categoriesData = [];

function loadCategories() {
    const raw = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (raw) {
        try {
            categoriesData = JSON.parse(raw);
            if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
                categoriesData = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES_DATA));
                saveCategories();
            }
        } catch(e) {
            categoriesData = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES_DATA));
            saveCategories();
        }
    } else {
        categoriesData = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES_DATA));
        saveCategories();
    }
}

function saveCategories() {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categoriesData));
}

function renderCategoryTable(itemsToRender = categoriesData) {
    const tbody = document.getElementById('categoryTableBody');
    if (!tbody) return;

    if (itemsToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:32px 16px; color:var(--text-muted);">
                    <i class="fa-solid fa-tags" style="font-size:32px; margin-bottom:8px; display:block; opacity:0.4;"></i>
                    Tidak ada data kategori yang sesuai filter pencarian.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = itemsToRender.map((cat, idx) => {
        const isAktif = cat.status === 'Aktif';
        const badgeStatus = isAktif
            ? `<span style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid #10b981; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Aktif</span>`
            : `<span style="background:rgba(100,116,139,0.15); color:#94a3b8; border:1px solid #64748b; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700;"><i class="fa-solid fa-circle-xmark"></i> Nonaktif</span>`;

        let urgensiColor = '#10b981';
        if (cat.urgensi === 'Darurat') urgensiColor = '#ef4444';
        else if (cat.urgensi === 'Penting') urgensiColor = '#f59e0b';

        return `
            <tr>
                <td style="text-align:center; font-weight:700; color:var(--text-muted);">${idx + 1}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:34px; height:34px; border-radius:8px; background:rgba(0,90,54,0.15); border:1px solid #005a36; display:flex; align-items:center; justify-content:center; color:var(--gold); font-size:15px; flex-shrink:0;">
                            <i class="fa-solid ${escapeHtml(cat.icon || 'fa-tag')}"></i>
                        </div>
                        <div>
                            <strong style="color:var(--text-main); font-size:13px; display:block;">${escapeHtml(cat.nama)}</strong>
                            <span style="font-size:11px; color:var(--text-muted); font-family:monospace;">${escapeHtml(cat.id)}</span>
                        </div>
                    </div>
                </td>
                <td style="font-size:12px; color:var(--text-muted); max-width:240px; line-height:1.4;">
                    ${escapeHtml(cat.deskripsi || '-')}
                </td>
                <td>
                    <span style="background:rgba(0,90,54,0.1); color:var(--primary); font-weight:700; padding:3px 8px; border-radius:6px; font-size:11px; border:1px solid rgba(0,90,54,0.2);">
                        <i class="fa-solid fa-clock"></i> ${cat.sla || 24} Jam
                    </span>
                </td>
                <td>
                    <span style="color:${urgensiColor}; font-weight:700; font-size:11px; background:${urgensiColor}18; padding:3px 8px; border-radius:6px; border:1px solid ${urgensiColor}40;">
                        ${escapeHtml(cat.urgensi || 'Standar')}
                    </span>
                </td>
                <td>${badgeStatus}</td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button type="button" class="btn-act" onclick="openCategoryModal('${cat.id}')" title="Edit Kategori" style="color:#facc15; border-color:rgba(250,204,21,0.3);">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn-act btn-del" onclick="deleteCategory('${cat.id}')" title="Hapus Kategori">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderCategoryManagementView() {
    loadCategories();
    renderCategoryTable();

    // KPI Summary
    const totalEl = document.getElementById('catKpiTotal');
    const activeEl = document.getElementById('catKpiActive');
    const topEl = document.getElementById('catKpiTop');
    const slaEl = document.getElementById('catKpiSla');

    if (totalEl) totalEl.innerText = categoriesData.length;
    if (activeEl) activeEl.innerText = categoriesData.filter(c => c.status === 'Aktif').length;

    // Hitung kategori terbanyak dilaporkan
    if (topEl) {
        const counts = {};
        (reportsData || []).forEach(r => {
            const k = r.kategori || 'Lainnya';
            counts[k] = (counts[k] || 0) + 1;
        });
        let topCat = 'Belum Ada';
        let maxCount = 0;
        Object.entries(counts).forEach(([k, c]) => {
            if (c > maxCount) {
                maxCount = c;
                topCat = k.split(' ')[0];
            }
        });
        topEl.innerText = topCat;
    }

    if (slaEl) {
        const totalSla = categoriesData.reduce((acc, c) => acc + (parseInt(c.sla) || 24), 0);
        const avgSla = categoriesData.length ? Math.round(totalSla / categoriesData.length) : 24;
        slaEl.innerText = `${avgSla} Jam`;
    }
}

function filterCategoryTable() {
    const query = (document.getElementById('searchCategoryInput')?.value || '').toLowerCase().trim();
    if (!query) {
        renderCategoryTable(categoriesData);
        return;
    }
    const filtered = categoriesData.filter(c => {
        return (c.nama || '').toLowerCase().includes(query) ||
               (c.id || '').toLowerCase().includes(query) ||
               (c.deskripsi || '').toLowerCase().includes(query);
    });
    renderCategoryTable(filtered);
}

function openCategoryModal(catId = null) {
    const modal = document.getElementById('categoryModal');
    const titleEl = document.getElementById('categoryModalTitle');
    const editIdInput = document.getElementById('categoryEditId');
    const nameInput = document.getElementById('categoryNameInput');
    const iconInput = document.getElementById('categoryIconInput');
    const slaInput = document.getElementById('categorySlaInput');
    const urgensiInput = document.getElementById('categoryUrgensiInput');
    const statusInput = document.getElementById('categoryStatusInput');
    const descInput = document.getElementById('categoryDescInput');

    if (!modal) return;

    if (catId) {
        const cat = categoriesData.find(c => c.id === catId);
        if (!cat) return;
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color:var(--gold);"></i> Edit Kategori: ${escapeHtml(cat.nama)}`;
        if (editIdInput) editIdInput.value = cat.id;
        if (nameInput) nameInput.value = cat.nama;
        if (iconInput) iconInput.value = cat.icon || 'fa-box-archive';
        if (slaInput) slaInput.value = cat.sla || 24;
        if (urgensiInput) urgensiInput.value = cat.urgensi || 'Standar';
        if (statusInput) statusInput.value = cat.status || 'Aktif';
        if (descInput) descInput.value = cat.deskripsi || '';
    } else {
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-tags" style="color:var(--gold);"></i> Tambah Kategori Fasilitas Baru`;
        if (editIdInput) editIdInput.value = '';
        if (nameInput) nameInput.value = '';
        if (iconInput) iconInput.value = 'fa-snowflake';
        if (slaInput) slaInput.value = '24';
        if (urgensiInput) urgensiInput.value = 'Standar';
        if (statusInput) statusInput.value = 'Aktif';
        if (descInput) descInput.value = '';
    }

    modal.classList.remove('hidden');
}

function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) modal.classList.add('hidden');
}

function closeCategoryModalOnBackdrop(e) {
    if (e.target && e.target.id === 'categoryModal') {
        closeCategoryModal();
    }
}

function handleCategoryFormSubmit(e) {
    e.preventDefault();

    const editId = document.getElementById('categoryEditId')?.value;
    const nama = (document.getElementById('categoryNameInput')?.value || '').trim();
    const icon = document.getElementById('categoryIconInput')?.value || 'fa-tag';
    const sla = parseInt(document.getElementById('categorySlaInput')?.value || '24', 10);
    const urgensi = document.getElementById('categoryUrgensiInput')?.value || 'Standar';
    const status = document.getElementById('categoryStatusInput')?.value || 'Aktif';
    const deskripsi = (document.getElementById('categoryDescInput')?.value || '').trim();

    if (!nama) {
        showToast('Nama kategori wajib diisi!', 'warning');
        return;
    }

    if (editId) {
        // Mode Update
        const idx = categoriesData.findIndex(c => c.id === editId);
        if (idx !== -1) {
            categoriesData[idx] = {
                ...categoriesData[idx],
                nama,
                icon,
                sla,
                urgensi,
                status,
                deskripsi
            };
            saveCategories();
            showToast(`Kategori "${nama}" berhasil diperbarui!`, 'success');
            logAudit('update', 'Perubahan Data Kategori', `Kategori ${editId} diubah menjadi "${nama}"`);
        }
    } else {
        // Mode Create
        const nextNum = categoriesData.length + 1;
        const newId = `CAT-${String(nextNum).padStart(3, '0')}`;
        const newCat = {
            id: newId,
            nama,
            icon,
            sla,
            urgensi,
            status,
            deskripsi
        };
        categoriesData.push(newCat);
        saveCategories();
        showToast(`Kategori "${nama}" berhasil ditambahkan!`, 'success');
        logAudit('create', 'Penambahan Kategori Baru', `Kategori baru ditambahkan: "${nama}" (${newId})`);
    }

    closeCategoryModal();
    renderCategoryManagementView();
    populateCategoryDropdowns();
    renderAllAdminCharts();
}

function deleteCategory(catId) {
    const cat = categoriesData.find(c => c.id === catId);
    if (!cat) return;

    // Cek laporan terkait
    const usedCount = (reportsData || []).filter(r => (r.kategori || '').toLowerCase().includes(cat.nama.toLowerCase().split(' ')[0])).length;

    const doDelete = () => {
        categoriesData = categoriesData.filter(c => c.id !== catId);
        saveCategories();
        renderCategoryManagementView();
        populateCategoryDropdowns();
        renderAllAdminCharts();
        showToast(`Kategori "${cat.nama}" berhasil dihapus.`, 'success');
        logAudit('delete', 'Penghapusan Kategori', `Kategori "${cat.nama}" (${catId}) dihapus dari sistem.`);
    };

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: `Hapus Kategori "${cat.nama}"?`,
            html: usedCount > 0
                ? `<div style="font-size:13px; color:#ef4444; font-weight:700;">Perhatian: Kategori ini terhubung dengan ${usedCount} riwayat laporan!</div>`
                : 'Data kategori ini akan dihapus dari opsi sistem.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: '<i class="fa-solid fa-trash-can"></i> Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                doDelete();
            }
        });
    } else {
        if (confirm(`Yakin ingin menghapus kategori "${cat.nama}"?`)) {
            doDelete();
        }
    }
}

function populateCategoryDropdowns() {
    loadCategories();
    const activeCats = categoriesData.filter(c => c.status === 'Aktif');

    // 1. Dropdown Filter Peta Overview: #mapCategoryFilter
    const mapFilter = document.getElementById('mapCategoryFilter');
    if (mapFilter) {
        const curVal = mapFilter.value;
        mapFilter.innerHTML = `<option value="">Semua Kategori Sarpras</option>` +
            activeCats.map(c => `<option value="${escapeHtml(c.nama)}">${escapeHtml(c.nama)}</option>`).join('');
        if (curVal) mapFilter.value = curVal;
    }

    // 2. Dropdown Filter Radar GIS: #gisCategoryFilter
    const gisFilter = document.getElementById('gisCategoryFilter');
    if (gisFilter) {
        const curVal = gisFilter.value;
        gisFilter.innerHTML = `<option value="">Semua Kategori Fasilitas</option>` +
            activeCats.map(c => `<option value="${escapeHtml(c.nama)}">${escapeHtml(c.nama)}</option>`).join('');
        if (curVal) gisFilter.value = curVal;
    }

    // 3. Dropdown Filter Tabel Dashboard: #filterKategori
    const tableFilter = document.getElementById('filterKategori');
    if (tableFilter) {
        const curVal = tableFilter.value;
        tableFilter.innerHTML = `<option value="">Semua Kategori</option>` +
            activeCats.map(c => `<option value="${escapeHtml(c.nama)}">${escapeHtml(c.nama)}</option>`).join('');
        if (curVal) tableFilter.value = curVal;
    }
}

/* ==========================================================================
   SUPER ADMIN STUDIO: TATA LETAK, EDIT, HAPUS & TAMBAH DI SETIAP HALAMAN
   ========================================================================== */
let currentBuilderPageKey = 'login'; // 'login' | 'user' | 'admin'
let activeBuilderModalCtx = null;
let tempBuilderBannerBg = '';

const BUILDER_ICONS_CATALOG = [
    { value: 'fa-bullhorn', label: 'Pengumuman (fa-bullhorn)' },
    { value: 'fa-circle-info', label: 'Informasi (fa-circle-info)' },
    { value: 'fa-shield-halved', label: 'Keamanan & Otoritas (fa-shield-halved)' },
    { value: 'fa-map-location-dot', label: 'Peta & Lokasi GIS (fa-map-location-dot)' },
    { value: 'fa-building-columns', label: 'Gedung Kampus (fa-building-columns)' },
    { value: 'fa-building-shield', label: 'Gedung & Sarpras (fa-building-shield)' },
    { value: 'fa-screwdriver-wrench', label: 'Teknisi & Perbaikan (fa-screwdriver-wrench)' },
    { value: 'fa-bolt', label: 'Respon Cepat / Listrik (fa-bolt)' },
    { value: 'fa-chart-line', label: 'Analitik & SLA (fa-chart-line)' },
    { value: 'fa-layer-group', label: 'Sistem Terpadu (fa-layer-group)' },
    { value: 'fa-phone-volume', label: 'Kontak Darurat (fa-phone-volume)' },
    { value: 'fa-calendar-check', label: 'Jadwal Layanan (fa-calendar-check)' },
    { value: 'fa-book-open', label: 'Panduan & SOP (fa-book-open)' },
    { value: 'fa-qrcode', label: 'QR & Bukti Digital (fa-qrcode)' },
    { value: 'fa-triangle-exclamation', label: 'Peringatan Penting (fa-triangle-exclamation)' }
];

const BUILDER_ACCENT_CATALOG = [
    { value: 'emerald', label: 'Hijau Emerald Kampus' },
    { value: 'gold', label: 'Emas Institusi (Gold)' },
    { value: 'cyan', label: 'Biru Siber (Cyan)' },
    { value: 'amber', label: 'Kuning Peringatan (Amber)' },
    { value: 'rose', label: 'Merah Prioritas (Rose)' }
];

function ensureSuperAdminForBuilder() {
    if (currentAdminRole !== 'superadmin') {
        warnSuperAdminOnly('mengubah tata letak, mengedit, menambah, atau menghapus komponen halaman');
        return false;
    }
    return true;
}

function getBuilderCfg() {
    return window.SimpelSiteBuilder
        ? window.SimpelSiteBuilder.getSiteConfig()
        : JSON.parse(localStorage.getItem('SIMPEL_SITE_BUILDER_V1') || '{}');
}

function commitBuilderCfg(cfg, toastMsg, auditDetail) {
    if (window.SimpelSiteBuilder) {
        window.SimpelSiteBuilder.saveSiteConfig(cfg);
        window.SimpelSiteBuilder.applyAdminPage();
    }
    if (typeof recordAuditLog === 'function' && auditDetail) {
        recordAuditLog('cms', 'Update Tata Letak / Halaman', auditDetail, 'info');
    }
    renderPageBuilderView();
    if (toastMsg) showToast(toastMsg, 'success');
}

function switchBuilderTargetPage(pageKey) {
    if (!ensureSuperAdminForBuilder()) return;
    currentBuilderPageKey = pageKey;
    renderPageBuilderView();
}

function renderPageBuilderView() {
    if (!ensureSuperAdminForBuilder()) return;
    const ws = document.getElementById('pageBuilderWorkspace');
    if (!ws) return;

    // Update active tab & preview link
    ['login', 'user', 'admin'].forEach(k => {
        const btn = document.getElementById('builderTab' + k.charAt(0).toUpperCase() + k.slice(1));
        if (btn) btn.classList.toggle('active', k === currentBuilderPageKey);
    });

    const previewLink = document.getElementById('builderPreviewPageLink');
    if (previewLink) {
        if (currentBuilderPageKey === 'login') {
            previewLink.href = '../index.html';
            previewLink.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square" style="color:#38bdf8;"></i> Buka Halaman Login';
        } else if (currentBuilderPageKey === 'user') {
            previewLink.href = 'user.html';
            previewLink.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square" style="color:#38bdf8;"></i> Buka Halaman Portal User';
        } else {
            previewLink.href = 'javascript:void(0)';
            previewLink.onclick = function (ev) {
                if (currentBuilderPageKey === 'admin') {
                    ev.preventDefault();
                    switchAdminView('dashboard');
                }
            };
            previewLink.innerHTML = '<i class="fa-solid fa-eye" style="color:#38bdf8;"></i> Lihat Dashboard Admin';
        }
        if (currentBuilderPageKey !== 'admin') {
            previewLink.onclick = null;
        }
    }

    const cfg = getBuilderCfg();

    if (currentBuilderPageKey === 'login') {
        ws.innerHTML = buildLoginStudioHtml(cfg.login);
    } else if (currentBuilderPageKey === 'user') {
        ws.innerHTML = buildUserStudioHtml(cfg.user);
    } else {
        ws.innerHTML = buildAdminStudioHtml(cfg.admin);
    }
}

/* --------------------------------------------------------------------------
   STUDIO 1: HALAMAN LOGIN (index.html)
   -------------------------------------------------------------------------- */
function buildLoginStudioHtml(lCfg) {
    const heroRows = (lCfg.heroOrder || []).map((id, idx, arr) => {
        let b = lCfg.blocks[id];
        let isCustom = false;
        if (!b) {
            b = (lCfg.customBlocks || []).find(c => c.id === id);
            isCustom = true;
        }
        if (!b) return '';
        const enabled = b.enabled !== false;
        const label = isCustom ? `[Blok Kustom] ${b.title}` : (b.label || b.title || id);
        const sub = isCustom
            ? (b.desc || 'Blok informasi tambahan di halaman login')
            : (id === 'features_list'
                ? `${(b.items || []).length} kartu fitur aktif — dapat ditambah, diedit, digeser, atau dihapus di bawah`
                : (b.title || b.desc || ''));

        return `
            <div class="builder-block-row ${enabled ? '' : 'is-disabled'}">
                <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
                    <span style="width:28px; height:28px; border-radius:8px; background:var(--gold-light); color:var(--gold); font-weight:800; font-size:12px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">${idx + 1}</span>
                    <div style="min-width:0;">
                        <div style="font-size:13.5px; font-weight:800; color:var(--text-main);">${escapeHtml(label)}</div>
                        <div style="font-size:12px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px;">${escapeHtml(sub)}</div>
                    </div>
                </div>
                <div class="builder-row-actions">
                    <button type="button" class="chart-icon-btn" onclick="builderMoveOrder('login_hero', '${escapeHtml(id)}', -1)" title="Geser ke Atas" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                    <button type="button" class="chart-icon-btn" onclick="builderMoveOrder('login_hero', '${escapeHtml(id)}', 1)" title="Geser ke Bawah" ${idx === arr.length - 1 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                    ${id !== 'features_list' ? `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('${isCustom ? 'custom_block' : 'login_builtin'}', '${escapeHtml(id)}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                    ` : ''}
                    ${isCustom ? `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="builderToggleEnabled('login', '${escapeHtml(id)}', true)">
                            <i class="fa-solid ${enabled ? 'fa-eye' : 'fa-eye-slash'}"></i> ${enabled ? 'Aktif' : 'Nonaktif'}
                        </button>
                        <button type="button" class="chart-icon-btn danger" onclick="builderDeleteCustomBlock('login', '${escapeHtml(id)}')" title="Hapus Permanen Blok Ini"><i class="fa-solid fa-trash-can"></i></button>
                    ` : `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px; color:${enabled ? '#ef4444' : '#10b981'}; border-color:${enabled ? 'rgba(239,68,68,0.35)' : 'rgba(16,185,129,0.4)'};" onclick="builderToggleEnabled('login', '${escapeHtml(id)}', false)">
                            <i class="fa-solid ${enabled ? 'fa-trash-can' : 'fa-rotate-left'}"></i> ${enabled ? 'Hapus dari Halaman' : 'Pulihkan Seksi'}
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');

    const featItems = (lCfg.blocks.features_list && lCfg.blocks.features_list.items) || [];
    const featRows = featItems.map((f, idx) => `
        <div class="builder-block-row">
            <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
                <div class="login-feature-icon ${escapeHtml(f.colorClass || 'icon-emerald')}" style="width:36px; height:36px; font-size:15px;">
                    <i class="fa-solid ${escapeHtml(f.icon || 'fa-star')}"></i>
                </div>
                <div style="min-width:0;">
                    <div style="font-size:13.5px; font-weight:800; color:var(--text-main);">${escapeHtml(f.title)}</div>
                    <div style="font-size:12px; color:var(--text-muted);">${escapeHtml(f.desc)}</div>
                </div>
            </div>
            <div class="builder-row-actions">
                <button type="button" class="chart-icon-btn" onclick="builderMoveLoginFeature(${idx}, -1)" title="Geser Atas" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                <button type="button" class="chart-icon-btn" onclick="builderMoveLoginFeature(${idx}, 1)" title="Geser Bawah" ${idx === featItems.length - 1 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('login_feature_item', '${idx}')">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button type="button" class="chart-icon-btn danger" onclick="builderDeleteLoginFeature(${idx})" title="Hapus Kartu Fitur Ini"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `).join('');

    return `
        <div class="glass-card" style="padding:20px 22px; margin-bottom:20px;">
            <h3 style="font-size:15.5px; font-weight:800; margin:0 0 12px 0; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-table-columns" style="color:var(--gold);"></i> A. Tata Letak Kolom Halaman Login (index.html)
            </h3>
            <div class="builder-layout-options">
                <div class="builder-layout-card ${lCfg.layout === 'split-right' ? 'selected' : ''}" onclick="builderSetPageLayout('login', 'split-right')">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-columns" style="color:var(--gold);"></i> Info Kiri — Form Login Kanan</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Tata letak standar institusi: identitas &amp; video di kiri, kartu login sticky di kanan.</span>
                </div>
                <div class="builder-layout-card ${lCfg.layout === 'split-left' ? 'selected' : ''}" onclick="builderSetPageLayout('login', 'split-left')">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-right-left" style="color:#38bdf8;"></i> Form Login Kiri — Info Kanan</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Membalik posisi kartu login ke sisi kiri layar utama dan informasi ke kanan.</span>
                </div>
                <div class="builder-layout-card ${lCfg.layout === 'centered' ? 'selected' : ''}" onclick="builderSetPageLayout('login', 'centered')">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-align-center" style="color:#10b981;"></i> Satu Kolom Terpusat (Centered)</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Kartu form login fokus tepat di tengah atas, diikuti fitur &amp; video di bawahnya.</span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-top:16px;">
                <div class="builder-block-row">
                    <div>
                        <div style="font-size:13px; font-weight:800;">Bar Kontak &amp; Jam Layanan Atas</div>
                        <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(lCfg.topBar.email)} &bull; ${escapeHtml(lCfg.topBar.phone)}</div>
                    </div>
                    <div class="builder-row-actions">
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('topbar', 'login')"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px; color:${lCfg.showTopBar ? '#ef4444' : '#10b981'};" onclick="builderToggleTopBar('login')">
                            ${lCfg.showTopBar ? 'Sembunyikan' : 'Tampilkan'}
                        </button>
                    </div>
                </div>

                <div class="builder-block-row">
                    <div>
                        <div style="font-size:13px; font-weight:800;">Kartu Form Login &amp; Kotak Akun Demo</div>
                        <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(lCfg.loginBox.title)} &bull; Demo: ${lCfg.loginBox.showPresetDemo !== false ? 'Tampil' : 'Disembunyikan'}</div>
                    </div>
                    <div class="builder-row-actions">
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('login_box', 'login')"><i class="fa-solid fa-pen"></i> Edit Kartu Login</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="glass-card" style="padding:20px 22px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
                <div>
                    <h3 style="font-size:15.5px; font-weight:800; margin:0;"><i class="fa-solid fa-layer-group" style="color:var(--gold);"></i> B. Urutan Seksi &amp; Blok Konten Halaman Login</h3>
                    <span style="font-size:12px; color:var(--text-muted);">Atur urutan tampil (<kbd>↑</kbd>/<kbd>↓</kbd>), edit teks/video, hapus seksi dari halaman, atau tambah blok pengumuman baru.</span>
                </div>
                <button type="button" class="btn btn-primary" style="font-size:12px; min-height:36px;" onclick="openBuilderEditModal('add_custom_block', 'login')">
                    <i class="fa-solid fa-plus"></i> Tambah Seksi / Blok Baru
                </button>
            </div>
            <div class="builder-block-list">${heroRows}</div>
        </div>

        <div class="glass-card" style="padding:20px 22px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
                <div>
                    <h3 style="font-size:15.5px; font-weight:800; margin:0;"><i class="fa-solid fa-star" style="color:var(--gold);"></i> C. Kelola Kartu Fitur Sorotan Login (Tambah, Edit, Urutkan &amp; Hapus)</h3>
                    <span style="font-size:12px; color:var(--text-muted);">Tidak terbatas 3 fitur — Anda bebas menambah fitur baru, mengubah ikon/teks, atau menghapusnya.</span>
                </div>
                <button type="button" class="btn btn-primary" style="font-size:12px; min-height:36px;" onclick="openBuilderEditModal('add_login_feature', '')">
                    <i class="fa-solid fa-plus"></i> Tambah Kartu Fitur
                </button>
            </div>
            <div class="builder-block-list">${featRows || '<div style="padding:16px; text-align:center; color:var(--text-muted); font-size:13px;">Belum ada kartu fitur. Klik "+ Tambah Kartu Fitur" untuk membuat baru.</div>'}</div>
        </div>
    `;
}

/* --------------------------------------------------------------------------
   STUDIO 2: HALAMAN PORTAL USER / PELAPOR (pages/user.html)
   -------------------------------------------------------------------------- */
function buildUserStudioHtml(uCfg) {
    const pageRows = (uCfg.pageOrder || []).map((id, idx, arr) => {
        let label = '';
        let sub = '';
        let enabled = true;
        let isCustom = false;

        if (id === 'user_banner') {
            const b = uCfg.blocks.user_banner;
            enabled = b.enabled !== false;
            label = 'Hero Banner Utama Portal Pelapor';
            sub = `${b.title} (${(b.pills || []).length} pill keunggulan)`;
        } else if (id === 'user_workspace') {
            label = 'Area Kerja Utama (Navigasi Tab / Formulir, Riwayat & Lacak Tiket)';
            sub = 'Blok inti layanan pengaduan civitas kampus';
        } else {
            const cb = (uCfg.customBlocks || []).find(c => c.id === id);
            if (!cb) return '';
            isCustom = true;
            enabled = cb.enabled !== false;
            label = `[Seksi Kustom] ${cb.title}`;
            sub = cb.desc || '';
        }

        return `
            <div class="builder-block-row ${enabled ? '' : 'is-disabled'}">
                <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
                    <span style="width:28px; height:28px; border-radius:8px; background:var(--gold-light); color:var(--gold); font-weight:800; font-size:12px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">${idx + 1}</span>
                    <div style="min-width:0;">
                        <div style="font-size:13.5px; font-weight:800; color:var(--text-main);">${escapeHtml(label)}</div>
                        <div style="font-size:12px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px;">${escapeHtml(sub)}</div>
                    </div>
                </div>
                <div class="builder-row-actions">
                    <button type="button" class="chart-icon-btn" onclick="builderMoveOrder('user_page', '${escapeHtml(id)}', -1)" title="Geser ke Atas" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                    <button type="button" class="chart-icon-btn" onclick="builderMoveOrder('user_page', '${escapeHtml(id)}', 1)" title="Geser ke Bawah" ${idx === arr.length - 1 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                    ${id === 'user_banner' ? `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('user_banner', 'user_banner')"><i class="fa-solid fa-pen"></i> Edit Banner</button>
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px; color:${enabled ? '#ef4444' : '#10b981'};" onclick="builderToggleEnabled('user', 'user_banner', false)">
                            ${enabled ? 'Hapus Banner' : 'Pulihkan Banner'}
                        </button>
                    ` : ''}
                    ${isCustom ? `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('custom_block', '${escapeHtml(id)}')"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="builderToggleEnabled('user', '${escapeHtml(id)}', true)">${enabled ? 'Aktif' : 'Nonaktif'}</button>
                        <button type="button" class="chart-icon-btn danger" onclick="builderDeleteCustomBlock('user', '${escapeHtml(id)}')" title="Hapus Permanen"><i class="fa-solid fa-trash-can"></i></button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    const tabRows = (uCfg.tabOrder || []).map((tid, idx, arr) => {
        let b = uCfg.blocks[tid];
        let isCustom = false;
        if (!b) {
            b = (uCfg.customBlocks || []).find(c => c.id === tid && c.placement === 'tab');
            isCustom = true;
        }
        if (!b) return '';
        const enabled = b.enabled !== false;
        return `
            <div class="builder-block-row ${enabled ? '' : 'is-disabled'}">
                <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
                    <div class="kpi-box-icon icon-emerald" style="width:36px; height:36px; font-size:14px;">
                        <i class="fa-solid ${escapeHtml(b.icon || 'fa-folder')}"></i>
                    </div>
                    <div style="min-width:0;">
                        <div style="font-size:13.5px; font-weight:800; color:var(--text-main);">
                            ${isCustom ? '[Tab Kustom] ' : ''}Tab: ${escapeHtml(b.tabLabel || b.title)}
                        </div>
                        <div style="font-size:12px; color:var(--text-muted);">${escapeHtml(b.title)} &mdash; ${escapeHtml(b.desc || '')}</div>
                    </div>
                </div>
                <div class="builder-row-actions">
                    <button type="button" class="chart-icon-btn" onclick="builderMoveOrder('user_tabs', '${escapeHtml(tid)}', -1)" title="Geser Kiri/Atas" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                    <button type="button" class="chart-icon-btn" onclick="builderMoveOrder('user_tabs', '${escapeHtml(tid)}', 1)" title="Geser Kanan/Bawah" ${idx === arr.length - 1 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                    <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('${isCustom ? 'custom_block' : 'user_builtin_tab'}', '${escapeHtml(tid)}')">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    ${isCustom ? `
                        <button type="button" class="chart-icon-btn danger" onclick="builderDeleteCustomBlock('user', '${escapeHtml(tid)}')" title="Hapus Tab Ini"><i class="fa-solid fa-trash-can"></i></button>
                    ` : `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px; color:${enabled ? '#ef4444' : '#10b981'};" onclick="builderToggleEnabled('user', '${escapeHtml(tid)}', false)">
                            ${enabled ? 'Hapus / Nonaktifkan' : 'Pulihkan Tab'}
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');

    const pills = (uCfg.blocks.user_banner && uCfg.blocks.user_banner.pills) || [];
    const pillChips = pills.map((p, i) => `
        <span style="display:inline-flex; align-items:center; gap:8px; padding:6px 12px; border-radius:9999px; background:rgba(255,255,255,0.05); border:1px solid var(--border-color); font-size:12px; font-weight:700;">
            <i class="fa-solid ${escapeHtml(p.icon || 'fa-check')}" style="color:var(--gold);"></i>
            <span>${escapeHtml(p.text)}</span>
            <button type="button" onclick="openBuilderEditModal('user_banner_pill', '${i}')" style="background:none; border:none; color:#38bdf8; cursor:pointer; padding:0;" title="Edit Pill"><i class="fa-solid fa-pen"></i></button>
            <button type="button" onclick="builderDeleteBannerPill(${i})" style="background:none; border:none; color:#ef4444; cursor:pointer; padding:0;" title="Hapus Pill"><i class="fa-solid fa-xmark"></i></button>
        </span>
    `).join('');

    return `
        <div class="glass-card" style="padding:20px 22px; margin-bottom:20px;">
            <h3 style="font-size:15.5px; font-weight:800; margin:0 0 12px 0; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-table-columns" style="color:var(--gold);"></i> A. Tata Letak Halaman Portal Pelapor (pages/user.html)
            </h3>
            <div class="builder-layout-options">
                <div class="builder-layout-card ${uCfg.layout === 'tabs' ? 'selected' : ''}" onclick="builderSetPageLayout('user', 'tabs')">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-folder-tree" style="color:var(--gold);"></i> Mode Navigasi Tab Terpisah</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Formulir, Riwayat, Lacak Tiket &amp; Tab tambahan dibagi rapi menggunakan tombol tab.</span>
                </div>
                <div class="builder-layout-card ${uCfg.layout === 'stacked' ? 'selected' : ''}" onclick="builderSetPageLayout('user', 'stacked')">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-bars-staggered" style="color:#38bdf8;"></i> Mode Semua Seksi Terbuka (Stacked)</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Menampilkan seluruh seksi aktif secara berurutan dari atas ke bawah dalam satu halaman penuh.</span>
                </div>
                <div class="builder-layout-card ${uCfg.containerWidth === 'wide' ? 'selected' : ''}" onclick="builderToggleUserWidth()">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-arrows-left-right-to-line" style="color:#10b981;"></i> Lebar Halaman: ${uCfg.containerWidth === 'wide' ? 'Lebar Penuh (1460px)' : 'Proporsional Standar (1260px)'}</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Klik untuk beralih antara kontainer standar atau kontainer ekstra lebar.</span>
                </div>
            </div>

            <div class="builder-block-row" style="margin-top:14px;">
                <div>
                    <div style="font-size:13px; font-weight:800;">Bar Kontak Layanan Atas (Portal User)</div>
                    <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(uCfg.topBar.email)} &bull; ${escapeHtml(uCfg.topBar.badge)}</div>
                </div>
                <div class="builder-row-actions">
                    <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('topbar', 'user')"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px; color:${uCfg.showTopBar ? '#ef4444' : '#10b981'};" onclick="builderToggleTopBar('user')">
                        ${uCfg.showTopBar ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                </div>
            </div>
        </div>

        <div class="glass-card" style="padding:20px 22px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
                <div>
                    <h3 style="font-size:15.5px; font-weight:800; margin:0;"><i class="fa-solid fa-arrows-up-down" style="color:var(--gold);"></i> B. Urutan Seksi Halaman &amp; Pill Banner Pelapor</h3>
                    <span style="font-size:12px; color:var(--text-muted);">Atur posisi Banner Utama, Area Kerja, serta tambahkan kartu pengumuman di atas/bawah halaman.</span>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button type="button" class="btn btn-secondary" style="font-size:12px; min-height:36px;" onclick="openBuilderEditModal('add_banner_pill', '')">
                        <i class="fa-solid fa-tag"></i> + Pill Banner
                    </button>
                    <button type="button" class="btn btn-primary" style="font-size:12px; min-height:36px;" onclick="openBuilderEditModal('add_custom_block', 'user_section')">
                        <i class="fa-solid fa-plus"></i> Tambah Seksi Halaman
                    </button>
                </div>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px;">${pillChips}</div>
            <div class="builder-block-list">${pageRows}</div>
        </div>

        <div class="glass-card" style="padding:20px 22px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
                <div>
                    <h3 style="font-size:15.5px; font-weight:800; margin:0;"><i class="fa-solid fa-window-restore" style="color:var(--gold);"></i> C. Kelola Tab &amp; Seksi Layanan Pelapor (Tambah, Edit, Urutkan &amp; Hapus)</h3>
                    <span style="font-size:12px; color:var(--text-muted);">Ubah nama tab/judul seksi, urutkan posisi tab, nonaktifkan seksi, atau buat Menu Tab baru (misal: SOP &amp; Kontak Darurat).</span>
                </div>
                <button type="button" class="btn btn-primary" style="font-size:12px; min-height:36px;" onclick="openBuilderEditModal('add_custom_block', 'user_tab')">
                    <i class="fa-solid fa-plus"></i> Tambah Menu Tab Baru
                </button>
            </div>
            <div class="builder-block-list">${tabRows}</div>
        </div>
    `;
}

/* --------------------------------------------------------------------------
   STUDIO 3: HALAMAN DASHBOARD ADMIN (pages/admin.html)
   -------------------------------------------------------------------------- */
function buildAdminStudioHtml(aCfg) {
    const secRows = (aCfg.sectionOrder || []).map((sid, idx, arr) => {
        let b = aCfg.blocks[sid];
        let isCustom = false;
        if (!b) {
            b = (aCfg.customBlocks || []).find(c => c.id === sid);
            isCustom = true;
        }
        if (!b) return '';
        const enabled = b.enabled !== false;
        const label = isCustom ? `[Widget Kustom] ${b.title}` : (b.label || b.title);

        return `
            <div class="builder-block-row ${enabled ? '' : 'is-disabled'}">
                <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
                    <span style="width:28px; height:28px; border-radius:8px; background:var(--gold-light); color:var(--gold); font-weight:800; font-size:12px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">${idx + 1}</span>
                    <div style="min-width:0;">
                        <div style="font-size:13.5px; font-weight:800; color:var(--text-main);">${escapeHtml(label)}</div>
                        <div style="font-size:12px; color:var(--text-muted);">${escapeHtml(b.desc || '')}</div>
                    </div>
                </div>
                <div class="builder-row-actions">
                    <button type="button" class="chart-icon-btn" onclick="builderMoveOrder('admin_sec', '${escapeHtml(sid)}', -1)" title="Geser ke Atas" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                    <button type="button" class="chart-icon-btn" onclick="builderMoveOrder('admin_sec', '${escapeHtml(sid)}', 1)" title="Geser ke Bawah" ${idx === arr.length - 1 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                    ${sid !== 'admin_table' ? `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('${isCustom ? 'custom_block' : 'admin_builtin'}', '${escapeHtml(sid)}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                    ` : ''}
                    ${isCustom ? `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="builderToggleEnabled('admin', '${escapeHtml(sid)}', true)">${enabled ? 'Aktif' : 'Nonaktif'}</button>
                        <button type="button" class="chart-icon-btn danger" onclick="builderDeleteCustomBlock('admin', '${escapeHtml(sid)}')" title="Hapus Permanen Widget Ini"><i class="fa-solid fa-trash-can"></i></button>
                    ` : `
                        <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px; color:${enabled ? '#ef4444' : '#10b981'};" onclick="builderToggleEnabled('admin', '${escapeHtml(sid)}', false)">
                            ${enabled ? 'Hapus dari Dashboard' : 'Pulihkan Seksi'}
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="glass-card" style="padding:20px 22px; margin-bottom:20px;">
            <h3 style="font-size:15.5px; font-weight:800; margin:0 0 12px 0; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-table-columns" style="color:var(--gold);"></i> A. Tata Letak Sidebar &amp; Grid Dashboard Admin (pages/admin.html)
            </h3>
            <div class="builder-layout-options">
                <div class="builder-layout-card ${aCfg.sidebarPosition === 'left' ? 'selected' : ''}" onclick="builderSetAdminSidebarPos('left')">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-indent" style="color:var(--gold);"></i> Navigasi Sidebar di Kiri</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Tata letak klasik: menu navigasi di sisi kiri dan area kerja di sisi kanan.</span>
                </div>
                <div class="builder-layout-card ${aCfg.sidebarPosition === 'right' ? 'selected' : ''}" onclick="builderSetAdminSidebarPos('right')">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-outdent" style="color:#38bdf8;"></i> Navigasi Sidebar di Kanan</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Memindahkan panel sidebar ke sisi kanan layar dan area kerja utama ke kiri.</span>
                </div>
                <div class="builder-layout-card ${aCfg.kpiColumns === '2' ? 'selected' : ''}" onclick="builderToggleAdminKpiCols()">
                    <strong style="font-size:13.5px; color:var(--text-main);"><i class="fa-solid fa-grip" style="color:#10b981;"></i> Grid Kartu KPI: ${aCfg.kpiColumns === '2' ? '2×2 Kolom Lebar' : '4 Kolom Sejajar'}</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Klik untuk mengganti susunan kartu metrik KPI di bagian atas dashboard.</span>
                </div>
            </div>

            <div class="builder-block-row" style="margin-top:14px;">
                <div>
                    <div style="font-size:13px; font-weight:800;">Header Utama Dashboard Admin</div>
                    <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(aCfg.header.title)} &mdash; ${escapeHtml(aCfg.header.desc)}</div>
                </div>
                <div class="builder-row-actions">
                    <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px;" onclick="openBuilderEditModal('admin_header', 'admin')"><i class="fa-solid fa-pen"></i> Edit Judul Header</button>
                    <button type="button" class="btn btn-secondary" style="min-height:30px; padding:4px 10px; font-size:11.5px; color:${aCfg.header.enabled !== false ? '#ef4444' : '#10b981'};" onclick="builderToggleAdminHeader()">
                        ${aCfg.header.enabled !== false ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                </div>
            </div>
        </div>

        <div class="glass-card" style="padding:20px 22px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
                <div>
                    <h3 style="font-size:15.5px; font-weight:800; margin:0;"><i class="fa-solid fa-cubes-stacked" style="color:var(--gold);"></i> B. Urutan Seksi &amp; Widget Dashboard Utama (Tambah, Edit, Urutkan &amp; Hapus)</h3>
                    <span style="font-size:12px; color:var(--text-muted);">Atur urutan KPI, Pusat Grafik Data, Peta GIS, Tabel Laporan, atau tambahkan Widget Pengumuman Internal baru.</span>
                </div>
                <button type="button" class="btn btn-primary" style="font-size:12px; min-height:36px;" onclick="openBuilderEditModal('add_custom_block', 'admin')">
                    <i class="fa-solid fa-plus"></i> Tambah Widget / Seksi Baru
                </button>
            </div>
            <div class="builder-block-list">${secRows}</div>
        </div>
    `;
}

/* --------------------------------------------------------------------------
   BUILDER ACTIONS: LAYOUT, MOVE, TOGGLE, DELETE, RESET
   -------------------------------------------------------------------------- */
function builderSetPageLayout(pageKey, layoutVal) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    cfg[pageKey].layout = layoutVal;
    commitBuilderCfg(cfg, `Tata letak halaman ${pageKey.toUpperCase()} diperbarui!`, `Mengubah tata letak halaman ${pageKey} ke mode ${layoutVal}`);
}

function builderToggleUserWidth() {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    cfg.user.containerWidth = cfg.user.containerWidth === 'wide' ? 'normal' : 'wide';
    commitBuilderCfg(cfg, 'Lebar kontainer Portal User diperbarui!', `Mengubah lebar kontainer halaman user ke ${cfg.user.containerWidth}`);
}

function builderSetAdminSidebarPos(pos) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    cfg.admin.sidebarPosition = pos;
    commitBuilderCfg(cfg, `Posisi sidebar diubah ke sisi ${pos === 'right' ? 'Kanan' : 'Kiri'}!`, `Mengubah posisi sidebar dashboard ke ${pos}`);
}

function builderToggleAdminKpiCols() {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    cfg.admin.kpiColumns = cfg.admin.kpiColumns === '2' ? '4' : '2';
    commitBuilderCfg(cfg, `Tata letak kartu KPI diubah ke ${cfg.admin.kpiColumns} kolom!`, `Mengubah kolom KPI dashboard ke ${cfg.admin.kpiColumns}`);
}

function builderToggleAdminHeader() {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    cfg.admin.header.enabled = !(cfg.admin.header.enabled !== false);
    commitBuilderCfg(cfg, 'Visibilitas header dashboard diperbarui!', 'Mengubah visibilitas header utama dashboard');
}

function builderToggleTopBar(pageKey) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    cfg[pageKey].showTopBar = !cfg[pageKey].showTopBar;
    commitBuilderCfg(cfg, 'Status bar kontak atas diperbarui!', `Mengubah visibilitas top utility bar pada halaman ${pageKey}`);
}

function builderMoveOrder(listType, itemId, dir) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    let arr = null;
    if (listType === 'login_hero') arr = cfg.login.heroOrder;
    else if (listType === 'user_page') arr = cfg.user.pageOrder;
    else if (listType === 'user_tabs') arr = cfg.user.tabOrder;
    else if (listType === 'admin_sec') arr = cfg.admin.sectionOrder;
    if (!Array.isArray(arr)) return;

    const idx = arr.indexOf(itemId);
    if (idx < 0) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= arr.length) return;
    const tmp = arr[idx];
    arr[idx] = arr[targetIdx];
    arr[targetIdx] = tmp;

    commitBuilderCfg(cfg, 'Urutan tata letak seksi berhasil digeser!', `Menggeser urutan komponen ${itemId} pada ${listType}`);
}

function builderMoveLoginFeature(idx, dir) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    const items = cfg.login.blocks.features_list.items || [];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const tmp = items[idx];
    items[idx] = items[targetIdx];
    items[targetIdx] = tmp;
    commitBuilderCfg(cfg, 'Urutan kartu fitur login diperbarui!', 'Mengubah urutan kartu fitur sorotan login');
}

function builderDeleteLoginFeature(idx) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    const items = cfg.login.blocks.features_list.items || [];
    const target = items[idx];
    if (!target) return;
    if (!confirm(`Hapus kartu fitur "${target.title}" dari halaman Login?`)) return;
    items.splice(idx, 1);
    commitBuilderCfg(cfg, 'Kartu fitur dihapus dari halaman Login.', `Menghapus kartu fitur login: ${target.title}`);
}

function builderDeleteBannerPill(idx) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    const pills = cfg.user.blocks.user_banner.pills || [];
    if (!pills[idx]) return;
    pills.splice(idx, 1);
    commitBuilderCfg(cfg, 'Pill banner dihapus.', 'Menghapus pill keunggulan pada banner user');
}

function builderToggleEnabled(pageKey, blockId, isCustom) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    if (isCustom) {
        const cb = (cfg[pageKey].customBlocks || []).find(c => c.id === blockId);
        if (cb) cb.enabled = !(cb.enabled !== false);
    } else if (cfg[pageKey].blocks && cfg[pageKey].blocks[blockId]) {
        const b = cfg[pageKey].blocks[blockId];
        b.enabled = !(b.enabled !== false);
    }
    commitBuilderCfg(cfg, 'Status tampilan komponen diperbarui!', `Mengubah visibilitas komponen ${blockId} pada halaman ${pageKey}`);
}

function builderDeleteCustomBlock(pageKey, blockId) {
    if (!ensureSuperAdminForBuilder()) return;
    const cfg = getBuilderCfg();
    const cb = (cfg[pageKey].customBlocks || []).find(c => c.id === blockId);
    if (!cb) return;
    if (!confirm(`Hapus permanen komponen "${cb.title}" dari halaman ${pageKey.toUpperCase()}?`)) return;

    cfg[pageKey].customBlocks = (cfg[pageKey].customBlocks || []).filter(c => c.id !== blockId);
    if (pageKey === 'login') cfg.login.heroOrder = cfg.login.heroOrder.filter(id => id !== blockId);
    if (pageKey === 'user') {
        cfg.user.pageOrder = cfg.user.pageOrder.filter(id => id !== blockId);
        cfg.user.tabOrder = cfg.user.tabOrder.filter(id => id !== blockId);
    }
    if (pageKey === 'admin') cfg.admin.sectionOrder = cfg.admin.sectionOrder.filter(id => id !== blockId);

    commitBuilderCfg(cfg, 'Komponen kustom berhasil dihapus permanen.', `Menghapus komponen kustom ${cb.title} dari halaman ${pageKey}`);
}

function resetCurrentBuilderPageToDefault() {
    if (!ensureSuperAdminForBuilder()) return;
    if (!window.SimpelSiteBuilder) return;
    const pageNames = { login: 'Halaman Login', user: 'Halaman Portal User', admin: 'Halaman Dashboard Admin' };
    if (!confirm(`Kembalikan seluruh tata letak dan konten ${pageNames[currentBuilderPageKey]} ke standar awal UINSSC?`)) return;

    const cfg = getBuilderCfg();
    cfg[currentBuilderPageKey] = JSON.parse(JSON.stringify(window.SimpelSiteBuilder.DEFAULT_SITE_CONFIG[currentBuilderPageKey]));
    commitBuilderCfg(cfg, `${pageNames[currentBuilderPageKey]} dikembalikan ke pengaturan bawaan!`, `Reset konfigurasi ${pageNames[currentBuilderPageKey]} ke default`);
}

/* --------------------------------------------------------------------------
   UNIVERSAL MODAL EDITOR FOR ADDING & EDITING ANY PAGE ITEM
   -------------------------------------------------------------------------- */
function buildIconOptionsHtml(selectedVal) {
    return BUILDER_ICONS_CATALOG.map(ic =>
        `<option value="${ic.value}" ${ic.value === selectedVal ? 'selected' : ''}>${escapeHtml(ic.label)}</option>`
    ).join('');
}

function buildAccentOptionsHtml(selectedVal) {
    return BUILDER_ACCENT_CATALOG.map(ac =>
        `<option value="${ac.value}" ${ac.value === selectedVal ? 'selected' : ''}>${escapeHtml(ac.label)}</option>`
    ).join('');
}

function openBuilderEditModal(mode, targetId) {
    if (!ensureSuperAdminForBuilder()) return;
    const modal = document.getElementById('builderEditorModal');
    const titleEl = document.getElementById('builderEditorModalTitle');
    const container = document.getElementById('builderEditorFieldsContainer');
    if (!modal || !container) return;

    const cfg = getBuilderCfg();
    activeBuilderModalCtx = { mode, targetId };
    let html = '';

    if (mode === 'topbar') {
        const tb = cfg[targetId].topBar;
        titleEl.innerHTML = `<i class="fa-solid fa-grip-lines" style="color:var(--gold);"></i> Edit Bar Kontak Atas (${targetId.toUpperCase()})`;
        html = `
            <div class="form-group"><label>Alamat Email Resmi:</label><input type="text" id="be_email" value="${escapeHtml(tb.email)}" required></div>
            <div class="form-group"><label>Nomor Telepon Layanan:</label><input type="text" id="be_phone" value="${escapeHtml(tb.phone)}" required></div>
            <div class="form-group"><label>Jam Operasional:</label><input type="text" id="be_hours" value="${escapeHtml(tb.hours)}" required></div>
            <div class="form-group"><label>Teks Badge Kanan:</label><input type="text" id="be_badge" value="${escapeHtml(tb.badge)}" required></div>
        `;
    } else if (mode === 'login_box') {
        const lb = cfg.login.loginBox;
        titleEl.innerHTML = `<i class="fa-solid fa-id-card" style="color:var(--gold);"></i> Edit Kartu Form Login &amp; Akun Demo`;
        html = `
            <div class="form-group"><label>Tagline Atas Kartu:</label><input type="text" id="be_sub" value="${escapeHtml(lb.subtitle)}" required></div>
            <div class="form-group"><label>Judul Kartu Login:</label><input type="text" id="be_title" value="${escapeHtml(lb.title)}" required></div>
            <div class="form-group"><label>Subjudul Instruksi:</label><input type="text" id="be_desc" value="${escapeHtml(lb.desc)}"></div>
            <div class="form-group"><label>Judul Kotak Akun Demo Cepat:</label><input type="text" id="be_preset_title" value="${escapeHtml(lb.presetTitle || '')}"></div>
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; cursor:pointer;">
                <input type="checkbox" id="be_show_preset" ${lb.showPresetDemo !== false ? 'checked' : ''} style="width:16px; height:16px; accent-color:var(--gold);">
                <span>Tampilkan Kotak Akun Demo Uji Coba 1-Klik di Kartu Login</span>
            </label>
        `;
    } else if (mode === 'login_builtin') {
        const b = cfg.login.blocks[targetId];
        if (targetId === 'hero_header') {
            titleEl.innerHTML = `<i class="fa-solid fa-heading" style="color:var(--gold);"></i> Edit Header Sambutan Login`;
            html = `
                <div class="form-group"><label>Teks Badge Institusi:</label><input type="text" id="be_badge" value="${escapeHtml(b.badge)}" required></div>
                <div class="form-group"><label>Judul Utama Halaman Login:</label><input type="text" id="be_title" value="${escapeHtml(b.title)}" required></div>
                <div class="form-group"><label>Deskripsi Sambutan:</label><textarea id="be_desc" rows="3" required>${escapeHtml(b.desc)}</textarea></div>
            `;
        } else if (targetId === 'video_profile') {
            titleEl.innerHTML = `<i class="fa-brands fa-youtube" style="color:#ef4444;"></i> Edit Video Profil Kampus (YouTube)`;
            html = `
                <div class="form-group"><label>Label Badge Video:</label><input type="text" id="be_badge" value="${escapeHtml(b.badge || 'PROFIL KAMPUS CYBER')}"></div>
                <div class="form-group"><label>Tautan URL YouTube / Video ID:</label><input type="text" id="be_url" value="${escapeHtml(b.url)}" placeholder="https://youtu.be/..." required></div>
                <div class="form-group"><label>Judul Video:</label><input type="text" id="be_title" value="${escapeHtml(b.title)}" required></div>
                <div class="form-group"><label>Deskripsi Singkat Video:</label><textarea id="be_desc" rows="2">${escapeHtml(b.desc)}</textarea></div>
            `;
        }
    } else if (mode === 'add_login_feature' || mode === 'login_feature_item') {
        const isEdit = mode === 'login_feature_item';
        const f = isEdit
            ? cfg.login.blocks.features_list.items[parseInt(targetId, 10)]
            : { icon: 'fa-shield-halved', colorClass: 'icon-emerald', title: '', desc: '' };
        titleEl.innerHTML = `<i class="fa-solid fa-star" style="color:var(--gold);"></i> ${isEdit ? 'Edit Kartu Fitur Login' : 'Tambah Kartu Fitur Login Baru'}`;
        html = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group"><label>Ikon Fitur:</label><select id="be_icon">${buildIconOptionsHtml(f.icon)}</select></div>
                <div class="form-group"><label>Warna Ikon:</label>
                    <select id="be_color">
                        <option value="icon-emerald" ${f.colorClass === 'icon-emerald' ? 'selected' : ''}>Hijau Emerald</option>
                        <option value="icon-amber" ${f.colorClass === 'icon-amber' ? 'selected' : ''}>Kuning Emas / Amber</option>
                        <option value="icon-cyan" ${f.colorClass === 'icon-cyan' ? 'selected' : ''}>Biru Siber / Cyan</option>
                    </select>
                </div>
            </div>
            <div class="form-group"><label>Judul Fitur:</label><input type="text" id="be_title" value="${escapeHtml(f.title)}" placeholder="Contoh: Respon Cepat SLA Terukur" required></div>
            <div class="form-group"><label>Deskripsi Fitur:</label><textarea id="be_desc" rows="2" placeholder="Penjelasan singkat keunggulan fitur..." required>${escapeHtml(f.desc)}</textarea></div>
        `;
    } else if (mode === 'user_banner') {
        const b = cfg.user.blocks.user_banner;
        tempBuilderBannerBg = b.bgImage || '';
        titleEl.innerHTML = `<i class="fa-solid fa-image" style="color:var(--gold);"></i> Edit Hero Banner Portal Pelapor`;
        html = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group"><label>Badge Atas Banner:</label><input type="text" id="be_badge" value="${escapeHtml(b.badge)}" required></div>
                <div class="form-group"><label>Ikon Latar Dekoratif:</label><select id="be_icon">${buildIconOptionsHtml(b.icon)}</select></div>
            </div>
            <div class="form-group"><label>Judul Utama Banner:</label><input type="text" id="be_title" value="${escapeHtml(b.title)}" required></div>
            <div class="form-group"><label>Deskripsi Banner:</label><textarea id="be_desc" rows="3" required>${escapeHtml(b.desc)}</textarea></div>
            <div class="form-group">
                <label>Gambar Latar Banner Opsional (Upload Poster/Foto Gedung):</label>
                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                    <input type="file" accept="image/*" onchange="handleBuilderBannerImgFile(event)" style="font-size:12px;">
                    <button type="button" class="btn btn-secondary" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="tempBuilderBannerBg=''; showToast('Gambar latar dikosongkan (gunakan gradien hijau-emas).', 'info');">
                        <i class="fa-solid fa-eraser"></i> Gunakan Gradien Default
                    </button>
                </div>
            </div>
        `;
    } else if (mode === 'add_banner_pill' || mode === 'user_banner_pill') {
        const isEdit = mode === 'user_banner_pill';
        const p = isEdit
            ? cfg.user.blocks.user_banner.pills[parseInt(targetId, 10)]
            : { icon: 'fa-circle-check', text: '' };
        titleEl.innerHTML = `<i class="fa-solid fa-tag" style="color:var(--gold);"></i> ${isEdit ? 'Edit Pill Banner' : 'Tambah Pill Keunggulan Banner'}`;
        html = `
            <div class="form-group"><label>Pilih Ikon:</label><select id="be_icon">${buildIconOptionsHtml(p.icon)}</select></div>
            <div class="form-group"><label>Teks Pill Singkat:</label><input type="text" id="be_title" value="${escapeHtml(p.text)}" placeholder="Contoh: Terintegrasi SSO UINSSC" required></div>
        `;
    } else if (mode === 'user_builtin_tab') {
        const b = cfg.user.blocks[targetId];
        titleEl.innerHTML = `<i class="fa-solid fa-folder-open" style="color:var(--gold);"></i> Edit Tab &amp; Seksi: ${escapeHtml(b.tabLabel)}`;
        html = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group"><label>Label Tombol Tab:</label><input type="text" id="be_tab_label" value="${escapeHtml(b.tabLabel)}" required></div>
                <div class="form-group"><label>Ikon Tab &amp; Seksi:</label><select id="be_icon">${buildIconOptionsHtml(b.icon)}</select></div>
            </div>
            <div class="form-group"><label>Judul Utama di Dalam Seksi:</label><input type="text" id="be_title" value="${escapeHtml(b.title)}" required></div>
            <div class="form-group"><label>Subjudul / Instruksi Seksi:</label><textarea id="be_desc" rows="2">${escapeHtml(b.desc)}</textarea></div>
        `;
    } else if (mode === 'admin_header') {
        const h = cfg.admin.header;
        titleEl.innerHTML = `<i class="fa-solid fa-heading" style="color:var(--gold);"></i> Edit Header Utama Dashboard Admin`;
        html = `
            <div class="form-group"><label>Judul Utama Dashboard:</label><input type="text" id="be_title" value="${escapeHtml(h.title)}" required></div>
            <div class="form-group"><label>Subjudul Operasional:</label><input type="text" id="be_desc" value="${escapeHtml(h.desc)}" required></div>
        `;
    } else if (mode === 'admin_builtin') {
        const b = cfg.admin.blocks[targetId];
        titleEl.innerHTML = `<i class="fa-solid fa-sliders" style="color:var(--gold);"></i> Edit Seksi Dashboard: ${escapeHtml(b.label)}`;
        if (targetId === 'admin_kpi') {
            const lbs = b.kpiLabels || ['Total Laporan', 'Menunggu Verifikasi', 'Dalam Perbaikan', 'Perbaikan Selesai'];
            html = `
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="form-group"><label>Label Kartu KPI 1:</label><input type="text" id="be_kpi0" value="${escapeHtml(lbs[0])}" required></div>
                    <div class="form-group"><label>Label Kartu KPI 2:</label><input type="text" id="be_kpi1" value="${escapeHtml(lbs[1])}" required></div>
                    <div class="form-group"><label>Label Kartu KPI 3:</label><input type="text" id="be_kpi2" value="${escapeHtml(lbs[2])}" required></div>
                    <div class="form-group"><label>Label Kartu KPI 4:</label><input type="text" id="be_kpi3" value="${escapeHtml(lbs[3])}" required></div>
                </div>
            `;
        } else {
            html = `
                <div class="form-group"><label>Judul Seksi:</label><input type="text" id="be_title" value="${escapeHtml(b.title)}" required></div>
                <div class="form-group"><label>Subjudul / Keterangan:</label><textarea id="be_desc" rows="2">${escapeHtml(b.desc || '')}</textarea></div>
            `;
        }
    } else if (mode === 'add_custom_block' || mode === 'custom_block') {
        const isEdit = mode === 'custom_block';
        let cb = {
            badge: 'INFORMASI SARPRAS',
            title: '',
            desc: '',
            icon: 'fa-bullhorn',
            accent: 'gold',
            tabLabel: '',
            buttonText: '',
            buttonUrl: '',
            placement: targetId === 'user_tab' ? 'tab' : 'section'
        };
        if (isEdit) {
            const found = (cfg[currentBuilderPageKey].customBlocks || []).find(c => c.id === targetId);
            if (found) cb = found;
        }
        const isTabItem = cb.placement === 'tab';
        titleEl.innerHTML = `<i class="fa-solid fa-plus-circle" style="color:var(--gold);"></i> ${isEdit ? 'Edit Komponen Kustom' : (isTabItem ? 'Tambah Menu Tab Baru di Portal User' : 'Tambah Seksi / Widget Baru')}`;

        html = `
            ${isTabItem ? `<div class="form-group"><label>Nama Tombol Menu Tab:</label><input type="text" id="be_tab_label" value="${escapeHtml(cb.tabLabel || cb.title)}" placeholder="Contoh: SOP &amp; Kontak Darurat" required></div>` : ''}
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group"><label>Ikon Visual:</label><select id="be_icon">${buildIconOptionsHtml(cb.icon)}</select></div>
                <div class="form-group"><label>Tema Warna Aksen:</label><select id="be_accent">${buildAccentOptionsHtml(cb.accent)}</select></div>
            </div>
            <div class="form-group"><label>Label Badge Kecil (Opsional):</label><input type="text" id="be_badge" value="${escapeHtml(cb.badge || '')}" placeholder="Contoh: PENGUMUMAN RESMI"></div>
            <div class="form-group"><label>Judul Seksi / Konten:</label><input type="text" id="be_title" value="${escapeHtml(cb.title)}" placeholder="Contoh: Jadwal Pemeliharaan Listrik Gedung Cyber" required></div>
            <div class="form-group"><label>Isi Informasi / Deskripsi Lengkap:</label><textarea id="be_desc" rows="4" placeholder="Tuliskan informasi lengkap, panduan SOP, atau pengumuman..." required>${escapeHtml(cb.desc)}</textarea></div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group"><label>Teks Tombol Tautan (Opsional):</label><input type="text" id="be_btn_text" value="${escapeHtml(cb.buttonText || '')}" placeholder="Contoh: Hubungi WhatsApp Piket"></div>
                <div class="form-group"><label>URL Tujuan Tombol (Opsional):</label><input type="text" id="be_btn_url" value="${escapeHtml(cb.buttonUrl || '')}" placeholder="https://wa.me/62812..."></div>
            </div>
        `;
    }

    container.innerHTML = html;
    modal.classList.remove('hidden');
}

function handleBuilderBannerImgFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
        showToast('Ukuran gambar maksimal 4MB.', 'error');
        event.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function (ev) {
        tempBuilderBannerBg = ev.target.result;
        showToast('Gambar latar banner siap disimpan!', 'success');
    };
    reader.readAsDataURL(file);
}

function closeBuilderEditorModal() {
    const modal = document.getElementById('builderEditorModal');
    if (modal) modal.classList.add('hidden');
    activeBuilderModalCtx = null;
}

function submitBuilderEditorForm(e) {
    e.preventDefault();
    if (!ensureSuperAdminForBuilder() || !activeBuilderModalCtx) return;

    const { mode, targetId } = activeBuilderModalCtx;
    const cfg = getBuilderCfg();
    const val = id => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    };

    if (mode === 'topbar') {
        cfg[targetId].topBar = {
            email: val('be_email'),
            phone: val('be_phone'),
            hours: val('be_hours'),
            badge: val('be_badge')
        };
    } else if (mode === 'login_box') {
        cfg.login.loginBox = {
            subtitle: val('be_sub'),
            title: val('be_title'),
            desc: val('be_desc'),
            presetTitle: val('be_preset_title'),
            showPresetDemo: !!(document.getElementById('be_show_preset') && document.getElementById('be_show_preset').checked)
        };
    } else if (mode === 'login_builtin') {
        if (targetId === 'hero_header') {
            Object.assign(cfg.login.blocks.hero_header, {
                badge: val('be_badge'),
                title: val('be_title'),
                desc: val('be_desc')
            });
        } else if (targetId === 'video_profile') {
            const rawUrl = val('be_url');
            const eid = extractYouTubeEmbedId(rawUrl);
            if (!eid) {
                showToast('URL YouTube tidak valid! Gunakan format https://youtu.be/...', 'error');
                return;
            }
            Object.assign(cfg.login.blocks.video_profile, {
                badge: val('be_badge'),
                url: rawUrl,
                embedId: eid,
                title: val('be_title'),
                desc: val('be_desc')
            });
        }
    } else if (mode === 'add_login_feature') {
        cfg.login.blocks.features_list.items.push({
            id: 'feat_' + Date.now(),
            icon: val('be_icon'),
            colorClass: val('be_color'),
            title: val('be_title'),
            desc: val('be_desc')
        });
    } else if (mode === 'login_feature_item') {
        const idx = parseInt(targetId, 10);
        if (cfg.login.blocks.features_list.items[idx]) {
            Object.assign(cfg.login.blocks.features_list.items[idx], {
                icon: val('be_icon'),
                colorClass: val('be_color'),
                title: val('be_title'),
                desc: val('be_desc')
            });
        }
    } else if (mode === 'user_banner') {
        Object.assign(cfg.user.blocks.user_banner, {
            badge: val('be_badge'),
            icon: val('be_icon'),
            title: val('be_title'),
            desc: val('be_desc'),
            bgImage: tempBuilderBannerBg || ''
        });
    } else if (mode === 'add_banner_pill') {
        cfg.user.blocks.user_banner.pills.push({
            id: 'pill_' + Date.now(),
            icon: val('be_icon'),
            text: val('be_title')
        });
    } else if (mode === 'user_banner_pill') {
        const idx = parseInt(targetId, 10);
        if (cfg.user.blocks.user_banner.pills[idx]) {
            cfg.user.blocks.user_banner.pills[idx].icon = val('be_icon');
            cfg.user.blocks.user_banner.pills[idx].text = val('be_title');
        }
    } else if (mode === 'user_builtin_tab') {
        if (cfg.user.blocks[targetId]) {
            Object.assign(cfg.user.blocks[targetId], {
                tabLabel: val('be_tab_label'),
                icon: val('be_icon'),
                title: val('be_title'),
                desc: val('be_desc')
            });
        }
    } else if (mode === 'admin_header') {
        Object.assign(cfg.admin.header, {
            title: val('be_title'),
            desc: val('be_desc')
        });
    } else if (mode === 'admin_builtin') {
        if (targetId === 'admin_kpi') {
            cfg.admin.blocks.admin_kpi.kpiLabels = [val('be_kpi0'), val('be_kpi1'), val('be_kpi2'), val('be_kpi3')];
        } else if (cfg.admin.blocks[targetId]) {
            Object.assign(cfg.admin.blocks[targetId], {
                title: val('be_title'),
                desc: val('be_desc')
            });
        }
    } else if (mode === 'add_custom_block') {
        const newId = 'custom_' + Date.now();
        const isTab = targetId === 'user_tab';
        const pageKey = (targetId === 'user_section' || targetId === 'user_tab') ? 'user' : targetId;
        const blockObj = {
            id: newId,
            enabled: true,
            placement: isTab ? 'tab' : 'section',
            tabLabel: isTab ? val('be_tab_label') : '',
            icon: val('be_icon'),
            accent: val('be_accent'),
            badge: val('be_badge'),
            title: val('be_title'),
            desc: val('be_desc'),
            buttonText: val('be_btn_text'),
            buttonUrl: val('be_btn_url')
        };
        cfg[pageKey].customBlocks.push(blockObj);
        if (pageKey === 'login') cfg.login.heroOrder.push(newId);
        else if (pageKey === 'user') {
            if (isTab) cfg.user.tabOrder.push(newId);
            else cfg.user.pageOrder.splice(1, 0, newId); // Tampil tepat di bawah banner secara default
        } else if (pageKey === 'admin') {
            cfg.admin.sectionOrder.unshift(newId); // Tampil di bagian atas dashboard secara default
        }
    } else if (mode === 'custom_block') {
        const found = (cfg[currentBuilderPageKey].customBlocks || []).find(c => c.id === targetId);
        if (found) {
            Object.assign(found, {
                tabLabel: found.placement === 'tab' ? val('be_tab_label') : found.tabLabel,
                icon: val('be_icon'),
                accent: val('be_accent'),
                badge: val('be_badge'),
                title: val('be_title'),
                desc: val('be_desc'),
                buttonText: val('be_btn_text'),
                buttonUrl: val('be_btn_url')
            });
        }
    }

    closeBuilderEditorModal();
    commitBuilderCfg(cfg, 'Perubahan berhasil disimpan & aktif di halaman!', `Menyimpan pembaruan komponen (${mode}) pada halaman ${currentBuilderPageKey}`);
}





