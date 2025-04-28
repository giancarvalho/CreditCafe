self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('CreditCafe').then((cache) => {
      console.log('Opened cache');
      return cache.addAll([
        '/',
        '/index.html',
        './assets/*.css',
        './assets/*.js',
        '/assets/*.svg'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});