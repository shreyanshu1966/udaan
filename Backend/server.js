const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Doris = require('./models/Doris');
const Dlr = require('./models/Dlr');
const Cersai = require('./models/Cersai');
const Mca21 = require('./models/Mca21');
const UnifiedProperty = require('./models/UnifiedProperty');
const { generatePropertyData } = require('./utils/dataGenerator');
const { integratePropertyData } = require('./utils/dataIntegrator');
const { mapSourceData } = require('./utils/dataMapper');

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

    // Apply standardized mapping to each data source
    const combinedData = {
      propertyId,
      doris: dorisData ? mapSourceData(dorisData, 'doris') : null,
      dlr: dlrData ? mapSourceData(dlrData, 'dlr') : null,
      cersai: cersaiData ? mapSourceData(cersaiData, 'cersai') : null,
      mca21: mca21Data ? mapSourceData(mca21Data, 'mca21') : null
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

// Update the Generate Property Data Route
app.post('/api/generate-property', async (req, res) => {
  try {
    const formData = req.body;
    
    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }
    
    console.log('Received form data for property generation:', formData);
    
    // Generate property data based on the form inputs
    const generatedData = generatePropertyData(formData);
    
    try {
      // Create new records in the database
      const dorisRecord = new Doris(generatedData.doris);
      const dlrRecord = new Dlr(generatedData.dlr);
      const cersaiRecord = new Cersai(generatedData.cersai);
      const mca21Record = new Mca21(generatedData.mca21);

      // Save all records to database (uncommented)
      await Promise.all([
        dorisRecord.save(),
        dlrRecord.save(),
        cersaiRecord.save(), 
        mca21Record.save()
      ]);
      
      // Generate and save unified data automatically
      const unifiedData = await integratePropertyData(generatedData.propertyId);
      console.log('Generated and saved unified property data with ID:', generatedData.propertyId);
      
      // Return complete data including the unified version
      res.json({
        ...generatedData,
        unified: unifiedData
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message || 'Error saving property data' });
    }
  } catch (error) {
    console.error('Error generating property data:', error);
    res.status(500).json({ error: error.message || 'Error generating property data' });
  }
});

// Integrate and get unified property data
app.get('/api/unified-property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    console.log(`Fetching unified data for propertyId: ${propertyId}`);
    
    // First try to get existing unified data
    let unifiedData = await UnifiedProperty.findOne({ propertyId });
    
    // If not found, generate it
    if (!unifiedData) {
      console.log(`No existing unified data found for ${propertyId}, generating new...`);
      unifiedData = await integratePropertyData(propertyId);
    } else {
      console.log(`Found existing unified data for ${propertyId}`);
    }
    
    res.json(unifiedData);
  } catch (error) {
    console.error('Error retrieving unified property data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all unified property data
app.get('/api/unified-properties', async (req, res) => {
  try {
    const unifiedData = await UnifiedProperty.find()
      .limit(100)  // Limit to 100 records to avoid overwhelming responses
      .sort({ updatedAt: -1 });  // Most recent first
    
    console.log(`Retrieved ${unifiedData.length} unified property records`);
    res.json(unifiedData);
  } catch (error) {
    console.error('Error retrieving all unified properties:', error);
    res.status(500).json({ error: error.message });
  }
});

// Batch integrate properties (can be used for background processing)
app.post('/api/integrate-properties', async (req, res) => {
  try {
    const { propertyIds } = req.body;
    
    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of propertyIds' });
    }
    
    const results = [];
    const errors = [];
    
    // Process each propertyId
    for (const propertyId of propertyIds) {
      try {
        const result = await integratePropertyData(propertyId);
        results.push({ propertyId, success: true });
      } catch (error) {
        errors.push({ propertyId, error: error.message });
      }
    }
    
    res.json({ results, errors });
  } catch (error) {
    console.error('Error in batch integration:', error);
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
