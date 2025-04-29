// Utility to generate realistic random data based on user inputs

// Helper function to generate random strings and numbers
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomBoolean = () => Math.random() > 0.5;
const generateRandomId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

// Generate random date within a range
const getRandomDate = (start, end) => {
  const startDate = start || new Date(2000, 0, 1);
  const endDate = end || new Date();
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
    .toISOString().split('T')[0];
};

// Generate DORIS (Property Registration) data
const generateDorisData = (formData) => {
  const genders = ['Male', 'Female'];
  const landTypes = ['Agricultural', 'Residential', 'Commercial', 'Industrial', 'Mixed Use'];
  
  // Use owner name if provided, otherwise generate random name
  const ownerName = formData.ownerName || 
    getRandomItem(['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Sunita Verma', 'Vikram Mehta']);
  
  // Generate document number based on registration details if provided
  let documentNumber;
  if (formData.documentNumber && formData.registrationYear) {
    documentNumber = `${formData.documentNumber}/${formData.registrationYear}`;
  } else {
    documentNumber = `DOC-${getRandomNumber(1000, 9999)}/${new Date().getFullYear()}`;
  }
  
  // SRO from form data or generate based on district
  const subRegistrarOffice = formData.sro || `SRO-${formData.district || 'Central'}`;
  
  return {
    propertyId: `PROP-${generateRandomId()}`,
    ownerName: ownerName,
    fatherName: formData.fatherHusbandName || `${getRandomItem(['Raj', 'Suresh', 'Mohan', 'Krishna'])} ${ownerName.split(' ')[1]}`,
    gender: getRandomItem(genders),
    dateOfBirth: getRandomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)),
    aadhaarNumber: `${getRandomNumber(1000, 9999)} ${getRandomNumber(1000, 9999)} ${getRandomNumber(1000, 9999)}`,
    mobileNumber: `+91 ${getRandomNumber(7000000000, 9999999999)}`,
    email: `${ownerName.split(' ')[0].toLowerCase()}.${ownerName.split(' ')[1].toLowerCase()}@example.com`,
    address: formData.plotNumber 
      ? `${formData.plotNumber}, ${formData.streetName || 'Main Street'}, ${formData.cityTown || formData.village || formData.district}, ${formData.state}`
      : `${getRandomNumber(1, 100)}, ${getRandomItem(['Park Road', 'MG Road', 'Civil Lines', 'Green Avenue'])}, ${formData.cityTown || formData.village || formData.district}, ${formData.state}`,
    landType: getRandomItem(landTypes),
    landArea: `${getRandomNumber(500, 10000)} sq. ft.`,
    registrationDate: formData.registrationDateFrom || getRandomDate(new Date(2010, 0, 1)),
    documentNumber: documentNumber,
    surveyNumber: `SUR-${getRandomNumber(100, 999)}/${getRandomNumber(10, 99)}`,
    propertyID: `UNIQUE-${generateRandomId()}`,
    state: formData.state,
    district: formData.district,
    subRegistrarOffice: subRegistrarOffice
  };
};

// Generate DLR (Land Records) data
const generateDlrData = (formData) => {
  const landUseTypes = ['Agricultural', 'Residential', 'Commercial', 'Industrial', 'Mixed Use'];
  const landCategories = ['General', 'Forest', 'Government', 'Private', 'Trust'];
  
  return {
    propertyId: `PROP-${generateRandomId()}`,
    khasraNumber: formData.identifierType === 'Khasra Number' 
      ? formData.identifierValue 
      : `KH-${getRandomNumber(100, 999)}/${getRandomNumber(10, 99)}`,
    khataNumber: formData.identifierType === 'Khata Number' 
      ? formData.identifierValue 
      : `KT-${getRandomNumber(10, 99)}/${getRandomNumber(1000, 9999)}`,
    landArea: `${getRandomNumber(500, 10000)} sq. ft.`,
    landLocation: formData.areaType === 'urban' 
      ? `${formData.cityTown}, ${formData.locality}` 
      : `${formData.village}, ${formData.tehsil}`,
    landUseType: getRandomItem(landUseTypes),
    mutationStatus: getRandomItem(['Complete', 'Pending', 'In Progress']),
    mutationDate: getRandomDate(new Date(2015, 0, 1)),
    district: formData.district,
    tehsil: formData.tehsil || getRandomItem(['Central', 'North', 'South', 'East', 'West']),
    village: formData.village || 'Sample Village',
    wardNumber: `W-${getRandomNumber(1, 50)}`,
    plotNumber: formData.plotNumber || `P-${getRandomNumber(1, 500)}`,
    revenueCircle: `RC-${getRandomNumber(1, 10)}`,
    landCategory: getRandomItem(landCategories),
    lastUpdated: getRandomDate(new Date(2020, 0, 1))
  };
};

