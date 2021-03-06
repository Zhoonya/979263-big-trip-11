const CACHE_PREFIX = `big-trip-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/bundle.js`,
          `/css/style.css`,
          `https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,800&display=swap`,
          `https://fonts.gstatic.com/s/montserrat/v14/JTURjIg1_i6t8kCHKm45_ZpC3gnD_g.woff2`,
          `https://fonts.gstatic.com/s/montserrat/v14/JTURjIg1_i6t8kCHKm45_c5H3gnD_g.woff2`,
          `https://fonts.gstatic.com/s/montserrat/v14/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2`,
          `https://fonts.gstatic.com/s/montserrat/v14/JTURjIg1_i6t8kCHKm45_bZF3gnD_g.woff2`,
          `https://fonts.gstatic.com/s/montserrat/v14/JTURjIg1_i6t8kCHKm45_dJE3gnD_g.woff2`,
          `/img/icons/bus.png`,
          `/img/icons/check-in.png`,
          `/img/icons/drive.png`,
          `/img/icons/flight.png`,
          `/img/icons/restaurant.png`,
          `/img/icons/ship.png`,
          `/img/icons/sightseeing.png`,
          `/img/icons/taxi.png`,
          `/img/icons/train.png`,
          `/img/icons/transport.png`,
          `/img/header-bg.png`,
          `/img/header-bg@2x.png`,
          `/img/logo.png`,
        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
    caches.keys()
      .then(
        (keys) => Promise.all(
          keys.map(
            (key) => {
              if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                return caches.delete(key);
              }
              return null;
            })
            .filter((key) => key !== null)
        )
      )
  );
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        if (cacheResponse) {
          return cacheResponse;
        }
        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== `basic`) {
              return response;
            }
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, clonedResponse);
              });
            return response;
          });
      })
  );
});
