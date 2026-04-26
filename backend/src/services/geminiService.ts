import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Gemini API key not configured');
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface DoshaAnalysisResult {
  doshaPrediction: 'vata' | 'pitta' | 'kapha';
  confidence: number;
  observations: string[];
  insights: string[];
  recommendations: string[];
  questionnaire: {
    section1_basicDetails: {
      sampleId: string;
      groupType: string;
      timeOfCapture: string;
      lightingCondition: string;
    };
    section2_shapeAnalysis: {
      primaryShape: string;
      boundaryDefined: string;
      elongation: string;
    };
    section3_movement: {
      movementLevel: string;
      direction: string;
    };
    section4_splitting: {
      splittingObserved: string;
      dropletCount: string;
      splittingTime: string;
    };
    section5_spread: {
      spreadType: string;
      surfaceBehavior: string;
      ringFormation: string;
    };
    section6_ayurvedicPattern: {
      doshaDominance: string;
      patternNature: string;
    };
    section7_observationNotes: {
      uniquePattern: string;
      externalFactors: string;
    };
    section8_aiClassification: {
      predictedClass: string;
      confidenceScore: number;
    };
  };
}

export async function analyzeOilDropImage(imageBase64: string): Promise<DoshaAnalysisResult> {
  console.log('🔍 Starting Gemini AI analysis...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Gemini API key not found in environment variables');
    throw new Error('Gemini API key not configured');
  }

  console.log('🔑 Using Gemini API key:', apiKey.substring(0, 15) + '...');

  try {
    console.log('🔧 Initializing Gemini with key:', apiKey.substring(0, 20) + '...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ GoogleGenerativeAI instance created');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini model obtained: gemini-1.5-flash');
    
    console.log('🧪 Testing Gemini API connection...');
    
    // Test the model with a simple text request first
    const testResult = await model.generateContent('Hello');
    const testResponse = testResult.response;
    const testText = testResponse.text();
    console.log('✅ Gemini API test successful:', testText);
    
    console.log('🚀 Starting real image analysis...');
    return await performAnalysis(model, imageBase64);
  } catch (error: any) {
    console.error('❌ Gemini API initialization failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

async function performAnalysis(model: any, imageBase64: string): Promise<DoshaAnalysisResult> {
  console.log('🔬 Starting image analysis with Gemini...');

  const prompt = `You are an expert Ayurvedic practitioner performing Taila Bindu Pariksha (oil drop urine analysis). Analyze the uploaded image of an oil drop on a urine sample carefully and provide a detailed diagnostic report.

IMPORTANT: You must analyze the ACTUAL IMAGE and describe what you see. Do not use generic answers. Base all observations strictly on the visual patterns in the image.

Classify the dominant Dosha based on the oil drop pattern:
- Vata: irregular, spiky, asymmetric, rapid spread, fragmented
- Pitta: circular, uniform, moderate spread, sharp edges, oval shape
- Kapha: dense, slow spread, rounded, smooth edges, stable

Respond ONLY in this exact JSON format with NO markdown formatting:

{
  "doshaPrediction": "vata|pitta|kapha",
  "confidence": 0-100,
  "observations": ["Describe what you actually see in the image"],
  "insights": ["Ayurvedic significance based on the pattern"],
  "recommendations": ["Lifestyle/diet advice for the predicted dosha"],
  "questionnaire": {
    "section1_basicDetails": {
      "sampleId": "AUTO-GENERATED",
      "groupType": "Based on confidence: Healthy (Group B) if confidence >=80 else Diseased (Group A)",
      "timeOfCapture": "Describe if morning/afternoon/evening based on image lighting",
      "lightingCondition": "Natural Light or Artificial Light or Low Light - based on image"
    },
    "section2_shapeAnalysis": {
      "primaryShape": "Circular|Oval|Irregular|Fragmented - based on actual image",
      "boundaryDefined": "Sharp|Slightly Diffused|Blurred - based on actual edge clarity",
      "elongation": "No|Mild|Moderate|High - based on actual image"
    },
    "section3_movement": {
      "movementLevel": "No movement|Minimal movement|Moderate movement|Rapid movement - based on spread pattern",
      "direction": "North|South|East|West|Multiple directions|No movement"
    },
    "section4_splitting": {
      "splittingObserved": "Yes|No - based on actual image",
      "dropletCount": "Single|Two|Multiple - based on actual image",
      "splittingTime": "N/A if no splitting, else estimate in seconds"
    },
    "section5_spread": {
      "spreadType": "No spread|Uniform spread|Irregular spread - based on actual image",
      "surfaceBehavior": "Stable|Vibrating|Dispersing - based on actual image",
      "ringFormation": "Yes|No - based on actual image"
    },
    "section6_ayurvedicPattern": {
      "doshaDominance": "Vata|Pitta|Kapha|Mixed - based on actual pattern",
      "patternNature": "Normal|Mild imbalance|Moderate imbalance|Severe disturbance"
    },
    "section7_observationNotes": {
      "uniquePattern": "Describe any unique patterns visible: spiral, snake-like, fragmentation, etc. BE SPECIFIC to this image",
      "externalFactors": "Light reflection|Surface texture|Camera quality|None"
    },
    "section8_aiClassification": {
      "predictedClass": "Normal|Abnormal",
      "confidenceScore": 0-100
    }
  }
}

CRITICAL: Every field in questionnaire must be answered based on what you see in the actual image. Do not provide generic answers. The user will verify these answers against the uploaded image.`;

  const imageData = imageBase64.includes('data:image')
    ? imageBase64.split(',')[1]
    : imageBase64;

  console.log('📤 Sending image to Gemini API...');
  
  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const content = result.response?.content;
    if (!content) {
      throw new Error('No content received from Gemini');
    }
    
    console.log('📥 Received response from Gemini:', content.substring(0, 200) + '...');

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log('✅ Successfully parsed Gemini response');
    console.log(`📊 Analysis result: ${parsed.doshaPrediction} dosha with ${parsed.confidence}% confidence`);

    if (!parsed.questionnaire) {
      throw new Error('Gemini response missing questionnaire data');
    }

    return {
      doshaPrediction: parsed.doshaPrediction,
      confidence: parsed.confidence,
      observations: parsed.observations,
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      questionnaire: parsed.questionnaire,
    };
  } catch (geminiError: any) {
    console.error('💥 Gemini API Error during analysis:', geminiError);
    throw new Error(`Gemini API Analysis Error: ${geminiError.message}`);
  }
}
