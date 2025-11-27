# Unified Test Task — Orders & Products

## Quick start (Docker)

Requirements: Docker, Docker Compose

From project root:
bash
`docker-compose up --build`

Frontend: http://localhost:3000

API (REST): http://localhost:4000/rest

GraphQL: http://localhost:4000/graphql

Socket.io: ws://localhost:4000

Project layout
app/ - Next.js frontend (TypeScript)

api/ - Mock backend (Express + GraphQL + Socket.io)

mysql/ - SQL schema for MySQL Workbench

Scripts (frontend)
Inside app/:

`npm run dev` - next dev

`npm run build` - build

`npm run start` - start

`npm run test` - run jest
