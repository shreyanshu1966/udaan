// Utility functions for property search components

// Format dates for rendering
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr === 'N/A') return 'N/A';
  
  try {
    // Parse and format date string
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString();
  } catch (e) {
    return dateStr;
  }
};

// Generate years for registration dropdown
export const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= currentYear - 30; year--) {
    years.push(year);
  }
  return years;
};

// Regular expressions for validation
export const validationPatterns = {
  pinCode: /^[0-9]{6}$/,
  documentNumber: /^[a-zA-Z0-9\/-]+$/,
  cinLlpin: /^[a-zA-Z0-9]+$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  alphanumericWithSpecial: /^[a-zA-Z0-9\s,./-]+$/,
  namePattern: /^[a-zA-Z\s.',-]+$/
};

// Basic input validation helpers
export const validateInput = {
  isEmpty: (value) => value === undefined || value === null || value.trim() === '',
  isMinLength: (value, minLength) => value && value.length >= minLength,
  isMaxLength: (value, maxLength) => value && value.length <= maxLength,
  matchesPattern: (value, pattern) => pattern.test(value),
  isPinCodeValid: (value) => !value || validationPatterns.pinCode.test(value),
  isAlphanumeric: (value) => !value || validationPatterns.alphanumeric.test(value),
  isValidName: (value) => !value || validationPatterns.namePattern.test(value),
  isDateAfter: (date, compareDate) => {
    if (!date || !compareDate) return true;
    return new Date(date) > new Date(compareDate);
  }
};

// Check if a section is complete (for progress indicator)
export const isSectionComplete = (sectionNumber, formValues) => {
  switch (sectionNumber) {
    case 1: // Location step
      // Basic required fields
      if (!formValues.state || !formValues.district || !formValues.areaType) {
        return false;
      }
      
      // Check urban area fields
      if (formValues.areaType === 'urban') {
        if (!formValues.cityTown || !formValues.locality) {
          return false;
        }
        // Validate locality has minimum length
        if (formValues.locality.length < 2) {
          return false;
        }
      }
      
      // Check rural area fields
      if (formValues.areaType === 'rural') {
        if (!formValues.tehsil || !formValues.village) {
          return false;
        }
      }
      
      // Validate PIN code if provided
      if (formValues.pinCode && !validateInput.isPinCodeValid(formValues.pinCode)) {
        return false;
      }
      
      return true;
      
    case 2: // Search Method step
      return !!formValues.searchMethod;
      
    case 3: // Search Details step
      if (!formValues.searchMethod) return false;
      
      switch (formValues.searchMethod) {
        case 'propertyAddress':
          // At least one address field should be filled
          const hasAddressData = formValues.plotNumber || formValues.buildingName || formValues.streetName;
          // Check lengths if data is provided
          const isPlotValid = !formValues.plotNumber || formValues.plotNumber.length <= 20;
          const isBuildingValid = !formValues.buildingName || formValues.buildingName.length <= 100;
          const isStreetValid = !formValues.streetName || formValues.streetName.length <= 100;
          
          return hasAddressData && isPlotValid && isBuildingValid && isStreetValid;
          
        case 'ownerName':
          // Owner name validation
          if (!formValues.ownerName || formValues.ownerName.length < 3) {
            return false;
          }
          // Father/husband name validation if provided
          if (formValues.fatherHusbandName && formValues.fatherHusbandName.length > 100) {
            return false;
          }
          // Check if names contain valid characters
          return validateInput.isValidName(formValues.ownerName) && 
                 validateInput.isValidName(formValues.fatherHusbandName);
          
        case 'propertyIdentifier':
          // Check required fields
          if (!formValues.identifierType || !formValues.identifierValue) {
            return false;
          }
          // Length validation
          if (formValues.identifierValue.length < 2 || formValues.identifierValue.length > 50) {
            return false;
          }
          return validateInput.isAlphanumeric(formValues.identifierValue);
          
        case 'registrationDetails':
          // Check required fields
          if (!formValues.sro || !formValues.documentNumber || !formValues.registrationYear) {
            return false;
          }
          // Document number validation
          return formValues.documentNumber.length >= 3 && 
                 formValues.documentNumber.length <= 30 &&
                 validationPatterns.documentNumber.test(formValues.documentNumber);
          
        case 'companyName':
          // Company name validation
          if (!formValues.companyName || formValues.companyName.length < 3) {
            return false;
          }
          // CIN/LLPIN validation if provided
          if (formValues.cinLlpin) {
            return validationPatterns.cinLlpin.test(formValues.cinLlpin) && 
                  formValues.cinLlpin.length <= 21;
          }
          return true;
          
        default:
          return false;
      }
      
    case 4: // Filters step - This is optional, so always allow to proceed
      // Validate date range if both dates are provided
      if (formValues.registrationDateFrom && formValues.registrationDateTo) {
        return validateInput.isDateAfter(formValues.registrationDateTo, formValues.registrationDateFrom);
      }
      return true;
      
    default:
      return false;
  }
};