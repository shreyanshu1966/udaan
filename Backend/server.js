const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Doris = require('./models/Doris');
const Dlr = require('./models/Dlr');
const Cersai = require('./models/Cersai');
const Mca21 = require('./models/Mca21');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/udaan';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Combined Property Data Route
app.get('/api/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Fetch data from all collections
    const [dorisData, dlrData, cersaiData, mca21Data] = await Promise.all([
      Doris.findOne({ propertyId }),
      Dlr.findOne({ propertyId }),
      Cersai.findOne({ propertyId }),
      Mca21.findOne({ propertyId })
    ]);

    // Combine the data
    const combinedData = {
      propertyId,
      doris: dorisData || null,
      dlr: dlrData || null,
      cersai: cersaiData || null,
      mca21: mca21Data || null
    };

    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DORIS Routes
app.get('/api/doris', async (req, res) => {
  try {
    const dorisData = await Doris.find();
    res.json(dorisData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DLR Routes
app.get('/api/dlr', async (req, res) => {
  try {
    const dlrData = await Dlr.find();
    res.json(dlrData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CERSAI Routes
app.get('/api/cersai', async (req, res) => {
  try {
    const cersaiData = await Cersai.find();
    res.json(cersaiData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MCA21 Routes
app.get('/api/mca21', async (req, res) => {
  try {
    const mca21Data = await Mca21.find();
    res.json(mca21Data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Udaan API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
