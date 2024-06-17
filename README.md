# Immich photo frame

A very basic photo frame that runs in a browser and shows a new random photo every 30 seconds.
Photos come from `getRandomPhoto` call, so pretty much the entire collection could be shown.
exceptions are videos and archived photos. Some photo metadata is shown in an overlay - album,
location and time of capture.

I use a reverse proxy (nginx) to serve the static photo frame code at the same host as Immich, see
`nginx/nginx.conf`.

API key is used for authentication, on the first use supply it in the URL with `?api-key=<YOUR KEY>`
after that it will be saved in a cookie.

## Deployment

1. Add nginx to the Immich deployment. In my case this means adding a new container to the Immich
   pod and redirecting the external port to the new container.

1. `npx webpack` to package the sources under `dist`.

1. Copy `dist` to the data folder of the nginx container, see the file `nginx/nginx.conf`.

1. From a device that will run the photo frame (in my case firefox kiosk running under DietPi),
   navigate to `http://immich_host:2283/photo-frame/index.html?api-key=<YOUR_API_KEY>`.
