import { Router } from 'express';
import { 
  getAllTravels, 
  getTravelById, 
  createTravel, 
  updateTravel, 
  deleteTravel 
} from '../controllers/travels.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get all travels
router.get('/', authMiddleware, getAllTravels);

// Get travel by id
router.get('/:id', authMiddleware, getTravelById);

// Create new travel
router.post('/', authMiddleware, createTravel);

// Update travel
router.put('/:id', authMiddleware, updateTravel);

// Delete travel
router.delete('/:id', authMiddleware, deleteTravel);

export default router; 