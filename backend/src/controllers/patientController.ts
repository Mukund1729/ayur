import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient, { IPatient } from '../models/Patient';

// Create a new patient
export const createPatient = async (req: Request, res: Response) => {
  try {
    const raw = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      const mockPatient = {
        _id: `mock_${Date.now()}`,
        ...raw,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log('MongoDB not connected, returning mock patient data');
      return res.status(201).json({
        success: true,
        message: 'Patient created successfully (mock data - MongoDB not connected)',
        data: mockPatient
      });
    }

    // Normalize flat frontend payload to nested schema
    const patientData: Partial<IPatient> = {
      name: raw.name?.trim(),
      age: typeof raw.age === 'number' ? raw.age : parseInt(raw.age, 10),
      gender: (raw.gender || '').toLowerCase() as 'male' | 'female' | 'other',
      email: raw.email?.trim().toLowerCase(),
      phone: raw.phone?.trim(),
      address: raw.address?.trim(),
      medicalHistory: {
        conditions: raw.medicalHistory ? [raw.medicalHistory] : [],
        medications: raw.medications ? [raw.medications] : [],
        allergies: raw.allergies ? [raw.allergies] : []
      },
      lifestyle: {
        diet: (raw.diet || 'non-vegetarian').toLowerCase() as 'vegetarian' | 'non-vegetarian' | 'vegan',
        exercise: mapExercise(raw.exerciseFrequency || raw.exercise || 'moderate') as 'intense' | 'moderate' | 'light' | 'none',
        sleep: raw.sleepPattern || raw.sleep || '',
        stress: mapStress(raw.stressLevel || raw.stress || 'medium') as 'low' | 'medium' | 'high'
      },
      symptoms: raw.currentSymptoms ? [raw.currentSymptoms] : raw.symptoms || [],
      consentGiven: raw.consentGiven === true || raw.consentGiven === 'true',
      consentDate: raw.consentGiven ? new Date() : undefined
    };

    // Check if patient with same email already exists
    if (patientData.email) {
      const existingPatient = await Patient.findOne({ email: patientData.email });
      if (existingPatient) {
        return res.status(400).json({
          success: false,
          message: 'Patient with this email already exists'
        });
      }
    }

    const patient = new Patient(patientData);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating patient'
    });
  }
};

function mapExercise(val: string): string {
  const v = (val || '').toLowerCase();
  if (v.includes('daily') || v.includes('intense')) return 'intense';
  if (v.includes('3-4') || v.includes('moderate')) return 'moderate';
  if (v.includes('1-2') || v.includes('light')) return 'light';
  if (v.includes('rarely') || v.includes('never') || v.includes('none')) return 'none';
  return 'moderate';
}

function mapStress(val: string): string {
  const v = (val || '').toLowerCase();
  if (v.includes('low')) return 'low';
  if (v.includes('moderate')) return 'medium';
  if (v.includes('severe') || v.includes('high')) return 'high';
  return 'medium';
}

// Get all patients
export const getPatients = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving patients'
    });
  }
};

// Get patient by ID
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient retrieved successfully',
      data: patient
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving patient'
    });
  }
};

// Update patient
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating patient'
    });
  }
};

// Delete patient
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting patient'
    });
  }
};

// Add test result to patient
export const addTestResult = async (req: Request, res: Response) => {
  try {
    const { testId, doshaPrediction, confidence, observations, remarks, imageUrl, videoUrl } = req.body;

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const testResult = {
      testId,
      date: new Date(),
      doshaPrediction,
      confidence,
      observations,
      remarks,
      imageUrl,
      videoUrl
    };

    patient.testResults = patient.testResults || [];
    patient.testResults.push(testResult);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Test result added successfully',
      data: testResult
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error adding test result'
    });
  }
};

// Get patient test results
export const getPatientTestResults = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Test results retrieved successfully',
      data: patient.testResults || []
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving test results'
    });
  }
};
