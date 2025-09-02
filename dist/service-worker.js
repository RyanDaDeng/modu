// Simple service worker for PWA without caching
const CACHE_NAME = 'modu-v1.0.0';

// Install event - just skip waiting
self.addEventListener('install', event => {
    self.skipWaiting();
});

// Activate event - claim clients immediately
self.addEventListener('activate', event => {
    event.waitUntil(
        // Clear all caches
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    console.log('Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - no caching, just pass through
self.addEventListener('fetch', event => {
    // Simply fetch from network, no caching
    event.respondWith(fetch(event.request));
});

// Handle messages from the app
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});