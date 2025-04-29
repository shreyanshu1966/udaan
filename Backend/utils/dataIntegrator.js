const UnifiedProperty = require('../models/UnifiedProperty');
const Doris = require('../models/Doris');
const Dlr = require('../models/Dlr');
const Cersai = require('../models/Cersai');
const Mca21 = require('../models/Mca21');
const { createUnifiedData } = require('./dataMapper');

// Helper to convert date strings to Date objects
const parseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Create or update a unified property record using the mapper
const integratePropertyData = async (propertyId) => {
  try {
    // Fetch data from all sources
    const [dorisData, dlrData, cersaiData, mca21Data] = await Promise.all([
      Doris.findOne({ propertyId }),
      Dlr.findOne({ propertyId }),
      Cersai.findOne({ propertyId }),
      Mca21.findOne({ propertyId })
    ]);

    // If no data found for this propertyId
    if (!dorisData && !dlrData && !cersaiData && !mca21Data) {
      throw new Error(`No data found for propertyId: ${propertyId}`);
    }

    // Use our new mapping module to create standardized data
    const unifiedData = createUnifiedData({
      doris: dorisData,
      dlr: dlrData,
      cersai: cersaiData,
      mca21: mca21Data
    });

    // Update or create the unified record
    console.log(`Attempting to save unified data for propertyId: ${propertyId}`);
    const result = await UnifiedProperty.findOneAndUpdate(
      { propertyId },
      unifiedData,
      { new: true, upsert: true }
    );
    
    console.log(`Successfully saved unified data: ${result.propertyId}`);
    return result;
  } catch (error) {
    console.error(`Error integrating data for propertyId ${propertyId}:`, error);
    throw error;
  }
};

module.exports = {
  integratePropertyData
};