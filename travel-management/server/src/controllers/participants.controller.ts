import { Request, Response } from 'express';
import Participant from '../models/Participant';
import Travel from '../models/Travel';

// Get all participants
export const getAllParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await Participant.findAll({
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    return res.status(200).json(participants);
  } catch (error) {
    console.error('Error getting participants:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get participant by id
export const getParticipantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const participant = await Participant.findByPk(id, {
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    return res.status(200).json(participant);
  } catch (error) {
    console.error('Error getting participant:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get participants by travel id
export const getParticipantsByTravelId = async (req: Request, res: Response) => {
  try {
    const { travelId } = req.params;
    const participants = await Participant.findAll({
      where: { travelId },
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    
    return res.status(200).json(participants);
  } catch (error) {
    console.error('Error getting participants by travel ID:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Create new participant
export const createParticipant = async (req: Request, res: Response) => {
  try {
    // Check if travel exists
    const travel = await Travel.findByPk(req.body.travelId);
    if (!travel) {
      return res.status(404).json({ message: 'Travel not found' });
    }
    
    const newParticipant = await Participant.create(req.body);
    
    // Return the created participant with travel info
    const participantWithTravel = await Participant.findByPk(newParticipant.id, {
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    
    return res.status(201).json(participantWithTravel);
  } catch (error) {
    console.error('Error creating participant:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Update participant
export const updateParticipant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if participant exists
    const participant = await Participant.findByPk(id);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    // If changing travelId, check if travel exists
    if (req.body.travelId && req.body.travelId !== participant.travelId) {
      const travel = await Travel.findByPk(req.body.travelId);
      if (!travel) {
        return res.status(404).json({ message: 'Travel not found' });
      }
    }
    
    await Participant.update(req.body, {
      where: { id },
    });
    
    // Return the updated participant with travel info
    const updatedParticipant = await Participant.findByPk(id, {
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    
    return res.status(200).json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Delete participant
export const deleteParticipant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if participant exists
    const participant = await Participant.findByPk(id);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    await Participant.destroy({
      where: { id },
    });
    
    return res.status(200).json({ message: 'Participant deleted successfully' });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 