# Student Hub - Deployment Guide

This guide will help you deploy your Student Hub website to live hosting platforms.

## 🚀 Quick Deployment Steps

### 1. Backend Deployment (Choose One)

#### Option A: Render (Recommended - Free)
1. Go to [Render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Create a new **Web Service**
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment Variables:**
     ```
     MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/studenthub
     JWT_SECRET=your-super-secret-jwt-key
     PORT=10000
     ```

#### Option B: Railway
1. Go to [Railway.app](https://railway.app) and sign up
2. Connect your GitHub repository
3. Add environment variables in the dashboard
4. Deploy automatically

### 2. Frontend Deployment (Netlify)

1. Go to [Netlify.com](https://netlify.com) and sign up
2. Connect your GitHub repository
3. Configure build settings:
   - **Build command:** `cd frontend && npm install && npm run build`
   - **Publish directory:** `frontend/build`
4. Add environment variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** Your backend URL (e.g., `https://your-backend.onrender.com/api`)

## 📋 Prerequisites

### 1. MongoDB Database
- Create account on [MongoDB Atlas](https://mongodb.com/atlas)
- Create a new cluster
- Get your connection string
- Add it to backend environment variables

### 2. GitHub Repository
- Push your code to GitHub
- Make sure both `frontend/` and `backend/` folders are included

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studenthub
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=10000
```

### Frontend (.env.local)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 📁 Project Structure
```
student-hub/
├── frontend/          # React.js frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── netlify.toml
├── backend/           # Node.js backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── DEPLOYMENT.md
```

## 🌐 Live URLs

After deployment, you'll have:
- **Frontend:** `https://your-app.netlify.app`
- **Backend:** `https://your-backend.onrender.com`

## 🔍 Testing Your Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.onrender.com`
   - Should show: `{"message":"Student Hub Backend is running!"}`

2. **Test Frontend:**
   - Visit: `https://your-app.netlify.app`
   - Should load the Student Hub homepage

3. **Test Full Functionality:**
   - Sign up for a new account
   - Create materials and threads
   - Test search functionality

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Make sure backend CORS is configured for your frontend domain

2. **API Connection Issues:**
   - Verify `REACT_APP_API_URL` is correct in Netlify
   - Check backend is running and accessible

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Database Connection:**
   - Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Verify connection string format

## 📞 Support

If you encounter issues:
1. Check the deployment logs in your hosting platform
2. Verify environment variables are set correctly
3. Test locally first to ensure code works

## 🎉 Success!

Once deployed, your Student Hub will be live and accessible to students worldwide! 🎓✨ 