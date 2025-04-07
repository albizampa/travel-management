import { Request, Response } from 'express';
import Travel from '../models/Travel';

// Get all travels
export const getAllTravels = async (req: Request, res: Response) => {
  try {
    const travels = await Travel.findAll();
    return res.status(200).json(travels);
  } catch (error) {
    console.error('Error getting travels:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get travel by id
export const getTravelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const travel = await Travel.findByPk(id);
    
    if (!travel) {
      return res.status(404).json({ message: 'Travel not found' });
    }
    
    return res.status(200).json(travel);
  } catch (error) {
    console.error('Error getting travel:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Create new travel
export const createTravel = async (req: Request, res: Response) => {
  try {
    const newTravel = await Travel.create(req.body);
    return res.status(201).json(newTravel);
  } catch (error) {
    console.error('Error creating travel:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Update travel
export const updateTravel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Travel.update(req.body, {
      where: { id },
    });
    
    if (updated === 0) {
      return res.status(404).json({ message: 'Travel not found' });
    }
    
    const updatedTravel = await Travel.findByPk(id);
    return res.status(200).json(updatedTravel);
  } catch (error) {
    console.error('Error updating travel:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Delete travel
export const deleteTravel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Travel.destroy({
      where: { id },
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: 'Travel not found' });
    }
    
    return res.status(200).json({ message: 'Travel deleted successfully' });
  } catch (error) {
    console.error('Error deleting travel:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 