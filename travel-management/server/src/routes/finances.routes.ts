import { Router } from 'express';
import {
  getAllFinances,
  getFinanceById,
  getFinancesByTravelId,
  getFinancialSummary,
  createFinance,
  updateFinance,
  deleteFinance
} from '../controllers/finances.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get all finances
router.get('/', authMiddleware, getAllFinances);

// Get financial summary
router.get('/summary', authMiddleware, getFinancialSummary);

// Get finance by id
router.get('/:id', authMiddleware, getFinanceById);

// Get finances by travel id
router.get('/travel/:travelId', authMiddleware, getFinancesByTravelId);

// Create new finance
router.post('/', authMiddleware, createFinance);

// Update finance
router.put('/:id', authMiddleware, updateFinance);

// Delete finance
router.delete('/:id', authMiddleware, deleteFinance);

export default router; 