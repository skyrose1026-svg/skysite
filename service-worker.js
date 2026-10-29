const SHELL_CACHE = "southern-oregon-angler-shell-v6";
const PAGE_CACHE = "southern-oregon-angler-pages-v6";
const OFFLINE_FALLBACK = "./offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const manifestUrl = new URL("./data/offline-assets.json", self.registration.scope);
    const response = await fetch(manifestUrl, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Offline asset manifest failed (${response.status}).`);
    const assets = await response.json();
    if (!Array.isArray(assets) || !assets.every((asset) =>
      typeof asset === "string" && asset.startsWith("./") && !asset.startsWith("../")
    )) {
      throw new Error("Offline asset manifest has an invalid format.");
    }

    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(assets);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) =>
      name.startsWith("southern-oregon-angler-") && name !== SHELL_CACHE && name !== PAGE_CACHE
    )
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(PAGE_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        const savedPage = await caches.match(request, { ignoreSearch: true });
        if (savedPage) return savedPage;
        const fallback = await caches.match(new URL(OFFLINE_FALLBACK, self.registration.scope));
        if (fallback) return fallback;
        throw new Error("This page is not available offline yet.");
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(PAGE_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
