import bcrypt from 'bcryptjs';
import { sequelize } from '../models/index';
import User from '../models/User';
import Travel from '../models/Travel';
import Participant from '../models/Participant';
import Finance from '../models/Finance';
import Contact from '../models/Contact';

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin'
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'password',
    role: 'user'
  }
];

const sampleTravels = [
  {
    name: 'Summer Retreat in Sardinia',
    description: 'A relaxing beach retreat on the beautiful island of Sardinia.',
    startDate: '2023-07-15',
    endDate: '2023-07-22',
    location: 'Sardinia, Italy',
    travelAgency: 'SunTours',
    commission: 1500,
    totalFee: 25000,
    status: 'completed'
  },
  {
    name: 'Winter Adventure in Alps',
    description: 'Ski and snowboarding adventure in the Swiss Alps.',
    startDate: '2023-12-10',
    endDate: '2023-12-17',
    location: 'Swiss Alps',
    travelAgency: 'SnowTreks',
    commission: 2000,
    totalFee: 32000,
    status: 'planned'
  },
  {
    name: 'Spring Break in Barcelona',
    description: 'Cultural experience in the vibrant city of Barcelona.',
    startDate: '2024-03-20',
    endDate: '2024-03-27',
    location: 'Barcelona, Spain',
    travelAgency: 'CityEscapes',
    commission: 1200,
    totalFee: 18000,
    status: 'planned'
  }
];

const sampleContacts = [
  {
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria@suntours.com',
    phone: '+34 123 456 789',
    organization: 'SunTours',
    role: 'Travel Agent',
    notes: 'Main contact for summer destinations.'
  },
  {
    firstName: 'Hans',
    lastName: 'Muller',
    email: 'hans@snowtreks.com',
    phone: '+41 987 654 321',
    organization: 'SnowTreks',
    role: 'Sales Manager',
    notes: 'Handles all winter travel arrangements.'
  },
  {
    firstName: 'Carlos',
    lastName: 'Garcia',
    email: 'carlos@cityescapes.com',
    phone: '+34 555 123 456',
    organization: 'CityEscapes',
    role: 'Tour Guide',
    notes: 'Expert on Barcelona tours.'
  }
];

// Seed the database
export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to database and sync models
    await sequelize.authenticate();
    console.log('Database connected.');
    
    await sequelize.sync({ force: true });
    console.log('Database synchronized. All existing data has been wiped.');
    
    // Seed users
    console.log('Creating users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    
    const createdUsers = await User.bulkCreate(hashedUsers);
    console.log(`Created ${createdUsers.length} users.`);
    
    // Seed travels
    console.log('Creating travels...');
    const createdTravels = await Travel.bulkCreate(sampleTravels);
    console.log(`Created ${createdTravels.length} travels.`);
    
    // Create sample participants for each travel
    console.log('Creating participants...');
    const sampleParticipants = [];
    
    for (const travel of createdTravels) {
      // Create 5-10 participants per travel
      const participantCount = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < participantCount; i++) {
        sampleParticipants.push({
          firstName: `FirstName${i}`,
          lastName: `LastName${i}`,
          email: `participant${i}@example.com`,
          phone: `+1 555-${100 + i}`,
          travelId: travel.id,
          amountPaid: Math.round(Math.random() * 1000) + 500,
          status: i % 5 === 0 ? 'cancelled' : i % 3 === 0 ? 'registered' : 'confirmed',
          notes: `Notes for participant ${i}`
        });
      }
    }
    
    const createdParticipants = await Participant.bulkCreate(sampleParticipants);
    console.log(`Created ${createdParticipants.length} participants.`);
    
    // Create sample finances
    console.log('Creating finances...');
    const sampleFinances = [];
    
    for (const travel of createdTravels) {
      // Add income entry for the travel
      sampleFinances.push({
        type: 'income',
        category: 'Commission',
        amount: travel.commission,
        date: new Date(travel.startDate),
        description: `Commission for ${travel.name}`,
        travelId: travel.id
      });
      
      // Add some random expenses
      const expenseCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < expenseCount; i++) {
        sampleFinances.push({
          type: 'expense',
          category: ['Marketing', 'Operations', 'Staff', 'Other'][Math.floor(Math.random() * 4)],
          amount: Math.round(Math.random() * 300) + 100,
          date: new Date(travel.startDate),
          description: `Expense ${i + 1} for ${travel.name}`,
          travelId: travel.id
        });
      }
      
      // Add some general finances not tied to travels
      sampleFinances.push({
        type: 'expense',
        category: 'Office',
        amount: 500,
        date: new Date(),
        description: 'Monthly office rent',
      });
      
      sampleFinances.push({
        type: 'expense',
        category: 'Utilities',
        amount: 150,
        date: new Date(),
        description: 'Monthly utilities',
      });
    }
    
    const createdFinances = await Finance.bulkCreate(sampleFinances);
    console.log(`Created ${createdFinances.length} finance records.`);
    
    // Seed contacts
    console.log('Creating contacts...');
    const createdContacts = await Contact.bulkCreate(sampleContacts);
    console.log(`Created ${createdContacts.length} contacts.`);
    
    console.log('Database seeding completed successfully!');
    
    return {
      users: createdUsers,
      travels: createdTravels,
      participants: createdParticipants,
      finances: createdFinances,
      contacts: createdContacts
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Run this script directly if needed
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed script executed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error running seed script:', error);
      process.exit(1);
    });
} 