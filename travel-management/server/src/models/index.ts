import { sequelize } from '../config/database';
import User from './User';
import Travel from './Travel';
import Participant from './Participant';
import Finance from './Finance';
import Contact from './Contact';

// Define all model relationships here
// These will be imported in server.ts to ensure all models are initialized

// Travel and Participant relationship
Travel.hasMany(Participant, { foreignKey: 'travelId', as: 'participants' });
Participant.belongsTo(Travel, { foreignKey: 'travelId', as: 'travel' });

// Travel and Finance relationship
Travel.hasMany(Finance, { foreignKey: 'travelId', as: 'finances' });
Finance.belongsTo(Travel, { foreignKey: 'travelId', as: 'travel' });

// Export all models
export {
  sequelize,
  User,
  Travel,
  Participant,
  Finance,
  Contact
}; 