import { Request, Response } from 'express';
import Finance from '../models/Finance';
import Travel from '../models/Travel';

// Get all finances
export const getAllFinances = async (req: Request, res: Response) => {
  try {
    const finances = await Finance.findAll({
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    return res.status(200).json(finances);
  } catch (error) {
    console.error('Error getting finances:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get finance by id
export const getFinanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const finance = await Finance.findByPk(id, {
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    
    return res.status(200).json(finance);
  } catch (error) {
    console.error('Error getting finance record:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get finances by travel id
export const getFinancesByTravelId = async (req: Request, res: Response) => {
  try {
    const { travelId } = req.params;
    const finances = await Finance.findAll({
      where: { travelId },
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    
    return res.status(200).json(finances);
  } catch (error) {
    console.error('Error getting finances by travel ID:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get financial summary (totals by type)
export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    // Get all finances
    const finances = await Finance.findAll();
    
    // Calculate totals
    const income = finances
      .filter(finance => finance.type === 'income')
      .reduce((sum, finance) => sum + Number(finance.amount), 0);
    
    const expenses = finances
      .filter(finance => finance.type === 'expense')
      .reduce((sum, finance) => sum + Number(finance.amount), 0);
    
    // Calculate balance
    const balance = income - expenses;
    
    return res.status(200).json({
      income,
      expenses,
      balance,
      count: finances.length
    });
  } catch (error) {
    console.error('Error getting financial summary:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Create new finance record
export const createFinance = async (req: Request, res: Response) => {
  try {
    // If travelId is provided, check if travel exists
    if (req.body.travelId) {
      const travel = await Travel.findByPk(req.body.travelId);
      if (!travel) {
        return res.status(404).json({ message: 'Travel not found' });
      }
    }
    
    const newFinance = await Finance.create(req.body);
    
    // Return the created finance with travel info if any
    const financeWithTravel = await Finance.findByPk(newFinance.id, {
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    
    return res.status(201).json(financeWithTravel);
  } catch (error) {
    console.error('Error creating finance record:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Update finance record
export const updateFinance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if finance record exists
    const finance = await Finance.findByPk(id);
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    
    // If changing travelId, check if travel exists
    if (req.body.travelId && req.body.travelId !== finance.travelId) {
      const travel = await Travel.findByPk(req.body.travelId);
      if (!travel) {
        return res.status(404).json({ message: 'Travel not found' });
      }
    }
    
    await Finance.update(req.body, {
      where: { id },
    });
    
    // Return the updated finance with travel info
    const updatedFinance = await Finance.findByPk(id, {
      include: [{ model: Travel, as: 'travel', attributes: ['id', 'name'] }],
    });
    
    return res.status(200).json(updatedFinance);
  } catch (error) {
    console.error('Error updating finance record:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Delete finance record
export const deleteFinance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if finance record exists
    const finance = await Finance.findByPk(id);
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    
    await Finance.destroy({
      where: { id },
    });
    
    return res.status(200).json({ message: 'Finance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting finance record:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 