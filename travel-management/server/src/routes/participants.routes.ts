import { Router } from 'express';
import {
  getAllParticipants,
  getParticipantById,
  getParticipantsByTravelId,
  createParticipant,
  updateParticipant,
  deleteParticipant
} from '../controllers/participants.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get all participants
router.get('/', authMiddleware, getAllParticipants);

// Get participant by id
router.get('/:id', authMiddleware, getParticipantById);

// Get participants by travel id
router.get('/travel/:travelId', authMiddleware, getParticipantsByTravelId);

// Create new participant
router.post('/', authMiddleware, createParticipant);

// Update participant
router.put('/:id', authMiddleware, updateParticipant);

// Delete participant
router.delete('/:id', authMiddleware, deleteParticipant);

export default router; 