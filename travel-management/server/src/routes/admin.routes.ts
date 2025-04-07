import { Router } from 'express';
import {
  exportData,
  exportEntityCSV,
  getSystemStats
} from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { seedDatabase } from '../utils/seedDatabase';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Export all data (admin only)
router.get('/export', exportData);

// Export specific entity as CSV (admin only)
router.get('/export/:entity/csv', exportEntityCSV);

// Get system statistics (admin only)
router.get('/stats', getSystemStats);

// Add after other routes, before the export
router.post('/seed-database', async (req, res) => {
  try {
    // Check for a secret key to protect this route
    const { secret } = req.body;
    
    if (secret !== process.env.SEED_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    await seedDatabase();
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ message: 'Error seeding database', error: (error as Error).message });
  }
});

export default router; 