const CACHE_PREFIX = "brimm-";
const CACHE = `${CACHE_PREFIX}v1`;
const PRECACHE = ["/", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    Promise.all([
      caches.open(CACHE).then((c) => c.addAll(PRECACHE)),
      self.skipWaiting(),
    ]),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then(async (res) => {
          if (res.ok && res.type === "basic") {
            const cache = await caches.open(CACHE);
            await cache.put("/", res.clone());
          }
          return res;
        })
        .catch(() => caches.match("/").then((r) => r ?? Response.error())),
    );
    return;
  }

  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then(async (res) => {
        if (res.ok && res.type === "basic") {
          const copy = res.clone();
          const cache = await caches.open(CACHE);
          await cache.put(request, copy);
        }
        return res;
      });
    }),
  );
});
