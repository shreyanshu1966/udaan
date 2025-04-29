const mongoose = require('mongoose');

const dorisSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  landType: {
    type: String,
    required: true,
    trim: true
  },
  landArea: {
    type: String,
    required: true,
    trim: true
  },
  registrationDate: {
    type: String,
    required: true
  },
  documentNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  surveyNumber: {
    type: String,
    required: true,
    trim: true
  },
  propertyID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  subRegistrarOffice: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
dorisSchema.index({ propertyID: 1 });
dorisSchema.index({ aadhaarNumber: 1 });
dorisSchema.index({ documentNumber: 1 });

const Doris = mongoose.model('Doris', dorisSchema);

module.exports = Doris; 