# Smart Leads Dashboard

A full-stack MERN lead management dashboard built for the internship assignment. It uses React, TypeScript, TailwindCSS, Express, MongoDB, Mongoose, JWT authentication, RBAC, backend pagination, combined filtering, debounced search, CSV export, Docker, and dark mode.

## Features

- JWT registration and login with bcrypt password hashing
- Protected API routes with `Admin` and `Sales User` roles
- Lead CRUD with status/source validation
- Combined filters for status, source, search, and sort
- Backend pagination with 10 leads per page and metadata
- Responsive dashboard UI with loading, empty, and error states
- Form validation on frontend and backend
- CSV export of the currently filtered lead set
- Dark mode support
- Docker Compose setup with MongoDB, API, and client

## Tech Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, React Router, Axios, Lucide React
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod

## Local Setup

1. Copy environment variables:

```bash
cp .env.example server/.env
cp .env.example client/.env
```

2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally or use Docker:

```bash
docker compose up mongo
```

4. Seed demo data:

```bash
npm run seed
```

5. Start development servers:

```bash
npm run dev
```

Client: http://localhost:5173  
API: http://localhost:5000/api

## Docker Setup

```bash
docker compose up --build
```

The client runs at http://localhost:5173 and the API runs at http://localhost:5000/api.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for GitHub, MongoDB Atlas, Render, and Vercel deployment steps.

## Demo Accounts

After running `npm run seed`:

- Admin: `admin@smartleads.dev` / `Admin@12345`
- Sales User: `sales@smartleads.dev` / `Sales@12345`

## Role Permissions

- Admin can create, view, update, and delete leads.
- Sales User can create, view, and update leads.
- Deleting leads is restricted to Admin.

## API Documentation

See [API.md](./API.md) for endpoint details, request bodies, query parameters, and response formats.
