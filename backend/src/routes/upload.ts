import express from 'express';
import { 
  uploadSingle, 
  uploadMultiple, 
  uploadFile, 
  uploadMultipleFiles, 
  deleteFile, 
  getFileInfo 
} from '../controllers/uploadController';

const router = express.Router();

// Single file upload
router.post('/', uploadSingle, uploadFile);

// Multiple files upload
router.post('/multiple', uploadMultiple, uploadMultipleFiles);

// Get file info
router.get('/:filename', getFileInfo);

// Delete file
router.delete('/:filename', deleteFile);

export default router;
