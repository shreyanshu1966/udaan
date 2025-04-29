/**
 * Data Mapping and Transformation Module
 * 
 * This module handles standardization of data from different sources:
 * - Field name mapping
 * - Date format normalization
 * - Missing value handling
 * - Data discrepancy resolution
 */

// Date transformer to standardize all date formats to YYYY-MM-DD
const normalizeDate = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput === 'N/A') return null;
  
  try {
    // Try to parse various date formats
    let date;
    if (typeof dateInput === 'string') {
      // Handle DD-MM-YYYY
      if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(dateInput)) {
        const [day, month, year] = dateInput.split(/[-/]/);
        date = new Date(`${year}-${month}-${day}`);
      } 
      // Handle YYYY/MM/DD
      else if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(dateInput)) {
        date = new Date(dateInput.replace(/\//g, '-'));
      }
      // Handle month name formats (May 13, 2021)
      else if (/[a-zA-Z]+\s\d{1,2},\s\d{4}/.test(dateInput)) {
        date = new Date(dateInput);
      }
      else {
        date = new Date(dateInput);
      }
    } else {
      date = new Date(dateInput);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    
    // Return in YYYY-MM-DD format
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error(`Error normalizing date: ${dateInput}`, error);
    return null;
  }
};

// Handle null or empty values
const standardizeValue = (value, defaultValue = 'N/A') => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value;
};

// Standard field mapping dictionary for each data source
const fieldMappings = {
  doris: {
    // source field : standardized field
    propertyID: 'propertyId',
    documentNumber: 'registrationNumber',
    registrationDate: 'registrationDate',
    ownerName: 'ownerName',
    fatherName: 'fatherHusbandName',
    surveyNumber: 'surveyNumber',
    address: 'propertyAddress',
    state: 'stateCode',
    landType: 'propertyType',
    landArea: 'areaSize',
    subRegistrarOffice: 'sro'
  },
  
  dlr: {
    khasraNumber: 'khasraNumber',
    khataNumber: 'khataNumber',
    landArea: 'areaSize',
    landLocation: 'propertyAddress',
    landUseType: 'propertyType',
    plotNumber: 'plotNumber',
    mutationStatus: 'mutationStatus',
    mutationDate: 'mutationDate',
    lastUpdated: 'lastUpdatedDate'
  },
  
  cersai: {
    isMortgaged: 'isMortgaged',
    bankName: 'lenderName',
    branchName: 'lenderBranch',
    loanAmount: 'loanAmount',
    loanType: 'loanType',
    loanAccountNumber: 'loanAccountNumber',
    loanStartDate: 'loanStartDate',
    loanEndDate: 'loanEndDate',
    encumbranceType: 'chargeType',
    encumbranceDate: 'chargeDate',
    lienHolderName: 'chargeHolder',
    chargeID: 'chargeId',
    cersaiRegistrationDate: 'cersaiRegDate'
  },
  
  mca21: {
    companyName: 'companyName',
    companyCIN: 'cin',
    companyPAN: 'pan',
    companyAddress: 'registeredAddress',
    companyType: 'companyType',
    incorporationDate: 'incorporationDate',
    directorName: 'directorName',
    directorDIN: 'directorDin',
    authorizedCapital: 'authorizedCapital',
    paidUpCapital: 'paidUpCapital',
    gstNumber: 'gstNumber',
    rocOffice: 'rocOffice',
    status: 'companyStatus'
  }
};

/**
 * Maps source data to standardized field names,
 * normalizes date fields, and handles null values
 */
const mapSourceData = (sourceData, sourceType) => {
  if (!sourceData) return null;
  
  const mapping = fieldMappings[sourceType];
  if (!mapping) {
    console.error(`No mapping defined for source type: ${sourceType}`);
    return sourceData;
  }
  
  const mappedData = {};
  
  // Map each field according to the source mapping
  Object.entries(sourceData._doc || sourceData).forEach(([key, value]) => {
    // Skip _id and other Mongoose metadata fields
    if (key.startsWith('_')) return;
    
    // Get the standardized field name (or use original if no mapping exists)
    const standardField = mapping[key] || key;
    
    // Handle date fields specially
    if (key.toLowerCase().includes('date')) {
      mappedData[standardField] = normalizeDate(value);
    } else {
      // Handle other values with standard null/empty checking
      mappedData[standardField] = standardizeValue(value);
    }
  });
  
  // Return the standardized data
  return mappedData;
};

/**
 * Combines all data sources into a unified structure with standardized fields
 */
