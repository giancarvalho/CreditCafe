const basePath = self.location.pathname.replace(/sw\.js$/, '');


self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('CreditCafe').then((cache) => {
      console.log('Opened cache');
      return cache.addAll([
        `${basePath}`,
        `${basePath}index.html`,
        `${basePath}assets/index-DbTjc8lW.css`,
        `${basePath}assets/index-BnpVIo-p.js`,
        `${basePath}assets/icon-192.png`,
        `${basePath}assets/icon-512.png`,
      ]);
    })
  );
});


self.addEventListener('activate', (event) => {
  self.clients.claim();
});