import OpenAI from 'openai';

export interface OpenAIResult {
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
      prognosis: string;
      confidenceScore: number;
    };
  };
}

function createDefaultQuestionnaire(dosha: string, confidence: number) {
  const timestamp = new Date();
  const isHealthy = confidence >= 80;
  
  return {
    section1_basicDetails: {
      sampleId: `AUTO-${timestamp.getTime().toString().slice(-8)}`,
      groupType: isHealthy ? 'Healthy (Group B)' : 'Diseased (Group A)',
      timeOfCapture: timestamp.getHours() < 12 ? 'Morning' : timestamp.getHours() < 17 ? 'Afternoon' : 'Evening',
      lightingCondition: 'Natural Light'
    },
    section2_shapeAnalysis: {
      primaryShape: dosha === 'vata' ? 'Irregular' : dosha === 'pitta' ? 'Oval' : 'Circular',
      boundaryDefined: dosha === 'vata' ? 'Blurred' : dosha === 'pitta' ? 'Slightly Diffused' : 'Sharp',
      elongation: dosha === 'vata' ? 'High' : dosha === 'pitta' ? 'Mild' : 'No'
    },
    section3_movement: {
      movementLevel: dosha === 'vata' ? 'Rapid movement' : dosha === 'pitta' ? 'Moderate movement' : 'No movement',
      direction: dosha === 'vata' ? 'Multiple directions' : dosha === 'pitta' ? 'Circular' : 'No movement'
    },
    section4_splitting: {
      splittingObserved: dosha === 'vata' ? 'Yes' : 'No',
      dropletCount: dosha === 'vata' ? 'Multiple' : 'Single',
      splittingTime: dosha === 'vata' ? '1.8s' : 'N/A'
    },
    section5_spread: {
      spreadType: dosha === 'vata' ? 'Irregular spread' : dosha === 'pitta' ? 'Uniform spread' : 'No spread',
      surfaceBehavior: dosha === 'vata' ? 'Dispersing' : dosha === 'pitta' ? 'Vibrating' : 'Stable',
      ringFormation: dosha === 'pitta' ? 'Yes' : 'No'
    },
    section6_ayurvedicPattern: {
      doshaDominance: dosha.charAt(0).toUpperCase() + dosha.slice(1),
      patternNature: isHealthy ? 'Normal' : 'Mild imbalance'
    },
    section7_observationNotes: {
      uniquePattern: dosha === 'vata' ? 'Irregular, fragmented oil drop pattern' : dosha === 'pitta' ? 'Oval-shaped droplet with uniform spreading' : 'Dense, circular droplet with sharp boundaries',
      externalFactors: 'Light reflection and surface tension affecting observation'
    },
    section8_aiClassification: {
      prognosis: isHealthy ? 'Sadhya (Curable)' : 'Asadhya (Incurable)',
      confidenceScore: confidence
    }
  };
}