// Generate CERSAI (Mortgage) data
const generateCersaiData = (formData) => {
  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 
    'Axis Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India'
  ];
  const branches = [
    'Main Branch', 'Sector 18', 'Civil Lines', 'MG Road', 
    'Parliament Street', 'Connaught Place', 'Anna Nagar', 'T Nagar'
  ];
  const loanTypes = ['Home Loan', 'Mortgage Loan', 'Business Loan', 'Construction Loan'];
  const encumbranceTypes = ['Mortgage', 'Lien', 'Charge', 'Hypothecation'];
  
  const selectedBank = getRandomItem(banks);
  const loanAmount = getRandomNumber(1000000, 10000000);
  const isMortgaged = getRandomBoolean();
  
  return {
    propertyId: `PROP-${generateRandomId()}`,
    isMortgaged: isMortgaged,
    bankName: isMortgaged ? selectedBank : 'N/A',
    branchName: isMortgaged ? `${getRandomItem(branches)}, ${formData.district || 'Central'}` : 'N/A',
    loanAmount: isMortgaged ? `₹ ${loanAmount.toLocaleString('en-IN')}` : '₹ 0',
    loanType: isMortgaged ? getRandomItem(loanTypes) : 'N/A',
    loanAccountNumber: isMortgaged ? `LOAN-${getRandomNumber(10000, 99999)}` : 'N/A',
    loanStartDate: isMortgaged ? getRandomDate(new Date(2015, 0, 1)) : 'N/A',
    loanEndDate: isMortgaged ? getRandomDate(new Date(2025, 0, 1), new Date(2040, 0, 1)) : 'N/A',
    encumbranceType: isMortgaged ? getRandomItem(encumbranceTypes) : 'None',
    encumbranceDate: isMortgaged ? getRandomDate(new Date(2015, 0, 1)) : 'N/A',
    remarks: isMortgaged ? 'Active loan account' : 'No encumbrance found',
    lienHolderName: isMortgaged ? selectedBank : 'None',
    chargeID: isMortgaged ? `CHG-${getRandomNumber(100000, 999999)}` : 'N/A',
    cersaiRegistrationDate: isMortgaged ? getRandomDate(new Date(2015, 0, 1)) : 'N/A'
  };
};

// Generate MCA21 (Company) data
const generateMca21Data = (formData) => {
  const companyTypes = ['Private Limited', 'Limited Liability Partnership', 'Public Limited', 'One Person Company'];
  const companyStatus = ['Active', 'Dormant', 'Under Liquidation', 'Struck Off'];
  const rocOffices = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
  
  // Use company name from form if provided
  const companyName = formData.companyName || getRandomItem([
    'Infosys Technologies Pvt Ltd', 'Reliance Industries Ltd', 
    'Tata Consultancy Services Ltd', 'Wipro Limited', 
    'Bharti Airtel Ltd', 'HCL Technologies Ltd'
  ]);
  
  // Use CIN if provided
  const companyCIN = formData.cinLlpin || `U${getRandomNumber(10000, 99999)}${formData.state || 'MH'}${getRandomNumber(2010, 2023)}PTC${getRandomNumber(100000, 999999)}`;
  
  return {
    propertyId: `PROP-${generateRandomId()}`,
    companyName: companyName,
    companyCIN: companyCIN,
    companyPAN: `AABC${getRandomItem(['P', 'R', 'T', 'D'])}${getRandomNumber(1000, 9999)}${getRandomItem(['A', 'B', 'C', 'Z'])}`,
    companyAddress: formData.plotNumber 
      ? `${formData.plotNumber}, ${formData.streetName || 'Business Park'}, ${formData.cityTown || formData.district}, ${formData.state}` 
      : `${getRandomNumber(1, 100)}, ${getRandomItem(['Corporate Park', 'Business Center', 'Tech Park', 'Industrial Area'])}, ${formData.cityTown || formData.district}, ${formData.state}`,
    companyType: getRandomItem(companyTypes),
    incorporationDate: getRandomDate(new Date(2000, 0, 1), new Date(2020, 0, 1)),
    directorName: getRandomItem(['Rajesh Kumar', 'Sunil Mittal', 'Anil Agarwal', 'Nirmala Sitharaman', 'Kiran Mazumdar']),
    directorDIN: `${getRandomNumber(10000000, 99999999)}`,
    authorizedCapital: `₹ ${getRandomNumber(1, 100)} Crore`,
    paidUpCapital: `₹ ${getRandomNumber(1, 50)} Crore`,
    linkedProperty: `${formData.plotNumber || 'Plot No. ' + getRandomNumber(1, 100)}, ${formData.streetName || 'Main Road'}, ${formData.cityTown || formData.village || formData.district}`,
    gstNumber: `${getRandomNumber(10, 99)}${formData.state || 'MH'}${getRandomItem(['A', 'B', 'C', 'D'])}${getRandomNumber(1000, 9999)}${getRandomItem(['A', 'B', 'Z'])}${getRandomNumber(1, 9)}Z${getRandomNumber(1, 9)}`,
    rocOffice: `ROC-${getRandomItem(rocOffices)}`,
    status: getRandomItem(companyStatus)
  };
};

// Main function to generate all data
export const generatePropertyData = (formData) => {
  const dorisData = generateDorisData(formData);
  const dlrData = generateDlrData(formData);
  const cersaiData = generateCersaiData(formData);
  const mca21Data = generateMca21Data(formData);
  
  return {
    propertyId: dorisData.propertyId,
    doris: dorisData,
    dlr: dlrData,
    cersai: cersaiData,
    mca21: mca21Data
  };
};