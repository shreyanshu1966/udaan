const UnifiedProperty = require('../models/UnifiedProperty');
const Doris = require('../models/Doris');
const Dlr = require('../models/Dlr');
const Cersai = require('../models/Cersai');
const Mca21 = require('../models/Mca21');

// Remove the CommonJS require for indianStates
// const { indianStates } = require('../../src/data/indianStates');

// Helper to convert date strings to Date objects
const parseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Create a cache for state names
let stateCache = {};

// Modify the getStateName function to be simpler
const getStateName = (stateCode) => {
  // Simple mapping to avoid ES Module import issues
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
    'TS': 'Telangana',
    'TR': 'Tripura',
    'UP': 'Uttar Pradesh',
    'UK': 'Uttarakhand',
    'WB': 'West Bengal',
    'DL': 'Delhi',
    // Add more states as needed
  };
  
  return stateMap[stateCode] || stateCode;
};

// Create or update a unified property record
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

    // Prepare unified record
    const unifiedData = {
      propertyId,
      property: {},
      owner: {},
      encumbrance: { isMortgaged: false },
      companyDetails: {},
      dataSourcesIntegrated: {
        doris: !!dorisData,
        dlr: !!dlrData,
        cersai: !!cersaiData,
        mca21: !!mca21Data
      }
    };

    // Integrate DORIS data
    if (dorisData) {
      // Get state name asynchronously
      const stateName = await getStateName(dorisData.state);
      
      // Property details
      unifiedData.property = {
        ...unifiedData.property,
        surveyNumber: dorisData.surveyNumber,
        documentNumber: dorisData.documentNumber,
        address: dorisData.address,
        landArea: dorisData.landArea,
        landType: dorisData.landType,
        registrationDate: parseDate(dorisData.registrationDate),
        state: {
          code: dorisData.state,
          name: stateName
        },
        district: dorisData.district,
        subRegistrarOffice: dorisData.subRegistrarOffice
      };

      // Owner details
      unifiedData.owner = {
        name: dorisData.ownerName,
        fatherName: dorisData.fatherName,
        gender: dorisData.gender,
        dateOfBirth: parseDate(dorisData.dateOfBirth),
        contactInfo: {
          aadhaarNumber: dorisData.aadhaarNumber,
          mobileNumber: dorisData.mobileNumber,
          email: dorisData.email
        },
        address: dorisData.address
      };
    }

    // Integrate DLR data
    if (dlrData) {
      unifiedData.property = {
        ...unifiedData.property,
        khasraNumber: dlrData.khasraNumber,
        khataNumber: dlrData.khataNumber,
        landLocation: dlrData.landLocation,
        landUseType: dlrData.landUseType,
        landCategory: dlrData.landCategory,
        mutationStatus: dlrData.mutationStatus,
        mutationDate: parseDate(dlrData.mutationDate),
        tehsil: dlrData.tehsil,
        village: dlrData.village,
        wardNumber: dlrData.wardNumber,
        plotNumber: dlrData.plotNumber,
        revenueCircle: dlrData.revenueCircle,
        lastUpdated: parseDate(dlrData.lastUpdated)
      };
    }

    // Integrate CERSAI data
    if (cersaiData) {
      unifiedData.encumbrance = {
        isMortgaged: cersaiData.isMortgaged,
        loanDetails: {
          bankName: cersaiData.bankName,
          branchName: cersaiData.branchName,
          loanAmount: cersaiData.loanAmount,
          loanType: cersaiData.loanType,
          loanAccountNumber: cersaiData.loanAccountNumber,
          loanStartDate: parseDate(cersaiData.loanStartDate),
          loanEndDate: parseDate(cersaiData.loanEndDate)
        },
        encumbranceDetails: {
          encumbranceType: cersaiData.encumbranceType,
          encumbranceDate: parseDate(cersaiData.encumbranceDate),
          lienHolderName: cersaiData.lienHolderName,
          chargeID: cersaiData.chargeID,
          cersaiRegistrationDate: parseDate(cersaiData.cersaiRegistrationDate),
          remarks: cersaiData.remarks
        }
      };
    }

    // Integrate MCA21 data
    if (mca21Data) {
      unifiedData.companyDetails = {
        companyName: mca21Data.companyName,
        companyCIN: mca21Data.companyCIN,
        companyPAN: mca21Data.companyPAN,
        companyAddress: mca21Data.companyAddress,
        companyType: mca21Data.companyType,
        incorporationDate: parseDate(mca21Data.incorporationDate),
        directorName: mca21Data.directorName,
        directorDIN: mca21Data.directorDIN,
        authorizedCapital: mca21Data.authorizedCapital,
        paidUpCapital: mca21Data.paidUpCapital,
        linkedProperty: mca21Data.linkedProperty,
        gstNumber: mca21Data.gstNumber,
        rocOffice: mca21Data.rocOffice,
        status: mca21Data.status
      };
    }

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