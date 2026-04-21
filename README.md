# 🛒 CampusCart

A peer-to-peer marketplace web app built exclusively for college students — buy and sell second-hand goods with fellow students, no shipping required.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## 📸 Overview

CampusCart connects students within a campus community to list, browse, and purchase items like textbooks, electronics, furniture, sports gear, and instruments — all arranged as direct on-campus meetups, no third-party shipping needed.

### Key Features

- 🔐 **Student & Admin accounts** — role-based access with bcrypt-hashed passwords
- 📦 **Product listings** — post items with title, description, price, category, location, and image
- 🔍 **Search & filter** — real-time filtering by keyword, category, and price range
- 💬 **In-app messaging** — buyer-seller chat threads tied to specific listings
- 📊 **Admin dashboard** — marketplace stats, user list, and per-user listing views
- 🌱 **Auto-seeded demo data** — demo users, products, and conversations on first startup

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router 6 |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | bcryptjs (password hashing) |
| Config | dotenv |

---

## 📁 Project Structure

```
campuscart/
├── api/                  # Backend — Express REST API
│   ├── server.js         # Main server file (routes, models, logic)
│   ├── package.json
│   └── .env              # Backend environment variables (not committed)
│
├── Frontend/             # React SPA
│   ├── src/
│   │   ├── components/   # Navbar, Footer, ProductCard, SearchBar, etc.
│   │   ├── pages/        # Home, Login, ProductDetail, Messaging, etc.
│   │   └── utils/api.js  # API base URL helper
│   ├── public/
│   ├── dist/             # Production build output
│   └── package.json
│
└── index.html            # Built frontend (static hosting root)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account with a cluster

### 1. Clone the repository

```bash
git clone https://github.com/your-username/campuscart.git
cd campuscart
```

### 2. Configure the backend

Copy the example env file and fill in your MongoDB credentials:

```bash
cd api
cp .env.example .env
```

Edit `api/.env`:

```env
PORT=3001
CORS_ORIGIN=*
MONGO_TYPE=atlas
MONGO_USER=your_db_username
MONGO_PASS=your_db_password
MONGO_HOST_URI=your-cluster.mongodb.net
MONGO_DB_NAME=campuscart
MONGO_AUTH_SRC=admin
MONGO_REWRITES=true
MONGO_W=majority
MONGO_HEARTBEAT_MS=60000
MONGO_COLL_CUSTOM_SEQUENCE=customSequence
```

### 3. Run the backend

```bash
# From the api/ directory
npm install
npm start
```

The API will be available at `http://localhost:3001/api`.  
Health check: `http://localhost:3001/api/health`

### 4. Run the frontend (development)

```bash
# From the Frontend/ directory
cd ../Frontend
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

> **Optional:** Create `Frontend/.env` to point to a non-default API:
> ```env
> VITE_API_BASE_URL=http://localhost:3001/api
> ```

### 5. Build for production

```bash
cd Frontend
npm run build
```

The production bundle is output to `Frontend/dist`. Copy its contents to the project root to update the static files served from `index.html`.

---

## 🔑 Demo Credentials

The app auto-seeds demo users and sample listings when MongoDB collections are empty on first startup.

| Role | Email | Password |
|---|---|---|
| Admin | admin@campuscart.com | password123 |
| Student | raj@student.com | password123 |
| Student | priya@student.com | password123 |
| Student | arjun@student.com | password123 |

> ⚠️ Change these credentials before any public deployment.

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Database connectivity check |
| GET | `/api/products` | List all available products |
| GET | `/api/products/:id` | Get a single product by ID |
| POST | `/api/products` | Create a new listing |
| POST | `/api/login` | Authenticate a user |
| POST | `/api/register` | Register a new user |
| GET | `/api/users` | List all users (admin) |
| GET | `/api/users/count` | Get total user count |
| GET | `/api/messages/conversations?userId=` | Get all conversations for a user |
| POST | `/api/messages/send` | Send a message |
| DELETE | `/api/messages/conversations/:id?userId=` | Delete a conversation |
| POST | `/api/seed-products` | Force-insert demo products |
| POST | `/api/reset-passwords` | Reset all passwords to `password123` |

---

## 🧭 Pages & Routing

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage with product grid, search, and filters |
| `/login` | Public | Login and registration |
| `/product/:id` | Public | Product detail — view listing, message seller |
| `/post-listing` | Student + Admin | Create a new listing |
| `/messages` | Student only | Messaging inbox and conversation threads |
| `/profile` | Authenticated | View and edit user profile |
| `/admin` | Admin only | Dashboard with stats, users, and listings |

---

## 🗃️ Database Schema

CampusCart uses five MongoDB collections:

- **users** — id, name, email, password (hashed), role, timestamps
- **products** — id, title, description, price, category, sellerId, sellerName, location, image, status, timestamps
- **conversations** — id, participantIds, productId, productTitle, lastMessageAt, timestamps
- **messages** — id, conversationId, senderId, receiverId, text, timestamps
- **customSequence** — key, value (atomic auto-increment counters for each collection)

---

## 🛠️ Troubleshooting

**Authentication failed connecting to Atlas**
- Verify `MONGO_USER` and `MONGO_PASS` in `api/.env`
- Confirm the database user has `readWrite` on the configured database in Atlas

**Cannot connect to Atlas**
- Add your server IP under Atlas → Network Access
- Use `0.0.0.0/0` temporarily for testing (not recommended for production)

**Frontend can't reach the API**
- Confirm the backend is running on port 3001
- Check `VITE_API_BASE_URL` in `Frontend/.env`
- Look for CORS errors in the browser console and set `CORS_ORIGIN` accordingly

---

## 🗺️ Roadmap

- [ ] JWT-based authentication with secure HttpOnly cookies
- [ ] Email verification and password reset
- [ ] Real-time messaging with WebSockets
- [ ] Payment gateway integration (Razorpay / UPI)
- [ ] Seller ratings and reviews
- [ ] Direct image file upload (multipart/form-data)
- [ ] Mobile app (React Native)
- [ ] Admin moderation controls (remove listings, suspend users)

---

## 📄 License

This project is for educational purposes. See [LICENSE](LICENSE) for details.
