# CampusCart

![CampusCart](./assets/campuscart-banner.png)

A full-stack student marketplace application enabling campus community members to buy, sell, and exchange items within their educational institution.

**GitHub:** [github.com/subhashsudarsi/campuscart](https://github.com/subhashsudarsi/campuscart)

## 🌟 Features

- **User Authentication** - Secure login and registration with role-based access (Admin/Student)
- **Product Marketplace** - Browse, list, and manage items for sale
- **Admin Dashboard** - Manage products, users, and reports
- **Messaging System** - Direct communication between buyers and sellers
- **Product Reporting** - Flag inappropriate or suspicious listings
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Real-time Database** - MongoDB Atlas for reliable data storage

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Custom session-based auth

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js**: Version 18 or newer ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **MongoDB Atlas Account**: Free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Git**: For version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/subhashsudarsi/campuscart.git
cd campuscart
```

### 2. Set Up MongoDB Atlas

1. Create a free MongoDB Atlas account
2. Create a cluster (free tier available)
3. Create a database user with read/write permissions
4. Get your connection string:
   - Go to **Cluster** > **Connect** > **Drivers** > **Node.js**
   - Copy the connection string

### 3. Configure Backend Environment

```bash
cd api
cp .env.example .env
```

Edit `api/.env` with your MongoDB credentials:

```env
PORT=3001
CORS_ORIGIN=*
REQUEST_BODY_LIMIT=8mb

# MongoDB Configuration (Atlas)
MONGO_TYPE=atlas
MONGO_USER=your_mongo_username
MONGO_PASS=your_mongo_password
MONGO_HOST_URI=your-cluster.xxxxx.mongodb.net
MONGO_DB_NAME=campuscart
MONGO_AUTH_SRC=admin
MONGO_REWRITES=true
MONGO_W=majority
MONGO_HEARTBEAT_MS=60000

# MongoDB Collections
MONGO_COLL_CUSTOM_SEQUENCE=customSequence
```

### 4. Install and Run Backend

```bash
cd api
npm install
npm start
```

Backend will be available at `http://localhost:3001/api`

Check health: `http://localhost:3001/api/health`

### 5. Configure and Run Frontend (Development)

```bash
cd Frontend
npm install
npm run dev
```

Frontend will typically run at `http://localhost:5173`

**Optional**: Edit `Frontend/.env` if backend runs on a different port:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📦 Build for Production

To create a production build of the frontend:

```bash
cd Frontend
npm run build
```

Output will be in `Frontend/dist/`. To use as static files at project root:

```bash
cp -r Frontend/dist/* ./
```

## 🔐 Demo Credentials

The API automatically seeds demo data when collections are empty:

| Role    | Email              | Password   |
|---------|-------------------|-----------|
| Admin   | admin@campuscart.com | password123 |
| Student | raj@student.com   | password123 |

⚠️ **Note**: These are demo credentials only. Change in production.

## 📁 Project Structure

```
campuscart/
├── api/                          # Express backend
│   ├── src/
│   │   ├── middleware/          # Auth, CORS, error handling
│   │   ├── models/              # Database schemas
│   │   ├── routes/              # API endpoints
│   │   └── utils/               # Helper functions
│   ├── server.js                # Entry point
│   ├── .env.example             # Environment template
│   └── package.json             # Dependencies
│
├── Frontend/                     # React + Vite app
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   └── utils/               # Client utilities
│   ├── public/                  # Static assets
│   ├── vite.config.js           # Vite configuration
│   └── package.json             # Dependencies
│
├── docs/                        # Documentation
├── AGILE METHODOLOGIES/         # System design documents
├── CampusCart_System_Design.pdf # Architecture documentation
├── DATABASE_SETUP.md            # Database configuration guide
└── SYSTEM_DESIGN.md             # Technical specifications
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/register              # Create new account
POST   /api/login                 # Login user
GET    /api/logout                # Logout session
```

### Products
```
GET    /api/products              # List all products
POST   /api/products              # Create product (auth required)
GET    /api/products/:id          # Get product details
DELETE /api/products/:id          # Delete product (admin only)
POST   /api/products/:id/report   # Report product
```

### System
```
GET    /api/health                # Health check
POST   /api/seed-products         # Seed demo data
POST   /api/reset-passwords       # Reset demo passwords
```

## ⚙️ Configuration

### Environment Variables

**Backend** (`api/.env`):
- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Allowed CORS origins
- `MONGO_*` - MongoDB connection details

**Frontend** (`Frontend/.env`):
- `VITE_API_BASE_URL` - Backend API URL

## 🐛 Troubleshooting

### MongoDB Authentication Error
```
Error: bad auth : Authentication failed
```

**Solution**:
1. Verify MongoDB username and password in `api/.env`
2. Ensure the user exists in MongoDB Atlas
3. Check that user has `readWrite` role on the database

### Cannot Connect to MongoDB Atlas
```
Error: getaddrinfo ENOTFOUND cluster0.xxxx.mongodb.net
```

**Solution**:
1. Add your IP address to MongoDB Atlas Network Access:
   - Go to Security > Network Access
   - Add your IP or allow `0.0.0.0/0` for testing only
2. Verify cluster is running

### Frontend Cannot Reach Backend
```
Error: Failed to fetch from API
```

**Solution**:
1. Ensure backend is running on `http://localhost:3001`
2. Check `VITE_API_BASE_URL` in `Frontend/.env`
3. Open browser DevTools to check network errors
4. Verify CORS is enabled (`CORS_ORIGIN=*` in `api/.env`)

### Port Already in Use
```
Error: EADDRINUSE: address already in use :::3001
```

**Solution**:
```bash
# Linux/Mac: Find and kill process
lsof -ti:3001 | xargs kill -9

# Windows: Use Task Manager or:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

## 📚 Documentation

- **[System Design](./SYSTEM_DESIGN.md)** - Architecture and design decisions
- **[Database Setup](./DATABASE_SETUP.md)** - MongoDB configuration
- **[System Architecture PDF](./CampusCart_System_Design.pdf)** - Visual architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Subhash Sudarsi**
- GitHub: [@subhashsudarsi](https://github.com/subhashsudarsi)
- Email: contact@subhashsudarsi.dev

## 🙏 Acknowledgments

- MongoDB Atlas for reliable database hosting
- React and Vite communities for excellent tooling
- Tailwind CSS for utility-first styling

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/subhashsudarsi/campuscart/issues)
- Create a [Discussion](https://github.com/subhashsudarsi/campuscart/discussions)

---

**Happy selling! 🛒**
