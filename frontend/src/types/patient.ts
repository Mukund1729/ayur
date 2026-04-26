export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: string;
  medicalHistory: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  lifestyle: {
    diet: 'vegetarian' | 'non-vegetarian' | 'vegan';
    exercise: 'none' | 'light' | 'moderate' | 'intense';
    sleep: string;
    stress: 'low' | 'medium' | 'high';
  };
  symptoms: string[];
  consentGiven: boolean;
  consentDate?: Date;
  testResults?: TestResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TestResult {
  testId: string;
  date: Date;
  doshaPrediction: 'vata' | 'pitta' | 'kapha';
  confidence: number;
  observations: string[];
  insights: string[];
  recommendations: string[];
  remarks: string;
  imageUrl?: string;
  videoUrl?: string;
  // Taila Bindu Pariksha Questionnaire Results
  questionnaire?: {
    section1_basicDetails: {
      sampleId: string;
      groupType: string;
      diseaseType?: string;
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
      patternIsolation?: string;
      colorDensityMapping?: string;
      externalFactors: string;
    };
    section8_aiClassification: {
      prognosis: string;
      confidenceScore: number;
    };
  };
}

export interface PatientFormData {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  email: string;
  phone: string;
  address: string;
  medicalHistory: string;
  currentSymptoms: string;
  lifestyle: string;
  diet: 'vegetarian' | 'vegan' | 'non-vegetarian' | 'mixed' | '';
  sleepPattern: string;
  stressLevel: 'low' | 'moderate' | 'high' | 'severe' | '';
  exerciseFrequency: 'daily' | '3-4-times' | '1-2-times' | 'rarely' | 'never' | '';
  consentGiven: boolean;
}
