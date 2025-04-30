import React, { useState, useContext } from 'react';
import { indianStates } from '../../data/indianStates';
import { formatDate } from './utils';
import { generatePDF } from '../../utils/pdfGenerator';
import PdfLoadingOverlay from './PdfLoadingOverlay';
import PdfTemplate from './PdfTemplate';
import { analyzePropertyRisks, getOverallRiskLevel, RISK_LEVELS } from '../../utils/riskAnalysis';
import { calculateInvestmentScore } from '../../utils/investmentScoring';
import { AuthContext } from '../../context/AuthContext';
import SaveSearchModal from './SaveSearchModal';
import AmenitiesMap from './AmenitiesMap';

const ResultsSummary = ({ submittedData, setSearchSuccess, setSubmittedData, setActiveStep }) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [saveSearchModalOpen, setSaveSearchModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const handleExportPDF = async () => {
    try {
      setIsPdfLoading(true);
      await generatePDF(
        'pdfTemplate', 
        `OMNIPROP-${submittedData.generatedData?.propertyID || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`
      );
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <>
      <PdfLoadingOverlay isVisible={isPdfLoading} />
      <div className="mt-4 animate__animated animate__fadeIn">
        <div id="searchResults" className="card border-success">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Search Submitted Successfully</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => {
                setSearchSuccess(false);
                setSubmittedData(null);
              }}
              aria-label="Close"
            ></button>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 className="border-bottom pb-2">Location Information</h6>
                <ul className="list-unstyled">
                  <li><strong>State:</strong> {indianStates.find(s => s.value === submittedData.state)?.label || submittedData.state}</li>
                  <li><strong>District:</strong> {submittedData.district}</li>
                  <li><strong>Area Type:</strong> {submittedData.areaType === 'urban' ? 'Urban' : 'Rural'}</li>
                  {submittedData.areaType === 'urban' && (
                    <>
                      <li><strong>City/Town:</strong> {submittedData.cityTown}</li>
                      <li><strong>Locality:</strong> {submittedData.locality}</li>
                    </>
                  )}
                  {submittedData.areaType === 'rural' && (
                    <>
                      <li><strong>Tehsil/Taluk:</strong> {submittedData.tehsil}</li>
                      <li><strong>Village:</strong> {submittedData.village}</li>
                    </>
                  )}
                  {submittedData.pinCode && <li><strong>Pin Code:</strong> {submittedData.pinCode}</li>}
                </ul>
              </div>
              
              <div className="col-md-6 mb-3">
                <h6 className="border-bottom pb-2">Search Method & Details</h6>
                <ul className="list-unstyled">
                  <li><strong>Search Method:</strong> {
                    submittedData.searchMethod === 'propertyAddress' ? 'Property Address' :
                    submittedData.searchMethod === 'ownerName' ? 'Owner/Party Name' :
                    submittedData.searchMethod === 'propertyIdentifier' ? 'Property Identifier' :
                    submittedData.searchMethod === 'registrationDetails' ? 'Registration Details' :
                    submittedData.searchMethod === 'companyName' ? 'Company Name' : 
                    submittedData.searchMethod
                  }</li>
                  
                  {submittedData.searchMethod === 'propertyAddress' && (
                    <>
                      {submittedData.plotNumber && <li><strong>Plot/House Number:</strong> {submittedData.plotNumber}</li>}
                      {submittedData.buildingName && <li><strong>Building Name:</strong> {submittedData.buildingName}</li>}
                      {submittedData.streetName && <li><strong>Street Name:</strong> {submittedData.streetName}</li>}
                    </>
                  )}
                  
                  {submittedData.searchMethod === 'ownerName' && (
                    <>
                      <li><strong>Owner Name:</strong> {submittedData.ownerName}</li>
                      {submittedData.fatherHusbandName && <li><strong>Father's/Husband's Name:</strong> {submittedData.fatherHusbandName}</li>}
                    </>
                  )}
                  
                  {submittedData.searchMethod === 'propertyIdentifier' && (
                    <>
                      <li><strong>Identifier Type:</strong> {submittedData.identifierType}</li>
                      <li><strong>Identifier Value:</strong> {submittedData.identifierValue}</li>
                    </>
                  )}
                  
                  {submittedData.searchMethod === 'registrationDetails' && (
                    <>
                      <li><strong>SRO:</strong> {submittedData.sro}</li>
                      <li><strong>Document Number:</strong> {submittedData.documentNumber}</li>
                      <li><strong>Registration Year:</strong> {submittedData.registrationYear}</li>
                    </>
                  )}
                  
                  {submittedData.searchMethod === 'companyName' && (
                    <>
                      <li><strong>Company Name:</strong> {submittedData.companyName}</li>
                      {submittedData.cinLlpin && <li><strong>CIN/LLPIN:</strong> {submittedData.cinLlpin}</li>}
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="row">
              <div className="col-12">
                <h6 className="border-bottom pb-2">Filters Applied</h6>
                <ul className="list-unstyled">
                  <li><strong>Property Type:</strong> {submittedData.propertyType}</li>
                  {submittedData.registrationDateFrom && (
                    <li>
                      <strong>Registration Date Range:</strong> {
                        `${typeof submittedData.registrationDateFrom.toLocaleDateString === 'function' 
                          ? submittedData.registrationDateFrom.toLocaleDateString() 
                          : String(submittedData.registrationDateFrom)} to ${
                          submittedData.registrationDateTo 
                            ? (typeof submittedData.registrationDateTo.toLocaleDateString === 'function'
                                ? submittedData.registrationDateTo.toLocaleDateString()
                                : String(submittedData.registrationDateTo)) 
                            : 'Present'
                        }`
                      }
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="row mt-4">
              <div className="col-12">
                <h5 className="border-bottom pb-2 text-primary">Generated Property Data Preview</h5>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">DORIS - Property Registration</h6>
                  </div>
                  <div className="card-body small">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Owner:</strong> {submittedData.generatedData?.doris?.ownerName}</p>
                        <p><strong>Document No:</strong> {submittedData.generatedData?.doris?.documentNumber}</p>
                        <p><strong>Registration Date:</strong> {formatDate(submittedData.generatedData?.doris?.registrationDate)}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Property ID:</strong> {submittedData.generatedData?.doris?.propertyID}</p>
                        <p><strong>Land Type:</strong> {submittedData.generatedData?.doris?.landType}</p>
                        <p><strong>Land Area:</strong> {submittedData.generatedData?.doris?.landArea}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">DLR - Land Records</h6>
                  </div>
                  <div className="card-body small">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Khasra No:</strong> {submittedData.generatedData?.dlr?.khasraNumber}</p>
                        <p><strong>Khata No:</strong> {submittedData.generatedData?.dlr?.khataNumber}</p>
                        <p><strong>Plot No:</strong> {submittedData.generatedData?.dlr?.plotNumber}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Land Use:</strong> {submittedData.generatedData?.dlr?.landUseType}</p>
                        <p><strong>Mutation Status:</strong> {submittedData.generatedData?.dlr?.mutationStatus}</p>
                        <p><strong>Last Updated:</strong> {formatDate(submittedData.generatedData?.dlr?.lastUpdated)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">CERSAI - Encumbrance</h6>
                  </div>
                  <div className="card-body small">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Mortgaged:</strong> {submittedData.generatedData?.cersai?.isMortgaged ? 'Yes' : 'No'}</p>
                        {submittedData.generatedData?.cersai?.isMortgaged && (
                          <>
                            <p><strong>Bank:</strong> {submittedData.generatedData?.cersai?.bankName}</p>
                            <p><strong>Loan Amount:</strong> {submittedData.generatedData?.cersai?.loanAmount}</p>
                          </>
                        )}
                      </div>
                      <div className="col-md-6">
                        {submittedData.generatedData?.cersai?.isMortgaged ? (
                          <>
                            <p><strong>Loan Type:</strong> {submittedData.generatedData?.cersai?.loanType}</p>
                            <p><strong>Start Date:</strong> {formatDate(submittedData.generatedData?.cersai?.loanStartDate)}</p>
                            <p><strong>End Date:</strong> {formatDate(submittedData.generatedData?.cersai?.loanEndDate)}</p>
                          </>
                        ) : (
                          <p><strong>Status:</strong> No encumbrance found</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">MCA21 - Company Details</h6>
                  </div>
                  <div className="card-body small">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Company:</strong> {submittedData.generatedData?.mca21?.companyName}</p>
                        <p><strong>CIN:</strong> {submittedData.generatedData?.mca21?.companyCIN}</p>
                        <p><strong>Type:</strong> {submittedData.generatedData?.mca21?.companyType}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Status:</strong> {submittedData.generatedData?.mca21?.status}</p>
                        <p><strong>Director:</strong> {submittedData.generatedData?.mca21?.directorName}</p>
                        <p><strong>Incorporation:</strong> {formatDate(submittedData.generatedData?.mca21?.incorporationDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <RiskAnalysisPanel propertyData={submittedData.generatedData} />
            <InvestmentScorePanel propertyData={submittedData.generatedData} />
            
            {/* Update Amenities Map to use coordinates from user's pin */}
            <AmenitiesMap 
              propertyLocation={getPropertyCoordinates(submittedData)}
            />

            <div className="d-flex justify-content-between mt-3">
              <div>
                <button 
                  type="button" 
                  className="btn btn-outline-primary me-2" 
                  onClick={() => {
                    setActiveStep(1);
                    setSearchSuccess(false);
                    setSubmittedData(null);
                  }}
                >
                  Start New Search
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={handleExportPDF}
                >
                  <i className="bi bi-file-pdf me-1">📄</i>
                  Export to PDF
                </button>

                <button 
                  type="button" 
                  className="btn btn-outline-primary me-2" 
                  onClick={() => user ? setSaveSearchModalOpen(true) : navigate('/login')}
                >
                  <i className="bi bi-bookmark me-1">🔖</i>
                  Save Search
                </button>
              </div>
              
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  alert("In a real app, this would show detailed search results with all generated data.");
                }}
              >
                View Detailed Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden PDF template */}
      <div style={{ display: 'none' }}>
        <PdfTemplate 
          data={submittedData.generatedData} 
          searchCriteria={submittedData}
        />
      </div>

      {user && (
        <SaveSearchModal 
          isOpen={saveSearchModalOpen} 
          onClose={() => setSaveSearchModalOpen(false)}
          searchData={submittedData}
        />
      )}
    </>
  );
};

const RiskAnalysisPanel = ({ propertyData }) => {
  const risks = analyzePropertyRisks(propertyData);
  const overallRisk = getOverallRiskLevel(risks);
  
  // Map risk levels to colors
  const riskColors = {
    [RISK_LEVELS.HIGH]: '#f44336',  // red
    [RISK_LEVELS.MEDIUM]: '#ff9800', // orange
    [RISK_LEVELS.LOW]: '#4caf50',   // green
    [RISK_LEVELS.NONE]: '#4caf50'   // green
  };
  
  return (
    <div className="mb-4">
      <h4 className="mb-3">Risk Analysis</h4>
      <div className="p-3 mb-3" style={{ 
        backgroundColor: riskColors[overallRisk] + '15',
        border: `1px solid ${riskColors[overallRisk]}30`,
        borderRadius: '8px' 
      }}>
        <div className="d-flex align-items-center mb-2">
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
          <p className="mb-0">No significant risks detected for this property.</p>
        )}
        
        {risks.length > 0 && (
          <ul className="mb-0 ps-3">
            {risks.map((risk, index) => (
              <li key={index}><strong>{risk.message}</strong>: {risk.details}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const InvestmentScorePanel = ({ propertyData }) => {
  const scoreData = calculateInvestmentScore(propertyData);
  
  // Map score ratings to colors
  const ratingColors = {
    'Excellent': '#4caf50',  // green
    'Good': '#8bc34a',       // light green
    'Fair': '#ffc107',       // amber
    'Average': '#ff9800',    // orange
    'Below Average': '#f44336' // red
  };
  
  return (
    <div className="mb-4">
      <h4 className="mb-3">Investment Opportunity Score</h4>
      <div className="p-3 mb-3" style={{ 
        backgroundColor: ratingColors[scoreData.rating] + '15',
        border: `1px solid ${ratingColors[scoreData.rating]}30`,
        borderRadius: '8px' 
      }}>
        <div className="d-flex align-items-center mb-3">
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
            <h5 className="mb-0">{scoreData.rating}</h5>
            <p className="mb-0 text-muted">Investment Opportunity Rating</p>
          </div>
        </div>
        
        <h6>Score Breakdown</h6>
        {Object.entries(scoreData.factors).map(([key, factor]) => (
          factor.score > 0 ? (
            <div key={key} className="mb-2">
              <div className="d-flex justify-content-between mb-1">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)} ({factor.weight * 100}%)</span>
                <span>{factor.score}/100</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${factor.score}%`, backgroundColor: getProgressColor(factor.score) }} 
                  aria-valuenow={factor.score} 
                  aria-valuemin="0" 
                  aria-valuemax="100">
                </div>
              </div>
              <p className="mb-1 mt-1 small text-muted">{factor.description}</p>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

// Helper function for progress bar colors
function getProgressColor(score) {
  if (score >= 80) return '#4caf50';
  if (score >= 70) return '#8bc34a';
  if (score >= 60) return '#ffc107';
  if (score >= 50) return '#ff9800';
  return '#f44336';
}

// Helper function to get property coordinates
function getPropertyCoordinates(submittedData) {
  // First priority: Use pinpointed map coordinates if available
  if (submittedData.mapCoordinates && submittedData.mapCoordinates.lat && submittedData.mapCoordinates.lng) {
    return {
      lat: submittedData.mapCoordinates.lat,
      lng: submittedData.mapCoordinates.lng,
      isPinpointed: true
    };
  }
  
  // Second priority: Use generated DORIS data coordinates
  if (submittedData.generatedData?.doris?.latitude && submittedData.generatedData?.doris?.longitude) {
    return {
      lat: submittedData.generatedData.doris.latitude,
      lng: submittedData.generatedData.doris.longitude,
      isPinpointed: false
    };
  }
  
  // Fallback: Use center of India
  return {
    lat: 20.5937,
    lng: 78.9629,
    isPinpointed: false
  };
}

export default ResultsSummary;