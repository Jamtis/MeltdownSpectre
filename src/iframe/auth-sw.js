self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/src/iframe/index.html'
      ]);
    })
  );
});

const request_keys = Object.keys(Request.prototype);
addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
        console.log("request", event.request);
        
        const options = {};
        for (const key of request_keys) {
            options[key] = event.request[key];
        }
        const url = new URL(options.url);
        if (url.hostname == "facebook.com") {
            options.url = "/src/iframe/redirect.html";
        }
      const args = event.request.mode == "navigate" ? [event.request] : [options.url, options];
      return fetch(...args).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function (error) {
          console.error(error);
          console.log(options);
        return caches.match('/src/iframe/index.html');
      });
  }));
});