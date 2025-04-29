const mongoose = require('mongoose');

const unifiedPropertySchema = new mongoose.Schema({
  // Core Identifiers
  propertyId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  
  // Property Core Details
  property: {
    surveyNumber: String,
    khasraNumber: String,
    khataNumber: String,
    plotNumber: String,
    documentNumber: String,
    address: String,
    landArea: String,
    landType: String,
    landUseType: String,
    landCategory: String,
    state: {
      code: String,
      name: String
    },
    district: String,
    tehsil: String,
    village: String,
    cityTown: String,
    wardNumber: String,
    revenueCircle: String,
    locality: String,
    registrationDate: Date,
    subRegistrarOffice: String,
    mutationStatus: String,
    mutationDate: Date,
    lastUpdated: Date
  },
  
  // Owner Information
  owner: {
    name: String,
    fatherName: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: Date,
    contactInfo: {
      aadhaarNumber: String,
      mobileNumber: String,
      email: String
    },
    address: String
  },
  
  // Encumbrance Information
  encumbrance: {
    isMortgaged: {
      type: Boolean,
      default: false
    },
    loanDetails: {
      bankName: String,
      branchName: String,
      loanAmount: String,
      loanType: String,
      loanAccountNumber: String,
      loanStartDate: Date,
      loanEndDate: Date
    },
    encumbranceDetails: {
      encumbranceType: String,
      encumbranceDate: Date,
      lienHolderName: String,
      chargeID: String,
      cersaiRegistrationDate: Date,
      remarks: String
    }
  },
  
  // Company Information
  companyDetails: {
    companyName: String,
    companyCIN: String,
    companyPAN: String,
    companyAddress: String,
    companyType: String,
    incorporationDate: Date,
    directorName: String,
    directorDIN: String,
    authorizedCapital: String,
    paidUpCapital: String,
    linkedProperty: String,
    gstNumber: String,
    rocOffice: String,
    status: String
  },
  
  // Metadata
  dataSourcesIntegrated: {
    doris: { type: Boolean, default: false },
    dlr: { type: Boolean, default: false },
    cersai: { type: Boolean, default: false },
    mca21: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
unifiedPropertySchema.index({ 'property.khasraNumber': 1 });
unifiedPropertySchema.index({ 'property.khataNumber': 1 });
unifiedPropertySchema.index({ 'property.documentNumber': 1 });
unifiedPropertySchema.index({ 'owner.name': 1 });

const UnifiedProperty = mongoose.model('UnifiedProperty', unifiedPropertySchema);

module.exports = UnifiedProperty;