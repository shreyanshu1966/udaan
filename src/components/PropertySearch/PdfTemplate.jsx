import React, { useMemo } from 'react';
import logo from '@/assets/OP-LOGO-(NAVBAR).png';
import { analyzePropertyRisks, getOverallRiskLevel, RISK_LEVELS } from '../../utils/riskAnalysis';
import { calculateInvestmentScore } from '../../utils/investmentScoring';
import { indianStates } from '../../data/indianStates';

const PdfTemplate = ({ data, searchCriteria }) => {
  const formatDate = (date) => {
    if (!date || date === 'N/A') return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculate risk analysis and investment score
  const risks = useMemo(() => analyzePropertyRisks(data), [data]);
  const overallRisk = useMemo(() => getOverallRiskLevel(risks), [risks]);
  const scoreData = useMemo(() => calculateInvestmentScore(data), [data]);

  // Risk level colors
  const riskColors = {
    [RISK_LEVELS.HIGH]: '#f44336',  // red
    [RISK_LEVELS.MEDIUM]: '#ff9800', // orange
    [RISK_LEVELS.LOW]: '#4caf50',   // green
    [RISK_LEVELS.NONE]: '#4caf50'   // green
  };

  // Rating colors
  const ratingColors = {
    'Excellent': '#4caf50',  // green
    'Good': '#8bc34a',       // light green
    'Fair': '#ffc107',       // amber
    'Average': '#ff9800',    // orange
    'Below Average': '#f44336' // red
  };

  return (
    <div className="relative">
      {/* Background Logo/Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 0,
          opacity: 0.03,
          transform: 'rotate(-30deg) scale(2.5)',
        }}
      >
        <img
          src={logo}
          alt=""
          className="w-96 h-96 object-contain"
        />
      </div>

      {/* Main Content */}
      <div 
        id="pdfTemplate" 
        className="p-8 bg-white relative"
        style={{ 
          fontFamily: 'Arial, sans-serif',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div className="flex items-center">
            <img src={logo} alt="Omniprop Logo" className="h-16 w-16 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-primary">OMNIPROP</h1>
              <p className="text-gray-600">Property Search Report</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Report Generated:</p>
            <p className="font-semibold">{formatDate(new Date())}</p>
            <p className="text-sm text-gray-500">Report ID: {data.doris?.propertyID || 'N/A'}</p>
          </div>
        </div>

        {/* NEW SECTION: Search Inputs Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            Search Criteria
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Location Information</h3>
              <ul className="list-none pl-0">
                <li><strong>State:</strong> {indianStates.find(s => s.value === searchCriteria?.state)?.label || searchCriteria?.state}</li>
                <li><strong>District:</strong> {searchCriteria?.district}</li>
                <li><strong>Area Type:</strong> {searchCriteria?.areaType === 'urban' ? 'Urban' : 'Rural'}</li>
                {searchCriteria?.areaType === 'urban' && (
                  <>
                    <li><strong>City/Town:</strong> {searchCriteria?.cityTown}</li>
                    <li><strong>Locality:</strong> {searchCriteria?.locality}</li>
                  </>
                )}
                {searchCriteria?.areaType === 'rural' && (
                  <>
                    <li><strong>Tehsil/Taluk:</strong> {searchCriteria?.tehsil}</li>
                    <li><strong>Village:</strong> {searchCriteria?.village}</li>
                  </>
                )}
                {searchCriteria?.pinCode && <li><strong>Pin Code:</strong> {searchCriteria?.pinCode}</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Search Method & Details</h3>
              <ul className="list-none pl-0">
                <li><strong>Search Method:</strong> {
                  searchCriteria?.searchMethod === 'propertyAddress' ? 'Property Address' :
                  searchCriteria?.searchMethod === 'ownerName' ? 'Owner/Party Name' :
                  searchCriteria?.searchMethod === 'propertyIdentifier' ? 'Property Identifier' :
                  searchCriteria?.searchMethod === 'registrationDetails' ? 'Registration Details' :
                  searchCriteria?.searchMethod === 'companyName' ? 'Company Name' : 
                  searchCriteria?.searchMethod
                }</li>
                
                {searchCriteria?.searchMethod === 'propertyAddress' && (
                  <>
                    {searchCriteria.plotNumber && <li><strong>Plot/House Number:</strong> {searchCriteria.plotNumber}</li>}
                    {searchCriteria.buildingName && <li><strong>Building Name:</strong> {searchCriteria.buildingName}</li>}
                    {searchCriteria.streetName && <li><strong>Street Name:</strong> {searchCriteria.streetName}</li>}
                  </>
                )}
                
                {searchCriteria?.searchMethod === 'ownerName' && (
                  <>
                    <li><strong>Owner Name:</strong> {searchCriteria.ownerName}</li>
                    {searchCriteria.fatherHusbandName && <li><strong>Father's/Husband's Name:</strong> {searchCriteria.fatherHusbandName}</li>}
                  </>
                )}
                
                {searchCriteria?.propertyType && <li><strong>Property Type:</strong> {searchCriteria.propertyType}</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* DORIS Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            DORIS - Property Registration Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="info-group">
              <p className="text-gray-600">Owner Name</p>
              <p className="font-semibold">{data.doris?.ownerName}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Document Number</p>
              <p className="font-semibold">{data.doris?.documentNumber}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Registration Date</p>
              <p className="font-semibold">{formatDate(data.doris?.registrationDate)}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Property ID</p>
              <p className="font-semibold">{data.doris?.propertyID}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Land Type</p>
              <p className="font-semibold">{data.doris?.landType}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Land Area</p>
              <p className="font-semibold">{data.doris?.landArea}</p>
            </div>
          </div>
        </div>

        {/* DLR Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            DLR - Land Records
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="info-group">
              <p className="text-gray-600">Khasra Number</p>
              <p className="font-semibold">{data.dlr?.khasraNumber}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Khata Number</p>
              <p className="font-semibold">{data.dlr?.khataNumber}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Plot Number</p>
              <p className="font-semibold">{data.dlr?.plotNumber}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Land Use Type</p>
              <p className="font-semibold">{data.dlr?.landUseType}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Mutation Status</p>
              <p className="font-semibold">{data.dlr?.mutationStatus}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Last Updated</p>
              <p className="font-semibold">{formatDate(data.dlr?.lastUpdated)}</p>
            </div>
          </div>
        </div>

        {/* CERSAI Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            CERSAI - Encumbrance Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="info-group">
              <p className="text-gray-600">Mortgage Status</p>
              <p className="font-semibold">{data.cersai?.isMortgaged ? 'Yes' : 'No'}</p>
            </div>
            {data.cersai?.isMortgaged && (
              <>
                <div className="info-group">
                  <p className="text-gray-600">Bank Name</p>
                  <p className="font-semibold">{data.cersai?.bankName}</p>
                </div>
                <div className="info-group">
                  <p className="text-gray-600">Loan Amount</p>
                  <p className="font-semibold">{data.cersai?.loanAmount}</p>
                </div>
                <div className="info-group">
                  <p className="text-gray-600">Loan Type</p>
                  <p className="font-semibold">{data.cersai?.loanType}</p>
                </div>
                <div className="info-group">
                  <p className="text-gray-600">Loan Start Date</p>
                  <p className="font-semibold">{formatDate(data.cersai?.loanStartDate)}</p>
                </div>
                <div className="info-group">
                  <p className="text-gray-600">Loan End Date</p>
                  <p className="font-semibold">{formatDate(data.cersai?.loanEndDate)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* MCA21 Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            MCA21 - Company Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="info-group">
              <p className="text-gray-600">Company Name</p>
              <p className="font-semibold">{data.mca21?.companyName}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">CIN</p>
              <p className="font-semibold">{data.mca21?.companyCIN}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Company Type</p>
              <p className="font-semibold">{data.mca21?.companyType}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Status</p>
              <p className="font-semibold">{data.mca21?.status}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Director Name</p>
              <p className="font-semibold">{data.mca21?.directorName}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Incorporation Date</p>
              <p className="font-semibold">{formatDate(data.mca21?.incorporationDate)}</p>
            </div>
          </div>
        </div>

        {/* NEW SECTION: Risk Analysis */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            Risk Analysis
          </h2>
          <div style={{ 
            padding: '16px',
            backgroundColor: `${riskColors[overallRisk]}15`,
            border: `1px solid ${riskColors[overallRisk]}30`,
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                backgroundColor: riskColors[overallRisk],
                marginRight: '8px'
              }}></div>
              <strong>Overall Risk: {overallRisk.charAt(0).toUpperCase() + overallRisk.slice(1)}</strong>
            </div>
            
            {risks.length === 0 && (
              <p style={{ margin: 0 }}>No significant risks detected for this property.</p>
            )}
            
            {risks.length > 0 && (
              <ul style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
                {risks.map((risk, index) => (
                  <li key={index}><strong>{risk.message}</strong>: {risk.details}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* NEW SECTION: Investment Score */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            Investment Opportunity Score
          </h2>
          <div style={{ 
            padding: '16px',
            backgroundColor: `${ratingColors[scoreData.rating]}15`,
            border: `1px solid ${ratingColors[scoreData.rating]}30`,
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                backgroundColor: ratingColors[scoreData.rating],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px',
                marginRight: '16px'
              }}>{scoreData.total}</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{scoreData.rating}</h3>
                <p style={{ margin: 0, color: '#666' }}>Investment Opportunity Rating</p>
              </div>
            </div>
            
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Score Breakdown</h3>
            {Object.entries(scoreData.factors).map(([key, factor]) => (
              factor.score > 0 ? (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)} ({factor.weight * 100}%)</span>
                    <span>{factor.score}/100</span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${factor.score}%`, 
                        backgroundColor: ratingColors[scoreData.rating]
                      }}
                    ></div>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>{factor.description}</p>
                </div>
              ) : null
            ))}
          </div>
        </div>

        {/* NEW SECTION: Nearby Amenities */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            Nearby Amenities
          </h2>
          <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <p>A comprehensive neighborhood analysis was conducted to evaluate amenities within a 1km radius of the property location. Key findings include:</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Educational Facilities</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {data.amenities?.schools ? (
                    data.amenities.schools.map((school, i) => (
                      <li key={i}>{school.name} ({school.distance})</li>
                    ))
                  ) : (
                    <li>Schools data available in the interactive map view</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Healthcare Facilities</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {data.amenities?.hospitals ? (
                    data.amenities.hospitals.map((hospital, i) => (
                      <li key={i}>{hospital.name} ({hospital.distance})</li>
                    ))
                  ) : (
                    <li>Healthcare data available in the interactive map view</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Transportation</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {data.amenities?.transport ? (
                    data.amenities.transport.map((item, i) => (
                      <li key={i}>{item.name} ({item.distance})</li>
                    ))
                  ) : (
                    <li>Transport data available in the interactive map view</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Shopping & Entertainment</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {data.amenities?.shopping ? (
                    data.amenities.shopping.map((item, i) => (
                      <li key={i}>{item.name} ({item.distance})</li>
                    ))
                  ) : (
                    <li>Shopping data available in the interactive map view</li>
                  )}
                </ul>
              </div>
            </div>
            
            <p className="mt-4" style={{ color: '#666', fontSize: '12px' }}>
              Note: For a fully interactive amenities map with additional details, please refer to the online version of this report at www.omniprop.com.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center text-gray-600">
          <p className="text-sm">This document is computer generated and does not require physical signature.</p>
          <p className="text-sm mt-2">Report generated by OMNIPROP Property Search System</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>For verification, please visit www.omniprop.com</p>
            <p>Contact: support@omniprop.com | Tel: +91-XXXXXXXXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfTemplate;