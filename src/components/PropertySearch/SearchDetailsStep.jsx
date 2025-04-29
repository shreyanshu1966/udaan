import React from 'react';
import { identifierTypes } from '../../data/indianStates';
import { generateYearOptions } from './utils';

const SearchDetailsStep = ({ formik }) => {
  return (
    <div className="step-container">
      <div className="card mb-4 border-primary">
        <div className="card-header bg-primary bg-opacity-10 text-primary">
          <h4 className="mb-0">Step 3: Provide Search Details</h4>
          <p className="mb-0 small">Fill in the specific information for your search</p>
        </div>
        <div className="card-body">
          {/* Property Address Details */}
          {formik.values.searchMethod === 'propertyAddress' && (
            <div className="animate__animated animate__fadeIn">
              <div className="alert alert-light border mb-3">
                <div className="d-flex">
                  <div className="me-3 text-primary">
                    <i className="bi bi-info-circle fs-4">📍</i>
                  </div>
                  <div>
                    <p className="mb-1">You're searching by <strong>Property Address</strong>.</p>
                    <p className="mb-0 small">Enter as many details as possible for better results.</p>
                  </div>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label htmlFor="plotNumber" className="form-label">
                    Plot / House / Flat Number
                  </label>
                  <input
                    id="plotNumber"
                    name="plotNumber"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.plotNumber}
                    placeholder="E.g., 42, Flat 301, etc."
                  />
                  <div className="form-text">Recommended for better results</div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <label htmlFor="buildingName" className="form-label">
                    Building / Apartment Name
                  </label>
                  <input
                    id="buildingName"
                    name="buildingName"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.buildingName}
                    placeholder="E.g., Sunshine Towers"
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="streetName" className="form-label">
                    Street / Road Name
                  </label>
                  <input
                    id="streetName"
                    name="streetName"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.streetName}
                    placeholder="E.g., Gandhi Road"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Owner / Party Name */}
          {formik.values.searchMethod === 'ownerName' && (
            <div className="animate__animated animate__fadeIn">
              <div className="alert alert-light border mb-3">
                <div className="d-flex">
                  <div className="me-3 text-primary">
                    <i className="bi bi-info-circle fs-4">👤</i>
                  </div>
                  <div>
                    <p className="mb-1">You're searching by <strong>Owner Name</strong>.</p>
                    <p className="mb-0 small">Enter the full name exactly as it appears in property records.</p>
                  </div>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="ownerName" className="form-label">
                    Full Name of Owner / Party *
                  </label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    className={`form-control ${formik.touched.ownerName && formik.errors.ownerName ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ownerName}
                    placeholder="Enter full name as in documents"
                  />
                  {formik.touched.ownerName && formik.errors.ownerName && (
                    <div className="invalid-feedback">{formik.errors.ownerName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="fatherHusbandName" className="form-label">
                    Father's / Husband's Name <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    id="fatherHusbandName"
                    name="fatherHusbandName"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fatherHusbandName}
                    placeholder="Helps distinguish common names"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Property Identifier */}
          {formik.values.searchMethod === 'propertyIdentifier' && (
            <div className="animate__animated animate__fadeIn">
              <div className="alert alert-light border mb-3">
                <div className="d-flex">
                  <div className="me-3 text-primary">
                    <i className="bi bi-info-circle fs-4">🏷️</i>
                  </div>
                  <div>
                    <p className="mb-1">You're searching by <strong>Property Identifier</strong>.</p>
                    <p className="mb-0 small">Select the type of identifier and enter its value exactly as it appears in documents.</p>
                  </div>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="identifierType" className="form-label">
                    Identifier Type *
                  </label>
                  <select
                    id="identifierType"
                    name="identifierType"
                    className={`form-select ${formik.touched.identifierType && formik.errors.identifierType ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.identifierType}
                  >
                    <option value="">Select Identifier Type</option>
                    {identifierTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {formik.touched.identifierType && formik.errors.identifierType && (
                    <div className="invalid-feedback">{formik.errors.identifierType}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="identifierValue" className="form-label">
                    Identifier Value *
                  </label>
                  <input
                    id="identifierValue"
                    name="identifierValue"
                    type="text"
                    className={`form-control ${formik.touched.identifierValue && formik.errors.identifierValue ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.identifierValue}
                    placeholder="Enter the exact value"
                  />
                  {formik.touched.identifierValue && formik.errors.identifierValue && (
                    <div className="invalid-feedback">{formik.errors.identifierValue}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Registration Details */}
          {formik.values.searchMethod === 'registrationDetails' && (
            <div className="animate__animated animate__fadeIn">
              <div className="alert alert-light border mb-3">
                <div className="d-flex">
                  <div className="me-3 text-primary">
                    <i className="bi bi-info-circle fs-4">📄</i>
                  </div>
                  <div>
                    <p className="mb-1">You're searching by <strong>Registration Details</strong>.</p>
                    <p className="mb-0 small">Enter the document number and Sub-Registrar Office where it was registered.</p>
                  </div>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label htmlFor="sro" className="form-label">
                    Sub-Registrar Office (SRO) *
                  </label>
                  <select
                    id="sro"
                    name="sro"
                    className={`form-select ${formik.touched.sro && formik.errors.sro ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.sro}
                  >
                    <option value="">Select SRO</option>
                    {formik.values.district && (
                      <option value={`SRO-${formik.values.district}`}>
                        SRO-{formik.values.district}
                      </option>
                    )}
                  </select>
                  {formik.touched.sro && formik.errors.sro && (
                    <div className="invalid-feedback">{formik.errors.sro}</div>
                  )}
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <label htmlFor="documentNumber" className="form-label">
                    Document / Deed Number *
                  </label>
                  <input
                    id="documentNumber"
                    name="documentNumber"
                    type="text"
                    className={`form-control ${formik.touched.documentNumber && formik.errors.documentNumber ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.documentNumber}
                    placeholder="E.g., 1234/2024"
                  />
                  {formik.touched.documentNumber && formik.errors.documentNumber && (
                    <div className="invalid-feedback">{formik.errors.documentNumber}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="registrationYear" className="form-label">
                    Year of Registration *
                  </label>
                  <select
                    id="registrationYear"
                    name="registrationYear"
                    className={`form-select ${formik.touched.registrationYear && formik.errors.registrationYear ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.registrationYear}
                  >
                    <option value="">Select Year</option>
                    {generateYearOptions().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {formik.touched.registrationYear && formik.errors.registrationYear && (
                    <div className="invalid-feedback">{formik.errors.registrationYear}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Linked Company Name */}
          {formik.values.searchMethod === 'companyName' && (
            <div className="animate__animated animate__fadeIn">
              <div className="alert alert-light border mb-3">
                <div className="d-flex">
                  <div className="me-3 text-primary">
                    <i className="bi bi-info-circle fs-4">🏢</i>
                  </div>
                  <div>
                    <p className="mb-1">You're searching by <strong>Company Name</strong>.</p>
                    <p className="mb-0 small">Enter the exact company name. Adding the CIN/LLPIN will improve accuracy.</p>
                  </div>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="companyName" className="form-label">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    className={`form-control ${formik.touched.companyName && formik.errors.companyName ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyName}
                    placeholder="Enter full registered company name"
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <div className="invalid-feedback">{formik.errors.companyName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="cinLlpin" className="form-label">
                    CIN / LLPIN <span className="text-muted">(Recommended)</span>
                  </label>
                  <input
                    id="cinLlpin"
                    name="cinLlpin"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cinLlpin}
                    maxLength={21}
                    placeholder="E.g., U74999MH2018PTC123456"
                  />
                  <div className="form-text">Entering the company ID improves search accuracy</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDetailsStep;