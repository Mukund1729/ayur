# 🚀 AyurTaila AI Deployment Guide

## 📋 Deployment Options

### Option 1: Full Stack on Vercel (Recommended)
- Frontend: React app on Vercel
- Backend: Serverless functions on Vercel
- Database: MongoDB Atlas
- Single domain deployment

### Option 2: Split Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 🎯 Option 1: Full Stack Vercel Deployment

### Step 1: Prepare Repository
```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Ready for Vercel deployment"

# Push to GitHub
git remote add origin https://github.com/yourusername/ayur-taila-ai.git
git push -u origin main
```

### Step 2: Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select your GitHub repository
5. Import the project

### Step 3: Environment Variables
In Vercel dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://your-connection-string
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-jwt-secret
```

### Step 4: Build Settings
Vercel will automatically detect the settings from `vercel.json`

### Step 5: Deploy
Click "Deploy" and wait for the build to complete.

---

## 🎯 Option 2: Split Deployment

### Frontend on Vercel
1. Deploy only the `frontend/` folder to Vercel
2. Update API base URL in frontend to point to Render backend

### Backend on Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `backend/`
4. Add environment variables
5. Deploy

---

## 🔧 Configuration Files Created

### Root `vercel.json`
- Handles both frontend and backend
- Routes API calls to serverless functions
- Routes everything else to React app

### Frontend `vercel.json`
- Handles React app build
- Rewrites API calls

### Backend `api/index.ts`
- Serverless function entry point
- Includes all routes and middleware

---

## 🌐 Post-Deployment

### 1. Update Frontend API URL
If using split deployment, update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com' 
  : 'http://localhost:5000';
```

### 2. Test the Application
- Upload an oil drop image
- Test AI analysis
- Verify all features work

### 3. Monitor Performance
- Check Vercel analytics
- Monitor API usage
- Check error logs

---

## 🚨 Important Notes

### Environment Variables
Never commit `.env` files to Git. Always use Vercel's environment variables.

### File Uploads
Vercel serverless functions have limitations for file uploads. Consider using:
- Vercel Blob storage
- AWS S3
- Cloudinary

### Database
Use MongoDB Atlas for cloud database. Update connection string in production.

### OpenAI API
Monitor your OpenAI usage and set up billing alerts.

---

## 🛠️ Troubleshooting

### Build Errors
- Check all dependencies are in package.json
- Verify TypeScript configuration
- Check environment variables

### API Errors
- Verify MongoDB connection
- Check OpenAI API key
- Review server logs

### Frontend Issues
- Check API base URL
- Verify build configuration
- Review browser console

---

## 📞 Support

For deployment issues:
1. Check Vercel docs
2. Review build logs
3. Test locally first
4. Check environment variables
