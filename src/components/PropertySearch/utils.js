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

// Check if a section is complete (for progress indicator)
export const isSectionComplete = (sectionNumber, formValues) => {
  switch (sectionNumber) {
    case 1:
      return formValues.state && formValues.district && formValues.areaType && 
        ((formValues.areaType === 'urban' && formValues.cityTown && formValues.locality) || 
         (formValues.areaType === 'rural' && formValues.tehsil && formValues.village));
    case 2:
      return formValues.searchMethod;
    case 3:
      if (!formValues.searchMethod) return false;
      switch (formValues.searchMethod) {
        case 'propertyAddress':
          return formValues.plotNumber || formValues.buildingName || formValues.streetName; 
        case 'ownerName':
          return !!formValues.ownerName;
        case 'propertyIdentifier':
          return !!formValues.identifierType && !!formValues.identifierValue;
        case 'registrationDetails':
          return !!formValues.sro && !!formValues.documentNumber && !!formValues.registrationYear;
        case 'companyName':
          return !!formValues.companyName;
        default:
          return false;
      }
    default:
      return false;
  }
};