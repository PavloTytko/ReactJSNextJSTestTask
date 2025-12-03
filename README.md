# Unified Test Task — Orders & Products

This repository contains a Next.js frontend and an Express/GraphQL/Socket.io backend. You can run it either with Docker (recommended) or locally.

## Quick start with Docker

Requirements: Docker and Docker Compose installed.

From the project root run:

```
docker-compose up --build -d
```

Once everything is up:

- Frontend (Next.js): http://localhost:3001
- API (REST): http://localhost:4000/rest
- GraphQL Playground: http://localhost:4000/graphql
- Socket.io endpoint: ws://localhost:4000

Notes
- The frontend container exposes port 3000 inside the container, mapped to 3001 on your machine (see `docker-compose.yml`).
- The login is fake you can put in "admin"/"admin"
- Environment passed to the frontend in Docker:
  - `NEXT_PUBLIC_API_URL=http://api:4000` (container-to-container URL)
  - `NEXT_PUBLIC_WS_URL=http://api:4000`
  - `NEXT_PUBLIC_WS_URL_BROWSER=http://localhost:4000` (what your browser uses)
- A MySQL container is included and data is stored in the `mysql-data` Docker volume. The current backend uses in-memory mock data and does not require MySQL to run business logic, but the service is provided for future extension.

To stop containers, then run:

```
docker-compose down
```

## Running locally without Docker

You can run the API and the frontend separately. In two terminals, from the project root:

1) Backend (API)
```
cd api
npm install
npm run dev
```
The API will be available at http://localhost:4000

2) Frontend (Next.js)
```
cd app
npm install
npm run dev
```
The app will be available at http://localhost:3000

Environment for local dev
- Edit `app/env.local` if needed. Defaults are set to talk to the local API:
  - `NEXT_PUBLIC_API_URL=http://localhost:4000`
  - `NEXT_PUBLIC_WS_URL_BROWSER=http://localhost:4000`

## Project layout
- `app/` — Next.js frontend (TypeScript)
- `api/` — Backend (Express + GraphQL Yoga + Socket.io) with mock data

## Useful API endpoints
- REST orders: `GET http://localhost:4000/rest/orders`
- REST products: `GET http://localhost:4000/rest/products`
- GraphQL: `POST http://localhost:4000/graphql`

Example GraphQL query:
```
query {
  orders { id title date description products { id title type } }
}
```

## Basic usage
1. Start the stack (Docker or local) and open the frontend in your browser.
   - Docker: http://localhost:3001
   - Local dev: http://localhost:3000
2. Explore orders and products.
3. Delete an order from the UI; the API emits `ordersUpdated` via Socket.io and the app updates in real time.
