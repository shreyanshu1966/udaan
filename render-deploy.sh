#!/bin/bash
# Helper script for deploying to Render

# Ensure we're in the project root
cd "$(dirname "$0")"

echo "===== 🚀 Preparing for Render Deployment ====="
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

# Ensure MongoDB URI is properly configured
echo "⚠️ IMPORTANT: Make sure to set up the following environment variables in Render dashboard:"
echo "  - MONGODB_URI - Your MongoDB connection string"
echo "  - JWT_SECRET - A secure secret for JWT token generation"
echo "  - CORS_ORIGIN - Your frontend URL (e.g., https://udaan-frontend.onrender.com)"
echo ""

echo "🔍 Backend checks complete!"
echo ""
echo "===== 📋 Next Steps ====="
echo "1. Create a new Web Service on Render (https://dashboard.render.com/)"
echo "2. Connect your Git repository"
echo "3. Select the Backend directory as the root directory"
echo "4. Set the Build Command to: npm install"
echo "5. Set the Start Command to: npm start"
echo "6. Add the environment variables mentioned above"
echo "7. Deploy your service"
echo ""
echo "===== 🚀 Deployment ready! ====="