// Service Worker for caching and performance optimization
const CACHE_NAME = 'lakeshore-convenience-v3';
const urlsToCache = [
  '/',
  '/menu',
  '/about',
  '/contact',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip caching for API requests, dynamic content, and POST requests
  if (
    event.request.url.includes('/api/') || 
    event.request.url.includes('localhost') ||
    event.request.method !== 'GET' ||
    event.request.headers.get('accept').includes('text/html')
  ) {
    return;
  }
  
  // For static assets, try cache first, then network
  if (
    event.request.url.includes('.js') ||
    event.request.url.includes('.css') ||
    event.request.url.includes('.png') ||
    event.request.url.includes('.jpg') ||
    event.request.url.includes('.jpeg') ||
    event.request.url.includes('.svg') ||
    event.request.url.includes('.woff') ||
    event.request.url.includes('.woff2')
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients to ensure the service worker takes control immediately
      return self.clients.claim();
    })
  );
});