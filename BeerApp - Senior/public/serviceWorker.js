const urlsToCache = [
    "/index.html",
    "/"
];
const cacheName = "beer-app-cache";
const installEvent = "install";
const fetchEvent = "fetch";

self.addEventListener(installEvent, (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Basic read-through caching
self.addEventListener(fetchEvent, (event) => {
    event.respondWith(caches.match(event.request)
        .then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});