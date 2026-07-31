/**
 * SIMPEL UIN SSC - Public User Portal Script
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
// BATAS GEOGRAFIS MULTI-ZONA PRESISI KAMPUS UIN SSC CIREBON
// (Hasil Pengumpulan Visual Polygon Designer oleh User)
// ==========================================================================
const CAMPUS_ZONES = [
    {
        id: 'kampus_utama',
        name: 'Area Kampus Utama UIN SSC',
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
        name: 'Area Gedung Cyber UIN SSC',
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
        name: 'Area Gedung Seberang Kampus Utama',
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
        name: 'Area Pascasarjana & Ma\'had UIN SSC',
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
        name: 'Area Kampus Saladara UIN SSC',
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
        lat: '-6.737400',
        lng: '108.553100',
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
        gedung: 'Fakultas Ilmu Tarbiyah (FITK)',
        ruangan: 'Ruang Kuliah FITK.204',
        lat: '-6.738100',
        lng: '108.553800',
        kategori: 'Proyektor & Sound System',
        urgensi: 'Darurat',
        deskripsi: 'Proyektor gantung mati total saat jam perkuliahan. Lampu indikator merah berkedip.',
        foto: PRESET_IMAGES.proyektor,
        status: 'Diajukan',
        teknisi: 'Belum Ditunjuk',
        catatanAdmin: 'Laporan baru diterima, menunggu verifikasi lapangan.',
        tanggalLapor: '2026-07-30 08:30',
        tanggalUpdate: '2026-07-30 08:30'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    checkUserAuth();
    initTheme();
    loadReports();
    initMapPicker();
});

function checkUserAuth() {
    const sessionRaw = localStorage.getItem('SIMPEL_AUTH_SESSION');
    if (!sessionRaw) {
        window.location.href = '../index.html';
    }
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
    localStorage.removeItem('SIMPEL_AUTH_SESSION');
    window.location.href = '../index.html';
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

function loadReports() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            reportsData = JSON.parse(saved);
        } catch (e) {
            reportsData = [...DEFAULT_SEED_DATA];
        }
    } else {
        reportsData = [...DEFAULT_SEED_DATA];
        saveReports();
    }
}

function saveReports() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reportsData));
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

// Memeriksa apakah titik berada di SALAH SATU zona kampus UIN SSC
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

        // Update default pin marker ke center tengah seluruh 4 zona kampus
        currentLat = centerAll.lat.toFixed(6);
        currentLng = centerAll.lng.toFixed(6);
        updateCoordinatesDisplay(currentLat, currentLng);

        // Map Initialization terfokus pada ke-5 kawasan kampus UIN SSC (minZoom: 14 & maxBounds agar tidak bisa nyasar)
        mapPickerInstance = L.map('mapPicker', {
            center: [centerAll.lat, centerAll.lng],
            zoom: 16,
            minZoom: 14,
            maxZoom: 22,
            maxBounds: combinedBounds.pad(0.35),
            maxBoundsViscosity: 1.0
        });

        // OpenStreetMap Layer (minZoom 14 & maxZoom 22)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 14,
            maxZoom: 22,
            maxNativeZoom: 19,
            attribution: '&copy; OpenStreetMap & UIN SSC'
        }).addTo(mapPickerInstance);

        // 1. Render Dark Mask Overlay (Shades everything outside ALL 4 UIN SSC campus zones)
        const outerWorld = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
        const campusHoles = CAMPUS_ZONES.map(z => z.polygon);

        L.polygon([outerWorld, ...campusHoles], {
            color: '#c59235',
            weight: 3,
            dashArray: '6, 6',
            fillColor: '#04140d',
            fillOpacity: 0.72,
            interactive: false
        }).addTo(mapPickerInstance);

        // 2. Render Highlight Polygons untuk Setiap Zona Kampus
        CAMPUS_ZONES.forEach(zone => {
            const poly = L.polygon(zone.polygon, {
                color: '#c59235',
                weight: 2,
                fillColor: '#005a36',
                fillOpacity: 0.25
            }).addTo(mapPickerInstance);

            poly.bindTooltip(`<b>${zone.name}</b>`, { permanent: false, direction: 'center' });
        });

        // Auto Fit Bounds ke Seluruh Zona Kampus UIN SSC saat pertama muat
        mapPickerInstance.fitBounds(combinedBounds, { padding: [20, 20] });

        // Marker Pin Titik Kerusakan di Tengah Kampus
        mapMarkerInstance = L.marker([currentLat, currentLng], { draggable: true }).addTo(mapPickerInstance);
        mapMarkerInstance.bindPopup('<b>Pusat Lokasi Kampus UIN SSC</b><br>Geser pin ke titik lokasi fasilitas rusak.').openPopup();

        // Marker Drag Event: Update koordinat secara instan tanpa hambatan penguncian
        mapMarkerInstance.on('dragend', function () {
            const pos = mapMarkerInstance.getLatLng();
            updateCoordinatesDisplay(pos.lat, pos.lng);
            if (!isInsideCampus(pos.lat, pos.lng)) {
                showToast('Info: Titik lokasi berada di luar batas utama zona gedung.', 'info');
            }
        });

        // Map Click Event: Memindahkan marker ke titik klik secara mulus
        mapPickerInstance.on('click', function (e) {
            if (isDrawModeActive) {
                handleMapClickForPolygon(e.latlng.lat, e.latlng.lng);
                return;
            }

            mapMarkerInstance.setLatLng(e.latlng);
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

            // Pindahkan pin marker ke tengah kawasan gedung yang dipilih
            if (mapMarkerInstance) {
                mapMarkerInstance.setLatLng([center.lat, center.lng]);
                updateCoordinatesDisplay(center.lat, center.lng);
                mapMarkerInstance.bindPopup(`<b>${escapeHtml(selectedOpt.value)}</b><br>Kamera & titik lokasi disesuaikan ke area gedung ini.`).openPopup();
            }
            showToast(`Fokus peta dipindahkan ke ${targetZone.name}.`, 'info');
        }
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

            if (mapPickerInstance && mapMarkerInstance) {
                mapPickerInstance.setView([lat, lng], 17);
                mapMarkerInstance.setLatLng([lat, lng]);
                mapMarkerInstance.bindPopup('<b>Lokasi GPS Anda Terunci!</b>').openPopup();
            }
            showToast('Lokasi presisi GPS terdeteksi!', 'success');
        },
        (error) => {
            console.warn('GPS Error', error);
            showToast('Gagal mengambil lokasi GPS. Menutup ke posisi default UIN SSC.', 'error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

function switchUserTab(tab) {
    document.getElementById('tabLapor').classList.remove('active');
    document.getElementById('tabLacak').classList.remove('active');
    document.getElementById('sectionForm').classList.add('hidden');
    document.getElementById('sectionLacak').classList.add('hidden');

    if (tab === 'lapor') {
        document.getElementById('tabLapor').classList.add('active');
        document.getElementById('sectionForm').classList.remove('hidden');
        if (mapPickerInstance) {
            setTimeout(() => mapPickerInstance.invalidateSize(), 300);
        }
    } else {
        document.getElementById('tabLacak').classList.add('active');
        document.getElementById('sectionLacak').classList.remove('hidden');
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
}

function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        selectedImage = e.target.result;
        document.getElementById('dropzoneText').classList.add('hidden');
        document.getElementById('previewBox').classList.remove('hidden');
        document.getElementById('imgPreview').src = selectedImage;
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

function handlePublicFormSubmit(event) {
    event.preventDefault();

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
        foto: selectedImage || PRESET_IMAGES.ac,
        status: 'Diajukan',
        teknisi: 'Belum Ditunjuk',
        catatanAdmin: 'Laporan telah diteruskan ke tim pemeliharaan Sarpras Kampus UIN SSC.',
        tanggalLapor: timeStr,
        tanggalUpdate: timeStr
    };

    reportsData.unshift(newReport);
    saveReports();

    lastTicketCode = ticketCode;
    document.getElementById('createdTicketDisplay').innerText = ticketCode;
    document.getElementById('successModal').classList.remove('hidden');

    document.getElementById('publicReportForm').reset();
    removeFoto();
    handleKategoriChange();
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
    switchUserTab('lacak');
    document.getElementById('ticketSearchInput').value = lastTicketCode;
    doSearchTicket();
}

function copyCreatedCode() {
    if (lastTicketCode) {
        navigator.clipboard.writeText(lastTicketCode);
        showToast(`Kode Tiket ${lastTicketCode} berhasil disalin!`, 'success');
    }
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
            <title>Bukti Pelaporan Fasilitas UIN SSC - ${report.id}</title>
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
                <h1 class="title">UIN SIBER SYEKH NURJATI CIREBON (UIN SSC)</h1>
                <p class="sub">Sistem Informasi Pelaporan & Pemeliharaan Fasilitas Kampus (SIMPEL UIN SSC)</p>
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
                Dokumen ini diterbitkan secara resmi oleh SIMPEL UIN SSC.<br>
                &copy; 2026 UIN Siber Syekh Nurjati Cirebon. All Rights Reserved.
            </div>
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    printWin.document.close();
}

function showToast(msg, type = 'info') {
    const box = document.getElementById('toastBox');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid fa-info-circle"></i> ${msg}`;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}
