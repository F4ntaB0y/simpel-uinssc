/**
 * SIMPEL UINSSC - Public User Portal Script
 * Location: js/user.js
 * --------------------------------------------------------------------------
 * MEMENUHI 6 UNIT KOMPETENSI SKKNI BNSP WEB DEVELOPER:
 * 1. Mengimplementasikan User Interface (Form Pelapor, Responsive & Interaktif)
 * 2. Menerapkan Eksekusi Teks, Grafik & Multimedia (Form Processing, Map & Photos)
 * 3. Menyusun Fungsi, File & Sumber Daya Pemrograman Rapi (Modular Organization)
 * 4. Menulis Kode Sesuai Guidelines & Best Practices (Clean Code, XSS Sanitization, JSDoc)
 * 5. Mengimplementasikan Pemrograman Terstruktur (Control Flow, State Management)
 * 6. Menggunakan Library Pre-existing (Leaflet.js Map, FontAwesome, Google Fonts)
 * --------------------------------------------------------------------------
 */

const STORAGE_KEY = 'SIMPEL_FK_REPORTS_DATA_V1';
const THEME_KEY = 'SIMPEL_FK_THEME';

let reportsData = [];
let selectedImage = '';
let lastTicketCode = '';

// Leaflet Map State
let mapPickerInstance = null;
let mapMarkerInstance = null;
let currentLat = -6.735000;
let currentLng = 108.533600;

// ==========================================================================
// BATAS GEOGRAFIS MULTI-ZONA PRESISI KAMPUS UINSSC CIREBON
// (Hasil Pengumpulan Visual Polygon Designer oleh User)
// ==========================================================================
const STORAGE_ZONES_KEY = 'SIMPEL_CAMPUS_ZONES';

const DEFAULT_CAMPUS_ZONES = [
    {
        id: 'kampus_utama',
        name: 'Kawasan Kampus Utama',
        polygon: [
            [-6.735695, 108.532945], // Titik 1
            [-6.73554, 108.532951],  // Titik 2
            [-6.734701, 108.532972], // Titik 3
            [-6.734682, 108.533112], // Titik 4
            [-6.734624, 108.53332],  // Titik 5
            [-6.734562, 108.533575], // Titik 6
            [-6.734567, 108.53362],  // Titik 7
            [-6.734515, 108.533695], // Titik 8
            [-6.734471, 108.533874], // Titik 9
            [-6.734414, 108.533961], // Titik 10
            [-6.734394, 108.534022], // Titik 11
            [-6.734399, 108.534065], // Titik 12
            [-6.734371, 108.534125], // Titik 13
            [-6.734366, 108.534182], // Titik 14
            [-6.734407, 108.534234], // Titik 15
            [-6.73448, 108.534317],  // Titik 16
            [-6.7345, 108.534375],   // Titik 17
            [-6.734521, 108.534437], // Titik 18
            [-6.734671, 108.534431], // Titik 19
            [-6.735007, 108.534409], // Titik 20
            [-6.735415, 108.534381], // Titik 21
            [-6.735451, 108.534382], // Titik 22
            [-6.735521, 108.53438],  // Titik 23
            [-6.735512, 108.53407],  // Titik 24
            [-6.735526, 108.533833], // Titik 25
            [-6.735557, 108.533747], // Titik 26
            [-6.735653, 108.533445], // Titik 27
            [-6.735686, 108.533301]  // Titik 28
        ]
    },
    {
        id: 'gedung_cyber',
        name: 'Kawasan Gedung Cyber',
        polygon: [
            [-6.736657, 108.532119], // Titik 1
            [-6.736606, 108.531878], // Titik 2
            [-6.73677, 108.53183],   // Titik 3
            [-6.736749, 108.531772], // Titik 4
            [-6.736835, 108.531742], // Titik 5
            [-6.736923, 108.531803], // Titik 6
            [-6.737017, 108.531812], // Titik 7
            [-6.73707, 108.531856],  // Titik 8
            [-6.73708, 108.531886],  // Titik 9
            [-6.737129, 108.531861], // Titik 10
            [-6.737092, 108.531802], // Titik 11
            [-6.737039, 108.531783], // Titik 12
            [-6.736963, 108.531763], // Titik 13
            [-6.736919, 108.531755], // Titik 14
            [-6.736881, 108.531717], // Titik 15
            [-6.736885, 108.531289], // Titik 16
            [-6.7369, 108.531247],   // Titik 17
            [-6.736982, 108.530953], // Titik 18
            [-6.737375, 108.530886], // Titik 19
            [-6.737385, 108.530941], // Titik 20
            [-6.737541, 108.530991], // Titik 21
            [-6.737511, 108.531333], // Titik 22
            [-6.737449, 108.531372], // Titik 23
            [-6.737551, 108.531723], // Titik 24
            [-6.737597, 108.531716], // Titik 25
            [-6.737653, 108.531777], // Titik 26
            [-6.737658, 108.531806], // Titik 27
            [-6.737356, 108.531826], // Titik 28
            [-6.737369, 108.531927], // Titik 29
            [-6.737172, 108.531927], // Titik 30
            [-6.737124, 108.531959], // Titik 31
            [-6.73717, 108.531992],  // Titik 32
            [-6.737206, 108.532054], // Titik 33
            [-6.736907, 108.532081]  // Titik 34
        ]
    },
    {
        id: 'gedung_seberang',
        name: 'Kawasan Kampus Sebrang',
        polygon: [
            [-6.735765, 108.532911], // Titik 1
            [-6.735807, 108.532919], // Titik 2
            [-6.73581, 108.532697],  // Titik 3
            [-6.736038, 108.532686], // Titik 4
            [-6.736026, 108.53243],  // Titik 5
            [-6.736054, 108.532427], // Titik 6
            [-6.736034, 108.532055], // Titik 7
            [-6.736574, 108.532007], // Titik 8
            [-6.736592, 108.532099], // Titik 9
            [-6.736632, 108.532297], // Titik 10
            [-6.73671, 108.532561],  // Titik 11
            [-6.736783, 108.532774], // Titik 12
            [-6.736968, 108.533206], // Titik 13
            [-6.736612, 108.53332],  // Titik 14
            [-6.736577, 108.533241], // Titik 15
            [-6.736397, 108.533265], // Titik 16
            [-6.736263, 108.53327],  // Titik 17
            [-6.735803, 108.533278], // Titik 18
            [-6.735805, 108.532949], // Titik 19
            [-6.735767, 108.532941]  // Titik 20
        ]
    },
    {
        id: 'pascasarjana_mahad',
        name: 'Kawasan Pascasarjana & Mahad',
        polygon: [
            [-6.735741, 108.532103], // Titik 1
            [-6.735328, 108.532041], // Titik 2
            [-6.735324, 108.53185],  // Titik 3
            [-6.735429, 108.531793], // Titik 4
            [-6.735173, 108.530796], // Titik 5
            [-6.735125, 108.530783], // Titik 6
            [-6.735019, 108.530409], // Titik 7
            [-6.73478, 108.530161],  // Titik 8
            [-6.734611, 108.53022],  // Titik 9
            [-6.734513, 108.530226], // Titik 10
            [-6.734208, 108.530236], // Titik 11
            [-6.734061, 108.530274], // Titik 12
            [-6.734082, 108.530365], // Titik 13
            [-6.733881, 108.530425], // Titik 14
            [-6.734005, 108.53093],  // Titik 15
            [-6.734068, 108.531046], // Titik 16
            [-6.734067, 108.531142], // Titik 17
            [-6.734129, 108.531258], // Titik 18
            [-6.734128, 108.53134],  // Titik 19
            [-6.734156, 108.531433], // Titik 20
            [-6.734164, 108.531524], // Titik 21
            [-6.73418, 108.531542],  // Titik 22
            [-6.734381, 108.531519], // Titik 23
            [-6.734497, 108.532011], // Titik 24
            [-6.735102, 108.531903], // Titik 25
            [-6.735178, 108.532121], // Titik 26
            [-6.735597, 108.532221], // Titik 27
            [-6.735603, 108.532149], // Titik 28
            [-6.735726, 108.532169]  // Titik 29
        ]
    },
    {
        id: 'area_saladara',
        name: 'Kawasan Lab Saladara',
        polygon: [
            [-6.74438, 108.525562],  // Titik 1
            [-6.744371, 108.525831], // Titik 2
            [-6.744221, 108.525832], // Titik 3
            [-6.744103, 108.525895], // Titik 4
            [-6.743949, 108.525891], // Titik 5
            [-6.743796, 108.52589],  // Titik 6
            [-6.74367, 108.525885],  // Titik 7
            [-6.743579, 108.525892], // Titik 8
            [-6.743671, 108.525619], // Titik 9
            [-6.743712, 108.525621], // Titik 10
            [-6.743721, 108.525551], // Titik 11
            [-6.743724, 108.525508], // Titik 12
            [-6.743987, 108.525504], // Titik 13
            [-6.744019, 108.525506], // Titik 14
            [-6.744017, 108.525553]  // Titik 15
        ]
    }
];

function loadCampusZones() {
    const raw = localStorage.getItem(STORAGE_ZONES_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length === 5) {
                return parsed;
            }
        } catch(e) {
            console.error('Gagal membaca geofencing tersimpan', e);
        }
    }
    return JSON.parse(JSON.stringify(DEFAULT_CAMPUS_ZONES));
}

