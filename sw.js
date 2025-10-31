/* Fitness Planner Service Worker */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `fitness-planner-${CACHE_VERSION}`;

// Core assets to precache (app shell)
const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-128.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Remove old caches
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Runtime caching strategy:
// - Navigation requests: network-first, fallback to cached index.html
// - Same-origin static GET: cache-first, then network
// - Cross-origin (e.g., CDN CSS): stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Navigation requests (SPA-ish behavior)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put('./index.html', networkResponse.clone());
          return networkResponse;
        } catch (err) {
          const cached = await caches.match('./index.html');
          return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      })()
    );
    return;
  }

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    // Cache-first for same-origin static assets
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      })()
    );
  } else {
    // Stale-while-revalidate for cross-origin (e.g., Font Awesome CSS)
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((response) => {
            cache.put(request, response.clone());
            return response;
          })
          .catch(() => undefined);
        return cached || networkPromise || new Response('', { status: 204 });
      })()
    );
  }
});

