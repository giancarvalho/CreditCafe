self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('CreditCafe').then((cache) => {
      console.log('Opened cache');
      return cache.addAll([
        '/',
        '/index.html',
        '/*.css',
        '/*.js',
        '/coffee.svg'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});