let CAMPUS_ZONES = loadCampusZones();

// Sinkronisasi Real-Time Geofencing saat Super Admin menyimpan batas baru di tab sebelah
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_ZONES_KEY) {
        CAMPUS_ZONES = loadCampusZones();
        console.info('Batas Geofencing diperbarui dari Super Admin.');
    }
});

const DEFAULT_CAMPUS_CENTER = { lat: -6.735000, lng: 108.533600 };

const PRESET_IMAGES = {
    ac: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23e2e8f0"><rect width="400" height="250" fill="%23f1f5f9"/><rect x="50" y="40" width="300" height="120" rx="10" fill="%23cbd5e1" stroke="%2394a3b8" stroke-width="3"/><rect x="70" y="130" width="260" height="15" fill="%2364748b"/><text x="200" y="90" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23475569" text-anchor="middle">AIR CONDITIONER (AC) - MENETES</text><path d="M 120 160 Q 120 190 120 210 M 200 160 Q 200 190 200 210 M 280 160 Q 280 190 280 210" stroke="%2338bdf8" stroke-width="4" stroke-dasharray="6,6"/></svg>',
    proyektor: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23e2e8f0"><rect width="400" height="250" fill="%231e293b"/><rect x="80" y="60" width="240" height="90" rx="12" fill="%23475569"/><circle cx="140" cy="105" r="28" fill="%230284c7"/><circle cx="140" cy="105" r="14" fill="%23000000"/><text x="200" y="190" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23ef4444" text-anchor="middle">PROYEKTOR EPSON - MATI TOTAL</text></svg>',
    toilet: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23e2e8f0"><rect width="400" height="250" fill="%23ecfeff"/><rect x="130" y="40" width="140" height="150" rx="10" fill="%2394a3b8"/><path d="M 140 120 Q 200 220 260 120 Z" fill="%23e2e8f0" stroke="%2364748b" stroke-width="3"/><text x="200" y="225" font-family="sans-serif" font-weight="bold" font-size="15" fill="%230369a1" text-anchor="middle">SANITASI - KRAN BOCOR</text></svg>',
    lampu: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23e2e8f0"><rect width="400" height="250" fill="%230f172a"/><circle cx="200" cy="100" r="40" fill="%23f59e0b" opacity="0.6"/><text x="200" y="210" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23fbbf24" text-anchor="middle">LAMPU NEON BERKEDIP</text></svg>'
};

const DEFAULT_SEED_DATA = [
    {
        id: 'TRK-2026-001',
        namaPelapor: 'Budi Santoso',
        nimNip: '220101844',
        peranPelapor: 'Mahasiswa',
        kontakPelapor: '081234567891',
        gedung: 'Laboratorium Terpadu & Pusat ICT',
        ruangan: 'Lab Komputer 3 (Lt. 2)',
        lat: '-6.735000',
        lng: '108.533800',
        kategori: 'AC & Pendingin',
        urgensi: 'Tinggi',
        deskripsi: 'AC nomor 2 berbunyi kencang dan meneteskan air lumayan deras tepat di atas unit komputer meja 14.',
        foto: PRESET_IMAGES.ac,
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
        gedung: 'Gedung Cyber UINSSC',
        ruangan: 'Ruang Kuliah Cyber.204',
        lat: '-6.737100',
        lng: '108.531500',
        kategori: 'Proyektor & Sound System',
        urgensi: 'Darurat',
        deskripsi: 'Proyektor gantung mati total saat jam perkuliahan. Lampu indikator merah berkedip.',
        foto: PRESET_IMAGES.proyektor,
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
        gedung: 'Area Gedung Seberang Kampus Utama',
        ruangan: 'Toilet Wanita Lantai 1',
        lat: '-6.736200',
        lng: '108.532700',
        kategori: 'Sanitasi & Toilet',
        urgensi: 'Sedang',
        deskripsi: 'Kran air wastafel sebelah kiri tidak bisa diputar dan air terus mengalir terbuang.',
        foto: PRESET_IMAGES.toilet,
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
        gedung: 'Gedung Rektorat UINSSC',
        ruangan: 'Ruang Rapat Utama Lt. 3',
        lat: '-6.735200',
        lng: '108.533200',
        kategori: 'Kelistrikan & Lampu',
        urgensi: 'Tinggi',
        deskripsi: 'Lampu LED ceiling berkedip terus dan menimbulkan suara dengung saat rapat berlangsung.',
        foto: PRESET_IMAGES.lampu,
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
        gedung: 'Fakultas Ilmu Tarbiyah (FITK)',
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
        gedung: 'Fakultas Syariah & Ekonomi (FSEI)',
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
        gedung: 'Fakultas Ushuluddin & Adab (FUAD)',
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
        gedung: 'Gedung Perpustakaan Pusat',
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
        gedung: 'Gedung Pascasarjana & Ma\'had',
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
        gedung: 'Kampus 2 Saladara UINSSC',
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
        gedung: 'Laboratorium Terpadu & Pusat ICT',
        ruangan: 'Foodcourt / Kantin Barat Stand 04',
        lat: '-6.735800',
        lng: '108.534100',
        kategori: 'Sanitasi & Toilet',
        urgensi: 'Tinggi',
        deskripsi: 'Pipa pembuangan wastafel cuci piring meluap sehingga air menggenang di selasar foodcourt kantin.',
        foto: PRESET_IMAGES ? PRESET_IMAGES.toilet : '',
        status: 'Diproses',
        teknisi: 'Rahmat (Plumbing)',
        catatanAdmin: 'Tim sanitasi sedang menangani sumbatan pipa air limbah kantin.',
        tanggalLapor: '2026-08-01 10:15',
        tanggalUpdate: '2026-08-01 11:30'
    }
];

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function applyUserPortalContent() {
    const raw = localStorage.getItem('SIMPEL_PORTAL_CONTENT_V1');
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        if (data.banner) {
            const b = data.banner;
            const badgeEl = document.getElementById('userHeroBannerBadge');
            const titleEl = document.getElementById('userHeroBannerTitle');
            const descEl = document.getElementById('userHeroBannerDesc');
            const cardEl = document.getElementById('userHeroBanner');
            const graphicEl = document.getElementById('userHeroBannerGraphic');

            if (badgeEl && b.badge) badgeEl.innerHTML = `<i class="fa-solid fa-bookmark"></i> ${escapeHtml(b.badge)}`;
            if (titleEl && b.title) titleEl.innerText = b.title;
            if (descEl && b.desc) descEl.innerText = b.desc;
            if (graphicEl && b.icon) graphicEl.innerHTML = `<i class="fa-solid ${escapeHtml(b.icon)}"></i>`;

            if (cardEl) {
                if (b.bgImage) {
                    cardEl.style.backgroundImage = `linear-gradient(rgba(0, 54, 32, 0.75), rgba(0, 40, 22, 0.88)), url('${b.bgImage}')`;
                    cardEl.style.backgroundSize = 'cover';
                    cardEl.style.backgroundPosition = 'center';
                } else {
                    cardEl.style.backgroundImage = '';
                    cardEl.style.backgroundSize = '';
                    cardEl.style.backgroundPosition = '';
                }
            }
        }
    } catch (e) {
        console.warn('Gagal memuat konten banner portal user:', e);
    }
}

function initUserCategories() {
    const select = document.getElementById('kategori');
    if (!select) return;

    const raw = localStorage.getItem('SIMPEL_CATEGORIES_DATA_V1');
    if (!raw) return;

    try {
        const cats = JSON.parse(raw);
        if (!Array.isArray(cats) || cats.length === 0) return;

        const activeCats = cats.filter(c => c.status === 'Aktif');
        if (activeCats.length === 0) return;

        const currentVal = select.value;

        select.innerHTML = `<option value="">-- Pilih Kategori --</option>` +
            activeCats.map(c => `<option value="${escapeHtml(c.nama)}">${escapeHtml(c.nama)}</option>`).join('') +
            `<option value="Lainnya">Fasilitas Lainnya</option>`;

        if (currentVal) select.value = currentVal;
    } catch (e) {
        console.warn('Gagal memuat kategori dinamis di form user:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkUserAuth();
    initTheme();
    applyUserPortalContent();
    initUserCategories();
    loadReports().then(() => {
        updateMyReportsBadge();
        updateUserKPIs();
    });
    initMapPicker();
});

window.addEventListener('storage', (e) => {
    if (e.key === 'SIMPEL_PORTAL_CONTENT_V1') {
        applyUserPortalContent();
    }
    if (e.key === 'SIMPEL_CATEGORIES_DATA_V1') {
        initUserCategories();
    }
});

function checkUserAuth() {
    const sessionRaw = localStorage.getItem('SIMPEL_AUTH_SESSION');
    if (!sessionRaw) {
        window.location.href = '../index.html';
        return;
    }
    try {
        const sess = JSON.parse(sessionRaw);
        const el = document.getElementById('userBadgeName');
        const displayName = sess.name || sess.username || 'Civitas UINSSC';
        const isMitra = (sess.role === 'mitra');

        if (el) {
            if (isMitra) {
                el.innerHTML = `<i class="fa-solid fa-handshake" style="color:#facc15; margin-right:4px;"></i> Mitra: ${escapeHtml(displayName)}`;
                const userBadge = el.closest('.user-badge');
                if (userBadge) {
                    userBadge.style.borderColor = '#facc15';
                    userBadge.style.background = 'rgba(250, 204, 21, 0.12)';
                }
            } else {
                el.innerHTML = `<i class="fa-solid fa-graduation-cap" style="color:var(--gold); margin-right:4px;"></i> ${escapeHtml(displayName)}`;
            }
        }

        prefillPelaporDataFromSession();

        // Listener jika peran diganti manual
        const peranSelect = document.getElementById('peranPelapor');
        if (peranSelect) {
            peranSelect.addEventListener('change', (e) => {
                const icon = document.getElementById('peranIcon');
                if (icon) {
                    if (e.target.value === 'Mitra Kampus') {
                        icon.className = 'fa-solid fa-handshake';
                        icon.style.color = '#facc15';
                    } else {
                        icon.className = 'fa-solid fa-graduation-cap';
                        icon.style.color = 'var(--gold)';
                    }
                }
            });
        }
    } catch (e) {
        console.warn('Gagal memproses sesi user:', e);
    }
}

function prefillPelaporDataFromSession() {
    const sessionRaw = localStorage.getItem('SIMPEL_AUTH_SESSION');
    if (!sessionRaw) return;
    try {
        const sess = JSON.parse(sessionRaw);
        const isMitra = (sess.role === 'mitra');
        const namaInput = document.getElementById('namaPelapor');
        const nimInput = document.getElementById('nimNip');
        const kontakInput = document.getElementById('kontakPelapor');
        const peranSelect = document.getElementById('peranPelapor');
        const peranIcon = document.getElementById('peranIcon');

        if (isMitra) {
            if (namaInput) namaInput.value = sess.name || '';
            if (nimInput) nimInput.value = sess.nimNip || sess.username || '';
            if (kontakInput && sess.wa) kontakInput.value = sess.wa;
            if (peranSelect) peranSelect.value = 'Mitra Kampus';
            if (peranIcon) {
                peranIcon.className = 'fa-solid fa-handshake';
                peranIcon.style.color = '#facc15';
            }
        }
    } catch (e) {}
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
}

function handleLogout() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Konfirmasi Keluar',
            text: 'Apakah Anda yakin ingin keluar dari akun SIMPEL UINSSC?',
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
                    text: 'Sesi Anda telah diakhiri dengan aman.',
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
    showToast('🔑 Anda telah berhasil keluar dari sistem. Mengalihkan ke pintu login...', 'info');
    localStorage.removeItem('SIMPEL_AUTH_SESSION');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1200);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

async function loadReports() {
    let loadedSuccess = false;
    try {
        const res = await fetch('../api/reports.php').catch(() => fetch('../api.php'));
        if (res && res.ok) {
            const text = await res.text();
            if (text.trim().startsWith('[')) {
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
            } catch (e) {
                reportsData = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
                saveReports();
            }
        } else {
            reportsData = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
            saveReports();
        }
    }
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

// Algoritma Ray-Casting untuk 1 Polygon
function isPointInSinglePolygon(point, vs) {
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

// Memeriksa apakah titik berada di SALAH SATU zona kampus UINSSC
function isInsideCampus(lat, lng) {
    if (isDrawModeActive) return true;
    if (CAMPUS_ZONES.length === 0) return true;
    const pt = [parseFloat(lat), parseFloat(lng)];
    return CAMPUS_ZONES.some(zone => isPointInSinglePolygon(pt, zone.polygon));
}

// Leaflet Map Picker Initialization (Masked, Center of All Zones & Comfortable Zoom 16-19)
function initMapPicker() {
    const container = document.getElementById('mapPicker');
    if (!container || typeof L === 'undefined') return;

    try {
        if (mapPickerInstance) {
            mapPickerInstance.remove();
        }

        // Feature Group untuk Menghitung Center & Bounds Seluruh 4 Zona Kampus
        const polygonGroup = L.featureGroup();
        CAMPUS_ZONES.forEach(z => {
            const poly = L.polygon(z.polygon);
            polygonGroup.addLayer(poly);
        });

        const combinedBounds = polygonGroup.getBounds();
        const centerAll = combinedBounds.getCenter();

        // Pin marker center tengah seluruh zona kampus (input koordinat tetap kosong sampai dipilih)
        currentLat = centerAll.lat.toFixed(6);
        currentLng = centerAll.lng.toFixed(6);

        // Map Initialization (Bebas Pan & Zoom dengan tombol penuntun ke area kampus)
        mapPickerInstance = L.map('mapPicker', {
            center: [centerAll.lat, centerAll.lng],
            zoom: 16,
            minZoom: 2,
            maxZoom: 22
        });

        // OpenStreetMap Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 2,
            maxZoom: 22,
            maxNativeZoom: 19,
            attribution: '&copy; OpenStreetMap & UINSSC'
        }).addTo(mapPickerInstance);

        // 1. Render White Mask Overlay (Default Masking Putih)
        const outerWorld = [
            [85.0511, -179.99],
            [85.0511, 179.99],
            [-85.0511, 179.99],
            [-85.0511, -179.99]
        ];
        const campusHoles = CAMPUS_ZONES.map(z => z.polygon);
        const safeSvgRenderer = L.svg({ padding: 2.0 });

        campusMaskPolygon = L.polygon([outerWorld, ...campusHoles], {
            renderer: safeSvgRenderer,
            color: '#c59235',
            weight: 2.5,
            dashArray: '5, 5',
            fillColor: '#ffffff',
            fillOpacity: 0.76,
            interactive: false
        }).addTo(mapPickerInstance);

        // 2. Render Highlight Polygons untuk Setiap Zona Kampus
        CAMPUS_ZONES.forEach(zone => {
            const poly = L.polygon(zone.polygon, {
                color: '#c59235',
                weight: 2,
                fillColor: '#005a36',
                fillOpacity: 0.2
            }).addTo(mapPickerInstance);

            poly.bindTooltip(`<b>${zone.name}</b>`, { permanent: false, direction: 'center' });
        });

        // Auto Fit Bounds ke Seluruh Zona Kampus UINSSC saat pertama muat
        mapPickerInstance.fitBounds(combinedBounds, { padding: [20, 20] });

        // Marker Pin Titik Kerusakan TIDAK dimunculkan secara default (menunggu klik / GPS / pilih kawasan)
        mapMarkerInstance = null;

        // Map Click Event: Menempatkan / memindahkan marker ke titik klik secara presisi
        mapPickerInstance.on('click', function (e) {
            if (isDrawModeActive) {
                handleMapClickForPolygon(e.latlng.lat, e.latlng.lng);
                return;
            }

            if (!mapMarkerInstance) {
                mapMarkerInstance = L.marker(e.latlng, { draggable: true }).addTo(mapPickerInstance);
                mapMarkerInstance.bindPopup('<b>Titik Lokasi Kerusakan</b><br>Geser pin jika perlu menyesuaikan posisi presisi.').openPopup();
                mapMarkerInstance.on('dragend', function () {
                    const pos = mapMarkerInstance.getLatLng();
                    updateCoordinatesDisplay(pos.lat, pos.lng);
                    if (!isInsideCampus(pos.lat, pos.lng)) {
                        showToast('Info: Titik lokasi berada di luar batas utama zona gedung.', 'info');
                    }
                });
            } else {
                mapMarkerInstance.setLatLng(e.latlng);
            }

            updateCoordinatesDisplay(e.latlng.lat, e.latlng.lng);
            if (!isInsideCampus(e.latlng.lat, e.latlng.lng)) {
                showToast('Info: Titik lokasi berada di luar batas utama zona gedung.', 'info');
            }
        });
    } catch (err) {
        console.error('Error init map:', err);
    }
}

// Smart Map Camera Navigation saat pengguna memilih Kawasan / Gedung
function handleGedungSelectChange() {
    const select = document.getElementById('gedung');
    if (!select || !mapPickerInstance) return;

    const selectedOpt = select.options[select.selectedIndex];
    const zoneId = selectedOpt ? selectedOpt.getAttribute('data-zone') : null;

    if (zoneId) {
        const targetZone = CAMPUS_ZONES.find(z => z.id === zoneId);
        if (targetZone) {
            const poly = L.polygon(targetZone.polygon);
            const bounds = poly.getBounds();
            const center = bounds.getCenter();

            // Animasi kamera terbang ke kawasan kampus yang dipilih
            mapPickerInstance.flyToBounds(bounds, {
                padding: [30, 30],
                duration: 1.2,
                maxZoom: 18
            });

            // Pindahkan / buat pin marker ke tengah kawasan gedung yang dipilih
            if (!mapMarkerInstance) {
                mapMarkerInstance = L.marker([center.lat, center.lng], { draggable: true }).addTo(mapPickerInstance);
                mapMarkerInstance.on('dragend', function () {
                    const pos = mapMarkerInstance.getLatLng();
                    updateCoordinatesDisplay(pos.lat, pos.lng);
                    if (!isInsideCampus(pos.lat, pos.lng)) {
                        showToast('Info: Titik lokasi berada di luar batas utama zona gedung.', 'info');
                    }
                });
            } else {
                mapMarkerInstance.setLatLng([center.lat, center.lng]);
            }
            updateCoordinatesDisplay(center.lat, center.lng);
            mapMarkerInstance.bindPopup(`<b>${escapeHtml(selectedOpt.value)}</b><br>Kamera & titik lokasi disesuaikan ke area gedung ini.`).openPopup();
            showToast(`Fokus peta dipindahkan ke ${targetZone.name}.`, 'info');
        }
    }
    checkDuplicateWarning();
}

