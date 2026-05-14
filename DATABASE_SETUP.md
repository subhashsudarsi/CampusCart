# CampusCart Setup Instructions (Node + MongoDB Atlas)

## Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster

## 1. Configure The API Environment

Backend files are in `api/`.

1. Ensure `api/.env` exists.
2. Set Mongo values in `api/.env`:


```

`REQUEST_BODY_LIMIT` controls the maximum JSON payload size accepted by the API (useful for listing image uploads).

## 2. Start The Node API

```bash
cd api
npm install
npm start
```

API base URL:
- `http://localhost:3001/api`

## 3. Start The Frontend (Vite)

```bash
cd Frontend
npm install
npm run dev
```

Optional environment variable for frontend:
- `VITE_API_BASE_URL=http://localhost:3001/api`

## Default Login Credentials

Admin:
- Email: `admin@campuscart.com`
- Password: `password123`

Students:
1. `raj@student.com` / `password123`
2. `priya@student.com` / `password123`
3. `arjun@student.com` / `password123`

## Core API Endpoints

Login:
- URL: `http://localhost:3001/api/login`
- Method: `POST`

Register:
- URL: `http://localhost:3001/api/register`
- Method: `POST`

Products:
- URL: `http://localhost:3001/api/products`
- Method: `GET`

## Verify Setup

Check DB connection via health endpoint:

```bash
curl http://localhost:3001/api/health
```

The API auto-seeds demo users/products into MongoDB when collections are empty.
