const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Connecter à la base de données
connectDB();

// Initialiser Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employer', require('./routes/employerRoutes'));
app.use('/api/managers', require('./routes/managerRoutes'));

// Route de base
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in on port ${PORT}`);
});