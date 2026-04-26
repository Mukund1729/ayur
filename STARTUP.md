# AyurTaila AI - Startup Guide

## Prerequisites

Make sure you have the following installed:
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (running on localhost:27017)
- Git

## Quick Start

### 1. Start MongoDB
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
Backend will run on: http://localhost:5000

### 3. Start AI Service
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```
AI Service will run on: http://localhost:8000

### 4. Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will run on: http://localhost:3000

## Application Flow

1. **Consent Page** - User must accept terms to proceed
2. **Patient Form** - Collect patient information and medical history
3. **File Upload** - Upload oil drop test image
4. **AI Analysis** - Python/OpenCV analyzes the pattern
5. **Results Dashboard** - Display Dosha prediction and recommendations

## API Endpoints

### Backend (Node.js - Port 5000)
- `GET /health` - Health check
- `POST /api/patients` - Create patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/upload` - Upload file
- `POST /api/patients/:id/test-results` - Add test result

### AI Service (Python - Port 8000)
- `GET /health` - Health check
- `POST /analyze` - Analyze image (base64)
- `POST /analyze-url` - Analyze image by URL

## File Structure

```
ayur/
âââ frontend/          # React + TypeScript + Tailwind
â   âââ src/
â   â   âââ components/   # React components
â   â   âââ pages/       # Page components
â   â   âââ services/    # API services
â   â   âââ types/       # TypeScript types
â   â   âââ utils/       # Utility functions
â   â   âââ App.tsx
â   â   âââ AppRouter.tsx
â
âââ backend/           # Node.js + Express + TypeScript
â   âââ src/
â   â   âââ controllers/ # API controllers
â   â   âââ models/      # MongoDB models
â   â   âââ routes/      # API routes
â   â   âââ middleware/  # Express middleware
â   â   âââ utils/       # Utility functions
â   â   âââ index.ts
â
âââ ai-service/        # Python + Flask + OpenCV
â   âââ app.py          # Flask application
â   âââ requirements.txt # Python dependencies
â
âââ README.md
âââ STARTUP.md
```

## Development Notes

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ayur-taila
JWT_SECRET=your-secret-key
```

**AI Service (.env)**
```
PORT=8000
DEBUG=false
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Database Schema

**Patient Collection**
```javascript
{
  name: String,
  age: Number,
  gender: String,
  email: String,
  phone: String,
  address: String,
  medicalHistory: {
    conditions: [String],
    medications: [String],
    allergies: [String]
  },
  lifestyle: {
    diet: String,
    exercise: String,
    sleep: String,
    stress: String
  },
  symptoms: [String],
  consentGiven: Boolean,
  consentDate: Date,
  testResults: [{
    testId: String,
    date: Date,
    doshaPrediction: String,
    confidence: Number,
    observations: [String],
    remarks: String,
    imageUrl: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **Port Already in Use**
   - Change PORT in .env files
   - Kill processes using the ports

3. **CORS Errors**
   - Ensure frontend URL is in CORS whitelist
   - Check backend CORS configuration

4. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits

5. **AI Service Errors**
   - Ensure Python dependencies are installed
   - Check OpenCV installation

### Logs

- Backend logs: Console output from `npm run dev`
- AI Service logs: Console output from `python app.py`
- Frontend logs: Browser developer console

## Production Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Compile Backend**
   ```bash
   cd backend
   npm run build
   ```

3. **Set Environment Variables**
   - Update all .env files with production values
   - Use production MongoDB URI
   - Set secure JWT secrets

4. **Run with Process Manager**
   ```bash
   # Backend
   npm start
   
   # AI Service
   gunicorn app:app
   ```

## Security Considerations

- Change default JWT secrets
- Use HTTPS in production
- Implement rate limiting
- Validate all file uploads
- Sanitize user inputs
- Use environment variables for sensitive data
