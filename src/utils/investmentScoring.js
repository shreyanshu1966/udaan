/**
 * Calculates an investment opportunity score for a property
 * @param {Object} propertyData - The unified property data
 * @returns {Object} Score details including total score and factor breakdowns
 */
export const calculateInvestmentScore = (propertyData) => {
  // Guard clause for missing data
  if (!propertyData) return { total: 0, factors: {} };
  
  // Initialize scoring factors with default weights
  const factors = {
    location: { score: 0, weight: 0.25, description: '' },
    propertyType: { score: 0, weight: 0.15, description: '' },
    size: { score: 0, weight: 0.15, description: '' },
    encumbrance: { score: 0, weight: 0.2, description: '' },
    companyProfile: { score: 0, weight: 0.15, description: '' },
    mutationStatus: { score: 0, weight: 0.1, description: '' }
  };
  
  // Score location (urban vs rural, district importance)
  if (propertyData.doris) {
    // Urban properties typically score higher for investment
    const isUrban = propertyData.doris.district.includes('Urban') || 
                    ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad'].includes(propertyData.doris.district);
    
    if (isUrban) {
      factors.location.score = 80;
      factors.location.description = 'Property in urban area - higher potential for appreciation';
    } else {
      factors.location.score = 50;
      factors.location.description = 'Property in rural area - moderate potential for appreciation';
    }
  }
  
  // Score property type
  if (propertyData.doris && propertyData.doris.landType) {
    const typeScores = {
      'Commercial': 90,
      'Residential': 75,
      'Industrial': 70,
      'Agricultural': 40,
      'Mixed Use': 80
    };
    
    factors.propertyType.score = typeScores[propertyData.doris.landType] || 50;
    factors.propertyType.description = `Property type: ${propertyData.doris.landType}`;
  }
  
  // Score property size (if available)
  if (propertyData.dlr && propertyData.dlr.landArea) {
    // Extract numeric value from land area (e.g., "5000 sq. ft." -> 5000)
    const areaMatch = propertyData.dlr.landArea.match(/(\d+)/);
    if (areaMatch) {
      const area = parseInt(areaMatch[1]);
      
      // Score based on size (larger typically better for investment)
      if (area > 5000) {
        factors.size.score = 85;
        factors.size.description = 'Large property - good development potential';
      } else if (area > 2000) {
        factors.size.score = 70;
        factors.size.description = 'Medium-sized property - moderate development potential';
      } else {
        factors.size.score = 50;
        factors.size.description = 'Smaller property - limited development potential';
      }
    }
  }
  
  // Score encumbrance status
  if (propertyData.cersai) {
    if (!propertyData.cersai.isMortgaged) {
      factors.encumbrance.score = 90;
      factors.encumbrance.description = 'Property is not mortgaged - clean title';
    } else {
      // Properties under mortgage might be investment opportunities
      // if they're distressed assets
      factors.encumbrance.score = 60;
      factors.encumbrance.description = `Property mortgaged with ${propertyData.cersai.bankName} - potential for distressed asset acquisition`;
    }
  }
  
  // Score company profile (if applicable)
  if (propertyData.mca21) {
    const companyStatus = propertyData.mca21.status;
    
    if (companyStatus === 'Active') {
      factors.companyProfile.score = 75;
      factors.companyProfile.description = 'Company is active - stable ownership';
    } else if (companyStatus === 'Under Liquidation') {
      factors.companyProfile.score = 85;
      factors.companyProfile.description = 'Company under liquidation - potential distressed asset opportunity';
    } else if (companyStatus === 'Dormant') {
      factors.companyProfile.score = 60;
      factors.companyProfile.description = 'Company is dormant - ownership may change';
    } else {
      factors.companyProfile.score = 50;
      factors.companyProfile.description = `Company status: ${companyStatus}`;
    }
  }
  
  // Score mutation status
  if (propertyData.dlr) {
    if (propertyData.dlr.mutationStatus === 'Complete') {
      factors.mutationStatus.score = 85;
      factors.mutationStatus.description = 'Mutation complete - clean title transfer';
    } else if (propertyData.dlr.mutationStatus === 'Pending') {
      factors.mutationStatus.score = 40;
      factors.mutationStatus.description = 'Mutation pending - title transfer not complete';
    } else {
      factors.mutationStatus.score = 60;
      factors.mutationStatus.description = `Mutation status: ${propertyData.dlr.mutationStatus}`;
    }
  }
  
  // Calculate weighted total score
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.keys(factors).forEach(key => {
    const factor = factors[key];
    if (factor.score > 0) {
      totalScore += factor.score * factor.weight;
      totalWeight += factor.weight;
    }
  });
  
  // Normalize total score if we don't have all factors
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  
  // Return complete scoring details
  return {
    total: finalScore,
    rating: getScoreRating(finalScore),
    factors
  };
};

// Helper function to convert numerical score to rating
function getScoreRating(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Average';
  return 'Below Average';
}