function focusMapToCampus() {
    if (!mapPickerInstance || CAMPUS_ZONES.length === 0) return;
    const polygonGroup = L.featureGroup();
    CAMPUS_ZONES.forEach(z => {
        const poly = L.polygon(z.polygon);
        polygonGroup.addLayer(poly);
    });
    const combinedBounds = polygonGroup.getBounds();
    mapPickerInstance.fitBounds(combinedBounds, { padding: [30, 30] });
    showToast('📍 Kamera terfokus kembali ke area Kampus UINSSC', 'info');
}

let campusMaskPolygon = null;
let isMaskEnabled = true;

function toggleCampusMask() {
    if (!mapPickerInstance || !campusMaskPolygon) return;
    const btn = document.getElementById('toggleMaskBtn');
    const container = document.getElementById('mapPicker');
    if (isMaskEnabled) {
        mapPickerInstance.removeLayer(campusMaskPolygon);
        isMaskEnabled = false;
        if (container) container.style.background = '#ffffff';
        if (btn) btn.innerHTML = `<i class="fa-solid fa-eye" style="color:var(--gold);"></i> Tampilkan Masking`;
        showToast('Masking putih dinonaktifkan (Peta penuh)', 'info');
    } else {
        campusMaskPolygon.addTo(mapPickerInstance);
        isMaskEnabled = true;
        if (container) container.style.background = '#ffffff';
        if (btn) btn.innerHTML = `<i class="fa-solid fa-eye-slash" style="color:var(--gold);"></i> Sembunyikan Masking`;
        showToast('Masking putih fokus kampus diaktifkan', 'info');
    }
}

// ==========================================================================
// INTERACTIVE POLYGON DESIGNER TOOL (ALAT PENGUMPUL KOORDINAT INTERAKTIF)
// ==========================================================================
let isDrawModeActive = false;
let drawnPoints = [];
let drawnPolygonLayer = null;
let drawnMarkers = [];

function togglePolygonDrawMode() {
    isDrawModeActive = !isDrawModeActive;
    const btn = document.getElementById('btnToggleDrawMode');
    const tools = document.getElementById('drawModeTools');

    if (isDrawModeActive) {
        btn.classList.add('active');
        btn.style.background = 'var(--gold)';
        btn.style.color = '#fff';
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Selesai / Nonaktifkan Mode';
        tools.classList.remove('hidden');
        showToast('Mode Gambar Polygon Aktif! Klik sudut-sudut kampus pada peta.', 'info');
    } else {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.color = '';
        btn.innerHTML = '<i class="fa-solid fa-pen-ruler"></i> Aktifkan Mode Gambar Polygon';
        tools.classList.add('hidden');
    }
}

function handleMapClickForPolygon(lat, lng) {
    if (!isDrawModeActive) return false;

    const latFixed = parseFloat(lat.toFixed(6));
    const lngFixed = parseFloat(lng.toFixed(6));
    drawnPoints.push([latFixed, lngFixed]);

    if (typeof L !== 'undefined' && mapPickerInstance) {
        const ptMarker = L.circleMarker([latFixed, lngFixed], {
            radius: 5,
            color: '#f59e0b',
            fillColor: '#f59e0b',
            fillOpacity: 1
        }).addTo(mapPickerInstance);
        drawnMarkers.push(ptMarker);

        if (drawnPolygonLayer) {
            mapPickerInstance.removeLayer(drawnPolygonLayer);
        }
        if (drawnPoints.length >= 2) {
            drawnPolygonLayer = L.polygon(drawnPoints, {
                color: '#f59e0b',
                weight: 3,
                dashArray: '4, 4',
                fillColor: '#005a36',
                fillOpacity: 0.35
            }).addTo(mapPickerInstance);
        }
    }

    updatePolygonCodeOutput();
    return true;
}

function clearDrawnPolygon() {
    drawnPoints = [];
    if (drawnPolygonLayer && mapPickerInstance) {
        mapPickerInstance.removeLayer(drawnPolygonLayer);
        drawnPolygonLayer = null;
    }
    drawnMarkers.forEach(m => m.remove());
    drawnMarkers = [];
    updatePolygonCodeOutput();
    showToast('Semua titik polygon dibersihkan.', 'info');
}

function updatePolygonCodeOutput() {
    const area = document.getElementById('polygonOutputCode');
    if (!area) return;

    if (drawnPoints.length === 0) {
        area.value = 'const CAMPUS_POLYGON_POINTS = [];';
        return;
    }

    let code = 'const CAMPUS_POLYGON_POINTS = [\n';
    drawnPoints.forEach((pt, idx) => {
        const isLast = idx === drawnPoints.length - 1;
        code += `    [${pt[0]}, ${pt[1]}]${isLast ? '' : ','} // Titik ${idx + 1}\n`;
    });
    code += '];';

    area.value = code;
}

function copyPolygonCode() {
    const area = document.getElementById('polygonOutputCode');
    if (area && area.value) {
        navigator.clipboard.writeText(area.value);
        showToast('Array Kode Polygon berhasil disalin ke clipboard!', 'success');
    }
}

function updateCoordinatesDisplay(lat, lng) {
    currentLat = parseFloat(lat).toFixed(6);
    currentLng = parseFloat(lng).toFixed(6);
    document.getElementById('latInput').value = currentLat;
    document.getElementById('lngInput').value = currentLng;
}

function getCurrentGPSLocation() {
    if (!navigator.geolocation) {
        showToast('Browser Anda tidak mendukung Geolocation GPS', 'error');
        return;
    }

    showToast('Mengambil lokasi presisi GPS...', 'info');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            updateCoordinatesDisplay(lat, lng);

            if (mapPickerInstance) {
                mapPickerInstance.setView([lat, lng], 17);
                if (!mapMarkerInstance) {
                    mapMarkerInstance = L.marker([lat, lng], { draggable: true }).addTo(mapPickerInstance);
                    mapMarkerInstance.on('dragend', function () {
                        const pos = mapMarkerInstance.getLatLng();
                        updateCoordinatesDisplay(pos.lat, pos.lng);
                    });
                } else {
                    mapMarkerInstance.setLatLng([lat, lng]);
                }
                mapMarkerInstance.bindPopup('<b>Lokasi GPS Anda Terunci!</b><br>Geser pin jika perlu disesuaikan.').openPopup();
            }
            showToast('Lokasi presisi GPS terdeteksi!', 'success');
        },
        (error) => {
            console.warn('GPS Error', error);
            showToast('Gagal mengambil lokasi GPS. Menutup ke posisi default UINSSC.', 'error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function resetReportLocationMarker() {
    if (mapMarkerInstance && mapPickerInstance) {
        mapPickerInstance.removeLayer(mapMarkerInstance);
        mapMarkerInstance = null;
    }
    currentLat = '';
    currentLng = '';
    const latInp = document.getElementById('latInput');
    const lngInp = document.getElementById('lngInput');
    if (latInp) latInp.value = '';
    if (lngInp) lngInp.value = '';
}

function escapeHtml(str) {
    if (!str) return '';
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(String(str));
    }
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function switchUserTab(tab) {
    const tabLapor = document.getElementById('tabLapor');
    const tabRiwayat = document.getElementById('tabRiwayat');
    const tabLacak = document.getElementById('tabLacak');
    const secForm = document.getElementById('sectionForm');
    const secRiwayat = document.getElementById('sectionRiwayat');
    const secLacak = document.getElementById('sectionLacak');

    if (tabLapor) tabLapor.classList.remove('active');
    if (tabRiwayat) tabRiwayat.classList.remove('active');
    if (tabLacak) tabLacak.classList.remove('active');

    if (secForm) secForm.classList.add('hidden');
    if (secRiwayat) secRiwayat.classList.add('hidden');
    if (secLacak) secLacak.classList.add('hidden');

    if (tab === 'lapor') {
        if (tabLapor) tabLapor.classList.add('active');
        if (secForm) secForm.classList.remove('hidden');
        if (mapPickerInstance) {
            setTimeout(() => mapPickerInstance.invalidateSize(), 300);
        }
    } else if (tab === 'riwayat') {
        if (tabRiwayat) tabRiwayat.classList.add('active');
        if (secRiwayat) secRiwayat.classList.remove('hidden');
        renderMyReportsHistory();
    } else {
        if (tabLacak) tabLacak.classList.add('active');
        if (secLacak) secLacak.classList.remove('hidden');
    }
}

function handleKategoriChange() {
    const select = document.getElementById('kategori');
    const wrapper = document.getElementById('kategoriLainnyaWrapper');
    const input = document.getElementById('kategoriLainnyaInput');

    if (select.value === 'Lainnya') {
        wrapper.classList.remove('hidden');
        input.required = true;
        input.focus();
    } else {
        wrapper.classList.add('hidden');
        input.required = false;
        input.value = '';
    }
    checkDuplicateWarning();
}

// Pencegahan Laporan Serupa / Duplikat (Smart Early Warning)
function checkDuplicateWarning() {
    const gedungEl = document.getElementById('gedung');
    const ruanganEl = document.getElementById('ruangan');
    const kategoriEl = document.getElementById('kategori');
    const warnBox = document.getElementById('duplicateWarningBox');
    const warnText = document.getElementById('duplicateWarningText');

    if (!gedungEl || !ruanganEl || !kategoriEl || !warnBox || !warnText) return;

    const gedung = gedungEl.value.trim();
    const ruangan = ruanganEl.value.trim().toLowerCase();
    let kategori = kategoriEl.value;
    if (kategori === 'Lainnya') {
        const custom = document.getElementById('kategoriLainnyaInput').value.trim();
        if (custom) kategori = custom;
    }

    if (!gedung || !ruangan || !kategori || kategori === '') {
        warnBox.classList.add('hidden');
        return;
    }

    // Cari laporan aktif yang belum selesai di gedung & ruangan ini dengan kategori serupa
    const matched = reportsData.filter(r => 
        (r.status === 'Diajukan' || r.status === 'Diproses') &&
        r.gedung === gedung &&
        (r.ruangan.toLowerCase().includes(ruangan) || ruangan.includes(r.ruangan.toLowerCase())) &&
        r.kategori.toLowerCase().includes(kategori.toLowerCase())
    );

    if (matched.length > 0) {
        const first = matched[0];
        warnText.innerHTML = `Laporan aktif terkait <strong>${escapeHtml(first.kategori)}</strong> di ruangan ini telah dilaporkan sebelumnya oleh <em>${escapeHtml(first.namaPelapor)}</em> (Tiket: <strong>${first.id}</strong>) berstatus <strong style="color:var(--gold);">${first.status}</strong>.<br>Ada total <strong>${matched.length} laporan</strong> serupa yang sedang ditangani.`;
        warnBox.classList.remove('hidden');
    } else {
        warnBox.classList.add('hidden');
    }
}

function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showToast('⚠️ Ukuran foto melebihi batas 5MB!', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        selectedImage = e.target.result;
        document.getElementById('dropzoneText').classList.add('hidden');
        document.getElementById('previewBox').classList.remove('hidden');
        document.getElementById('imgPreview').src = selectedImage;
        showToast('Foto bukti berhasil diunggah.', 'success');
    };
    reader.readAsDataURL(file);
}

