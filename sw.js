// Service Worker - Empty placeholder
// This file exists to prevent 404 errors in the console
// Add Progressive Web App functionality here if needed in the future

self.addEventListener('install', function(event) {
  // Service worker installed
});

self.addEventListener('activate', function(event) {
  // Service worker activated
});

self.addEventListener('fetch', function(event) {
  // Return network request as-is
  event.respondWith(fetch(event.request));
});
