const CACHE_NAME = 'scikids-cache-v1';
const OFFLINE_ASSETS = [
    '/',
    '/index.html',
    '/html/español.html',
    '/html/matematicas.html',
    '/html/ciencias.html',
    '/html/juegos.html',
    '/css/style.css',
    '/css/animations.css',
    '/css/responsive.css',
    '/js/main.js',
    '/js/buscador.js',
    '/js/juegos.js',
    '/js/laboratorio.js',
    '/src/assets/css/all.min.css',
    '/src/img/iconos/español.png',
    '/src/img/iconos/juegos.png',
    '/src/img/iconos/matematicas.png',
    '/src/img/iconos/ciencias.png',
    '/src/img/espanol/imagen vocabulario.jpeg',
    '/src/img/espanol/imagen ortografia.png',
    '/src/img/espanol/comprension lectora.jpeg',
    '/src/img/espanol/oracion.jpeg',
    '/src/img/espanol/abecedario.jpeg',
    '/src/img/espanol/tilde.png',
    '/src/img/espanol/libro.png',
    '/src/videos/lectura/sinonimos.mp4'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
                    return networkResponse;
                }
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                return networkResponse;
            }).catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('/html/español.html');
                }
            });
        })
    );
});
