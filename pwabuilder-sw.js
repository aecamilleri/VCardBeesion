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
        "/styles.css",  // Agrega tus archivos CSS y JS reales
        "/app.js",
        "/assets/img/logo.jpg.png"
      ]);
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

// Manejo de solicitudes de red
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_PAGE))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
