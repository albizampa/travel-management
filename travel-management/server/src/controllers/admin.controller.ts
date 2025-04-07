import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { exportAllData, generateCSV } from '../utils/dataExport';
import Travel from '../models/Travel';
import Participant from '../models/Participant';
import Finance from '../models/Finance';
import Contact from '../models/Contact';
import User from '../models/User';

// Export all data to JSON files
export const exportData = async (req: Request, res: Response) => {
  try {
    // Only allow admin users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Create temp directory for exports
    const exportDir = path.join(os.tmpdir(), 'travel-management-exports');
    
    // Export data
    const exportPath = await exportAllData(exportDir);
    
    // Create a zip file of the exports
    // In a real app, you would zip the files and send the zip
    // For this example, we'll just send the path
    
    return res.status(200).json({
      message: 'Data exported successfully',
      exportPath,
      files: fs.readdirSync(exportPath).map(file => path.join(exportPath, file))
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Export specific data as CSV
export const exportEntityCSV = async (req: Request, res: Response) => {
  try {
    // Only allow admin users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { entity } = req.params;
    
    // Create temp directory for exports
    const exportDir = path.join(os.tmpdir(), 'travel-management-exports');
    
    let data;
    let filename;
    
    // Get data based on entity
    switch (entity) {
      case 'travels':
        data = await Travel.findAll();
        filename = 'travels.csv';
        break;
      case 'participants':
        data = await Participant.findAll();
        filename = 'participants.csv';
        break;
      case 'finances':
        data = await Finance.findAll();
        filename = 'finances.csv';
        break;
      case 'contacts':
        data = await Contact.findAll();
        filename = 'contacts.csv';
        break;
      default:
        return res.status(400).json({ message: 'Invalid entity type' });
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No data found for export' });
    }
    
    // Generate CSV file
    const filePath = generateCSV(data, filename, exportDir);
    
    // In a real app, you would set headers and stream the file
    // For this example, we'll just send the path
    
    return res.status(200).json({
      message: 'CSV exported successfully',
      filePath
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get system statistics
export const getSystemStats = async (req: Request, res: Response) => {
  try {
    // Only allow admin users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    // Count entities
    const travelsCount = await Travel.count();
    const participantsCount = await Participant.count();
    const financesCount = await Finance.count();
    const contactsCount = await Contact.count();
    const usersCount = await User.count();
    
    // Calculate financial stats
    const finances = await Finance.findAll();
    const totalIncome = finances
      .filter(finance => finance.type === 'income')
      .reduce((sum, finance) => sum + Number(finance.amount), 0);
      
    const totalExpenses = finances
      .filter(finance => finance.type === 'expense')
      .reduce((sum, finance) => sum + Number(finance.amount), 0);
    
    return res.status(200).json({
      counts: {
        travels: travelsCount,
        participants: participantsCount,
        finances: financesCount,
        contacts: contactsCount,
        users: usersCount
      },
      finances: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses
      },
      system: {
        platform: os.platform(),
        uptime: os.uptime(),
        memory: {
          total: os.totalmem(),
          free: os.freemem()
        }
      }
    });
  } catch (error) {
    console.error('Error getting system stats:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 