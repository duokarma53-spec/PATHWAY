// Pathway Admin CRM Service Worker
// Cache Version bumped to force instant purge of all stale dummy data
const SW_VERSION = 'v2026-10-03-pwa-install-fix';
const CACHE_NAME = `pathway-admin-${SW_VERSION}`;

// DO NOT cache '/' (HTML). Keeping HTML un-cached guarantees fresh data on every app open.
const STATIC_ASSETS = [
  '/icon.svg',
  '/icon-maskable.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Purge ALL previous caches unconditionally
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-only for navigation (HTML) and API calls
  // This guarantees fresh code and zero stale dummy data
  const isNavigation = event.request.mode === 'navigate';
  const isApi = url.pathname.startsWith('/api/');

  if (isNavigation || isApi) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => {
        return caches.match('/icon.svg');
      })
    );
    return;
  }

  // Network-first for Next.js build chunks
  const isNextChunk = url.pathname.startsWith('/_next/');
  if (isNextChunk) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first only for static icons & manifest
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// ── Native Phone Push & Real Inquiry Notification Support ───────────────

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
    tag: payload.tag || `inquiry-${Date.now()}`,
    renotify: true,
    data: {
      url: payload.url || '/inquiries',
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

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
      if (clientList.length > 0 && 'navigate' in clientList[0] && 'focus' in clientList[0]) {
        clientList[0].focus();
        return clientList[0].navigate(targetUrl);
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'SHOW_NATIVE_NOTIFICATION') {
    const { title, body, url, tag } = event.data;
    self.registration.showNotification(title || '🔔 Pathway CRM Notification', {
      body: body || 'New student activity detected.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [250, 100, 250, 100, 250],
      tag: tag || `pathway-${Date.now()}`,
      renotify: true,
      data: { url: url || '/inquiries' }
    });
  }
});
