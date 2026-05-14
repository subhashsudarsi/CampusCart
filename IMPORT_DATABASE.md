# CampusCart - MongoDB API Quick Test

## Step 1: Configure MongoDB Atlas Values

Set the following in `api/.env`:



## Step 2: Start Node API

```bash
cd api
npm install
npm start
```

The API runs on:
- `http://localhost:3001/api`

## Step 3: Start Frontend

```bash
cd Frontend
npm install
npm run dev
```

Optional frontend env (`Frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Test Credentials

All users have password `password123`.

Admin:
- `admin@campuscart.com`

Students:
1. `raj@student.com`
2. `priya@student.com`
3. `arjun@student.com`

## API Usage Examples

Login:

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@campuscart.com",
    "password": "password123"
  }'
```

Register:

```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Student",
    "email": "newstudent@example.com",
    "password": "password123",
    "role": "student"
  }'
```

Fetch products:

```bash
curl http://localhost:3001/api/products
```

Health check:

```bash
curl http://localhost:3001/api/health
```

The API creates demo users and sample products automatically when Mongo collections are empty.
