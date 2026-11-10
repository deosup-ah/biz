/* 더숲 아카이브 — 오프라인 대비. 데이터는 항상 네트워크 먼저, 안 되면 마지막 저장본. */
const CACHE = "ds-v4";
const CORE = ["./", "index.html", "data.js", "sales.js", "logo.png", "icon-192.png", "manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  const key = u.pathname.endsWith("/") ? "./" : u.pathname.split("/").pop();
  e.respondWith(fetch(e.request, { cache: "no-store" }).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(key, cp)); }
    return r;
  }).catch(() => caches.match(key).then(r => r || caches.match(e.request))));
});
