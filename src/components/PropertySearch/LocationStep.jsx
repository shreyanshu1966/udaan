import React from 'react';
import { indianStates } from '../../data/indianStates';

const LocationStep = ({ formik, selectedDistricts, selectedUrbanAreas, selectedTehsils, toggleTooltip, showTooltip }) => {
  return (
    <div className="step-container">
      <div className="card mb-4 border-primary">
        <div className="card-header bg-primary bg-opacity-10 text-primary d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Step 1: Locate the Property</h4>
            <p className="mb-0 small">Specify the geographical area</p>
          </div>
          <div className="form-text text-primary">All fields marked with * are required</div>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="state" className="form-label">
                State / Union Territory *
                <i 
                  className="ms-2 bi bi-question-circle" 
                  role="button"
                  onClick={() => toggleTooltip('state')}
                >ⓘ</i>
              </label>
              {showTooltip.state && (
                <div className="alert alert-info py-2 small">
                  Select the state where the property is located.
                </div>
              )}
              <select
                id="state"
                name="state"
                className={`form-select ${formik.touched.state && formik.errors.state ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.state}
              >
                <option value="">Select State/UT</option>
                {indianStates.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
              {formik.touched.state && formik.errors.state && (
                <div className="invalid-feedback">{formik.errors.state}</div>
              )}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="district" className="form-label">
                District *
              </label>
              <select
                id="district"
                name="district"
                className={`form-select ${formik.touched.district && formik.errors.district ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.district}
                disabled={!formik.values.state}
              >
                <option value="">Select District</option>
                {selectedDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {formik.touched.district && formik.errors.district && (
                <div className="invalid-feedback">{formik.errors.district}</div>
              )}
              {!formik.values.state && (
                <div className="form-text text-muted">Please select a state first</div>
              )}
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="form-label">Area Type *</label>
              <div className="d-flex gap-4">
                <div className="form-check">
                  <input
                    id="areaTypeUrban"
                    name="areaType"
                    type="radio"
                    className="form-check-input"
                    value="urban"
                    checked={formik.values.areaType === 'urban'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label className="form-check-label" htmlFor="areaTypeUrban">
                    <span className="fw-bold">Urban</span> (City, Town, Municipality)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="areaTypeRural"
                    name="areaType"
                    type="radio"
                    className="form-check-input"
                    value="rural"
                    checked={formik.values.areaType === 'rural'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label className="form-check-label" htmlFor="areaTypeRural">
                    <span className="fw-bold">Rural</span> (Village, Panchayat)
                  </label>
                </div>
              </div>
              {formik.touched.areaType && formik.errors.areaType && (
                <div className="text-danger small mt-1">{formik.errors.areaType}</div>
              )}
            </div>
          </div>
          
          {/* Urban-specific fields */}
          {formik.values.areaType === 'urban' && (
            <div className="row mb-3 animate__animated animate__fadeIn">
              <div className="col-md-6 mb-3 mb-md-0">
                <label htmlFor="cityTown" className="form-label">
                  City / Town / Municipal Corp *
                </label>
                <select
                  id="cityTown"
                  name="cityTown"
                  className={`form-select ${formik.touched.cityTown && formik.errors.cityTown ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cityTown}
                  disabled={!formik.values.district}
                >
                  <option value="">Select City/Town</option>
                  {selectedUrbanAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {formik.touched.cityTown && formik.errors.cityTown && (
                  <div className="invalid-feedback">{formik.errors.cityTown}</div>
                )}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="locality" className="form-label">
                  Locality / Ward / Sector *
                </label>
                <input
                  id="locality"
                  name="locality"
                  type="text"
                  className={`form-control ${formik.touched.locality && formik.errors.locality ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.locality}
                  disabled={!formik.values.cityTown}
                  placeholder="Enter locality name"
                />
                {formik.touched.locality && formik.errors.locality && (
                  <div className="invalid-feedback">{formik.errors.locality}</div>
                )}
              </div>
            </div>
          )}
          
          {/* Rural-specific fields */}
          {formik.values.areaType === 'rural' && (
            <div className="row mb-3 animate__animated animate__fadeIn">
              <div className="col-md-6 mb-3 mb-md-0">
                <label htmlFor="tehsil" className="form-label">
                  Tehsil / Taluk / Mandal *
                </label>
                <select
                  id="tehsil"
                  name="tehsil"
                  className={`form-select ${formik.touched.tehsil && formik.errors.tehsil ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tehsil}
                  disabled={!formik.values.district}
                >
                  <option value="">Select Tehsil/Taluk/Mandal</option>
                  {selectedTehsils.map((tehsil) => (
                    <option key={tehsil} value={tehsil}>
                      {tehsil}
                    </option>
                  ))}
                </select>
                {formik.touched.tehsil && formik.errors.tehsil && (
                  <div className="invalid-feedback">{formik.errors.tehsil}</div>
                )}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="village" className="form-label">
                  Village / Panchayat *
                </label>
                <select
                  id="village"
                  name="village"
                  className={`form-select ${formik.touched.village && formik.errors.village ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.village}
                  disabled={!formik.values.tehsil}
                >
                  <option value="">Select Village/Panchayat</option>
                  {formik.values.tehsil && 
                    (formik.values.tehsil in window.villagesByTehsil ? 
                      window.villagesByTehsil[formik.values.tehsil].map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))
                    : [])}
                </select>
                {formik.touched.village && formik.errors.village && (
                  <div className="invalid-feedback">{formik.errors.village}</div>
                )}
              </div>
            </div>
          )}
          
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="pinCode" className="form-label">
                Pin Code <span className="text-muted">(Optional)</span>
              </label>
              <input
                id="pinCode"
                name="pinCode"
                type="text"
                className={`form-control ${formik.touched.pinCode && formik.errors.pinCode ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pinCode}
                maxLength={6}
                placeholder="6-digit PIN code"
              />
              {formik.touched.pinCode && formik.errors.pinCode && (
                <div className="invalid-feedback">{formik.errors.pinCode}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationStep;