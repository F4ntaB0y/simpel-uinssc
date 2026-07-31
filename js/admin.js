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

let reportsData = [];
let editingId = null;

// Admin Map State
let adminMapInstance = null;
let adminMarkerInstance = null;
let adminOverviewMapInstance = null;
let adminOverviewMarkersGroup = null;
let currentAdminMapMode = 'pin'; // 'pin' or 'heatmap'
let currentAdminFoto = '';

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
        gedung: 'Laboratorium Terpadu & Pusat ICT',
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
        gedung: 'Gedung Cyber UINSSC',
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
        gedung: 'Area Gedung Seberang Kampus Utama',
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
    }
];

const CAMPUS_ZONES = [
    {
        id: 'kampus_utama',
        name: 'Area Kampus Utama UINSSC',
        polygon: [
            [-6.735695, 108.532945], [-6.73554, 108.532951], [-6.734701, 108.532972], [-6.734682, 108.533112], [-6.734624, 108.53332], [-6.734562, 108.533575], [-6.734567, 108.53362], [-6.734515, 108.533695], [-6.734471, 108.533874], [-6.734414, 108.533961], [-6.734394, 108.534022], [-6.734399, 108.534065], [-6.734371, 108.534125], [-6.734366, 108.534182], [-6.734407, 108.534234], [-6.73448, 108.534317], [-6.7345, 108.534375], [-6.734521, 108.534437], [-6.734671, 108.534431], [-6.735007, 108.534409], [-6.735415, 108.534381], [-6.735451, 108.534382], [-6.735521, 108.53438], [-6.735512, 108.53407], [-6.735526, 108.533833], [-6.735557, 108.533747], [-6.735653, 108.533445], [-6.735686, 108.533301]
        ]
    },
    {
        id: 'gedung_cyber',
        name: 'Area Gedung Cyber UINSSC',
        polygon: [
            [-6.736657, 108.532119], [-6.736606, 108.531878], [-6.73677, 108.53183], [-6.736749, 108.531772], [-6.736835, 108.531742], [-6.736923, 108.531803], [-6.737017, 108.531812], [-6.73707, 108.531856], [-6.73708, 108.531886], [-6.737129, 108.531861], [-6.737092, 108.531802], [-6.737039, 108.531783], [-6.736963, 108.531763], [-6.736919, 108.531755], [-6.736881, 108.531717], [-6.736885, 108.531289], [-6.7369, 108.531247], [-6.736982, 108.530953], [-6.737375, 108.530886], [-6.737385, 108.530941], [-6.737541, 108.530991], [-6.737511, 108.531333], [-6.737449, 108.531372], [-6.737551, 108.531723], [-6.737597, 108.531716], [-6.737653, 108.531777], [-6.737658, 108.531806], [-6.737356, 108.531826], [-6.737369, 108.531927], [-6.737172, 108.531927], [-6.737124, 108.531959], [-6.73717, 108.531992], [-6.737206, 108.532054], [-6.736907, 108.532081]
        ]
    },
    {
        id: 'gedung_seberang',
        name: 'Area Gedung Seberang Kampus Utama',
        polygon: [
            [-6.735765, 108.532911], [-6.735807, 108.532919], [-6.73581, 108.532697], [-6.736038, 108.532686], [-6.736026, 108.53243], [-6.736054, 108.532427], [-6.736034, 108.532055], [-6.736574, 108.532007], [-6.736592, 108.532099], [-6.736632, 108.532297], [-6.73671, 108.532561], [-6.736783, 108.532774], [-6.736968, 108.533206], [-6.736612, 108.53332], [-6.736577, 108.533241], [-6.736397, 108.533265], [-6.736263, 108.53327], [-6.735803, 108.533278], [-6.735805, 108.532949], [-6.735767, 108.532941]
        ]
    },
    {
        id: 'pascasarjana_mahad',
        name: 'Area Pascasarjana & Ma\'had UINSSC',
        polygon: [
            [-6.735741, 108.532103], [-6.735328, 108.532041], [-6.735324, 108.53185], [-6.735429, 108.531793], [-6.735173, 108.530796], [-6.735125, 108.530783], [-6.735019, 108.530409], [-6.73478, 108.530161], [-6.734611, 108.53022], [-6.734513, 108.530226], [-6.734208, 108.530236], [-6.734061, 108.530274], [-6.734082, 108.530365], [-6.733881, 108.530425], [-6.734005, 108.53093], [-6.734068, 108.531046], [-6.734067, 108.531142], [-6.734129, 108.531258], [-6.734128, 108.53134], [-6.734156, 108.531433], [-6.734164, 108.531524], [-6.73418, 108.531542], [-6.734381, 108.531519], [-6.734497, 108.532011], [-6.735102, 108.531903], [-6.735178, 108.532121], [-6.735597, 108.532221], [-6.735603, 108.532149], [-6.735726, 108.532169]
        ]
    },
    {
        id: 'area_saladara',
        name: 'Area Kampus Saladara UINSSC',
        polygon: [
            [-6.74438, 108.525562], [-6.744371, 108.525831], [-6.744221, 108.525832], [-6.744103, 108.525895], [-6.743949, 108.525891], [-6.743796, 108.52589], [-6.74367, 108.525885], [-6.743579, 108.525892], [-6.743671, 108.525619], [-6.743712, 108.525621], [-6.743721, 108.525551], [-6.743724, 108.525508], [-6.744987, 108.525504], [-6.744019, 108.525506], [-6.744017, 108.525553]
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    initTheme();
    loadReports();
    renderKPIs();
    renderChart();
    renderAdminTable();
    initAdminOverviewMap();
});

function checkAdminAuth() {
    const sessionRaw = localStorage.getItem('SIMPEL_AUTH_SESSION');
    if (!sessionRaw) {
        window.location.href = '../index.html';
        return;
    }
    try {
        const sess = JSON.parse(sessionRaw);
        if (sess.role !== 'admin') {
            window.location.href = '../index.html';
            return;
        }
        const el = document.getElementById('adminBadgeName');
        if (el && sess.username) {
            el.textContent = `Admin (${sess.username})`;
        }
    } catch (e) {
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
    showToast('🔑 Anda telah berhasil keluar dari Dashboard Admin. Mengalihkan...', 'info');
    localStorage.removeItem('SIMPEL_AUTH_SESSION');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1200);
}

function showToast(msg, type = 'info') {
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
}

function loadReports() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            reportsData = JSON.parse(saved);
        } catch(e) {
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

function renderChart(itemsToRender = reportsData) {
    const container = document.getElementById('chartBarContainer');
    if (!container) return;

    const buildings = [
        { name: 'Rektorat', keys: ['Rektorat'] },
        { name: 'FITK', keys: ['FITK', 'Tarbiyah'] },
        { name: 'FSEI', keys: ['FSEI', 'Syariah'] },
        { name: 'FUAD', keys: ['FUAD', 'Ushuluddin'] },
        { name: 'Lab ICT', keys: ['ICT', 'Laboratorium'] },
        { name: 'Perpus', keys: ['Perpustakaan'] },
        { name: 'Cyber', keys: ['Cyber'] },
        { name: 'Seberang', keys: ['Seberang'] },
        { name: 'Pasca/Ma\'had', keys: ['Pascasarjana', "Ma'had"] },
        { name: 'Saladara', keys: ['Saladara'] }
    ];

    const counts = buildings.map(b => {
        return itemsToRender.filter(r => {
            const g = (r.gedung || '').toLowerCase();
            return b.keys.some(k => g.includes(k.toLowerCase()));
        }).length;
    });

    const maxCount = Math.max(...counts, 1);

    container.innerHTML = buildings.map((b, idx) => {
        const val = counts[idx];
        const heightPct = Math.round((val / maxCount) * 100);
        const barColor = val > 0 ? 'linear-gradient(to top, #005a36, #c59235)' : 'rgba(255,255,255,0.08)';
        return `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
                <span style="font-size:11px; font-weight:800; margin-bottom:4px; color:${val > 0 ? 'var(--gold)' : 'var(--text-muted)'};">${val}</span>
                <div style="width:100%; max-width:28px; background:${barColor}; height:${Math.max(heightPct, 6)}%; border-radius:4px 4px 0 0; transition:height 0.4s ease; box-shadow:${val > 0 ? '0 4px 10px rgba(197,146,53,0.3)' : 'none'};" title="${b.name}: ${val} Laporan"></div>
                <span style="font-size:10px; font-weight:700; color:var(--text-muted); margin-top:6px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%;" title="${b.name}">${b.name}</span>
            </div>
        `;
    }).join('');
}

function renderAdminTable() {
    const statusFilter = document.getElementById('filterStatus').value;
    const gedungFilter = document.getElementById('filterGedung').value;
    const search = document.getElementById('searchInput').value.trim().toLowerCase();

    const filtered = reportsData.filter(item => {
        if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
        if (gedungFilter !== 'ALL' && item.gedung !== gedungFilter) return false;
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
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:var(--text-muted);">Tidak ada data laporan yang cocok.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td><span style="font-family:monospace; font-weight:800; color:var(--gold);">${item.id}</span></td>
            <td style="font-size:12px; color:var(--text-muted);">${item.tanggalLapor}</td>
            <td>
                <strong>${escapeHtml(item.namaPelapor)}</strong>
                <div style="font-size:11px; color:var(--text-muted);">${item.peranPelapor} (${item.nimNip})</div>
            </td>
            <td>
                <strong>${escapeHtml(item.ruangan)}</strong>
                <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(item.gedung)}</div>
                <div style="font-size:10px; color:var(--gold); font-family:monospace;"><i class="fa-solid fa-location-dot"></i> ${item.lat || '-6.737400'}, ${item.lng || '108.553100'}</div>
            </td>
            <td>${escapeHtml(item.kategori)}</td>
            <td><span class="dot-urgensi dot-${item.urgensi}"></span> ${item.urgensi}</td>
            <td><span class="badge-status badge-${item.status}">${item.status}</span></td>
            <td style="font-size:12px; font-weight:700;">${escapeHtml(item.teknisi)}</td>
            <td style="text-align:center;">
                <button class="btn-act" onclick="openAdminModal('${item.id}')" title="Kelola Tiket & Lihat Peta"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-act btn-del" onclick="deleteReport('${item.id}')" title="Hapus Laporan"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        </tr>
    `).join('');
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
    document.getElementById('modalTeknisiInput').value = report.teknisi;
    document.getElementById('modalCatatanInput').value = report.catatanAdmin || '';

    const reportLat = parseFloat(report.lat || -6.737400);
    const reportLng = parseFloat(report.lng || 108.553100);

    document.getElementById('modalReportInfo').innerHTML = `
        <p><strong>Pelapor:</strong> ${escapeHtml(report.namaPelapor)} (${report.nimNip}) - ${escapeHtml(report.kontakPelapor)}</p>
        <p style="margin-top:4px;"><strong>Lokasi:</strong> ${escapeHtml(report.gedung)} - ${escapeHtml(report.ruangan)}</p>
        <p style="margin-top:4px;"><strong>Koordinat GPS:</strong> <span style="font-family:monospace; color:var(--gold); font-weight:700;">${reportLat.toFixed(6)}, ${reportLng.toFixed(6)}</span></p>
        <p style="margin-top:4px;"><strong>Masalah:</strong> ${escapeHtml(report.deskripsi)}</p>
    `;

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

                // Render Dark Mask Overlay
                const outerWorld = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
                const campusHoles = CAMPUS_ZONES.map(z => z.polygon);

                L.polygon([outerWorld, ...campusHoles], {
                    color: '#c59235',
                    weight: 3,
                    dashArray: '6, 6',
                    fillColor: '#04140d',
                    fillOpacity: 0.72,
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

function saveReportUpdates() {
    if (!editingId) return;

    const idx = reportsData.findIndex(r => r.id === editingId);
    if (idx === -1) return;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    reportsData[idx].status = document.getElementById('modalStatusSelect').value;
    reportsData[idx].teknisi = document.getElementById('modalTeknisiInput').value.trim() || 'Belum Ditunjuk';
    reportsData[idx].catatanAdmin = document.getElementById('modalCatatanInput').value.trim();
    reportsData[idx].foto = currentAdminFoto;
    reportsData[idx].tanggalUpdate = timeStr;

    saveReports();
    renderKPIs();
    renderChart();
    renderAdminTable();
    renderAdminOverviewMarkers();
    closeAdminModal();
    showToast(`Perubahan tiket ${editingId} berhasil disimpan!`, 'success');
}

function deleteReport(id) {
    if (confirm(`Apakah Anda yakin ingin menghapus laporan ${id}?`)) {
        reportsData = reportsData.filter(r => r.id !== id);
        saveReports();
        renderKPIs();
        renderChart();
        renderAdminTable();
        renderAdminOverviewMarkers();
        showToast(`Laporan ${id} dihapus.`, 'info');
    }
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

function resetDemoData() {
    if (confirm('Reset semua data ke kondisi demo awal?')) {
        reportsData = [...DEFAULT_SEED_DATA];
        saveReports();
        renderKPIs();
        renderChart();
        renderAdminTable();
        renderAdminOverviewMarkers();
        showToast('Data demo berhasil direset!', 'success');
    }
}

function showToast(msg, type='info') {
    const box = document.getElementById('toastBox');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid fa-info-circle"></i> ${msg}`;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}



function initAdminOverviewMap() {
    const container = document.getElementById('adminOverviewMap');
    if (!container || typeof L === 'undefined') return;

    try {
        if (!adminOverviewMapInstance) {
            const polygonGroup = L.featureGroup();
            CAMPUS_ZONES.forEach(z => {
                const poly = L.polygon(z.polygon, {
                    color: '#c59235',
                    weight: 2,
                    fillColor: '#005a36',
                    fillOpacity: 0.25
                });
                polygonGroup.addLayer(poly);
            });

            const combinedBounds = polygonGroup.getBounds();
            const centerAll = combinedBounds.getCenter();

            adminOverviewMapInstance = L.map('adminOverviewMap', {
                center: [centerAll.lat, centerAll.lng],
                zoom: 16,
                minZoom: 14,
                maxZoom: 22,
                maxBounds: combinedBounds.pad(0.35),
                maxBoundsViscosity: 1.0
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: 14,
                maxZoom: 22,
                maxNativeZoom: 19,
                attribution: '&copy; OpenStreetMap & UINSSC'
            }).addTo(adminOverviewMapInstance);

            // Outer Dark Mask Overlay
            const outerCoords = [
                [90, -180],
                [90, 180],
                [-90, 180],
                [-90, -180]
            ];
            const holes = CAMPUS_ZONES.map(z => z.polygon);
            L.polygon([outerCoords, ...holes], {
                color: '#005a36',
                weight: 2,
                fillColor: '#04140d',
                fillOpacity: 0.88,
                interactive: false
            }).addTo(adminOverviewMapInstance);

            polygonGroup.addTo(adminOverviewMapInstance);

            adminOverviewMarkersGroup = L.featureGroup().addTo(adminOverviewMapInstance);
        }

        renderAdminOverviewMarkers();
    } catch(e) {
        console.warn('Overview map init error', e);
    }
}

function renderAdminOverviewMarkers(itemsToRender = reportsData) {
    if (!adminOverviewMapInstance || !adminOverviewMarkersGroup) return;
    adminOverviewMarkersGroup.clearLayers();

    const bounds = L.latLngBounds();

    itemsToRender.forEach(rep => {
        let lat = parseFloat(rep.lat || '-6.735000');
        let lng = parseFloat(rep.lng || '108.533800');
        
        // Auto-fix legacy demo coords outside campus
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

        if (currentAdminMapMode === 'heatmap') {
            // Render 3-layer radial heat intensity glow circles
            let heatRadius = 35;
            let glowColor = '#ef4444';
            if (rep.urgensi === 'Darurat') { heatRadius = 55; glowColor = '#dc2626'; }
            else if (rep.urgensi === 'Tinggi') { heatRadius = 45; glowColor = '#f97316'; }
            else if (rep.urgensi === 'Sedang') { heatRadius = 35; glowColor = '#f59e0b'; }
            else { heatRadius = 25; glowColor = '#3b82f6'; }

            // Outer Heat Layer
            const heatOuter = L.circle([lat, lng], {
                radius: heatRadius,
                fillColor: glowColor,
                fillOpacity: 0.25,
                stroke: false
            });
            // Mid Heat Core
            const heatMid = L.circle([lat, lng], {
                radius: Math.round(heatRadius * 0.6),
                fillColor: '#f97316',
                fillOpacity: 0.5,
                stroke: false
            });
            // Hotspot Core Pin
            const heatCore = L.circleMarker([lat, lng], {
                radius: 7,
                fillColor: '#ffffff',
                color: glowColor,
                weight: 3,
                fillOpacity: 1
            });

            const heatPopupHtml = `
                <div style="font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; padding:6px; min-width:180px;">
                    <div style="font-size:11px; font-weight:800; color:#ef4444; margin-bottom:2px;"><i class="fa-solid fa-fire"></i> KLUSTER KERUSAKAN (${escapeHtml(rep.urgensi).toUpperCase()})</div>
                    <h4 style="margin:2px 0 4px 0; font-size:14px; font-weight:800; color:#005a36;">${escapeHtml(rep.kategori)}</h4>
                    <p style="font-size:12px; margin-bottom:8px; color:#475569;"><i class="fa-solid fa-building" style="color:#c59235;"></i> ${escapeHtml(rep.gedung)} (${escapeHtml(rep.ruangan)})</p>
                    <button onclick="openAdminModal('${rep.id}')" style="width:100%; padding:6px 10px; background:#ef4444; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:11px; cursor:pointer;"><i class="fa-solid fa-magnifying-glass"></i> Inspeksi Kluster Ini</button>
                </div>
            `;

            heatOuter.bindPopup(heatPopupHtml);
            heatCore.bindPopup(heatPopupHtml);

            adminOverviewMarkersGroup.addLayer(heatOuter);
            adminOverviewMarkersGroup.addLayer(heatMid);
            adminOverviewMarkersGroup.addLayer(heatCore);
        } else {
            // Standard Pin Marker
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
                    <button onclick="openAdminModal('${rep.id}')" style="width:100%; padding:7px 10px; background:#005a36; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:12px; cursor:pointer; box-shadow: 0 2px 8px rgba(0,90,54,0.3);"><i class="fa-solid fa-pen-to-square"></i> Process Laporan Ini</button>
                </div>
            `;

            marker.bindPopup(popupHtml);
            adminOverviewMarkersGroup.addLayer(marker);
        }
    });

    if (itemsToRender.length > 0 && bounds.isValid()) {
        adminOverviewMapInstance.fitBounds(bounds.pad(0.35));
    }
}

function sendWANotificationSim() {
    const teknisi = document.getElementById('modalTeknisiInput').value.trim() || 'Tim Sarpras';
    showToast(`💬 Notifikasi WhatsApp berhasil dikirimkan ke ${teknisi}!`, 'success');
}
