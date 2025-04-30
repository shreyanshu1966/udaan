# Udaan Property Platform

A comprehensive property search and management application that unifies data from multiple Indian property databases.

## Deployment Instructions for Render

This application consists of both a frontend and backend component that need to be deployed separately on Render.

### Backend Deployment

1. Log in to [Render](https://render.com) and click "New Web Service"
2. Connect your GitHub repository
3. Use the following settings:
   - **Name**: udaan-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or select appropriate plan)
4. Add the following environment variables:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `JWT_SECRET`: (add a secure random string)
   - `MONGODB_URI`: (your MongoDB connection string)
   - `FRONTEND_URL`: https://udaan-app.onrender.com
   - `CORS_ORIGIN`: https://udaan-app.onrender.com

### Frontend Deployment

1. Log in to [Render](https://render.com) and click "New Static Site"
2. Connect your GitHub repository
3. Use the following settings:
   - **Name**: udaan-app
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist
   - **Environment Variables**:
     - `VITE_API_URL`: https://udaan-backend.onrender.com/api
4. Add the following redirect/rewrite rule:
   - Source: /*
   - Destination: /index.html
   - Action: Rewrite

## Local Development Setup

1. Clone the repository
2. Install dependencies in both frontend and backend:
   ```
   # In the root directory (frontend)
   npm install
   
   # In the Backend directory
   cd Backend
   npm install
   ```
3. Create `.env.development` in the root directory with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. Create `.env` in the Backend directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/propdb
   JWT_SECRET=your_development_secret
   ```
5. Start the backend:
   ```
   cd Backend
   node server.js
   ```
6. Start the frontend (from the root directory):
   ```
   npm run dev
   ```

## Project Structure

- `/src` - Frontend React application
- `/Backend` - Node.js/Express backend API
- `/public` - Public static assets