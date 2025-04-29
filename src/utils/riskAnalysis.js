import { identifierTypes } from '../data/indianStates';

// Risk levels
export const RISK_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  NONE: 'none'
};

/**
 * Analyzes property data and identifies potential risks
 * @param {Object} propertyData - The unified property data
 * @returns {Array} Array of risk objects with type, level, message and details
 */
export const analyzePropertyRisks = (propertyData) => {
  const risks = [];
  
  // Guard clause for missing data
  if (!propertyData) return risks;
  
  // Check for mutation status issues
  if (propertyData.dlr && propertyData.dlr.mutationStatus === 'Pending') {
    risks.push({
      type: 'mutation',
      level: RISK_LEVELS.HIGH,
      message: 'Mutation is pending',
      details: `Mutation status: ${propertyData.dlr.mutationStatus}. Last updated: ${propertyData.dlr.lastUpdated}`,
      source: 'dlr'
    });
  }
  
  // Check for company liquidation issues
  if (propertyData.mca21 && propertyData.mca21.status === 'Under Liquidation') {
    risks.push({
      type: 'company_status',
      level: RISK_LEVELS.HIGH,
      message: 'Company is under liquidation',
      details: `Company ${propertyData.mca21.companyName} (${propertyData.mca21.companyCIN}) is under liquidation, which may lead to legal complications.`,
      source: 'mca21'
    });
  }
  
  // Check for zoning conflicts
  if (
    propertyData.dlr && 
    propertyData.dlr.landUseType === 'Industrial' && 
    propertyData.doris && 
    propertyData.doris.landType === 'Residential'
  ) {
    risks.push({
      type: 'zoning_conflict',
      level: RISK_LEVELS.MEDIUM,
      message: 'Potential zoning conflict',
      details: 'Property appears to be used for industrial purposes in a residential zone',
      source: 'combined'
    });
  }
  
  // Add more risk rules as needed
  
  return risks;
};

// Helper function to get overall risk level
export const getOverallRiskLevel = (risks) => {
  if (risks.some(risk => risk.level === RISK_LEVELS.HIGH)) {
    return RISK_LEVELS.HIGH;
  } else if (risks.some(risk => risk.level === RISK_LEVELS.MEDIUM)) {
    return RISK_LEVELS.MEDIUM;
  } else if (risks.some(risk => risk.level === RISK_LEVELS.LOW)) {
    return RISK_LEVELS.LOW;
  }
  return RISK_LEVELS.NONE;
};