function removeFoto(event) {
    if (event) event.stopPropagation();
    selectedImage = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('imgPreview').src = '';
    document.getElementById('previewBox').classList.add('hidden');
    document.getElementById('dropzoneText').classList.remove('hidden');
}

// Modal Tinjau Laporan Sebelum Dikirim (Pre-Submission Review)
function openReviewBeforeSubmit() {
    const form = document.getElementById('publicReportForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (!selectedImage) {
        showToast('⚠️ Foto bukti fisik kerusakan wajib diunggah!', 'error');
        const dropzone = document.getElementById('uploadDropzoneBox');
        if (dropzone) {
            dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
            dropzone.style.borderColor = '#ef4444';
            dropzone.style.boxShadow = '0 0 16px rgba(239, 68, 68, 0.4)';
            setTimeout(() => {
                dropzone.style.borderColor = '';
                dropzone.style.boxShadow = '';
            }, 2500);
        }
        return;
    }

    const nama = document.getElementById('namaPelapor').value.trim();
    const nim = document.getElementById('nimNip').value.trim();
    const peran = document.getElementById('peranPelapor').value;
    const kontak = document.getElementById('kontakPelapor').value.trim();
    const gedung = document.getElementById('gedung').value;
    const ruangan = document.getElementById('ruangan').value.trim();
    let kategori = document.getElementById('kategori').value;
    if (kategori === 'Lainnya') {
        const customCat = document.getElementById('kategoriLainnyaInput').value.trim();
        kategori = customCat ? `Lainnya (${customCat})` : 'Fasilitas Lainnya';
    }
    const urgensi = document.getElementById('urgensi').value;
    const deskripsi = document.getElementById('deskripsi').value.trim();
    const lat = document.getElementById('latInput').value || currentLat;
    const lng = document.getElementById('lngInput').value || currentLng;

    const content = document.getElementById('reviewModalContent');
    content.innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div><span style="color:var(--text-muted); font-size:12px; display:block;">Pelapor:</span><strong>${escapeHtml(nama)}</strong> (${escapeHtml(nim)})</div>
            <div><span style="color:var(--text-muted); font-size:12px; display:block;">Peran & Kontak:</span>${escapeHtml(peran)} - ${escapeHtml(kontak)}</div>
            <div><span style="color:var(--text-muted); font-size:12px; display:block;">Lokasi Gedung:</span>${escapeHtml(gedung)}</div>
            <div><span style="color:var(--text-muted); font-size:12px; display:block;">Ruangan:</span><strong>${escapeHtml(ruangan)}</strong></div>
            <div><span style="color:var(--text-muted); font-size:12px; display:block;">Kategori Fasilitas:</span><strong style="color:var(--gold);">${escapeHtml(kategori)}</strong></div>
            <div><span style="color:var(--text-muted); font-size:12px; display:block;">Tingkat Urgensi:</span><span class="dot-urgensi dot-${urgensi}"></span> <strong>${escapeHtml(urgensi)}</strong></div>
        </div>
        <div style="margin-bottom:12px; padding:8px 12px; background:rgba(0,0,0,0.1); border-radius:8px;">
            <i class="fa-solid fa-map-pin" style="color:var(--gold);"></i> <strong>Koordinat Presisi GPS:</strong> <span style="font-family:monospace; color:var(--gold);">${lat}, ${lng}</span>
        </div>
        <div style="margin-bottom:14px;">
            <span style="color:var(--text-muted); font-size:12px; display:block;">Deskripsi Kerusakan:</span>
            <p style="background:rgba(0,0,0,0.15); padding:10px; border-radius:8px; margin-top:4px;">${escapeHtml(deskripsi)}</p>
        </div>
        <div>
            <span style="color:var(--text-muted); font-size:12px; display:block; margin-bottom:6px;">Foto Bukti Fisik:</span>
            <img src="${selectedImage}" alt="Foto Bukti" style="max-height:150px; border-radius:8px; border:1px solid var(--border-color); object-fit:cover;">
        </div>
    `;

    document.getElementById('reviewModal').classList.remove('hidden');
}

function closeReviewModal() {
    const m = document.getElementById('reviewModal');
    if (m) m.classList.add('hidden');
}

function confirmSubmitReport() {
    closeReviewModal();
    const form = document.getElementById('publicReportForm');
    if (form) {
        form.requestSubmit();
    }
}

// Anti-Spam & Submission Logic
const SUBMIT_COOLDOWN_MS = 45 * 1000; // 45 Detik Cooldown Anti-Spam

async function handlePublicFormSubmit(event) {
    event.preventDefault();

    // 1. Wajib Gambar Check
    if (!selectedImage) {
        showToast('⚠️ Foto bukti fisik kerusakan wajib diunggah!', 'error');
        const dropzone = document.getElementById('uploadDropzoneBox');
        if (dropzone) {
            dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
            dropzone.style.borderColor = '#ef4444';
            dropzone.style.boxShadow = '0 0 16px rgba(239, 68, 68, 0.4)';
            setTimeout(() => {
                dropzone.style.borderColor = '';
                dropzone.style.boxShadow = '';
            }, 2500);
        }
        return;
    }

    const namaPelapor = document.getElementById('namaPelapor').value.trim();
    const nimNip = document.getElementById('nimNip').value.trim();
    const peranPelapor = document.getElementById('peranPelapor').value;
    const kontakPelapor = document.getElementById('kontakPelapor').value.trim();
    const gedung = document.getElementById('gedung').value;
    const ruangan = document.getElementById('ruangan').value.trim();
    const lat = document.getElementById('latInput').value || currentLat;
    const lng = document.getElementById('lngInput').value || currentLng;
    let kategori = document.getElementById('kategori').value;
    if (kategori === 'Lainnya') {
        const customCat = document.getElementById('kategoriLainnyaInput').value.trim();
        kategori = customCat ? `Lainnya (${customCat})` : 'Fasilitas Lainnya';
    }
    const urgensi = document.getElementById('urgensi').value;
    const deskripsi = document.getElementById('deskripsi').value.trim();

    // 2. Anti-Spam: Rate Limit Cooldown
    const lastSubmitTime = parseInt(localStorage.getItem('SIMPEL_LAST_SUBMIT_TIME') || '0', 10);
    const nowMs = Date.now();
    if (nowMs - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
        const remaining = Math.ceil((SUBMIT_COOLDOWN_MS - (nowMs - lastSubmitTime)) / 1000);
        showToast(`⏳ Harap tunggu ${remaining} detik sebelum mengirim laporan baru (Perlindungan Anti-Spam).`, 'error');
        return;
    }

    // 3. Anti-Spam: Cegah pelapor yang sama mengirim laporan ganda di ruangan & kategori yang sama saat masih aktif
    const sameActiveReport = reportsData.find(r => 
        r.nimNip.toLowerCase() === nimNip.toLowerCase() &&
        r.gedung === gedung &&
        r.ruangan.toLowerCase() === ruangan.toLowerCase() &&
        r.kategori.toLowerCase() === kategori.toLowerCase() &&
        (r.status === 'Diajukan' || r.status === 'Diproses')
    );
    if (sameActiveReport) {
        showToast(`⚠️ Anda sudah memiliki laporan aktif (#${sameActiveReport.id}) untuk masalah ini. Cek tab 'Riwayat Laporan'.`, 'error');
        return;
    }

    // 4. Loading state tombol kirim
    const submitBtn = document.getElementById('btnSubmitReport');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Laporan...';
    }

    const year = new Date().getFullYear();
    const ticketCode = `TRK-${year}-${Math.floor(100 + Math.random() * 900)}`;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReport = {
        id: ticketCode,
        namaPelapor,
        nimNip,
        peranPelapor,
        kontakPelapor,
        gedung,
        ruangan,
        lat,
        lng,
        kategori,
        urgensi,
        deskripsi,
        foto: selectedImage,
        status: 'Diajukan',
        teknisi: 'Belum Ditunjuk',
        catatanAdmin: 'Laporan telah diterima dan diteruskan ke tim pemeliharaan Sarpras Kampus UINSSC.',
        tanggalLapor: timeStr,
        tanggalUpdate: timeStr
    };

    reportsData.unshift(newReport);
    await saveReports();

    // Catat timestamp dan tiket ke riwayat lokal
    localStorage.setItem('SIMPEL_LAST_SUBMIT_TIME', String(nowMs));
    saveMyTicketId(ticketCode);

    lastTicketCode = ticketCode;
    document.getElementById('createdTicketDisplay').innerText = ticketCode;
    renderTicketQRCode(ticketCode);
    document.getElementById('successModal').classList.remove('hidden');

    // Reset Form
    document.getElementById('publicReportForm').reset();
    prefillPelaporDataFromSession();
    resetReportLocationMarker();
    removeFoto();
    handleKategoriChange();
    checkDuplicateWarning();

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Laporan';
    }
}

