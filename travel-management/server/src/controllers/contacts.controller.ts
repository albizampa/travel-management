import { Request, Response } from 'express';
import Contact from '../models/Contact';

// Get all contacts
export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.findAll();
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get contact by id
export const getContactById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    return res.status(200).json(contact);
  } catch (error) {
    console.error('Error getting contact:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Search contacts
export const searchContacts = async (req: Request, res: Response) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    
    const searchTerm = `%${term}%`;
    
    const contacts = await Contact.findAll({
      where: {
        [Symbol.for('sequelize.Op.or')]: [
          { firstName: { [Symbol.for('sequelize.Op.iLike')]: searchTerm } },
          { lastName: { [Symbol.for('sequelize.Op.iLike')]: searchTerm } },
          { email: { [Symbol.for('sequelize.Op.iLike')]: searchTerm } },
          { organization: { [Symbol.for('sequelize.Op.iLike')]: searchTerm } },
        ],
      },
    });
    
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error searching contacts:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Create new contact
export const createContact = async (req: Request, res: Response) => {
  try {
    const newContact = await Contact.create(req.body);
    return res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Update contact
export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if contact exists
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    await Contact.update(req.body, {
      where: { id },
    });
    
    const updatedContact = await Contact.findByPk(id);
    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Delete contact
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if contact exists
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    await Contact.destroy({
      where: { id },
    });
    
    return res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 