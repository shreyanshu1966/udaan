# Udaan Render Deployment Guide

This guide provides step-by-step instructions for deploying the Udaan application on Render.

## Prerequisites

- A Render account (https://render.com)
- A MongoDB database (e.g., MongoDB Atlas)
- Git repository with your code

## Deployment Process

### 1. Backend Deployment

1. Log in to your Render account
2. Create a new Web Service
3. Connect your Git repository
4. Configure the service:
   - **Name:** udaan-backend
   - **Root Directory:** Backend
   - **Environment:** Node
   - **Build Command:** npm install
   - **Start Command:** npm start
   - **Plan:** Free

5. Add the following environment variables:
   - `NODE_ENV`: production
   - `PORT`: 8888
   - `RENDER`: true
   - `JWT_SECRET`: [your secure secret key]
   - `MONGODB_URI`: [your MongoDB connection string]
   - `CORS_ORIGIN`: https://udaan-frontend.onrender.com

6. Click "Create Web Service"

### 2. Frontend Deployment

1. Create another Web Service on Render
2. Connect the same Git repository
3. Configure the service:
   - **Name:** udaan-frontend
   - **Root Directory:** / (project root, not Backend)
   - **Environment:** Node
   - **Build Command:** npm install && npm run build
   - **Start Command:** npx serve -s dist
   - **Plan:** Free

4. Add the following environment variables:
   - `VITE_API_BASE_URL`: https://udaan-backend.onrender.com
   - `VITE_APP_ENV`: production

5. Click "Create Web Service"

### 3. Verify Deployment

- Once both services are deployed, verify the backend is accessible at: https://udaan-backend.onrender.com
- Verify the frontend is accessible at: https://udaan-frontend.onrender.com
- Test the application functionality to ensure the frontend can communicate with the backend

> **Note:** Render's free tier services will spin down after periods of inactivity. The first request after inactivity may take a moment to process.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Render logs for error messages
2. Verify that all environment variables are correctly set
3. Ensure MongoDB connection string is valid and accessible
4. Check CORS configuration if frontend cannot communicate with backend

For more detailed deployment instructions, run the `render-deploy-guide.sh` script in the project root.