import { Router } from 'express';
import axios from 'axios';
import { analyzeWithOpenAI } from '../services/openaiService';
import fs from 'fs';
import path from 'path';

const router = Router();

// AI Service Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Health check for AI service
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'AI service unavailable',
      error: error.message
    });
  }
});

// Analyze image via Gemini AI
router.post('/analyze', async (req, res) => {
  try {
    console.log('🔥 AI Analysis Request:', req.body);
    
    const { imageUrl } = req.body;

    if (!imageUrl) {
      console.log('❌ No imageUrl provided');
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }

    console.log('📁 Image URL:', imageUrl);

    // Extract filename from URL and read the uploaded file
    const filename = imageUrl.replace('/uploads/', '').replace(/^.*[\\/]/, '');
    const uploadPath = path.join(process.cwd(), 'uploads', filename);

    console.log('📂 Looking for file:', uploadPath);

    if (!fs.existsSync(uploadPath)) {
      console.log('❌ File not found:', uploadPath);
      return res.status(400).json({
        success: false,
        error: 'Image file not found'
      });
    }

    console.log('✅ File found, reading...');

    // Read image and convert to base64
    const imageBuffer = fs.readFileSync(uploadPath);
    const imageBase64 = imageBuffer.toString('base64');

    console.log('📊 Image size:', imageBuffer.length, 'bytes');

    // Use ONLY OpenAI GPT-4 Vision
    console.log('🤖 Using OpenAI GPT-4 Vision analysis...');
    
    const result = await analyzeWithOpenAI(imageBase64);
    const analysisMethod = 'openai_vision';
    
    console.log('✅ OpenAI analysis successful!');

    res.json({
      success: true,
      data: {
        doshaPrediction: result.doshaPrediction,
        confidence: result.confidence,
        observations: result.observations,
        insights: result.insights,
        recommendations: result.recommendations,
        questionnaire: result.questionnaire,
      },
      analysis_method: analysisMethod,
      traditional_result: {
        doshaPrediction: result.doshaPrediction,
        confidence: result.confidence,
        observations: result.observations
      }
    });
  } catch (error: any) {
    console.error('💥 OpenAI GPT-4 Vision Analysis Error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return OpenAI error - no fallback
    res.status(500).json({
      success: false,
      error: 'OpenAI GPT-4 Vision analysis failed',
      details: error.message,
      errorType: error.name
    });
  }
});

// Get AI service configuration
router.get('/config', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/config`);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch AI configuration',
      error: error.message
    });
  }
});

export default router;
