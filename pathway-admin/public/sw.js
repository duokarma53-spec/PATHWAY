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

// ── Native Phone Push & In-App Notification Support ─────────────────────

// Listen for Web Push events from server or background sync
self.addEventListener('push', (event) => {
  let payload = {
    title: '🔔 New Student Inquiry',
    body: 'A prospective student submitted an inquiry to Pathway CRM.',
    url: '/inquiries'
  };

  if (event.data) {
    try {
      payload = Object.assign(payload, event.data.json());
    } catch (e) {
      payload.body = event.data.text() || payload.body;
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [250, 100, 250, 100, 250],
    tag: payload.tag || 'pathway-inquiry',
    renotify: true,
    data: {
      url: payload.url || '/inquiries',
      timestamp: Date.now()
    },
    actions: [
      { action: 'open', title: 'Open Inquiry' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// User taps on the native phone notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/inquiries';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // If window is open on a different page, navigate to inquiries
      if (clientList.length > 0 && 'navigate' in clientList[0] && 'focus' in clientList[0]) {
        clientList[0].focus();
        return clientList[0].navigate(targetUrl);
      }
      // Otherwise open fresh window/PWA
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle direct message triggers from client app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NATIVE_NOTIFICATION') {
    const { title, body, url, tag } = event.data;
    self.registration.showNotification(title || '🔔 Pathway CRM Notification', {
      body: body || 'New student activity detected.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [250, 100, 250, 100, 250],
      tag: tag || 'pathway-alert',
      renotify: true,
      data: { url: url || '/inquiries' }
    });
  }
});
