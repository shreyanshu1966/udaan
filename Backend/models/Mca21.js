const mongoose = require('mongoose');

const mca21Schema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyCIN: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  companyPAN: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  companyAddress: {
    type: String,
    required: true,
    trim: true
  },
  companyType: {
    type: String,
    required: true,
    trim: true
  },
  incorporationDate: {
    type: String,
    required: true
  },
  directorName: {
    type: String,
    required: true,
    trim: true
  },
  directorDIN: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  authorizedCapital: {
    type: String,
    required: true,
    trim: true
  },
  paidUpCapital: {
    type: String,
    required: true,
    trim: true
  },
  linkedProperty: {
    type: String,
    required: true,
    trim: true
  },
  gstNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  rocOffice: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
mca21Schema.index({ propertyId: 1 });
mca21Schema.index({ companyCIN: 1 });
mca21Schema.index({ companyPAN: 1 });
mca21Schema.index({ directorDIN: 1 });
mca21Schema.index({ gstNumber: 1 });
mca21Schema.index({ companyName: 1 });

const Mca21 = mongoose.model('Mca21', mca21Schema);

module.exports = Mca21; 