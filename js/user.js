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
let currentLat = -6.735117;
let currentLng = 108.533722;

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
    initTheme();
    loadReports();
    initMapPicker();
});

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

// ==========================================================================
// BATAS GEOGRAFIS MULTI-ZONA KAMPUS UIN SSC CIREBON (PRESISI MULTI-TITIK)
// ==========================================================================
const CAMPUS_ZONES = [
    {
        id: 'kampus_utama',
        name: 'Zona 1: Kampus Utama UIN SSC (Jl. Perjuangan)',
        polygon: [
            [-6.735667, 108.532944], // 6°44'08.4"S 108°31'58.6"E
            [-6.734694, 108.532972], // 6°44'04.9"S 108°31'58.7"E
            [-6.734194, 108.534444], // 6°44'03.1"S 108°32'04.0"E
            [-6.735472, 108.534361], // 6°44'07.7"S 108°32'03.7"E
            [-6.735556, 108.533889]  // 6°44'08.0"S 108°32'02.0"E
        ]
    },
    {
        id: 'fitk',
        name: 'Zona 2: Area Gedung FITK & Tarbiyah',
        polygon: [
            [-6.738000, 108.553000],
            [-6.738000, 108.558500],
            [-6.743500, 108.558500],
            [-6.743500, 108.553000]
        ]
    },
    {
        id: 'fdki_pasca',
        name: 'Zona 3: Area Gedung FDKI & Pascasarjana',
        polygon: [
            [-6.731500, 108.547000],
            [-6.731500, 108.552500],
            [-6.737000, 108.552500],
            [-6.737000, 108.547000]
        ]
    }
];

const DEFAULT_CAMPUS_CENTER = { lat: -6.735117, lng: 108.533722 };

// Algoritma Presisi Ray-Casting Point-in-Polygon
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
    const pt = [parseFloat(lat), parseFloat(lng)];
    return CAMPUS_ZONES.some(zone => isPointInSinglePolygon(pt, zone.polygon));
}

// Leaflet Map Picker Initialization (Restricted & Masked to Multi-Zone UIN SSC Campus Area)
function initMapPicker() {
    const container = document.getElementById('mapPicker');
    if (!container || typeof L === 'undefined') return;

    try {
        if (mapPickerInstance) {
            mapPickerInstance.remove();
        }

        mapPickerInstance = L.map('mapPicker', {
            center: [currentLat, currentLng],
            zoom: 16,
            minZoom: 14,
            maxZoom: 19
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap & UIN SSC'
        }).addTo(mapPickerInstance);

        // Render Inverted Mask Overlay (Shades everything outside ALL UIN SSC campus zones)
        const outerWorld = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
        const campusHoles = CAMPUS_ZONES.map(z => z.polygon);

        L.polygon([outerWorld, ...campusHoles], {
            color: '#c59235',
            weight: 3,
            dashArray: '6, 6',
            fillColor: '#04140d',
            fillOpacity: 0.75,
            interactive: false
        }).addTo(mapPickerInstance);

        mapMarkerInstance = L.marker([currentLat, currentLng], { draggable: true }).addTo(mapPickerInstance);
        mapMarkerInstance.bindPopup('<b>Area Kampus UIN SSC</b><br>Geser pin ke lokasi gedung terdekat.').openPopup();

        mapMarkerInstance.on('dragend', function () {
            const pos = mapMarkerInstance.getLatLng();
            if (!isInsideCampus(pos.lat, pos.lng)) {
                mapMarkerInstance.setLatLng([DEFAULT_CAMPUS_CENTER.lat, DEFAULT_CAMPUS_CENTER.lng]);
                updateCoordinatesDisplay(DEFAULT_CAMPUS_CENTER.lat, DEFAULT_CAMPUS_CENTER.lng);
                showToast('Pin dikembalikan! Titik lokasi harus berada di salah satu zona gedung UIN SSC.', 'error');
            } else {
                updateCoordinatesDisplay(pos.lat, pos.lng);
            }
        });

        mapPickerInstance.on('click', function (e) {
            if (!isInsideCampus(e.latlng.lat, e.latlng.lng)) {
                showToast('Titik lokasi harus berada di dalam salah satu zona gedung UIN SSC!', 'error');
            } else {
                mapMarkerInstance.setLatLng(e.latlng);
                updateCoordinatesDisplay(e.latlng.lat, e.latlng.lng);
            }
        });
    } catch (err) {
        console.error('Error init map:', err);
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
