importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = "beesion-vcard-cache";
const OFFLINE_PAGE = "/offline.html"; // Asegúrate de crear este archivo

// Precargar archivos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_PAGE,
        "/",  // Página principal
        "/index.html",
        "/styles.css",  // Asegúrate de que esta ruta sea correcta
        "/app.js",  // Asegúrate de que esta ruta sea correcta
        "/assets/img/logo.jpg",  // Logo
      ]);
    })
  );
});

// Interceptar las solicitudes y servir desde la caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Evento de activación
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