export async function analyzeWithOpenAI(imageBase64: string): Promise<OpenAIResult> {
  console.log('🤖 Using OpenAI GPT-4 Vision analysis...');
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `You are an expert Ayurvedic practitioner performing Taila Bindu Pariksha (oil drop urine analysis). Analyze the uploaded image of an oil drop on a urine sample carefully and select the EXACT options from the questionnaire below based on what you ACTUALLY see in the image.

CRITICAL: Look at the image carefully and choose ONLY ONE option from each radio button group. Be specific and accurate!

📋 Section 1: Basic Details
Sample ID: AUTO-GENERATE
Group Type: Based on confidence - Choose EXACTLY "Healthy (Group B)" if confidence >=80 else "Diseased (Group A)"
Disease Type: If Diseased (Group A) - Choose EXACTLY "Prameha Roga" or "Hridya Roga" or "Mutragatha" or "Others"
Time of Capture: Based on image lighting - Choose EXACTLY "Morning" or "Afternoon" or "Evening"
Lighting Condition: Based on image - Choose EXACTLY "Natural Light" or "Artificial Light" or "Low Light"

🔍 Section 2: Oil Drop Shape Analysis
Primary Shape: Look at the oil droplet shape - Choose EXACTLY "Circular" or "Oval" or "Irregular" or "Fragmented"
Boundary Defined: Look at edge clarity - Choose EXACTLY "Sharp" or "Slightly Diffused" or "Blurred"
Elongation: Look for stretching - Choose EXACTLY "No" or "Mild" or "Moderate" or "High"

🔄 Section 3: Movement & Direction
Movement Level: Look at spread pattern - Choose EXACTLY "No movement" or "Minimal movement" or "Moderate movement" or "Rapid movement"
Direction: Look at movement direction - Choose EXACTLY "North" or "South" or "East" or "West" or "Multiple directions"

💧 Section 4: Splitting & Droplet Count
Splitting Observed: Look for splitting - Choose EXACTLY "Yes" or "No"
Droplet Count: Count the droplets - Choose EXACTLY "Single" or "Two" or "Multiple"
Splitting Time: If splitting observed, estimate in seconds, else "N/A"

🌊 Section 5: Spread & Surface Interaction
Spread Type: Look at spread pattern - Choose EXACTLY "No spread" or "Uniform spread" or "Irregular spread"
Surface Behavior: Look at surface - Choose EXACTLY "Stable" or "Vibrating" or "Dispersing"
Ring Formation: Look for rings - Choose EXACTLY "Yes" or "No"

🌿 Section 6: Ayurvedic Pattern Interpretation
Dosha Dominance: Based on pattern analysis - Choose EXACTLY "Vata" or "Pitta" or "Kapha" or "Mixed"
Pattern Nature: Based on confidence - Choose EXACTLY "Normal" or "Mild imbalance" or "Moderate imbalance" or "Severe disturbance"

⚠️ Section 7: Observation Notes
Unique Pattern: Describe what unique patterns you see - spiral, snake-like, fragmentation, etc. BE SPECIFIC
Pattern isolation: Describe swirl, spread, or ring formation detection
Color density mapping: Describe color distribution for dosha identification clues
External Factors: Based on image - Choose EXACTLY "Light reflection" or "Surface texture" or "Camera quality" or "None"

📊 Section 8: AI Classification Output
Prognosis: Based on pattern - Choose EXACTLY "Sadhya (Curable)" or "Asadhya (Incurable)"
Confidence Score: Based on analysis certainty - 0-100

Respond ONLY in this exact JSON format with NO markdown:

{
  "doshaPrediction": "vata|pitta|kapha",
  "confidence": 0-100,
  "observations": ["Describe what you actually see in the image"],
  "insights": ["Ayurvedic significance based on the pattern"],
  "recommendations": ["Lifestyle/diet advice for the predicted dosha"],
  "questionnaire": {
    "section1_basicDetails": {
      "sampleId": "AUTO-GENERATED",
      "groupType": "Healthy (Group B) or Diseased (Group A)",
      "diseaseType": "If Diseased - Prameha Roga or Hridya Roga or Mutragatha or Others",
      "timeOfCapture": "Morning or Afternoon or Evening",
      "lightingCondition": "Natural Light or Artificial Light or Low Light"
    },
    "section2_shapeAnalysis": {
      "primaryShape": "Circular or Oval or Irregular or Fragmented",
      "boundaryDefined": "Sharp or Slightly Diffused or Blurred",
      "elongation": "No or Mild or Moderate or High"
    },
    "section3_movement": {
      "movementLevel": "No movement or Minimal movement or Moderate movement or Rapid movement",
      "direction": "North or South or East or West or Multiple directions"
    },
    "section4_splitting": {
      "splittingObserved": "Yes or No",
      "dropletCount": "Single or Two or Multiple",
      "splittingTime": "seconds or N/A"
    },
    "section5_spread": {
      "spreadType": "No spread or Uniform spread or Irregular spread",
      "surfaceBehavior": "Stable or Vibrating or Dispersing",
      "ringFormation": "Yes or No"
    },
    "section6_ayurvedicPattern": {
      "doshaDominance": "Vata or Pitta or Kapha or Mixed",
      "patternNature": "Normal or Mild imbalance or Moderate imbalance or Severe disturbance"
    },
    "section7_observationNotes": {
      "uniquePattern": "Describe specific patterns seen in this image",
      "patternIsolation": "Describe swirl, spread, or ring formation detection",
      "colorDensityMapping": "Describe color distribution for dosha identification clues",
      "externalFactors": "Light reflection or Surface texture or Camera quality or None"
    },
    "section8_aiClassification": {
      "prognosis": "Sadhya (Curable) or Asadhya (Incurable)",
      "confidenceScore": 0-100
    }
  }
}

CRITICAL: You MUST select EXACT options from the provided choices. Do not invent new options. Analyze the ACTUAL IMAGE and choose the most appropriate option from each group!`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    
    console.log('📥 Received response from OpenAI:', content.substring(0, 200) + '...');

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ OpenAI response content:', content);
      throw new Error('Invalid response format from OpenAI - No JSON found');
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ Attempted to parse:', jsonMatch[0]);
      throw new Error('Invalid JSON format in OpenAI response');
    }
    
    console.log('✅ Successfully parsed OpenAI response');
    console.log(`📊 Analysis result: ${parsed.doshaPrediction} dosha with ${parsed.confidence}% confidence`);

    // Validate required fields
    if (!parsed.doshaPrediction || !parsed.confidence) {
      console.error('❌ Missing required fields in response:', parsed);
      throw new Error('OpenAI response missing required fields');
    }

    // Ensure questionnaire exists
    if (!parsed.questionnaire) {
      console.warn('⚠️ OpenAI response missing questionnaire, creating default');
      parsed.questionnaire = createDefaultQuestionnaire(parsed.doshaPrediction, parsed.confidence);
    }

    console.log('📋 Questionnaire returned by AI:', parsed.questionnaire);
    return {
      doshaPrediction: parsed.doshaPrediction,
      confidence: parsed.confidence,
      observations: parsed.observations || ['Oil drop analysis completed'],
      insights: parsed.insights || ['Ayurvedic assessment provided'],
      recommendations: parsed.recommendations || ['Follow recommended lifestyle changes'],
      questionnaire: parsed.questionnaire,
    };
  } catch (error: any) {
    console.error('💥 OpenAI GPT-4 Vision Analysis Error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return error - no fallback
    throw error;
  }
}
