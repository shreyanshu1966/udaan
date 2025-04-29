const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  searchName: {
    type: String,
    required: true,
    trim: true
  },
  searchParams: {
    state: String,
    district: String,
    areaType: String,
    cityTown: String,
    locality: String,
    tehsil: String,
    village: String,
    pinCode: String,
    searchMethod: String,
    plotNumber: String,
    buildingName: String,
    streetName: String,
    ownerName: String,
    fatherHusbandName: String,
    identifierType: String,
    identifierValue: String,
    sro: String,
    documentNumber: String,
    registrationYear: String,
    companyName: String,
    cinLlpin: String,
    propertyType: String,
    registrationDateFrom: Date,
    registrationDateTo: Date
  },
  searchResults: {
    propertyId: String,
    // Store a summary of results (not the entire results to save space)
    summary: {
      ownerName: String,
      propertyId: String,
      propertyAddress: String,
      propertyType: String,
      district: String,
      state: String
    }
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
savedSearchSchema.index({ userId: 1, createdAt: -1 });
savedSearchSchema.index({ 'searchParams.searchMethod': 1 });

const SavedSearch = mongoose.model('SavedSearch', savedSearchSchema);
module.exports = SavedSearch;