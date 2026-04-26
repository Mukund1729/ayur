# AyurTaila AI - Healthcare Application

An AI-powered healthcare web application based on Ayurvedic diagnostic technique **Taila Bindu Pariksha** (oil drop analysis on urine samples).

## Features

1. **Patient Management System** - Collect and store patient details in MongoDB
2. **Consent Page** - Mandatory consent form before using the system
3. **Upload Module** - Secure file upload for oil drop test images/videos
4. **AI Analysis Module** - Process images to detect patterns and map to Dosha types
5. **Results Dashboard** - Display predictions, observations, and remarks

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI Service**: Python + OpenCV

## Project Structure

```
ayur/
  frontend/          # React frontend
  backend/           # Node.js API server
  ai-service/        # Python AI analysis service
  README.md          # This file
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB
- npm/yarn

### Installation

1. Clone and setup frontend:
```bash
cd frontend
npm install
npm start
```

2. Setup backend:
```bash
cd backend
npm install
npm run dev
```

3. Setup AI service:
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

## Architecture

The application follows a clean, scalable architecture with separate services for:
- Frontend UI (React)
- API Gateway (Node.js)
- AI Processing (Python)
- Data Storage (MongoDB)
