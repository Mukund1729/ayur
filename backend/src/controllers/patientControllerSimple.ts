import { Request, Response } from 'express';

// Create a new patient - Simple version without MongoDB
export const createPatient = async (req: Request, res: Response) => {
  try {
    const patientData = req.body;
    
    // Create mock patient
    const mockPatient = {
      _id: `mock_${Date.now()}`,
      ...patientData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Mock patient created:', mockPatient);
    
    return res.status(201).json({
      success: true,
      message: 'Patient created successfully (mock data)',
      data: mockPatient
    });
    
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating patient'
    });
  }
};

// Get all patients - Simple version
export const getPatients = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: []
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving patients'
    });
  }
};

// Get patient by ID - Simple version
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    return res.status(200).json({
      success: true,
      message: 'Patient retrieved successfully',
      data: null // Mock response
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving patient'
    });
  }
};

// Update patient - Simple version
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    return res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: { _id: id, ...updateData }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating patient'
    });
  }
};

// Delete patient - Simple version
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    return res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting patient'
    });
  }
};

// Add test result - Simple version
export const addTestResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testResult = req.body;
    
    const mockTestResult = {
      _id: `test_${Date.now()}`,
      patientId: id,
      ...testResult,
      createdAt: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Test result added successfully',
      data: mockTestResult
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error adding test result'
    });
  }
};

// Get patient test results - Simple version
export const getPatientTestResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    return res.status(200).json({
      success: true,
      message: 'Test results retrieved successfully',
      data: [] // Mock empty array
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving test results'
    });
  }
};
