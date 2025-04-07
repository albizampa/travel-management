import { Router } from 'express';
import { login, getCurrentUser, register } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/user
// @desc    Get current user
// @access  Private
router.get('/user', authMiddleware, getCurrentUser);

// @route   POST /api/auth/register
// @desc    Register a new user (admin only)
// @access  Private/Admin
router.post('/register', authMiddleware, register);

export default router; 