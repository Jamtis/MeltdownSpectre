importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.mjs");

if (workbox) {
    /*const strategy = workbox.strategies.staleWhileRevalidate({
        cacheName: "my-cache"
    });*/
    const strategy = workbox.strategies.cacheFirst({
        cacheName: "my-cache"
    });
    workbox.routing.registerRoute(/.*\.mjs/, strategy);
}