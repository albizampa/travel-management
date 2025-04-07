import { seedDatabase } from './utils/seedDatabase';

console.log('Starting the database seeding process...');

seedDatabase()
  .then(() => {
    console.log('Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  }); 