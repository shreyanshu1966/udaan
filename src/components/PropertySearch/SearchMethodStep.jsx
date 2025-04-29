import React from 'react';

const SearchMethodStep = ({ formik }) => {
  return (
    <div className="step-container">
      <div className="card mb-4 border-primary">
        <div className="card-header bg-primary bg-opacity-10 text-primary">
          <h4 className="mb-0">Step 2: Choose Search Method</h4>
          <p className="mb-0 small">Select how you want to search for the property</p>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="mb-3">
                <label className="form-label fw-bold mb-3">How would you like to search? *</label>
                
                <div className="search-method-options">
                  {[
                    { id: 'propertyAddress', label: 'Property Address Details', desc: 'Use specific address elements' },
                    { id: 'ownerName', label: 'Owner / Party Name', desc: 'Use the name of the person/entity associated' },
                    { id: 'propertyIdentifier', label: 'Property Identifier', desc: 'Use a unique ID like Khasra, Khata, Municipal No., etc.' },
                    { id: 'registrationDetails', label: 'Registration Details', desc: 'Use Deed/Document number and SRO' },
                    { id: 'companyName', label: 'Linked Company Name', desc: 'Find properties linked to a company' }
                  ].map(option => (
                    <div 
                      key={option.id}
                      className={`card mb-2 search-method-card ${formik.values.searchMethod === option.id ? 'border-primary' : 'border'}`}
                      role="button"
                      onClick={() => formik.setFieldValue('searchMethod', option.id)}
                    >
                      <div className="card-body py-2 d-flex align-items-center">
                        <div className="form-check mb-0">
                          <input
                            id={`searchMethod${option.id}`}
                            name="searchMethod"
                            type="radio"
                            className="form-check-input"
                            value={option.id}
                            checked={formik.values.searchMethod === option.id}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="ms-2">
                          <label className="form-check-label fw-bold" htmlFor={`searchMethod${option.id}`}>
                            {option.label}
                          </label>
                          <div className="small text-muted">{option.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {formik.touched.searchMethod && formik.errors.searchMethod && (
                  <div className="text-danger mt-2">{formik.errors.searchMethod}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMethodStep;