const cacheName = 'pomocycle-v1'
const filesToCache = [
  'index.html',
  'dist/bundle.js',
  'css/style.css',
  'images/icon.png'
]

self.addEventListener('install', e => {
  console.log('[Service Worker] install')
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('[Service Worker] caching app')
        return cache.addAll(filesToCache)
      })
  )
})

self.addEventListener('fetch', e => {
  console.log('[Service Worker] Fetch', e.request.url)
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  )
})
