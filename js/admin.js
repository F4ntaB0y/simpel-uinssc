/**
 * SIMPEL UIN SSC - Dedicated Admin Dashboard Script
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
        gedung: 'Fakultas Ilmu Tarbiyah (FITK)',
        ruangan: 'Ruang Kuliah FITK.204',
        lat: '-6.738100',
        lng: '108.553800',
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
        gedung: 'Gedung Perpustakaan Pusat',
        ruangan: 'Toilet Wanita Lantai 1',
        lat: '-6.736900',
        lng: '108.552500',
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

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadReports();
    renderKPIs();
    renderChart();
    renderAdminTable();
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

function renderChart() {
    const container = document.getElementById('chartBarContainer');
    if (!container) return;

    const buildings = [
        { name: 'Rektorat', key: 'Rektorat' },
        { name: 'FITK', key: 'FITK' },
        { name: 'FSEI', key: 'FSEI' },
        { name: 'FUAD', key: 'FUAD' },
        { name: 'Lab ICT', key: 'ICT' },
        { name: 'Perpustakaan', key: 'Perpustakaan' }
    ];

    const counts = buildings.map(b => {
        return reportsData.filter(r => r.gedung.includes(b.key)).length;
    });

    const maxCount = Math.max(...counts, 1);

    container.innerHTML = buildings.map((b, idx) => {
        const val = counts[idx];
        const heightPct = Math.round((val / maxCount) * 100);
        return `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
                <span style="font-size:12px; font-weight:800; margin-bottom:6px; color:var(--gold);">${val}</span>
                <div style="width:100%; max-width:42px; background:linear-gradient(to top, #005a36, #c59235); height:${Math.max(heightPct, 8)}%; border-radius:6px 6px 0 0; transition:height 0.4s ease; box-shadow:0 4px 10px rgba(197,146,53,0.3);"></div>
                <span style="font-size:11px; color:var(--text-muted); margin-top:8px; white-space:nowrap;">${b.name}</span>
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

    // Initialize or update Admin Leaflet Map (Masked & Restricted to UIN SSC Campus Area)
    setTimeout(() => {
        if (typeof L !== 'undefined') {
            const CAMPUS_BOUNDS = {
                minLat: -6.741000,
                maxLat: -6.734000,
                minLng: 108.549500,
                maxLng: 108.556500
            };

            if (!adminMapInstance) {
                adminMapInstance = L.map('adminMap', {
                    center: [reportLat, reportLng],
                    zoom: 17,
                    minZoom: 15,
                    maxZoom: 19
                });
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap & UIN SSC'
                }).addTo(adminMapInstance);

                // Render Inverted Mask Overlay (Shades everything outside UIN SSC campus in dark tint)
                const outerWorld = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
                const campusHole = [
                    [CAMPUS_BOUNDS.maxLat, CAMPUS_BOUNDS.minLng],
                    [CAMPUS_BOUNDS.maxLat, CAMPUS_BOUNDS.maxLng],
                    [CAMPUS_BOUNDS.minLat, CAMPUS_BOUNDS.maxLng],
                    [CAMPUS_BOUNDS.minLat, CAMPUS_BOUNDS.minLng]
                ];

                L.polygon([outerWorld, campusHole], {
                    color: '#c59235',
                    weight: 3,
                    dashArray: '6, 6',
                    fillColor: '#04140d',
                    fillOpacity: 0.75,
                    interactive: false
                }).addTo(adminMapInstance);

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
    reportsData[idx].tanggalUpdate = timeStr;

    saveReports();
    renderKPIs();
    renderChart();
    renderAdminTable();
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
