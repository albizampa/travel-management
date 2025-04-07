import fs from 'fs';
import path from 'path';
import { Travel } from '../models/Travel';
import { Participant } from '../models/Participant';
import { Finance } from '../models/Finance';
import { Contact } from '../models/Contact';

// Export all data to JSON files
export const exportAllData = async (exportDir: string): Promise<string> => {
  try {
    // Create export directory if it doesn't exist
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Get current date for filename
    const date = new Date().toISOString().split('T')[0];
    const exportPath = path.join(exportDir, `export-${date}`);
    
    // Create directory for this export
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    // Export travels
    const travels = await Travel.findAll();
    fs.writeFileSync(
      path.join(exportPath, 'travels.json'),
      JSON.stringify(travels, null, 2)
    );

    // Export participants
    const participants = await Participant.findAll();
    fs.writeFileSync(
      path.join(exportPath, 'participants.json'),
      JSON.stringify(participants, null, 2)
    );

    // Export finances
    const finances = await Finance.findAll();
    fs.writeFileSync(
      path.join(exportPath, 'finances.json'),
      JSON.stringify(finances, null, 2)
    );

    // Export contacts
    const contacts = await Contact.findAll();
    fs.writeFileSync(
      path.join(exportPath, 'contacts.json'),
      JSON.stringify(contacts, null, 2)
    );

    // Create a summary file
    const summary = {
      exportDate: new Date().toISOString(),
      counts: {
        travels: travels.length,
        participants: participants.length,
        finances: finances.length,
        contacts: contacts.length
      }
    };

    fs.writeFileSync(
      path.join(exportPath, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    return exportPath;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error(`Failed to export data: ${error.message}`);
  }
};

// Generate a CSV file from array of objects
export const generateCSV = <T>(data: T[], filename: string, exportDir: string): string => {
  try {
    // Create export directory if it doesn't exist
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    if (data.length === 0) {
      throw new Error('No data to export');
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      // Headers row
      headers.join(','),
      // Data rows
      ...data.map(item => 
        headers.map(header => {
          const value = item[header];
          
          // Handle different types of values
          if (value === null || value === undefined) {
            return '';
          }
          
          if (typeof value === 'string') {
            // Escape quotes and wrap in quotes
            return `"${value.replace(/"/g, '""')}"`;
          }
          
          if (value instanceof Date) {
            return value.toISOString();
          }
          
          return String(value);
        }).join(',')
      )
    ].join('\n');

    const filePath = path.join(exportDir, filename);
    fs.writeFileSync(filePath, csvContent);
    
    return filePath;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw new Error(`Failed to generate CSV: ${error.message}`);
  }
}; 