self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('CreditCafe').then((cache) => {
      console.log('Opened cache');
      return cache.addAll([
        '/',
        '/index.html',
        './assets/index-DbTjc8lW.css',
        './assets/index-BnpVIo-p.js',
        './assets/coffee-144.svg'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});