// Render QR Code untuk Tiket Pelaporan (QRCode.js)
function renderTicketQRCode(ticketId) {
    const box = document.getElementById('ticketQrBox');
    if (!box) return;
    box.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
        try {
            new QRCode(box, {
                text: ticketId,
                width: 100,
                height: 100,
                colorDark: "#005a36",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        } catch(e) {
            console.warn('QRCode error', e);
            box.innerHTML = `<span style="font-family:monospace; font-weight:800; color:#005a36;">${escapeHtml(ticketId)}</span>`;
        }
    } else {
        box.innerHTML = `<span style="font-family:monospace; font-weight:800; color:#005a36;">${escapeHtml(ticketId)}</span>`;
    }
}

function copyCreatedCode() {
    if (!lastTicketCode) return;
    navigator.clipboard.writeText(lastTicketCode).then(() => {
        showToast(`📋 Kode tiket ${lastTicketCode} berhasil disalin!`, 'success');
    }).catch(() => {
        showToast(`Kode tiket: ${lastTicketCode}`, 'info');
    });
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('hidden');
    if (lastTicketCode) {
        switchUserTab('lacak');
        const input = document.getElementById('ticketSearchInput');
        if (input) {
            input.value = lastTicketCode;
            doSearchTicket();
        }
    }
}

// Unduh Dokumen PDF Resmi Tiket Pelaporan (html2pdf.js)
function downloadOfficialTicketPDF(ticketId) {
    const report = reportsData.find(r => r.id === ticketId);
    if (!report) {
        showToast('Data tiket tidak ditemukan.', 'error');
        return;
    }

    if (typeof html2pdf === 'undefined') {
        printTicketPDF(ticketId);
        return;
    }

    showToast('📄 Sedang mengonversi tiket ke dokumen PDF resmi...', 'info');

    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'tempPdfDownloadBox';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '750px';
    pdfContainer.style.padding = '36px 40px';
    pdfContainer.style.background = '#ffffff';
    pdfContainer.style.color = '#0f172a';
    pdfContainer.style.fontFamily = "'Plus Jakarta Sans', Arial, sans-serif";

    pdfContainer.innerHTML = `
        <div style="border-bottom: 3px double #c59235; padding-bottom: 16px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display:flex; align-items:center; gap:16px;">
                <img src="../assets/img/logo.png" style="height:64px;" onerror="this.style.display='none'">
                <div>
                    <h2 style="font-size: 18px; font-weight: 800; color: #005a36; margin: 0; text-transform: uppercase;">UIN Siber Syekh Nurjati Cirebon</h2>
                    <p style="font-size: 12px; color: #64748b; margin: 3px 0 0 0; font-weight: 600;">Sistem Informasi Pelaporan & Pemeliharaan Sarpras Kampus (SIMPEL UINSSC)</p>
                    <span style="font-size: 10px; color: #94a3b8;">Jl. Perjuangan, Sunyaragi, Kec. Kesambi, Kota Cirebon, Jawa Barat 45132</span>
                </div>
            </div>
            <div style="text-align: right;">
                <span style="font-size: 10px; font-weight: 700; color: #c59235; text-transform: uppercase; letter-spacing: 0.5px;">Dokumen Resmi</span>
                <div style="font-family: monospace; font-size: 16px; font-weight: 800; color: #005a36;">${escapeHtml(report.id)}</div>
            </div>
        </div>

        <div style="background: #f8fafc; border: 1.5px dashed #c59235; border-radius: 12px; padding: 18px 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Bukti Pengajuan Tiket Sarpras</span>
                <div style="font-size: 26px; font-weight: 900; font-family: monospace; color: #005a36; margin: 2px 0;">${escapeHtml(report.id)}</div>
                <div style="font-size: 12px; color: #475569;">Diajukan pada: <strong>${escapeHtml(report.tanggalLapor)}</strong></div>
            </div>
            <div style="text-align: center;">
                <div style="background: #005a36; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 800;">
                    STATUS: ${escapeHtml(report.status).toUpperCase()}
                </div>
                <span style="font-size: 10px; color: #64748b; display: block; margin-top: 4px;">Urgensi: ${escapeHtml(report.urgensi)}</span>
            </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
            <tbody>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: 700; width: 30%; color: #475569; background: #f8fafc;">Nama Pelapor</td><td style="padding: 10px; color: #0f172a; font-weight: 700;">${escapeHtml(report.namaPelapor)} (${escapeHtml(report.nimNip)})</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: 700; color: #475569; background: #f8fafc;">Status / Peran</td><td style="padding: 10px; color: #0f172a;">${escapeHtml(report.peranPelapor)} | Kontak: ${escapeHtml(report.kontakPelapor)}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: 700; color: #475569; background: #f8fafc;">Kawasan & Gedung</td><td style="padding: 10px; color: #0f172a; font-weight: 700;">${escapeHtml(report.gedung)}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: 700; color: #475569; background: #f8fafc;">Ruangan / Lokasi Spesifik</td><td style="padding: 10px; color: #0f172a;">${escapeHtml(report.ruangan)}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: 700; color: #475569; background: #f8fafc;">Koordinat GPS Geofencing</td><td style="padding: 10px; color: #c59235; font-family: monospace; font-weight: 700;">Lat: ${escapeHtml(report.lat || '-6.735000')}, Lng: ${escapeHtml(report.lng || '108.533600')}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: 700; color: #475569; background: #f8fafc;">Kategori Fasilitas</td><td style="padding: 10px; color: #005a36; font-weight: 800;">${escapeHtml(report.kategori)}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: 700; color: #475569; background: #f8fafc;">Rincian Masalah</td><td style="padding: 10px; color: #1e293b; line-height: 1.5;">${escapeHtml(report.deskripsi)}</td></tr>
                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: 700; color: #475569; background: #f8fafc;">Teknisi Ditunjuk</td><td style="padding: 10px; color: #0f172a; font-weight: 700;">${escapeHtml(report.teknisi)}</td></tr>
                <tr><td style="padding: 10px; font-weight: 700; color: #475569; background: #f8fafc;">Catatan Tindak Lanjut</td><td style="padding: 10px; color: #1e293b;">${escapeHtml(report.catatanAdmin || 'Menunggu verifikasi lapangan.')}</td></tr>
            </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <div style="font-size: 11px; color: #64748b; line-height: 1.6;">
                <strong style="color: #005a36;">Verifikasi Digital SIMPEL UINSSC:</strong><br>
                1. Dokumen ini sah dan terdaftar dalam sistem database sarpras UINSSC.<br>
                2. Tunjukkan kode tiket atau scan QR code kepada teknisi lapangan.<br>
                Diterbitkan secara elektronik pada: ${new Date().toLocaleString('id-ID')}
            </div>
            <div style="text-align: center; min-width: 160px;">
                <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">Unit Sarana & Prasarana</div>
                <div style="border-bottom: 1px dashed #94a3b8; height: 46px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 11px; font-weight: 800; color: #005a36; letter-spacing: 1px;">[ TERVERIFIKASI SISTEM ]</span>
                </div>
                <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 4px;">SIMPEL UINSSC Digital Sign</div>
            </div>
        </div>
    `;

    document.body.appendChild(pdfContainer);

    const opt = {
        margin: [8, 8, 8, 8],
        filename: `TIKET_SARPRAS_UINSSC_${report.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(pdfContainer).save().then(() => {
        pdfContainer.remove();
        showToast('✅ Berkas PDF resmi tiket berhasil diunduh!', 'success');
    }).catch(err => {
        console.error('PDF error', err);
        pdfContainer.remove();
        printTicketPDF(ticketId);
    });
}

// Penyimpanan & Badge Riwayat Laporan Pengguna
function saveMyTicketId(ticketId) {
    try {
        let myTickets = JSON.parse(localStorage.getItem('SIMPEL_MY_TICKETS') || '[]');
        if (!myTickets.includes(ticketId)) {
            myTickets.unshift(ticketId);
            localStorage.setItem('SIMPEL_MY_TICKETS', JSON.stringify(myTickets));
        }
    } catch (e) {}
    updateMyReportsBadge();
}

function updateMyReportsBadge() {
    const badge = document.getElementById('myReportsBadge');
    try {
        const myTickets = JSON.parse(localStorage.getItem('SIMPEL_MY_TICKETS') || '[]');
        if (badge) badge.innerText = myTickets.length;
    } catch (e) {
        if (badge) badge.innerText = '0';
    }
    updateUserKPIs();
}

// Sinkronisasi Angka Ringkasan 3 KPI Summary Cards
function updateUserKPIs() {
    let myTicketIds = [];
    try {
        myTicketIds = JSON.parse(localStorage.getItem('SIMPEL_MY_TICKETS') || '[]');
    } catch (e) {
        myTicketIds = [];
    }

    const myReports = reportsData.filter(r => myTicketIds.includes(r.id));
    const isUserPersonal = myReports.length > 0;
    const dataSource = isUserPersonal ? myReports : reportsData;

    const totalEl = document.getElementById('userKpiTotal');
    const prosesEl = document.getElementById('userKpiProses');
    const selesaiEl = document.getElementById('userKpiSelesai');

    const totalCount = dataSource.length;
    const prosesCount = dataSource.filter(r => r.status === 'Diajukan' || r.status === 'Diproses').length;
    const selesaiCount = dataSource.filter(r => r.status === 'Selesai').length;

    if (totalEl) totalEl.innerText = totalCount;
    if (prosesEl) prosesEl.innerText = prosesCount;
    if (selesaiEl) selesaiEl.innerText = selesaiCount;

    const labelTotalEl = document.querySelector('.card-accent-emerald .user-kpi-label');
    if (labelTotalEl) {
        labelTotalEl.innerText = isUserPersonal ? 'TOTAL LAPORAN SAYA' : 'TOTAL LAPORAN KAMPUS';
    }
}

// Render Riwayat & Tinjau Laporan Saya
function renderMyReportsHistory(nimFilter = null) {
    const container = document.getElementById('myReportsListContainer');
    if (!container) return;

    let myTicketIds = [];
    try {
        myTicketIds = JSON.parse(localStorage.getItem('SIMPEL_MY_TICKETS') || '[]');
    } catch (e) {
        myTicketIds = [];
    }

    let myReports = [];
    if (nimFilter) {
        myReports = reportsData.filter(r => r.nimNip.toLowerCase() === nimFilter.toLowerCase());
    } else {
        // Ambil tiket yang ID-nya tercatat di local device
        myReports = reportsData.filter(r => myTicketIds.includes(r.id));
    }

    if (myReports.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:50px 20px; color:var(--text-muted); background:rgba(0,0,0,0.05); border-radius:16px; border:1px dashed var(--border-color);">
                <i class="fa-solid fa-folder-open" style="font-size:48px; margin-bottom:12px; opacity:0.6; color:var(--gold);"></i>
                <h3 style="font-size:18px; color:var(--text-main); font-weight:700;">Belum Ada Riwayat Laporan</h3>
                <p style="font-size:13px; margin-top:6px; max-width:480px; margin-left:auto; margin-right:auto;">
                    ${nimFilter ? `Tidak ditemukan laporan untuk NIM "<strong>${escapeHtml(nimFilter)}</strong>".` : 'Anda belum pernah mengirim laporan di perangkat ini. Klik tombol di bawah untuk membuat laporan pertama Anda.'}
                </p>
                <div style="margin-top:16px;">
                    <button class="btn btn-primary" onclick="switchUserTab('lapor')"><i class="fa-solid fa-plus"></i> Buat Laporan Baru</button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = myReports.map(r => `
        <div class="history-card">
            <div class="history-card-header">
                <div>
                    <span style="font-family:monospace; font-weight:800; font-size:16px; color:var(--gold);">${r.id}</span>
                    <h3 style="font-size:16px; font-weight:800; margin-top:3px;">${escapeHtml(r.kategori)}</h3>
                    <span style="font-size:12px; color:var(--text-muted);">
                        <i class="fa-solid fa-calendar-days"></i> ${r.tanggalLapor} &nbsp;|&nbsp; 
                        <i class="fa-solid fa-building"></i> ${escapeHtml(r.gedung)} (${escapeHtml(r.ruangan)})
                    </span>
                </div>
                <div>
                    <span class="badge" style="background:var(--primary-light); color:var(--gold); font-weight:800; padding:6px 14px; border-radius:20px; border:1px solid var(--gold); font-size:12px;">
                        ${r.status}
                    </span>
                </div>
            </div>

            <div class="history-card-body">
                <div>
                    ${r.foto ? `
                        <img src="${r.foto}" alt="Foto Bukti" style="width:100%; height:100px; object-fit:cover; border-radius:10px; border:1px solid var(--border-color); cursor:pointer;" onclick="openDetailReviewModal('${r.id}')" title="Klik untuk meninjau detail">
                    ` : `
                        <div style="width:100%; height:100px; background:rgba(0,0,0,0.2); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:11px;">
                            Tanpa Foto
                        </div>
                    `}
                </div>
                <div>
                    <p style="font-size:13px; color:var(--text-main); margin-bottom:8px; line-height:1.5;">
                        <strong>Masalah:</strong> ${escapeHtml(r.deskripsi)}
                    </p>
                    <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
                        <span><i class="fa-solid fa-user-gear" style="color:var(--gold);"></i> Teknisi: <strong>${escapeHtml(r.teknisi)}</strong></span>
                        <span style="margin-left:14px;"><i class="fa-solid fa-comment-dots"></i> Update: ${escapeHtml(r.catatanAdmin || 'Menunggu verifikasi')}</span>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="btn btn-secondary" onclick="openDetailReviewModal('${r.id}')" style="padding:6px 14px; font-size:12px;">
                            <i class="fa-solid fa-eye"></i> Tinjau Detail Laporan
                        </button>
                        <button class="btn btn-secondary" onclick="printTicketPDF('${r.id}')" style="padding:6px 14px; font-size:12px;">
                            <i class="fa-solid fa-print"></i> Cetak Bukti PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function searchMyReportsByNIM() {
    const input = document.getElementById('filterMyReportNIM');
    if (!input) return;
    const nim = input.value.trim();
    if (!nim) {
        renderMyReportsHistory();
        return;
    }
    renderMyReportsHistory(nim);
}

// Modal Detail Tinjau Laporan dari Riwayat
function openDetailReviewModal(ticketId) {
    const r = reportsData.find(item => item.id === ticketId);
    if (!r) {
        showToast('Data tiket tidak ditemukan.', 'error');
        return;
    }

    document.getElementById('detailModalTicketCode').innerText = r.id;
    document.getElementById('detailModalTitle').innerText = `${r.kategori} - ${r.ruangan}`;

    const body = document.getElementById('detailModalBody');
    body.innerHTML = `
        <div style="margin-bottom:20px; border-bottom:1px dashed var(--border-color); padding-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
                <span style="font-size:13px; color:var(--text-muted);"><i class="fa-solid fa-clock"></i> Tanggal Pengajuan: <strong>${r.tanggalLapor}</strong></span>
                <span class="badge" style="background:var(--primary-light); color:var(--gold); font-weight:800; padding:6px 14px; border-radius:20px; border:1px solid var(--gold);">${r.status}</span>
            </div>

            <!-- Timeline Status Perbaikan -->
            <div class="timeline-track" style="margin:20px 0;">
                <div class="t-step ${r.status === 'Diajukan' || r.status === 'Diproses' || r.status === 'Selesai' ? 'completed' : ''}">
                    <div class="t-icon"><i class="fa-solid fa-paper-plane"></i></div>
                    <div style="font-size:12px; font-weight:700;">Diajukan</div>
                </div>
                <div class="t-step ${r.status === 'Diproses' || r.status === 'Selesai' ? (r.status === 'Selesai' ? 'completed' : 'active') : ''}">
                    <div class="t-icon"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                    <div style="font-size:12px; font-weight:700;">Perbaikan</div>
                </div>
                <div class="t-step ${r.status === 'Selesai' ? 'completed' : ''}">
                    <div class="t-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <div style="font-size:12px; font-weight:700;">Selesai</div>
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; font-size:13px; margin-bottom:16px;">
            <div><strong>Nama Pelapor:</strong> ${escapeHtml(r.namaPelapor)}</div>
            <div><strong>NIM / NIP:</strong> ${escapeHtml(r.nimNip)} (${escapeHtml(r.peranPelapor)})</div>
            <div><strong>Gedung Kampus:</strong> ${escapeHtml(r.gedung)}</div>
            <div><strong>Ruangan:</strong> ${escapeHtml(r.ruangan)}</div>
            <div><strong>Tingkat Urgensi:</strong> <span class="dot-urgensi dot-${r.urgensi}"></span> ${escapeHtml(r.urgensi)}</div>
            <div><strong>Teknisi Sarpras:</strong> <strong style="color:var(--gold);">${escapeHtml(r.teknisi)}</strong></div>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:12px; padding:14px; font-size:13px; margin-bottom:16px;">
            <p><strong><i class="fa-solid fa-location-dot" style="color:var(--gold);"></i> Titik GPS:</strong> Lat ${r.lat || '-6.735000'}, Lng ${r.lng || '108.533800'}</p>
            <p style="margin-top:6px;"><strong>Deskripsi Kerusakan:</strong> ${escapeHtml(r.deskripsi)}</p>
            <p style="margin-top:6px;"><strong>Catatan Penanganan Sarpras:</strong> ${escapeHtml(r.catatanAdmin || 'Belum ada catatan')}</p>
        </div>

        ${r.foto ? `
            <div>
                <strong style="font-size:13px; display:block; margin-bottom:8px;"><i class="fa-solid fa-image" style="color:var(--gold);"></i> Bukti Foto Kerusakan Fisik:</strong>
                <img src="${r.foto}" alt="Bukti Foto" style="max-width:100%; max-height:220px; border-radius:10px; border:1px solid var(--border-color); cursor:pointer;" onclick="window.open('${r.foto}')" title="Klik untuk melihat foto resolusi penuh">
            </div>
        ` : ''}
    `;

    document.getElementById('detailModalPrintBtn').onclick = () => printTicketPDF(r.id);
    document.getElementById('detailReviewModal').classList.remove('hidden');
}

function closeDetailReviewModal() {
    const m = document.getElementById('detailReviewModal');
    if (m) m.classList.add('hidden');
}

function doSearchTicket() {
    const query = document.getElementById('ticketSearchInput').value.trim().toLowerCase();
    const output = document.getElementById('trackerOutput');

    if (!query) {
        showToast('Masukkan ID Tiket atau NIM/NIP terlebih dahulu', 'error');
        return;
    }

    const matched = reportsData.filter(r => r.id.toLowerCase().includes(query) || r.nimNip.toLowerCase() === query);

    if (matched.length === 0) {
        output.innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--text-muted);">
                <i class="fa-solid fa-file-circle-xmark" style="font-size:48px; margin-bottom:10px; opacity:0.5;"></i>
                <h3>Tiket Tidak Ditemukan</h3>
                <p>Tidak ada laporan dengan ID Tiket / NIM "<strong>${query}</strong>".</p>
            </div>
        `;
        return;
    }

    output.innerHTML = matched.map(r => `
        <div style="background:var(--bg-card-solid); border:1px solid var(--border-color); border-radius:16px; padding:24px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div>
                    <span style="font-family:monospace; font-weight:800; font-size:18px; color:var(--gold);">${r.id}</span>
                    <h3 style="margin-top:4px;">${r.kategori} - ${r.ruangan}</h3>
                    <span style="font-size:13px; color:var(--text-muted);"><i class="fa-solid fa-building"></i> ${r.gedung}</span>
                </div>
                <span class="badge" style="background:var(--primary-light); color:var(--gold); font-weight:800; padding:6px 14px; border-radius:20px; border:1px solid var(--gold);">${r.status}</span>
            </div>

            <div class="timeline-track">
                <div class="t-step ${r.status === 'Diajukan' || r.status === 'Diproses' || r.status === 'Selesai' ? 'completed' : ''}">
                    <div class="t-icon"><i class="fa-solid fa-paper-plane"></i></div>
                    <div style="font-size:12px; font-weight:700;">Diajukan</div>
                </div>
                <div class="t-step ${r.status === 'Diproses' || r.status === 'Selesai' ? (r.status === 'Selesai' ? 'completed' : 'active') : ''}">
                    <div class="t-icon"><i class="fa-solid fa-screws-tilting"></i></div>
                    <div style="font-size:12px; font-weight:700;">Dalam Perbaikan</div>
                </div>
                <div class="t-step ${r.status === 'Selesai' ? 'completed' : ''}">
                    <div class="t-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <div style="font-size:12px; font-weight:700;">Selesai</div>
                </div>
            </div>

            <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:12px; font-size:13px; border:1px solid var(--border-color);">
                <p><strong><i class="fa-solid fa-map-pin" style="color:var(--gold);"></i> Koordinat GPS:</strong> Lat ${r.lat || '-6.737400'}, Lng ${r.lng || '108.553100'}</p>
                <p style="margin-top:6px;"><strong>Deskripsi:</strong> ${r.deskripsi}</p>
                <p style="margin-top:6px;"><strong>Teknisi:</strong> ${r.teknisi}</p>
                <p style="margin-top:4px;"><strong>Update Sarpras:</strong> ${r.catatanAdmin}</p>
                ${r.foto ? `
                <div style="margin-top:12px; border-top:1px dashed var(--border-color); padding-top:10px;">
                    <strong style="display:block; margin-bottom:6px;"><i class="fa-solid fa-camera" style="color:var(--gold);"></i> Foto Bukti / Perbaikan:</strong>
                    <img src="${r.foto}" alt="Foto Kerusakan" style="max-width:180px; max-height:120px; border-radius:8px; border:1px solid var(--border-color); cursor:pointer; object-fit:cover;" onclick="window.open('${r.foto}')" title="Klik untuk memperbesar gambar">
                </div>
                ` : ''}
            </div>

            <div style="margin-top:16px; display:flex; justify-content:flex-end;">
                <button class="btn btn-secondary" onclick="printTicketPDF('${r.id}')" style="padding:6px 16px; font-size:13px;">
                    <i class="fa-solid fa-print"></i> Cetak Bukti PDF Tiket
                </button>
            </div>
        </div>
    `).join('');
}

function printTicketPDF(ticketId) {
    const report = reportsData.find(r => r.id === ticketId);
    if (!report) return;

    const printWin = window.open('', '_blank', 'width=800,height=900');
    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bukti Pelaporan Fasilitas UINSSC - ${report.id}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #005a36; line-height: 1.6; }
                .header { text-align: center; border-bottom: 3px double #c59235; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { height: 75px; margin-bottom: 10px; }
                .title { font-size: 20px; font-weight: bold; color: #005a36; margin: 0; }
                .sub { font-size: 13px; color: #555; margin-top: 4px; }
                .ticket-box { background: #f4f8f5; border: 2px dashed #c59235; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 30px; }
                .ticket-code { font-size: 28px; font-weight: bold; font-family: monospace; color: #005a36; letter-spacing:1px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; font-size: 14px; }
                th { background: #005a36; color: #ffffff; width: 30%; }
                .footer { margin-top: 50px; font-size: 12px; color: #777; text-align: center; border-top: 1px solid #ddd; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="../assets/img/logo.png" class="logo">
                <h1 class="title">UIN SIBER SYEKH NURJATI CIREBON (UINSSC)</h1>
                <p class="sub">Sistem Informasi Pelaporan & Pemeliharaan Fasilitas Kampus (SIMPEL UINSSC)</p>
            </div>

            <div class="ticket-box">
                <div style="font-size:13px; color:#555; font-weight:bold;">BUKTI TIKET PELAPORAN RESMI</div>
                <div class="ticket-code">${report.id}</div>
                <div style="font-size:12px; color:#666; margin-top:4px;">Tanggal Lapor: ${report.tanggalLapor}</div>
            </div>

            <table>
                <tr><th>Nama Pelapor</th><td>${report.namaPelapor} (${report.nimNip}) - ${report.peranPelapor}</td></tr>
                <tr><th>Kontak HP/WA</th><td>${report.kontakPelapor}</td></tr>
                <tr><th>Lokasi Fasilitas</th><td>${report.gedung} - ${report.ruangan}</td></tr>
                <tr><th>Koordinat GPS Presisi</th><td>Latitude: ${report.lat || '-6.737400'}, Longitude: ${report.lng || '108.553100'}</td></tr>
                <tr><th>Kategori</th><td>${report.kategori}</td></tr>
                <tr><th>Tingkat Urgensi</th><td>${report.urgensi}</td></tr>
                <tr><th>Status Perbaikan</th><td><strong>${report.status}</strong></td></tr>
                <tr><th>Deskripsi Kerusakan</th><td>${report.deskripsi}</td></tr>
                <tr><th>Teknisi Sarpras</th><td>${report.teknisi}</td></tr>
                <tr><th>Catatan Sarpras</th><td>${report.catatanAdmin || '-'}</td></tr>
            </table>

            <div class="footer">
                Dokumen ini diterbitkan secara resmi oleh SIMPEL UINSSC.<br>
                &copy; 2026 UIN Siber Syekh Nurjati Cirebon. All Rights Reserved.
            </div>
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    printWin.document.close();
}

// SweetAlert2 Toast Instance for User Portal
const UserSwalToast = typeof Swal !== 'undefined' ? Swal.mixin({
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

    if (typeof Swal !== 'undefined' && UserSwalToast) {
        UserSwalToast.fire({
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
