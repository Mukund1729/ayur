import axios from 'axios';
import { Patient, PatientFormData, TestResult } from '../types/patient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patient API calls
export const patientService = {
  // Create a new patient
  createPatient: async (patientData: PatientFormData): Promise<Patient> => {
    const response = await api.post('/patients', patientData);
    return response.data.data;
  },

  // Get all patients
  getPatients: async (page = 1, limit = 10): Promise<{
    data: Patient[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await api.get(`/patients?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get patient by ID
  getPatientById: async (id: string): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data.data;
  },

  // Update patient
  updatePatient: async (id: string, patientData: Partial<PatientFormData>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data.data;
  },

  // Delete patient
  deletePatient: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  // Add test result
  addTestResult: async (patientId: string, testResult: Omit<TestResult, 'date'>): Promise<TestResult> => {
    const response = await api.post(`/patients/${patientId}/test-results`, testResult);
    return response.data.data;
  },

  // Get patient test results
  getPatientTestResults: async (patientId: string): Promise<TestResult[]> => {
    const response = await api.get(`/patients/${patientId}/test-results`);
    return response.data.data;
  },
};

// File upload API
export const uploadService = {
  uploadFile: async (file: File, type: 'image' | 'video'): Promise<{ url: string; success: boolean; message?: string }> => {
    try {
      console.log('Starting file upload:', file.name, 'Type:', type, 'Size:', file.size);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      console.log('FormData prepared, sending request...');

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      // Backend wraps payload in { success: true, data: { url: ... } }
      // Return the inner data object so callers can use result.url directly
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Upload error response:', error.response?.data);
      throw error;
    }
  },
};

// AI Analysis API
export const aiService = {
  analyzeImage: async (imageUrl: string, retryCount = 2): Promise<{
    success: boolean;
    data?: {
      doshaPrediction: 'vata' | 'pitta' | 'kapha';
      confidence: number;
      observations: string[];
      insights: string[];
      recommendations: string[];
      questionnaire?: {
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
    };
    analysis_method?: string;
    traditional_result?: {
      doshaPrediction: 'vata' | 'pitta' | 'kapha';
      confidence: number;
      observations: string[];
    };
    doshaPrediction?: 'vata' | 'pitta' | 'kapha';
    confidence?: number;
    observations?: string[];
    error?: string;
  }> => {
    try {
      console.log('Starting AI analysis for image URL:', imageUrl);
      const response = await api.post('/ai/analyze', { imageUrl });
      console.log('AI analysis response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('AI analysis error:', error);
      console.error('AI analysis error response:', error.response?.data);
      
      // Retry logic for network errors
      if (retryCount > 0 && (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR')) {
        console.log(`Retrying AI analysis... (${retryCount} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return aiService.analyzeImage(imageUrl, retryCount - 1);
      }
      
      throw error;
    }
  },
};

export default api;
