const mongoose = require('mongoose');

const cersaiSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  isMortgaged: {
    type: Boolean,
    required: true,
    default: false
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  branchName: {
    type: String,
    required: true,
    trim: true
  },
  loanAmount: {
    type: String,
    required: true,
    trim: true
  },
  loanType: {
    type: String,
    required: true,
    trim: true
  },
  loanAccountNumber: {
    type: String,
    required: function() {
      return this.isMortgaged === true;
    },
    trim: true,
    // Remove unique constraint or add composite index instead
    // unique: true,
    sparse: true  // This is important - only enforces uniqueness on non-null values
  },
  loanStartDate: {
    type: String,
    required: true
  },
  loanEndDate: {
    type: String,
    required: true
  },
  encumbranceType: {
    type: String,
    required: true,
    trim: true
  },
  encumbranceDate: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    trim: true
  },
  lienHolderName: {
    type: String,
    required: true,
    trim: true
  },
  chargeID: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  cersaiRegistrationDate: {
    type: String,
    required: true
  },
  documentNumber: {
    type: String,
    required: true,
    // Remove unique constraint or add composite index with another field
    // unique: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
cersaiSchema.index({ propertyId: 1 });
cersaiSchema.index({ loanAccountNumber: 1 });
cersaiSchema.index({ chargeID: 1 });
cersaiSchema.index({ bankName: 1, branchName: 1 });

const Cersai = mongoose.model('Cersai', cersaiSchema);

module.exports = Cersai;