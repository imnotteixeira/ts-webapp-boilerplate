# ts-webapp-boilerplate

A complete(-ish) webapp boilerplate with Node.js (with TypeScript!), Docker, nginx, webpack, SSR, React.

## Run

This implies docker and docker-compose are set up. `docker-compose.yml` specifies the infrastructure services which this app is composed of.

## Development

This mode allows for faster development as it hot-reloads on client-side changes. **Server changes still require restart!**

```
docker-compose up web-server-dev
```

In this mode, the server itself creates an internal webpack dev server to serve its own assets, which reloads the page on asset change.

It will start the web application on `http://localhost:8081`.

In order to use Docker/Docker Compose for the full local development workflow (with local overrides of dependencies), you'll need additional steps. I did a similar setup, and you can follow the instructions in [coliseo-development-workspace-setup](https://github.com/imnotteixeira/coliseo-development-workspace-setup).

## Production

This mode implies two service running separately: the `web-server` (backend); and the `assets-server` (frontend)

Since `web-server` depends on `assets-server`, simply starting the `web-server` service will also start `assets-server`, conveniently:

```
docker-compose up web-server
```

## Architecture Overview

The app is composed of two main pieces: The backend web server, and the assets (client) server.

The backend web server is a Node.js application, which may communicate with other backend services (e.g. a database) and its goal is to generate a base static html webpage, which may request additional client assets code, by including `<script>` tags.

The assets server serves the `.js` and `.css` bundles which are requested by the backend-generated pages, in order to make static pages *dynamic*.

The backend server will send necessary data to the backend by injecting an `__APP_CONTEXT__` field into the `window` object. The structure for this data is defined in `shared/shared.d.ts`, so that both backend and frontend have a contract on the data that that is sent from one to the other.

The assets code is composed of a React application, which is also used by the backend server in order to generate the static version of it, which is later hydrated once the assets are loaded. This allows for users to see (some) version of the page even before JavaScript loads, which is great for Search Engine Optimization (SEO)!

In dev mode, the backend server alone is responsible to serve the assets as well, but the SSR design remains, this just allows for hot-module-reloading, which is convenient during development.

## Backlog

* It may be useful to put the web-server itself behind a nginx of its own, so that serving static assets from the server is easier (to include in SSR generated pages, e.g. favicons, default images, etc...)

## Log

### 2022-07-24

* Complete SSR setup done (docker compatible; development watch mode compatible)