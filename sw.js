// Importa Workbox desde el CDN
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
        "/styles.css",  
        "/app.js",
        "/assets/img/logo.jpg"
      ]).catch((error) => console.error("Error al precargar caché:", error));
    })
  );
  self.skipWaiting();
});

// Activa el nuevo Service Worker y elimina cachés antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
  self.clients.claim();
});

// Manejo de solicitudes de red con estrategia de caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match(OFFLINE_PAGE);
        });
      })
  );
});
