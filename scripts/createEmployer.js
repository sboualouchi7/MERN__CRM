const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Connecter au db
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      //verefeier
      const employerExists = await User.findOne({ role: 'employer' });
      
      if (employerExists) {
        console.log('Employer already exists');
      } else {
        // cree un employeur
        const employer = await User.create({
          name: 'Salman',
          email: 'sboualouchi6@gmail.com',
          password: '12345',
          role: 'employer'
        });
        
        console.log('Employer created:', employer);
      }
      
      // Déconnecter
      mongoose.disconnect();
    } catch (error) {
      console.error('Error:', error);
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });