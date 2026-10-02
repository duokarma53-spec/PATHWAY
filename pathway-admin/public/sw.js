// Pathway Admin CRM Service Worker
// Cache version is based on timestamp — bumped on each deploy via next.config
const CACHE_VERSION = Date.now().toString().slice(0, 8);
const CACHE_NAME = `pathway-admin-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/icon.svg',
  '/icon-maskable.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-first for HTML pages and ALL Next.js JS/CSS chunks
  // This guarantees new deployments always load fresh
  const isNavigation = event.request.mode === 'navigate';
  const isNextChunk  = url.pathname.startsWith('/_next/');

  if (isNavigation || isNextChunk) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match('/'))
      )
    );
    return;
  }

  // Cache-first only for icons and manifest
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
