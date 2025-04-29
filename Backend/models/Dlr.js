const mongoose = require('mongoose');

const dlrSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  khasraNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  khataNumber: {
    type: String,
    required: true,
    trim: true
  },
  landArea: {
    type: String,
    required: true,
    trim: true
  },
  landLocation: {
    type: String,
    required: true,
    trim: true
  },
  landUseType: {
    type: String,
    required: true,
    trim: true
  },
  mutationStatus: {
    type: String,
    required: true,
    trim: true
  },
  mutationDate: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  tehsil: {
    type: String,
    required: true,
    trim: true
  },
  village: {
    type: String,
    required: true,
    trim: true
  },
  wardNumber: {
    type: String,
    required: true,
    trim: true
  },
  plotNumber: {
    type: String,
    required: true,
    trim: true
  },
  revenueCircle: {
    type: String,
    required: true,
    trim: true
  },
  landCategory: {
    type: String,
    required: true,
    trim: true
  },
  lastUpdated: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
dlrSchema.index({ propertyId: 1 });
dlrSchema.index({ khasraNumber: 1 });
dlrSchema.index({ khataNumber: 1 });
dlrSchema.index({ district: 1, tehsil: 1, village: 1 });

const Dlr = mongoose.model('Dlr', dlrSchema);

module.exports = Dlr; 