const createUnifiedData = (sources) => {
  const { doris, dlr, cersai, mca21 } = sources;
  
  // Get standardized data from each source
  const dorisData = doris ? mapSourceData(doris, 'doris') : null;
  const dlrData = dlr ? mapSourceData(dlr, 'dlr') : null; 
  const cersaiData = cersai ? mapSourceData(cersai, 'cersai') : null;
  const mca21Data = mca21 ? mapSourceData(mca21, 'mca21') : null;
  
  // Create a unified structure with all mapped data
  const unifiedData = {
    // Use the first available propertyId
    propertyId: 
      (dorisData && dorisData.propertyId) || 
      (dlrData && dlrData.propertyId) || 
      (cersaiData && cersaiData.propertyId) || 
      (mca21Data && mca21Data.propertyId),
    
    // Core property details
    property: {
      // Combine registration info from DORIS
      registrationNumber: dorisData?.registrationNumber || 'N/A',
      registrationDate: dorisData?.registrationDate || null,
      sro: dorisData?.sro || 'N/A',
      
      // Combine land record info from DLR
      khasraNumber: dlrData?.khasraNumber || 'N/A',
      khataNumber: dlrData?.khataNumber || 'N/A', 
      surveyNumber: dorisData?.surveyNumber || 'N/A',
      plotNumber: dlrData?.plotNumber || 'N/A',
      
      // Property details from both sources
      propertyType: dorisData?.propertyType || dlrData?.propertyType || 'N/A',
      areaSize: dorisData?.areaSize || dlrData?.areaSize || 'N/A',
      propertyAddress: dorisData?.propertyAddress || dlrData?.propertyAddress || 'N/A',
      
      // Location details
      stateCode: dorisData?.stateCode || 'N/A',
      stateName: getStateName(dorisData?.stateCode) || 'N/A',
      district: dorisData?.district || dlrData?.district || 'N/A',
      tehsil: dlrData?.tehsil || 'N/A',
      village: dlrData?.village || 'N/A',
      
      // Mutation details
      mutationStatus: dlrData?.mutationStatus || 'N/A',
      mutationDate: dlrData?.mutationDate || null,
      lastUpdatedDate: dlrData?.lastUpdatedDate || null
    },
    
    // Owner information from DORIS
    owner: dorisData ? {
      name: dorisData.ownerName || 'N/A',
      fatherHusbandName: dorisData.fatherHusbandName || 'N/A',
      gender: dorisData.gender || 'N/A',
      dateOfBirth: dorisData.dateOfBirth || null,
      contactInfo: {
        aadhaarNumber: dorisData.aadhaarNumber || 'N/A',
        mobileNumber: dorisData.mobileNumber || 'N/A',
        email: dorisData.email || 'N/A'
      },
      address: dorisData.address || 'N/A'
    } : null,
    
    // Encumbrance information from CERSAI
    encumbrance: cersaiData ? {
      isMortgaged: cersaiData.isMortgaged || false,
      loanDetails: {
        lenderName: cersaiData.lenderName || 'N/A',
        lenderBranch: cersaiData.lenderBranch || 'N/A',
        loanAmount: cersaiData.loanAmount || 'N/A',
        loanType: cersaiData.loanType || 'N/A',
        loanAccountNumber: cersaiData.loanAccountNumber || 'N/A',
        loanStartDate: cersaiData.loanStartDate || null,
        loanEndDate: cersaiData.loanEndDate || null
      },
      chargeDetails: {
        chargeType: cersaiData.chargeType || 'N/A',
        chargeDate: cersaiData.chargeDate || null,
        chargeHolder: cersaiData.chargeHolder || 'N/A',
        chargeId: cersaiData.chargeId || 'N/A',
        cersaiRegDate: cersaiData.cersaiRegDate || null,
        remarks: cersaiData.remarks || 'N/A'
      }
    } : { isMortgaged: false },
    
    // Company information from MCA21
    companyDetails: mca21Data ? {
      companyName: mca21Data.companyName || 'N/A',
      cin: mca21Data.cin || 'N/A',
      pan: mca21Data.pan || 'N/A',
      registeredAddress: mca21Data.registeredAddress || 'N/A',
      companyType: mca21Data.companyType || 'N/A',
      incorporationDate: mca21Data.incorporationDate || null,
      directorName: mca21Data.directorName || 'N/A',
      directorDin: mca21Data.directorDin || 'N/A',
      authorizedCapital: mca21Data.authorizedCapital || 'N/A',
      paidUpCapital: mca21Data.paidUpCapital || 'N/A',
      linkedProperty: mca21Data.linkedProperty || 'N/A',
      gstNumber: mca21Data.gstNumber || 'N/A',
      rocOffice: mca21Data.rocOffice || 'N/A',
      companyStatus: mca21Data.companyStatus || 'N/A'
    } : null,
    
    // Track data sources that were integrated
    dataSourcesIntegrated: {
      doris: !!dorisData,
      dlr: !!dlrData,
      cersai: !!cersaiData,
      mca21: !!mca21Data
    }
  };
  
  return unifiedData;
};

// Simple state code to name converter 
const getStateName = (stateCode) => {
  // State code to name mapping
  const stateMap = {
    'AP': 'Andhra Pradesh',
    'AR': 'Arunachal Pradesh',
    'AS': 'Assam',
    'BR': 'Bihar',
    'CG': 'Chhattisgarh',
    'GA': 'Goa',
    'GJ': 'Gujarat',
    'HR': 'Haryana',
    'HP': 'Himachal Pradesh',
    'JH': 'Jharkhand',
    'KA': 'Karnataka',
    'KL': 'Kerala',
    'MP': 'Madhya Pradesh',
    'MH': 'Maharashtra',
    'MN': 'Manipur',
    'ML': 'Meghalaya',
    'MZ': 'Mizoram',
    'NL': 'Nagaland',
    'OD': 'Odisha',
    'PB': 'Punjab',
    'RJ': 'Rajasthan',
    'SK': 'Sikkim',
    'TN': 'Tamil Nadu',
    'TG': 'Telangana',
    'TR': 'Tripura',
    'UP': 'Uttar Pradesh',
    'UK': 'Uttarakhand',
    'WB': 'West Bengal',
    'DL': 'Delhi'
  };
  
  return stateCode ? (stateMap[stateCode] || stateCode) : null;
};

// Export the functionality
module.exports = {
  mapSourceData,
  createUnifiedData,
  normalizeDate,
  standardizeValue,
  getStateName
};