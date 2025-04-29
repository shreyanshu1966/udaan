import React from 'react';
import { indianStates } from '../../data/indianStates';
import { formatDate } from './utils';

const ResultsSummary = ({ submittedData, setSearchSuccess, setSubmittedData, setActiveStep }) => {
  return (
    <div className="mt-4 animate__animated animate__fadeIn">
      <div className="card border-success">
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
          
          <div className="d-flex justify-content-between mt-3">
            <button 
              type="button" 
              className="btn btn-outline-primary" 
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
              className="btn btn-primary" 
              onClick={() => {
                // Here you would navigate to a detailed results page
                alert("In a real app, this would show detailed search results with all generated data.");
              }}
            >
              View Detailed Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;