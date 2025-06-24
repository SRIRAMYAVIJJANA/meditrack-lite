self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activate');
});

self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] Fetch', e.request.url);
});
