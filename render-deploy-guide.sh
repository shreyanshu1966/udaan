#!/bin/bash
# Comprehensive guide for deploying both frontend and backend to Render

echo "===== 🚀 UDAAN RENDER DEPLOYMENT GUIDE ====="
echo ""
echo "This script will guide you through deploying both the frontend and backend of your Udaan application to Render."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi

# Check if git repository exists
if [ ! -d .git ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
    echo "✅ Git repository initialized"
fi

echo ""
echo "===== 📋 DEPLOYMENT STEPS ====="
echo ""
echo "1. BACKEND DEPLOYMENT"
echo "----------------------"
echo "a) Create a new Web Service on Render (https://dashboard.render.com/)"
echo "b) Connect your Git repository"
echo "c) Configure your service:"
echo "   - Name: udaan-backend"
echo "   - Root Directory: Backend"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo ""
echo "d) Add the following environment variables:"
echo "   - NODE_ENV: production"
echo "   - PORT: 8888"
echo "   - RENDER: true"
echo "   - JWT_SECRET: <your_secure_secret_key>"
echo "   - MONGODB_URI: <your_mongodb_connection_string>"
echo "   - CORS_ORIGIN: https://udaan-frontend.onrender.com"
echo ""
echo "e) Click 'Create Web Service'"
echo ""
echo "2. FRONTEND DEPLOYMENT"
echo "----------------------"
echo "a) Create another Web Service on Render"
echo "b) Connect the same Git repository"
echo "c) Configure your service:"
echo "   - Name: udaan-frontend"
echo "   - Root Directory: / (project root, not Backend)"
echo "   - Environment: Node"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npx serve -s dist"
echo "   - Plan: Free"
echo ""
echo "d) Add the following environment variables:"
echo "   - VITE_API_BASE_URL: https://udaan-backend.onrender.com"
echo "   - VITE_APP_ENV: production"
echo ""
echo "e) Click 'Create Web Service'"
echo ""
echo "3. VERIFY DEPLOYMENT"
echo "-------------------"
echo "a) Once both services are deployed, verify the backend is accessible at https://udaan-backend.onrender.com"
echo "b) Verify the frontend is accessible at https://udaan-frontend.onrender.com"
echo "c) Test the application functionality to ensure the frontend can communicate with the backend"
echo ""
echo "Note: Render's free tier services will spin down after periods of inactivity. The first request after inactivity may take a moment to process."
echo ""
echo "===== 🎉 DEPLOYMENT COMPLETE! ====="