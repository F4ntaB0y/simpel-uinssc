/**
 * SIMPEL UINSSC - Universal Site Layout & Page Content Engine
 * Location: js/site-builder.js
 * --------------------------------------------------------------------------
 * Memungkinkan Super Admin mengubah tata letak (layout), mengedit konten,
 * menghapus/menyembunyikan blok, serta menambah seksi/fitur/tab baru pada
 * setiap halaman (Login, Portal Pelapor/User, dan Dashboard Admin).
 * --------------------------------------------------------------------------
 */

(function () {
    'use strict';

    const SITE_BUILDER_KEY = 'SIMPEL_SITE_BUILDER_V1';
    const LEGACY_CMS_KEY = 'SIMPEL_PORTAL_CONTENT_V1';

    function escapeHtmlSafe(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function extractYtId(url) {
        if (!url) return '';
        const trimmed = String(url).trim();
        const m1 = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (m1 && m1[1]) return m1[1];
        const m2 = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
        if (m2 && m2[1]) return m2[1];
        const m3 = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
        if (m3 && m3[1]) return m3[1];
        if (/^[a-zA-Z0-9_-]{8,15}$/.test(trimmed)) return trimmed;
        return '';
    }

    const DEFAULT_SITE_CONFIG = {
        login: {
            layout: 'split-right', // 'split-right' | 'split-left' | 'centered'
            showTopBar: true,
            topBar: {
                email: 'sarpras@uinssc.ac.id',
                phone: '(0231) 481-264',
                hours: 'Senin - Jumat (07.30 - 16.00 WIB)',
                badge: 'Portal Terpadu Sarpras UINSSC'
            },
            loginBox: {
                subtitle: 'SIMPEL UINSSC',
                title: 'Portal Masuk Sistem',
                desc: 'Gunakan akun resmi kampus Anda untuk mengakses layanan.',
                showPresetDemo: true,
                presetTitle: 'Akun Demo Uji Coba Cepat (1-Klik):'
            },
            heroOrder: ['hero_header', 'video_profile', 'features_list'],
            blocks: {
                hero_header: {
                    id: 'hero_header',
                    type: 'builtin',
                    label: 'Header Identitas & Judul Sambutan',
                    enabled: true,
                    badge: 'UIN Siber Syekh Nurjati Cirebon',
                    title: 'Sistem Informasi Pelaporan Fasilitas Kampus',
                    desc: 'Portal resmi civitas akademika untuk efisiensi pelaporan kerusakan sarpras, verifikasi geofencing GIS presisi, dan tindak lanjut perbaikan secara terpadu.'
                },
                features_list: {
                    id: 'features_list',
                    type: 'builtin',
                    label: 'Daftar Kartu Fitur Sorotan',
                    enabled: true,
                    items: [
                        {
                            id: 'feat_1',
                            icon: 'fa-map-location-dot',
                            colorClass: 'icon-emerald',
                            title: 'Geofencing GIS Presisi 5 Zona',
                            desc: 'Validasi otomatis titik koordinat GPS di kawasan kampus guna mencegah laporan palsu.'
                        },
                        {
                            id: 'feat_2',
                            icon: 'fa-layer-group',
                            colorClass: 'icon-amber',
                            title: 'Smart Duplicate & Anti-Spam',
                            desc: 'Deteksi pintar laporan serupa di ruangan yang sama untuk efisiensi teknisi sarpras.'
                        },
                        {
                            id: 'feat_3',
                            icon: 'fa-chart-line',
                            colorClass: 'icon-cyan',
                            title: 'Transparansi Tracking & SLA',
                            desc: 'Pantau status perbaikan mulai dari Diajukan, Diproses teknisi, hingga Selesai tuntas.'
                        }
                    ]
                },
                video_profile: {
                    id: 'video_profile',
                    type: 'builtin',
                    label: 'Kartu Video Profil Kampus (YouTube)',
                    enabled: true,
                    badge: 'PROFIL KAMPUS CYBER',
                    title: 'Profil Kampus UIN Siber Syekh Nurjati Cirebon',
                    desc: 'Kenali lebih dekat fasilitas modern, ekosistem digital, dan layanan sarana prasarana kampus cyber.',
                    url: 'https://youtu.be/bUhLVKdbRd0?si=C6iIsdGNuLUB38Qa',
                    embedId: 'bUhLVKdbRd0'
                }
            },
            customBlocks: []
        },
        user: {
            layout: 'tabs', // 'tabs' | 'stacked'
            containerWidth: 'normal', // 'normal' | 'wide'
            showTopBar: true,
            topBar: {
                email: 'sarpras@uinssc.ac.id',
                phone: '(0231) 481-264',
                hours: 'Senin - Jumat (07.30 - 16.00 WIB)',
                badge: 'Layanan Sarpras & Fasilitas Terpadu UINSSC'
            },
            pageOrder: ['user_banner', 'user_workspace'],
            tabOrder: ['lapor', 'riwayat', 'lacak'],
            blocks: {
                user_banner: {
                    id: 'user_banner',
                    type: 'builtin',
                    label: 'Hero Banner Utama Portal Pelapor',
                    enabled: true,
                    badge: 'PORTAL LAYANAN SARPRAS KAMPUS',
                    title: 'Sistem Informasi Pelaporan Fasilitas Kampus',
                    desc: 'Pencatatan Kerusakan Sarpras, Validasi Geofencing GIS Presisi 5 Kawasan, Pelacakan Status Tiket Real-time, & Respon Cepat Tim Teknisi Pemeliharaan UINSSC.',
                    icon: 'fa-building-shield',
                    bgImage: '',
                    pills: [
                        { id: 'pill_1', icon: 'fa-location-crosshairs', text: 'Geofencing 5 Kawasan Kampus' },
                        { id: 'pill_2', icon: 'fa-bolt', text: 'Tindak Lanjut Berbasis SLA' },
                        { id: 'pill_3', icon: 'fa-qrcode', text: 'Bukti Tiket PDF & QR Resmi' }
                    ]
                },
                lapor: {
                    id: 'lapor',
                    type: 'builtin_tab',
                    label: 'Seksi / Tab: Formulir Buat Laporan',
                    enabled: true,
                    tabLabel: 'Buat Laporan Kerusakan',
                    icon: 'fa-pen-to-square',
                    title: 'Formulir Pengaduan Fasilitas',
                    desc: 'Ikuti 3 bagian terstruktur di bawah agar teknisi sarpras dapat menindaklanjuti di titik ruangan yang tepat.'
                },
                riwayat: {
                    id: 'riwayat',
                    type: 'builtin_tab',
                    label: 'Seksi / Tab: Riwayat Laporan Saya',
                    enabled: true,
                    tabLabel: 'Riwayat Laporan',
                    icon: 'fa-clock-rotate-left',
                    title: 'Riwayat Pengaduan Saya',
                    desc: 'Daftar laporan fasilitas yang pernah Anda kirimkan beserta progres penanganannya.'
                },
                lacak: {
                    id: 'lacak',
                    type: 'builtin_tab',
                    label: 'Seksi / Tab: Lacak Status Tiket',
                    enabled: true,
                    tabLabel: 'Lacak Status Tiket',
                    icon: 'fa-magnifying-glass-location',
                    title: 'Lacak Status Penanganan Tiket',
                    desc: 'Masukkan Nomor Tiket Resmi atau NIM / NIP pelapor untuk melihat progres real-time.'
                }
            },
            customBlocks: []
        },
        admin: {
            sidebarPosition: 'left', // 'left' | 'right'
            kpiColumns: '4', // '4' | '2'
            header: {
                enabled: true,
                title: 'Dashboard Pengelolaan Sarpras UINSSC',
                desc: 'Pantau, verifikasi, dan tindak lanjuti laporan kerusakan fasilitas seluruh kampus.'
            },
            sectionOrder: ['admin_kpi', 'admin_charts', 'admin_map', 'admin_table'],
            blocks: {
                admin_kpi: {
                    id: 'admin_kpi',
                    type: 'builtin',
                    label: 'Baris Kartu Indikator KPI',
                    enabled: true,
                    title: 'Indikator KPI Utama',
                    desc: 'Ringkasan total laporan, antrean verifikasi, sedang diproses, dan selesai.',
                    kpiLabels: ['Total Laporan', 'Menunggu Verifikasi', 'Dalam Perbaikan', 'Perbaikan Selesai']
                },
                admin_charts: {
                    id: 'admin_charts',
                    type: 'builtin',
                    label: 'Pusat Analitik Visual & Pemilih Grafik',
                    enabled: true,
                    title: 'Pusat Analitik Visual Sarpras Kampus',
                    desc: 'Pilih kombinasi dataset dan tipe grafik interaktif sesuai kebutuhan evaluasi sarpras.'
                },
                admin_map: {
                    id: 'admin_map',
                    type: 'builtin',
                    label: 'Peta GIS Sebaran Titik Kerusakan',
                    enabled: true,
                    title: 'Peta GIS Sebaran Titik Kerusakan Fasilitas Kampus UINSSC',
                    desc: 'Menampilkan sebaran insiden fasilitas aktif di kawasan kampus.'
                },
                admin_table: {
                    id: 'admin_table',
                    type: 'builtin',
                    label: 'Tabel Data & Filter Laporan Masuk',
                    enabled: true,
                    title: 'Daftar Tiket Pengaduan Sarpras',
                    desc: 'Filter status, kawasan, potensi duplikasi, dan pencarian tiket.'
                }
            },
            customBlocks: []
        }
    };

    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function getSiteConfig() {
        const base = deepClone(DEFAULT_SITE_CONFIG);

        // Migrate legacy SIMPEL_PORTAL_CONTENT_V1 if present and SIMPEL_SITE_BUILDER_V1 not yet saved
        const rawBuilder = localStorage.getItem(SITE_BUILDER_KEY);
        if (!rawBuilder) {
            const rawLegacy = localStorage.getItem(LEGACY_CMS_KEY);
            if (rawLegacy) {
                try {
                    const legacy = JSON.parse(rawLegacy);
                    if (Array.isArray(legacy.features) && legacy.features.length > 0) {
                        base.login.blocks.features_list.items = legacy.features.map((f, idx) => ({
                            id: f.id ? String(f.id) : 'feat_' + (idx + 1),
                            icon: f.icon || 'fa-star',
                            colorClass: f.colorClass || 'icon-emerald',
                            title: f.title || 'Fitur',
                            desc: f.desc || ''
                        }));
                    }
                    if (legacy.video) {
                        base.login.blocks.video_profile = Object.assign(
                            base.login.blocks.video_profile,
                            {
                                enabled: legacy.video.enabled !== false,
                                title: legacy.video.title || base.login.blocks.video_profile.title,
                                desc: legacy.video.desc || base.login.blocks.video_profile.desc,
                                url: legacy.video.url || base.login.blocks.video_profile.url,
                                embedId: legacy.video.embedId || extractYtId(legacy.video.url) || 'bUhLVKdbRd0'
                            }
                        );
                    }
                    if (legacy.banner) {
                        base.user.blocks.user_banner = Object.assign(
                            base.user.blocks.user_banner,
                            {
                                badge: legacy.banner.badge || base.user.blocks.user_banner.badge,
                                title: legacy.banner.title || base.user.blocks.user_banner.title,
                                desc: legacy.banner.desc || base.user.blocks.user_banner.desc,
                                icon: legacy.banner.icon || base.user.blocks.user_banner.icon,
                                bgImage: legacy.banner.bgImage || ''
                            }
                        );
                    }
                } catch (e) {
                    console.warn('Migrasi konten legacy dilewati:', e);
                }
            }
            return base;
        }

        try {
            const parsed = JSON.parse(rawBuilder);

            // Merge Login
            if (parsed.login) {
                base.login.layout = parsed.login.layout || base.login.layout;
                if (typeof parsed.login.showTopBar === 'boolean') base.login.showTopBar = parsed.login.showTopBar;
                if (parsed.login.topBar) Object.assign(base.login.topBar, parsed.login.topBar);
                if (parsed.login.loginBox) Object.assign(base.login.loginBox, parsed.login.loginBox);
                if (Array.isArray(parsed.login.customBlocks)) base.login.customBlocks = parsed.login.customBlocks;
                if (parsed.login.blocks) {
                    Object.keys(base.login.blocks).forEach(k => {
                        if (parsed.login.blocks[k]) {
                            base.login.blocks[k] = Object.assign({}, base.login.blocks[k], parsed.login.blocks[k]);
                        }
                    });
                }
                if (Array.isArray(parsed.login.heroOrder) && parsed.login.heroOrder.length > 0) {
                    base.login.heroOrder = parsed.login.heroOrder;
                }
                // Ensure all builtin & custom blocks exist in heroOrder
                ['hero_header', 'features_list', 'video_profile'].forEach(id => {
                    if (!base.login.heroOrder.includes(id)) base.login.heroOrder.push(id);
                });
                base.login.customBlocks.forEach(cb => {
                    if (!base.login.heroOrder.includes(cb.id)) base.login.heroOrder.push(cb.id);
                });
            }

            // Merge User
            if (parsed.user) {
                base.user.layout = parsed.user.layout || base.user.layout;
                base.user.containerWidth = parsed.user.containerWidth || base.user.containerWidth;
                if (typeof parsed.user.showTopBar === 'boolean') base.user.showTopBar = parsed.user.showTopBar;
                if (parsed.user.topBar) Object.assign(base.user.topBar, parsed.user.topBar);
                if (Array.isArray(parsed.user.customBlocks)) base.user.customBlocks = parsed.user.customBlocks;
                if (parsed.user.blocks) {
                    Object.keys(base.user.blocks).forEach(k => {
                        if (parsed.user.blocks[k]) {
                            base.user.blocks[k] = Object.assign({}, base.user.blocks[k], parsed.user.blocks[k]);
                        }
                    });
                }
                if (Array.isArray(parsed.user.pageOrder) && parsed.user.pageOrder.length > 0) {
                    base.user.pageOrder = parsed.user.pageOrder;
                }
                ['user_banner', 'user_workspace'].forEach(id => {
                    if (!base.user.pageOrder.includes(id)) base.user.pageOrder.push(id);
                });
                base.user.customBlocks.filter(cb => cb.placement !== 'tab').forEach(cb => {
                    if (!base.user.pageOrder.includes(cb.id)) base.user.pageOrder.push(cb.id);
                });

                if (Array.isArray(parsed.user.tabOrder) && parsed.user.tabOrder.length > 0) {
                    base.user.tabOrder = parsed.user.tabOrder;
                }
                ['lapor', 'riwayat', 'lacak'].forEach(id => {
                    if (!base.user.tabOrder.includes(id)) base.user.tabOrder.push(id);
                });
                base.user.customBlocks.filter(cb => cb.placement === 'tab').forEach(cb => {
                    if (!base.user.tabOrder.includes(cb.id)) base.user.tabOrder.push(cb.id);
                });
            }

            // Merge Admin
            if (parsed.admin) {
                base.admin.sidebarPosition = parsed.admin.sidebarPosition || base.admin.sidebarPosition;
                base.admin.kpiColumns = parsed.admin.kpiColumns || base.admin.kpiColumns;
                if (parsed.admin.header) Object.assign(base.admin.header, parsed.admin.header);
                if (Array.isArray(parsed.admin.customBlocks)) base.admin.customBlocks = parsed.admin.customBlocks;
                if (parsed.admin.blocks) {
                    Object.keys(base.admin.blocks).forEach(k => {
                        if (parsed.admin.blocks[k]) {
                            base.admin.blocks[k] = Object.assign({}, base.admin.blocks[k], parsed.admin.blocks[k]);
                        }
                    });
                }
                if (Array.isArray(parsed.admin.sectionOrder) && parsed.admin.sectionOrder.length > 0) {
                    base.admin.sectionOrder = parsed.admin.sectionOrder;
                }
                ['admin_kpi', 'admin_charts', 'admin_map', 'admin_table'].forEach(id => {
                    if (!base.admin.sectionOrder.includes(id)) base.admin.sectionOrder.push(id);
                });
                base.admin.customBlocks.forEach(cb => {
                    if (!base.admin.sectionOrder.includes(cb.id)) base.admin.sectionOrder.push(cb.id);
                });
            }

            return base;
        } catch (err) {
            console.warn('Gagal memproses konfigurasi site builder:', err);
            return base;
        }
    }

    function saveSiteConfig(cfg) {
        localStorage.setItem(SITE_BUILDER_KEY, JSON.stringify(cfg));

        // Keep legacy SIMPEL_PORTAL_CONTENT_V1 synced for backward compatibility
        try {
            const legacyPayload = {
                features: (cfg.login.blocks.features_list.items || []).map((it, i) => ({
                    id: i + 1,
                    icon: it.icon,
                    colorClass: it.colorClass,
                    title: it.title,
                    desc: it.desc
                })),
                banner: {
                    badge: cfg.user.blocks.user_banner.badge,
                    title: cfg.user.blocks.user_banner.title,
                    desc: cfg.user.blocks.user_banner.desc,
                    icon: cfg.user.blocks.user_banner.icon,
                    bgImage: cfg.user.blocks.user_banner.bgImage || ''
                },
                video: {
                    enabled: cfg.login.blocks.video_profile.enabled,
                    title: cfg.login.blocks.video_profile.title,
                    desc: cfg.login.blocks.video_profile.desc,
                    url: cfg.login.blocks.video_profile.url,
                    embedId: cfg.login.blocks.video_profile.embedId || 'bUhLVKdbRd0'
                },
                lastUpdated: new Date().toISOString(),
                updatedBy: 'superadmin'
            };
            localStorage.setItem(LEGACY_CMS_KEY, JSON.stringify(legacyPayload));
        } catch (e) {}
    }

    function buildCustomBlockHtml(cb) {
        const accentMap = {
            emerald: { border: 'rgba(16, 185, 129, 0.38)', bg: 'rgba(0, 90, 54, 0.16)', badgeBg: 'rgba(16, 185, 129, 0.16)', color: '#10b981' },
            gold: { border: 'rgba(212, 163, 67, 0.45)', bg: 'rgba(212, 163, 67, 0.10)', badgeBg: 'rgba(212, 163, 67, 0.18)', color: '#d4a343' },
            cyan: { border: 'rgba(6, 182, 212, 0.40)', bg: 'rgba(6, 182, 212, 0.10)', badgeBg: 'rgba(6, 182, 212, 0.18)', color: '#06b6d4' },
            amber: { border: 'rgba(245, 158, 11, 0.42)', bg: 'rgba(245, 158, 11, 0.10)', badgeBg: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b' },
            rose: { border: 'rgba(244, 63, 94, 0.40)', bg: 'rgba(244, 63, 94, 0.10)', badgeBg: 'rgba(244, 63, 94, 0.18)', color: '#f43f5e' }
        };
        const st = accentMap[cb.accent] || accentMap.gold;
        const iconCls = cb.icon || 'fa-bullhorn';
        const badgeHtml = cb.badge
            ? `<span style="display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:800; padding:3px 10px; border-radius:9999px; background:${st.badgeBg}; color:${st.color}; border:1px solid ${st.border}; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">
                   <i class="fa-solid ${escapeHtmlSafe(iconCls)}"></i> ${escapeHtmlSafe(cb.badge)}
               </span>`
            : '';
        const btnHtml = (cb.buttonText && cb.buttonUrl)
            ? `<div style="margin-top:12px;">
                   <a href="${escapeHtmlSafe(cb.buttonUrl)}" target="${cb.buttonUrl.startsWith('http') ? '_blank' : '_self'}" rel="noopener" class="btn btn-secondary" style="min-height:36px; padding:6px 14px; font-size:12px; border-color:${st.border}; color:${st.color};">
                       <i class="fa-solid fa-arrow-up-right-from-square"></i> ${escapeHtmlSafe(cb.buttonText)}
                   </a>
               </div>`
            : '';

        return `
            <div class="glass-card custom-builder-block" data-custom-block-id="${escapeHtmlSafe(cb.id)}" style="padding:18px 22px; margin-bottom:18px; border:1px solid ${st.border}; background:${st.bg}; border-radius:var(--radius-md); position:relative; overflow:hidden;">
                <div style="display:flex; align-items:flex-start; gap:14px;">
                    <div style="width:44px; height:44px; border-radius:12px; background:${st.badgeBg}; border:1px solid ${st.border}; color:${st.color}; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
                        <i class="fa-solid ${escapeHtmlSafe(iconCls)}"></i>
                    </div>
                    <div style="flex:1; min-width:0;">
                        ${badgeHtml}
                        <h3 style="font-size:16px; font-weight:800; color:var(--text-main); margin:0 0 5px 0; line-height:1.35;">${escapeHtmlSafe(cb.title || 'Informasi Kampus')}</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin:0; line-height:1.6; white-space:pre-line;">${escapeHtmlSafe(cb.desc || '')}</p>
                        ${btnHtml}
                    </div>
                </div>
            </div>
        `;
    }

    function applyTopUtilBar(barEl, show, barCfg) {
        if (!barEl) return;
        barEl.style.display = show ? '' : 'none';
        if (!show || !barCfg) return;
        const contacts = barEl.querySelector('.top-util-contacts');
        const badge = barEl.querySelector('.top-util-badge');
        if (contacts) {
            contacts.innerHTML = `
                <span><i class="fa-solid fa-envelope" style="color:#fde047;"></i> ${escapeHtmlSafe(barCfg.email)}</span>
                <span><i class="fa-solid fa-phone" style="color:#fde047;"></i> ${escapeHtmlSafe(barCfg.phone)}</span>
                <span><i class="fa-solid fa-clock" style="color:#fde047;"></i> ${escapeHtmlSafe(barCfg.hours)}</span>
            `;
        }
        if (badge) {
            badge.innerHTML = `<i class="fa-solid fa-building-columns"></i> ${escapeHtmlSafe(barCfg.badge)}`;
        }
    }

    /* ======================================================================
       1. APPLY TO LOGIN PAGE (index.html)
       ====================================================================== */
    function applyLoginPage() {
        const grid = document.querySelector('.login-portal-grid');
        if (!grid) return;

        const cfg = getSiteConfig().login;

        // 1. Top Utility Bar
        applyTopUtilBar(document.querySelector('.top-util-bar'), cfg.showTopBar, cfg.topBar);

        // 2. Portal Grid Layout ('split-right' | 'split-left' | 'centered')
        grid.classList.remove('layout-split-right', 'layout-split-left', 'layout-centered');
        grid.classList.add('layout-' + (cfg.layout || 'split-right'));

        // 3. Login Card Texts & Preset Box
        const loginCard = document.querySelector('.login-glass-card');
        if (loginCard && cfg.loginBox) {
            const headerWrap = loginCard.firstElementChild;
            if (headerWrap) {
                const subEl = headerWrap.children[1];
                const h2El = headerWrap.querySelector('h2');
                const pEl = headerWrap.querySelector('p');
                if (subEl) subEl.textContent = cfg.loginBox.subtitle || 'SIMPEL UINSSC';
                if (h2El) {
                    const cardTyped = h2El.querySelector('#typedCardTitle');
                    if (cardTyped) {
                        cardTyped.textContent = cfg.loginBox.title || 'Portal Masuk Sistem';
                    } else {
                        h2El.textContent = cfg.loginBox.title || 'Portal Masuk Sistem';
                    }
                }
                if (pEl) pEl.textContent = cfg.loginBox.desc || '';
            }
            const presetBox = loginCard.querySelector('.login-preset-box');
            if (presetBox) {
                presetBox.style.display = cfg.loginBox.showPresetDemo !== false ? '' : 'none';
                const presetLabel = presetBox.querySelector('span');
                if (presetLabel && cfg.loginBox.presetTitle) {
                    presetLabel.innerHTML = `<i class="fa-solid fa-bolt" style="color: var(--gold);"></i> ${escapeHtmlSafe(cfg.loginBox.presetTitle)}`;
                }
            }
        }

        // 4. Hero Side Blocks & Ordering
        const heroSide = document.querySelector('.login-hero-side');
        if (heroSide) {
            // Ensure hero_header wrapper exists as full-width header before grid
            let heroHeaderWrap = document.getElementById('loginHeroHeaderBlock');
            const mainContainer = grid.parentElement;
            if (!heroHeaderWrap) {
                const badgeEl = document.querySelector('.login-inst-badge');
                const titleWrap = document.querySelector('.login-main-title') ? document.querySelector('.login-main-title').parentElement : null;
                if (badgeEl || titleWrap) {
                    heroHeaderWrap = document.createElement('header');
                    heroHeaderWrap.id = 'loginHeroHeaderBlock';
                    heroHeaderWrap.className = 'login-full-header';
                    if (mainContainer) {
                        mainContainer.insertBefore(heroHeaderWrap, grid);
                    } else {
                        heroSide.insertBefore(heroHeaderWrap, heroSide.firstChild);
                    }
                    if (badgeEl) heroHeaderWrap.appendChild(badgeEl);
                    if (titleWrap && titleWrap !== heroSide) heroHeaderWrap.appendChild(titleWrap);
                }
            } else if (mainContainer && heroHeaderWrap.parentElement !== mainContainer) {
                mainContainer.insertBefore(heroHeaderWrap, grid);
            }

            // Update hero_header content
            const hh = cfg.blocks.hero_header;
            if (heroHeaderWrap && hh) {
                heroHeaderWrap.style.display = hh.enabled !== false ? 'flex' : 'none';
                const badgeSpan = heroHeaderWrap.querySelector('.login-inst-badge span:last-child');
                const mainTitle = heroHeaderWrap.querySelector('.login-main-title');
                const mainDesc = heroHeaderWrap.querySelector('.login-main-desc');
                if (badgeSpan) badgeSpan.textContent = hh.badge || 'UIN Siber Syekh Nurjati Cirebon';
                if (mainTitle) {
                    if (typeof window.initLoginTypedAnimation === 'function') {
                        window.initLoginTypedAnimation(hh.title || '');
                    } else {
                        const typedSpan = mainTitle.querySelector('#typedHeroTitle');
                        if (typedSpan) typedSpan.textContent = hh.title || '';
                        else mainTitle.textContent = hh.title || '';
                    }
                }
                if (mainDesc) mainDesc.textContent = hh.desc || '';
            }

            // Update features_list content (Dynamic N items!)
            const featList = document.getElementById('loginFeaturesList');
            const fl = cfg.blocks.features_list;
            if (featList && fl) {
                featList.style.display = (fl.enabled !== false && Array.isArray(fl.items) && fl.items.length > 0) ? 'flex' : 'none';
                if (Array.isArray(fl.items)) {
                    featList.innerHTML = fl.items.map(f => `
                        <div class="login-feature-item">
                            <div class="login-feature-icon ${escapeHtmlSafe(f.colorClass || 'icon-emerald')}">
                                <i class="fa-solid ${escapeHtmlSafe(f.icon || 'fa-star')}"></i>
                            </div>
                            <div class="login-feature-text">
                                <h4>${escapeHtmlSafe(f.title)}</h4>
                                <p>${escapeHtmlSafe(f.desc)}</p>
                            </div>
                        </div>
                    `).join('');
                }
            }

            // Update video_profile content & handle Super Admin enable/disable toggle
            const videoCard = document.getElementById('loginVideoCard');
            const videoBlock = document.getElementById('loginVideoBlock');
            const vp = cfg.blocks.video_profile;
            const isVideoActive = vp && vp.enabled !== false;
            const isFeatActive = fl && fl.enabled !== false && Array.isArray(fl.items) && fl.items.length > 0;

            if (videoBlock) {
                if (isVideoActive) {
                    videoBlock.classList.remove('hidden');
                    videoBlock.style.removeProperty('display');
                    const embedId = vp.embedId || extractYtId(vp.url) || 'bUhLVKdbRd0';
                    const videoIframe = document.getElementById('loginVideoIframe');
                    const videoTitle = document.getElementById('loginVideoTitle');
                    const videoDesc = document.getElementById('loginVideoDesc');
                    const badgeEl = videoBlock.querySelector('span');
                    if (badgeEl && vp.badge) {
                        badgeEl.innerHTML = `<i class="fa-brands fa-youtube"></i> ${escapeHtmlSafe(vp.badge)}`;
                    }
                    if (videoIframe && embedId) {
                        const targetSrc = `https://www.youtube.com/embed/${embedId}?rel=0`;
                        if (!videoIframe.src || !videoIframe.src.includes(embedId)) {
                            videoIframe.src = targetSrc;
                        }
                    }
                    if (videoTitle) videoTitle.textContent = vp.title || '';
                    if (videoDesc) videoDesc.textContent = vp.desc || '';
                } else {
                    videoBlock.classList.add('hidden');
                    videoBlock.style.setProperty('display', 'none', 'important');
                }
            }

            if (videoCard) {
                if (isVideoActive) {
                    videoCard.classList.remove('hidden');
                    videoCard.classList.remove('no-video');
                    videoCard.style.removeProperty('display');
                } else {
                    // Ketika video dan text dinonaktifkan, shape (kartu video) ikut nonaktif
                    videoCard.classList.add('hidden');
                    videoCard.classList.add('no-video');
                    videoCard.style.setProperty('display', 'none', 'important');
                }
            }

            // Remove old rendered custom blocks on login hero
            heroSide.querySelectorAll('.custom-builder-block-wrap').forEach(el => el.remove());

            // Map block IDs to DOM elements & append in configured heroOrder
            const domMap = {
                hero_header: heroHeaderWrap,
                features_list: featList,
                video_profile: videoCard
            };

            (cfg.customBlocks || []).forEach(cb => {
                if (cb.enabled === false) return;
                const wrap = document.createElement('div');
                wrap.className = 'custom-builder-block-wrap';
                wrap.innerHTML = buildCustomBlockHtml(cb);
                domMap[cb.id] = wrap;
            });

            (cfg.heroOrder || []).forEach(id => {
                if (id !== 'hero_header' && domMap[id]) {
                    if (id === 'features_list' && featList) {
                        if (isVideoActive && videoCard) {
                            if (!videoCard.contains(featList)) {
                                videoCard.appendChild(featList);
                            }
                        } else {
                            if (videoCard && videoCard.contains(featList)) {
                                heroSide.appendChild(featList);
                            } else {
                                heroSide.appendChild(featList);
                            }
                        }
                    } else if (domMap[id] !== featList) {
                        heroSide.appendChild(domMap[id]);
                    }
                }
            });

            // Check if heroSide has any active/visible components
            const hasVisibleHeroBlocks = isVideoActive || isFeatActive || (cfg.customBlocks || []).some(cb => cb.enabled !== false);
            if (!hasVisibleHeroBlocks) {
                heroSide.classList.add('hidden');
                heroSide.style.setProperty('display', 'none', 'important');
                if (grid) grid.classList.add('hero-empty');
            } else {
                heroSide.classList.remove('hidden');
                heroSide.style.removeProperty('display');
                if (grid) grid.classList.remove('hero-empty');
            }
        }

        initLoginEqualHeightSync();
        renderSuperAdminFloatingBar('login');
    }

    function syncLoginEqualHeights() {
        const videoCard = document.getElementById('loginVideoCard');
        const glassCard = document.querySelector('.login-glass-card');
        const grid = document.querySelector('.login-portal-grid');
        if (!videoCard || !glassCard || !grid) return;

        requestAnimationFrame(() => {
            const compDisplay = window.getComputedStyle(grid).display;
            const isTwoCol = (window.innerWidth > 820 || (compDisplay === 'grid' && window.getComputedStyle(grid).gridTemplateColumns.includes(' ')));
            const isVideoVisible = !videoCard.classList.contains('hidden') && videoCard.style.display !== 'none' && videoCard.offsetParent !== null;

            if (isTwoCol && isVideoVisible) {
                videoCard.style.minHeight = '';
                glassCard.style.minHeight = '';
                const h1 = videoCard.scrollHeight || videoCard.offsetHeight;
                const h2 = glassCard.scrollHeight || glassCard.offsetHeight;
                const maxH = Math.max(h1, h2);
                if (maxH > 150) {
                    videoCard.style.minHeight = maxH + 'px';
                    glassCard.style.minHeight = maxH + 'px';
                }
            } else {
                videoCard.style.minHeight = '';
                glassCard.style.minHeight = '';
            }
        });
    }

    let _loginResizeObserver = null;
    function initLoginEqualHeightSync() {
        const videoCard = document.getElementById('loginVideoCard');
        const glassCard = document.querySelector('.login-glass-card');
        if (!videoCard || !glassCard) return;

        syncLoginEqualHeights();
        window.addEventListener('resize', syncLoginEqualHeights, { passive: true });
        window.addEventListener('orientationchange', syncLoginEqualHeights, { passive: true });
        window.addEventListener('load', syncLoginEqualHeights, { passive: true });

        if ('ResizeObserver' in window && !_loginResizeObserver) {
            _loginResizeObserver = new ResizeObserver(() => syncLoginEqualHeights());
            _loginResizeObserver.observe(glassCard);
            _loginResizeObserver.observe(videoCard);
        }
    }

    /* ======================================================================
       2. APPLY TO USER PORTAL PAGE (pages/user.html)
       ====================================================================== */
    function applyUserPage() {
        const bannerCard = document.getElementById('userHeroBanner');
        const mainContainer = document.querySelector('main.container');
        if (!bannerCard || !mainContainer) return;

        const cfg = getSiteConfig().user;

        // 1. Top Utility Bar & Container Width
        applyTopUtilBar(document.querySelector('.top-util-bar'), cfg.showTopBar, cfg.topBar);
        const isWide = (cfg.containerWidth === 'wide');
        mainContainer.classList.toggle('container-wide', isWide);
        const navContainer = document.querySelector('.navbar .container');
        if (navContainer) navContainer.classList.toggle('container-wide', isWide);
        const topUtilContainer = document.querySelector('.top-util-bar .container');
        if (topUtilContainer) topUtilContainer.classList.toggle('container-wide', isWide);
        const footerContainer = document.querySelector('.app-footer .container');
        if (footerContainer) footerContainer.classList.toggle('container-wide', isWide);

        // 2. Ensure userWorkspaceWrapper wraps tab-switcher + sections so pageOrder can reorder Banner, Custom Sections & Workspace
        let workspaceWrap = document.getElementById('userWorkspaceWrapper');
        const tabSwitcher = mainContainer.querySelector('.tab-switcher');
        const secForm = document.getElementById('sectionForm');
        const secRiwayat = document.getElementById('sectionRiwayat');
        const secLacak = document.getElementById('sectionLacak');

        if (!workspaceWrap && tabSwitcher) {
            workspaceWrap = document.createElement('div');
            workspaceWrap.id = 'userWorkspaceWrapper';
            mainContainer.insertBefore(workspaceWrap, tabSwitcher);
            workspaceWrap.appendChild(tabSwitcher);
            if (secForm) workspaceWrap.appendChild(secForm);
            if (secRiwayat) workspaceWrap.appendChild(secRiwayat);
            if (secLacak) workspaceWrap.appendChild(secLacak);
        }

        // 3. Banner Content & Pills
        const b = cfg.blocks.user_banner;
        if (b) {
            bannerCard.style.display = b.enabled !== false ? '' : 'none';
            const badgeEl = document.getElementById('userHeroBannerBadge');
            const titleEl = document.getElementById('userHeroBannerTitle');
            const descEl = document.getElementById('userHeroBannerDesc');
            const graphicEl = document.getElementById('userHeroBannerGraphic');
            const pillsWrap = bannerCard.querySelector('.banner-feature-pills');

            if (badgeEl) badgeEl.innerHTML = `<i class="fa-solid fa-bookmark"></i> ${escapeHtmlSafe(b.badge || '')}`;
            if (titleEl) titleEl.textContent = b.title || '';
            if (descEl) descEl.textContent = b.desc || '';
            if (graphicEl) graphicEl.innerHTML = `<i class="fa-solid ${escapeHtmlSafe(b.icon || 'fa-building-shield')}"></i>`;

            if (b.bgImage) {
                bannerCard.style.backgroundImage = `linear-gradient(rgba(0, 54, 32, 0.75), rgba(0, 40, 22, 0.88)), url('${b.bgImage}')`;
                bannerCard.style.backgroundSize = 'cover';
                bannerCard.style.backgroundPosition = 'center';
            } else {
                bannerCard.style.backgroundImage = '';
                bannerCard.style.backgroundSize = '';
                bannerCard.style.backgroundPosition = '';
            }

            if (pillsWrap) {
                const pills = Array.isArray(b.pills) ? b.pills : [];
                pillsWrap.style.display = pills.length > 0 ? 'flex' : 'none';
                pillsWrap.innerHTML = pills.map(p =>
                    `<span class="banner-pill-item"><i class="fa-solid ${escapeHtmlSafe(p.icon || 'fa-check')}"></i> ${escapeHtmlSafe(p.text)}</span>`
                ).join('');
            }
        }

        // 4. Builtin Tabs & Sections Headings + Visibility
        const tabMap = {
            lapor: { btn: document.getElementById('tabLapor'), sec: secForm, cfg: cfg.blocks.lapor },
            riwayat: { btn: document.getElementById('tabRiwayat'), sec: secRiwayat, cfg: cfg.blocks.riwayat },
            lacak: { btn: document.getElementById('tabLacak'), sec: secLacak, cfg: cfg.blocks.lacak }
        };

        // Update section titles & tab button labels
        if (secForm && cfg.blocks.lapor) {
            const h2 = secForm.querySelector('.form-card-header h2');
            const p = secForm.querySelector('.form-card-header p');
            if (h2) h2.innerHTML = `<i class="fa-solid ${escapeHtmlSafe(cfg.blocks.lapor.icon || 'fa-clipboard-list')}" style="color:var(--gold);"></i> ${escapeHtmlSafe(cfg.blocks.lapor.title)}`;
            if (p) p.textContent = cfg.blocks.lapor.desc || '';
            const span = document.querySelector('#tabLapor span');
            if (span) span.textContent = cfg.blocks.lapor.tabLabel || 'Buat Laporan Kerusakan';
        }
        if (secRiwayat && cfg.blocks.riwayat) {
            const h2 = secRiwayat.querySelector('h2');
            const p = secRiwayat.querySelector('p');
            if (h2) h2.innerHTML = `<i class="fa-solid ${escapeHtmlSafe(cfg.blocks.riwayat.icon || 'fa-clock-rotate-left')}" style="color:var(--gold);"></i> ${escapeHtmlSafe(cfg.blocks.riwayat.title)}`;
            if (p) p.textContent = cfg.blocks.riwayat.desc || '';
            const tabBtn = document.getElementById('tabRiwayat');
            if (tabBtn) {
                const badgeCount = document.getElementById('myReportsBadge') ? document.getElementById('myReportsBadge').textContent : '0';
                tabBtn.innerHTML = `<i class="fa-solid ${escapeHtmlSafe(cfg.blocks.riwayat.icon || 'fa-clock-rotate-left')}"></i> <span>${escapeHtmlSafe(cfg.blocks.riwayat.tabLabel || 'Riwayat Laporan')} <span id="myReportsBadge" class="badge-pill-count">${escapeHtmlSafe(badgeCount)}</span></span>`;
            }
        }
        if (secLacak && cfg.blocks.lacak) {
            const h2 = secLacak.querySelector('h2');
            const p = secLacak.querySelector('p');
            if (h2) h2.textContent = cfg.blocks.lacak.title || 'Lacak Status Penanganan Tiket';
            if (p) p.textContent = cfg.blocks.lacak.desc || '';
            const span = document.querySelector('#tabLacak span');
            if (span) span.textContent = cfg.blocks.lacak.tabLabel || 'Lacak Status Tiket';
        }

        // Remove previously injected custom tabs & custom sections
        if (tabSwitcher) {
            tabSwitcher.querySelectorAll('.custom-user-tab-btn').forEach(el => el.remove());
        }
        if (workspaceWrap) {
            workspaceWrap.querySelectorAll('.custom-user-tab-section').forEach(el => el.remove());
        }
        mainContainer.querySelectorAll('.custom-page-section-wrap').forEach(el => el.remove());

        // Create Custom Tab Buttons & Tab Sections
        const customTabs = (cfg.customBlocks || []).filter(cb => cb.placement === 'tab' && cb.enabled !== false);
        customTabs.forEach(cb => {
            if (tabSwitcher && workspaceWrap) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'tab-btn custom-user-tab-btn';
                btn.id = 'tabCustom_' + cb.id;
                btn.onclick = function () { window.switchUserTab && window.switchUserTab(cb.id); };
                btn.innerHTML = `<i class="fa-solid ${escapeHtmlSafe(cb.icon || 'fa-circle-info')}"></i> <span>${escapeHtmlSafe(cb.tabLabel || cb.title || 'Info Baru')}</span>`;

                const sec = document.createElement('div');
                sec.id = 'sectionCustom_' + cb.id;
                sec.className = 'custom-user-tab-section hidden';
                sec.innerHTML = buildCustomBlockHtml(cb);

                tabMap[cb.id] = { btn, sec, cfg: cb };
                tabSwitcher.appendChild(btn);
                workspaceWrap.appendChild(sec);
            }
        });

        // Reorder tabs & sections according to tabOrder
        (cfg.tabOrder || []).forEach(tid => {
            const entry = tabMap[tid];
            if (!entry) return;
            const enabled = entry.cfg && entry.cfg.enabled !== false;
            if (entry.btn) {
                entry.btn.style.display = enabled ? '' : 'none';
                if (tabSwitcher) tabSwitcher.appendChild(entry.btn);
            }
            if (entry.sec && workspaceWrap) {
                entry.sec.dataset.builderEnabled = enabled ? '1' : '0';
                workspaceWrap.appendChild(entry.sec);
            }
        });

        // Layout Mode: 'tabs' vs 'stacked'
        if (cfg.layout === 'stacked') {
            if (tabSwitcher) tabSwitcher.style.display = 'none';
            Object.keys(tabMap).forEach(tid => {
                const entry = tabMap[tid];
                if (!entry || !entry.sec) return;
                const enabled = entry.cfg && entry.cfg.enabled !== false;
                if (enabled) {
                    entry.sec.classList.remove('hidden');
                    entry.sec.style.marginBottom = '24px';
                } else {
                    entry.sec.classList.add('hidden');
                }
            });
            if (typeof window.renderMyReportsHistory === 'function') {
                window.renderMyReportsHistory();
            }
        } else {
            if (tabSwitcher) tabSwitcher.style.display = '';
            // Ensure first enabled tab is active if current active tab is disabled
            const enabledTabIds = (cfg.tabOrder || []).filter(tid => tabMap[tid] && tabMap[tid].cfg && tabMap[tid].cfg.enabled !== false);
            Object.keys(tabMap).forEach(tid => {
                const entry = tabMap[tid];
                if (entry && entry.sec && (!entry.cfg || entry.cfg.enabled === false)) {
                    entry.sec.classList.add('hidden');
                }
            });
            const anyActive = enabledTabIds.some(tid => tabMap[tid].btn && tabMap[tid].btn.classList.contains('active'));
            if (!anyActive && enabledTabIds.length > 0 && typeof window.switchUserTab === 'function') {
                window.switchUserTab(enabledTabIds[0]);
            }
        }

        // 5. Reorder Page-Level Blocks (user_banner, user_workspace, + custom page sections)
        const pageDomMap = {
            user_banner: bannerCard,
            user_workspace: workspaceWrap
        };
        (cfg.customBlocks || []).filter(cb => cb.placement !== 'tab' && cb.enabled !== false).forEach(cb => {
            const wrap = document.createElement('div');
            wrap.className = 'custom-page-section-wrap';
            wrap.innerHTML = buildCustomBlockHtml(cb);
            pageDomMap[cb.id] = wrap;
        });

        (cfg.pageOrder || []).forEach(pid => {
            if (pageDomMap[pid]) {
                mainContainer.appendChild(pageDomMap[pid]);
            }
        });

        renderSuperAdminFloatingBar('user');
    }

    // Enhance global switchUserTab so custom tabs & stacked mode work seamlessly
    function hookUserTabSwitcher() {
        if (typeof window.switchUserTab !== 'function' || window.__simpelTabHooked) return;
        const origSwitch = window.switchUserTab;
        window.switchUserTab = function (tabId) {
            const cfg = getSiteConfig().user;
            if (cfg.layout === 'stacked') return;

            // Hide any custom tab sections & deactivate custom buttons
            document.querySelectorAll('.custom-user-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.custom-user-tab-section').forEach(s => s.classList.add('hidden'));

            if (tabId === 'lapor' || tabId === 'riwayat' || tabId === 'lacak') {
                origSwitch(tabId);
            } else {
                // Deactivate builtin tabs & hide builtin sections
                ['tabLapor', 'tabRiwayat', 'tabLacak'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.remove('active');
                });
                ['sectionForm', 'sectionRiwayat', 'sectionLacak'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.add('hidden');
                });
                const customBtn = document.getElementById('tabCustom_' + tabId);
                const customSec = document.getElementById('sectionCustom_' + tabId);
                if (customBtn) customBtn.classList.add('active');
                if (customSec) customSec.classList.remove('hidden');
            }
        };
        window.__simpelTabHooked = true;
    }

    /* ======================================================================
       3. APPLY TO ADMIN DASHBOARD PAGE (pages/admin.html)
       ====================================================================== */
    function applyAdminPage() {
        const wrapper = document.getElementById('adminWrapper');
        const mainDash = document.getElementById('viewMainDashboard');
        if (!wrapper || !mainDash) return;

        const cfg = getSiteConfig().admin;

        // 1. Sidebar Position ('left' | 'right')
        wrapper.classList.toggle('sidebar-right', cfg.sidebarPosition === 'right');

        // 2. Admin Header Title, Subtitle & Visibility
        const headerEl = document.querySelector('.admin-header');
        if (headerEl && cfg.header) {
            headerEl.style.display = cfg.header.enabled !== false ? '' : 'none';
            const h1 = headerEl.querySelector('h1');
            const p = headerEl.querySelector('p');
            if (h1 && cfg.header.title) h1.textContent = cfg.header.title;
            if (p && cfg.header.desc) p.textContent = cfg.header.desc;
        }

        // 3. Identify Main Dashboard Sections
        const kpiSec = document.getElementById('adminKpiSection') || mainDash.querySelector('.admin-kpi-grid');
        const chartsSec = document.getElementById('adminChartsSection');
        const mapSec = document.getElementById('adminMapSection');
        const tableSec = document.getElementById('adminTableSection') || mainDash.querySelector('.table-card');

        if (kpiSec && cfg.blocks.admin_kpi) {
            kpiSec.style.display = cfg.blocks.admin_kpi.enabled !== false ? '' : 'none';
            kpiSec.classList.toggle('kpi-cols-2', cfg.kpiColumns === '2');
            const titleSpans = kpiSec.querySelectorAll('.kpi-title');
            const labels = cfg.blocks.admin_kpi.kpiLabels || [];
            titleSpans.forEach((sp, i) => {
                if (labels[i]) sp.textContent = labels[i];
            });
        }

        if (chartsSec && cfg.blocks.admin_charts) {
            chartsSec.style.display = cfg.blocks.admin_charts.enabled !== false ? '' : 'none';
            const h3 = document.getElementById('adminChartsSectionTitle');
            const p = document.getElementById('adminChartsSectionDesc');
            if (h3 && cfg.blocks.admin_charts.title) {
                h3.innerHTML = `<i class="fa-solid fa-chart-pie" style="color:var(--gold);"></i> ${escapeHtmlSafe(cfg.blocks.admin_charts.title)}`;
            }
            if (p && cfg.blocks.admin_charts.desc) {
                p.textContent = cfg.blocks.admin_charts.desc;
            }
        }

        if (mapSec && cfg.blocks.admin_map) {
            mapSec.style.display = cfg.blocks.admin_map.enabled !== false ? '' : 'none';
            const h3 = mapSec.querySelector('h3');
            const sub = document.getElementById('mapCategoryFilterLabel');
            if (h3 && cfg.blocks.admin_map.title) {
                h3.innerHTML = `<i class="fa-solid fa-map-location-dot" style="color: var(--gold);"></i> ${escapeHtmlSafe(cfg.blocks.admin_map.title)}`;
            }
            if (sub && cfg.blocks.admin_map.desc) {
                sub.textContent = cfg.blocks.admin_map.desc;
            }
        }

        if (tableSec && cfg.blocks.admin_table) {
            tableSec.style.display = cfg.blocks.admin_table.enabled !== false ? '' : 'none';
        }

        // Remove old custom blocks in Dashboard
        mainDash.querySelectorAll('.custom-admin-section-wrap').forEach(el => el.remove());

        const domMap = {
            admin_kpi: kpiSec,
            admin_charts: chartsSec,
            admin_map: mapSec,
            admin_table: tableSec
        };

        (cfg.customBlocks || []).forEach(cb => {
            if (cb.enabled === false) return;
            const wrap = document.createElement('div');
            wrap.className = 'custom-admin-section-wrap';
            wrap.innerHTML = buildCustomBlockHtml(cb);
            domMap[cb.id] = wrap;
        });

        (cfg.sectionOrder || []).forEach(sid => {
            if (domMap[sid]) {
                mainDash.appendChild(domMap[sid]);
            }
        });
    }

    /* ======================================================================
       4. FLOATING SUPER ADMIN LIVE QUICK-DOCK ON LOGIN & USER PAGES
       ====================================================================== */
    function isSuperAdminSession() {
        try {
            const raw = localStorage.getItem('SIMPEL_AUTH_SESSION');
            if (!raw) return false;
            const sess = JSON.parse(raw);
            return sess && sess.role === 'superadmin';
        } catch (e) {
            return false;
        }
    }

    function renderSuperAdminFloatingBar(pageKey) {
        const existing = document.getElementById('saFloatingLiveDock');
        if (!isSuperAdminSession()) {
            if (existing) existing.remove();
            return;
        }
        if (existing) existing.remove();

        const isSubdir = window.location.pathname.includes('/pages/');
        const adminUrl = isSubdir ? 'admin.html?openBuilder=' + pageKey : 'pages/admin.html?openBuilder=' + pageKey;

        const dock = document.createElement('div');
        dock.id = 'saFloatingLiveDock';
        dock.className = 'sa-floating-dock';

        const layoutBtnLabel = pageKey === 'login'
            ? 'Tukar Tata Letak Kolom'
            : 'Tukar Mode Tab / Bertumpuk';

        const curCfg = getSiteConfig();
        let videoToggleBtnHtml = '';
        if (pageKey === 'login') {
            const isVideoOn = curCfg.login.blocks.video_profile && curCfg.login.blocks.video_profile.enabled !== false;
            videoToggleBtnHtml = `
                <button type="button" class="sa-dock-btn" id="saQuickToggleVideoBtn" title="${isVideoOn ? 'Sembunyikan Video & Teks Profil di Halaman Login' : 'Tampilkan Video & Teks Profil di Halaman Login'}">
                    <i class="fa-solid ${isVideoOn ? 'fa-video-slash' : 'fa-video'}"></i> ${isVideoOn ? 'Nonaktifkan Video' : 'Aktifkan Video'}
                </button>
            `;
        }

        dock.innerHTML = `
            <span class="sa-dock-badge"><i class="fa-solid fa-crown"></i> Super Admin</span>
            <button type="button" class="sa-dock-btn" id="saQuickFlipLayoutBtn" title="Ubah tata letak halaman ini secara instan">
                <i class="fa-solid fa-table-columns"></i> ${layoutBtnLabel}
            </button>
            ${videoToggleBtnHtml}
            <a href="${adminUrl}" class="sa-dock-btn sa-dock-btn-primary" title="Buka Studio Editor untuk Tambah, Edit, Hapus & Urutkan Seksi">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Kelola Halaman Ini
            </a>
        `;

        document.body.appendChild(dock);

        const flipBtn = document.getElementById('saQuickFlipLayoutBtn');
        if (flipBtn) {
            flipBtn.onclick = function () {
                const cfg = getSiteConfig();
                if (pageKey === 'login') {
                    const modes = ['split-right', 'split-left', 'centered'];
                    const next = modes[(modes.indexOf(cfg.login.layout) + 1) % modes.length];
                    cfg.login.layout = next;
                    saveSiteConfig(cfg);
                    applyLoginPage();
                } else if (pageKey === 'user') {
                    cfg.user.layout = cfg.user.layout === 'tabs' ? 'stacked' : 'tabs';
                    saveSiteConfig(cfg);
                    applyUserPage();
                }
            };
        }

        const quickToggleVideoBtn = document.getElementById('saQuickToggleVideoBtn');
        if (quickToggleVideoBtn) {
            quickToggleVideoBtn.onclick = function () {
                const cfg = getSiteConfig();
                const wasOn = cfg.login.blocks.video_profile && cfg.login.blocks.video_profile.enabled !== false;
                cfg.login.blocks.video_profile.enabled = !wasOn;
                saveSiteConfig(cfg);
                applyLoginPage();

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: !wasOn ? 'Video Profil Diaktifkan' : 'Video Profil Dinonaktifkan',
                        text: !wasOn ? 'Pemutar video & teks telah ditampilkan di halaman login.' : 'Pemutar video & teks telah disembunyikan.',
                        showConfirmButton: false,
                        timer: 2200
                    });
                }
            };
        }
    }

    function applyCurrentPage() {
        if (document.querySelector('.login-portal-grid')) {
            applyLoginPage();
        }
        if (document.getElementById('userHeroBanner')) {
            hookUserTabSwitcher();
            applyUserPage();
        }
        if (document.getElementById('adminWrapper') && document.getElementById('viewMainDashboard')) {
            applyAdminPage();
        }
    }

    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        if (window.scrollY > 15) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    }

    // Modal Panduan Helpers (Available globally across Login, User, & Admin pages)
    window.openHelpModal = function () {
        const modal = document.getElementById('helpModal');
        if (modal) modal.classList.remove('hidden');
    };
    window.closeHelpModal = function () {
        const modal = document.getElementById('helpModal');
        if (modal) modal.classList.add('hidden');
    };
    window.closeHelpModalOnBackdrop = function (e) {
        if (e && e.target && e.target.id === 'helpModal') {
            window.closeHelpModal();
        }
    };

    // Generic Vanilla Bootstrap 5 Accordion Collapse Handler for Panduan Timeline
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-bs-toggle="collapse"]');
        if (!btn) return;
        e.preventDefault();
        const targetSelector = btn.getAttribute('data-bs-target');
        if (!targetSelector) return;
        const targetEl = document.querySelector(targetSelector);
        if (!targetEl) return;

        const isShown = targetEl.classList.contains('show');
        if (isShown) {
            targetEl.classList.remove('show');
            btn.classList.add('collapsed');
            btn.setAttribute('aria-expanded', 'false');
        } else {
            targetEl.classList.add('show');
            btn.classList.remove('collapsed');
            btn.setAttribute('aria-expanded', 'true');
        }
    });

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    document.addEventListener('DOMContentLoaded', function () {
        applyCurrentPage();
        handleNavbarScroll();
    });
    window.addEventListener('load', function () {
        applyCurrentPage();
        handleNavbarScroll();
    });
    window.addEventListener('storage', function (e) {
        if (e.key === SITE_BUILDER_KEY || e.key === LEGACY_CMS_KEY || e.key === 'SIMPEL_AUTH_SESSION') {
            applyCurrentPage();
        }
    });

    window.SimpelSiteBuilder = {
        SITE_BUILDER_KEY,
        DEFAULT_SITE_CONFIG,
        getSiteConfig,
        saveSiteConfig,
        extractYtId,
        applyCurrentPage,
        applyLoginPage,
        applyUserPage,
        applyAdminPage,
        resetAllToDefault: function () {
            localStorage.removeItem(SITE_BUILDER_KEY);
            localStorage.removeItem(LEGACY_CMS_KEY);
            applyCurrentPage();
        }
    };
})();

