// Retired service worker. The localhost demo no longer supports offline caching,
// background submission retries, or push notifications.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith('udyamsetu-'))
        .map((name) => caches.delete(name))
    );
    await self.registration.unregister();
  })());
});
