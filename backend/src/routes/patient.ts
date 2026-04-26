import express from 'express';
import { 
  createPatient, 
  getPatients, 
  getPatientById, 
  updatePatient, 
  deletePatient,
  addTestResult,
  getPatientTestResults
} from '../controllers/patientController';

const router = express.Router();

// Patient CRUD routes
router.post('/', createPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

// Test result routes
router.post('/:id/test-results', addTestResult);
router.get('/:id/test-results', getPatientTestResults);

export default router;
