const CACHE_NAME = 'bt-transport-v1';
const ASSETS = [
  'index.html',
  'reception.html',
  'livraison.html',
  'inventaire.html',
  'config.html',
  'style.css',
  'sync.js',
  'fond.png',
  'logo app.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
