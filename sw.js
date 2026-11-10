/**
 * SERVICE WORKER - SIMPEL UINSSC
 * Progressive Web App (PWA) Offline Cache & Background Handler
 * UIN Siber Syekh Nurjati Cirebon
 */

const CACHE_NAME = 'simpel-uinssc-v6.9';
const STATIC_ASSETS = [
    './',
    './index.html',
    './pages/user.html',
    './pages/admin.html',
    './css/user.css',
    './css/admin.css',
    './js/site-builder.js',
    './js/webgl-tour.js',
    './js/user.js',
    './js/admin.js',
    './assets/img/logo.png',
    './assets/img/favicon.png',
    './assets/img/avatar_dummy.svg',
    './assets/img/gedungCyber.png',
    './assets/img/uinssc_siber.jpg',
    './assets/img/uinssc_fasya.jpg',
    './assets/img/uinssc_fdk.jpg',
    './manifest.json'
];

// Install Event: Pre-cache Static Shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('[SW] Pre-caching partial skip:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activate Event: Clear Old Caches Immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Network-First for HTML Navigation (Always Fresh!), Cache-First for Static Assets
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Bypass non-GET and API or external resources
    if (request.method !== 'GET' || url.pathname.includes('/api/')) {
        return;
    }

    // 1. Dokumen HTML (index.html, user.html, admin.html): Network-First
    // Memastikan perbaikan UI langsung tampil tanpa tertahan cache lama!
    if (request.mode === 'navigate' || request.destination === 'document' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // 2. Aset Statis (CSS, JS, Gambar): Stale-While-Revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});

