import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../src/utils/database';
import patientRoutes from '../src/routes/patient';
import uploadRoutes from '../src/routes/upload';
import aiRoutes from '../src/routes/ai';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
