# ShopAdmin - E-commerce Admin Dashboard

A full-stack admin dashboard for an e-commerce system built with React, Node.js, Express, and MongoDB. The interface is a dark "control room" layout with a sidebar, live KPI cards, an SVG revenue curve, a category donut, a staged conversion funnel and a status-coded order table.

## 🚀 Live Deployment

- **Frontend:** [admindashboard-cedcos-task.vercel.app](https://admindashboard-cedcos-task.vercel.app)
- **Backend API:** https://admindashboard-cedcos-task.onrender.com/api
- **Health Check:** https://admindashboard-cedcos-task.onrender.com/api/health

The API degrades gracefully: when MongoDB is unavailable it keeps serving the bundled dashboard snapshots and demo admin credentials, so the hosted demo never dead-ends.

## ✨ Features

- **Dashboard Metrics:** Total orders, revenue, new customers, average order value
- **Period Filtering:** View data by Today, This Week, or This Month
- **Revenue Trend:** SVG area chart with peak annotation and per-point details
- **Top Products:** Display top 3 best-selling products with revenue share
- **Category Revenue:** Donut breakdown of revenue by product category
- **Order Status:** Track orders by status (Delivered, In Transit, Processing, Cancelled)
- **Conversion Funnel:** Monitor visitor-to-purchase conversion rates
- **Recent Orders:** View latest order details
- **Authentication:** Secure admin login with JWT tokens

## 🛠 Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Project Structure

```
ecommerce-task-cedcoss/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # MongoDB connection
│   │   ├── models/
│   │   │   ├── Admin.js          # Admin user model
│   │   │   └── DashboardSnapshot.js  # Dashboard data model
│   │   ├── data/
│   │   │   └── defaultDashboardData.js  # Seed data
│   │   └── seed/
│   │       └── seedDatabase.js   # Database seeding
│   ├── server.js                 # Main server file
│   ├── package.json
│   ├── Procfile                  # Render deployment
│   └── .env.example              # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── App.css               # Component styles
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json               # Vercel deployment
│   └── .env.example              # Environment variables template
└── README.md
```

## 🚀 Local Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/shopadmin
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=12h
   ADMIN_EMAIL=admin@shopadmin.com
   ADMIN_PASSWORD=Admin@123
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🔐 Default Credentials

- **Email:** admin@shopadmin.com
- **Password:** Admin@123

## 🌐 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (optional — without it the API serves the demo snapshots)
   - `JWT_SECRET`: Generate a secure random string
   - `JWT_EXPIRES_IN`: `12h`
   - `ADMIN_EMAIL`: Your admin email
   - `ADMIN_PASSWORD`: Your admin password
6. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Create a new project on Vercel
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)
6. Deploy

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin user (requires authentication)

### Dashboard
- `GET /api/dashboard?period=today|week|month` - Get dashboard data (requires authentication)

### Health
- `GET /api/health` - Health check endpoint

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRES_IN` - JWT token expiration time
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 📝 License

This project is created for demonstration purposes.

## 👤 Author

Created as part of the ShopAdmin e-commerce dashboard project.
