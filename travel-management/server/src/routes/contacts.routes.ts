import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  searchContacts,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contacts.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get all contacts
router.get('/', authMiddleware, getAllContacts);

// Search contacts
router.get('/search', authMiddleware, searchContacts);

// Get contact by id
router.get('/:id', authMiddleware, getContactById);

// Create new contact
router.post('/', authMiddleware, createContact);

// Update contact
router.put('/:id', authMiddleware, updateContact);

// Delete contact
router.delete('/:id', authMiddleware, deleteContact);

export default router; 