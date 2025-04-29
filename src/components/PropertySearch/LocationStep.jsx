import React from 'react';
import { indianStates } from '../../data/indianStates';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCity, FaHome } from 'react-icons/fa';

const LocationStep = ({ formik, selectedDistricts, selectedUrbanAreas, selectedTehsils, toggleTooltip, showTooltip }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="step-container"
    >
      <div className="card mb-4 shadow-sm border-primary">
        <div className="card-header bg-gradient-primary text-white">
          <div className="d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 fs-4" />
            <div>
              <h4 className="mb-0">Step 1: Locate the Property</h4>
              <p className="mb-0 small">Specify the geographical area</p>
            </div>
          </div>
        </div>

        <div className="card-body bg-light">
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="form-floating">
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
                <label htmlFor="state">State / Union Territory *</label>
              </div>
              {formik.touched.state && formik.errors.state && (
                <div className="invalid-feedback">{formik.errors.state}</div>
              )}
            </div>

            <div className="col-md-6">
              <div className="form-floating">
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
                <label htmlFor="district">District *</label>
              </div>
              {formik.touched.district && formik.errors.district && (
                <div className="invalid-feedback">{formik.errors.district}</div>
              )}
              {!formik.values.state && (
                <div className="form-text text-muted">Please select a state first</div>
              )}
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <label className="form-label fw-bold">
                <FaHome className="me-2" />
                Area Type *
              </label>
              <div className="d-flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`card flex-grow-1 cursor-pointer ${
                    formik.values.areaType === 'urban' ? 'border-primary bg-light' : ''
                  }`}
                  onClick={() => formik.setFieldValue('areaType', 'urban')}
                >
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={formik.values.areaType === 'urban'}
                        onChange={() => {}}
                      />
                      <label className="form-check-label">
                        <FaCity className="me-2" />
                        <span className="fw-bold">Urban</span>
                        <br />
                        <small className="text-muted">City, Town, Municipality</small>
                      </label>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`card flex-grow-1 cursor-pointer ${
                    formik.values.areaType === 'rural' ? 'border-primary bg-light' : ''
                  }`}
                  onClick={() => formik.setFieldValue('areaType', 'rural')}
                >
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={formik.values.areaType === 'rural'}
                        onChange={() => {}}
                      />
                      <label className="form-check-label">
                        <FaHome className="me-2" />
                        <span className="fw-bold">Rural</span>
                        <br />
                        <small className="text-muted">Village, Panchayat</small>
                      </label>
                    </div>
                  </div>
                </motion.div>
              </div>
              {formik.touched.areaType && formik.errors.areaType && (
                <div className="text-danger small mt-1">{formik.errors.areaType}</div>
              )}
            </div>
          </div>

          {formik.values.areaType === 'urban' && (
            <div className="row mb-3 animate__animated animate__fadeIn">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-floating">
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
                  <label htmlFor="cityTown">City / Town / Municipal Corp *</label>
                </div>
                {formik.touched.cityTown && formik.errors.cityTown && (
                  <div className="invalid-feedback">{formik.errors.cityTown}</div>
                )}
              </div>

              <div className="col-md-6">
                <div className="form-floating">
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
                  <label htmlFor="locality">Locality / Ward / Sector *</label>
                </div>
                {formik.touched.locality && formik.errors.locality && (
                  <div className="invalid-feedback">{formik.errors.locality}</div>
                )}
              </div>
            </div>
          )}

          {formik.values.areaType === 'rural' && (
            <div className="row mb-3 animate__animated animate__fadeIn">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-floating">
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
                  <label htmlFor="tehsil">Tehsil / Taluk / Mandal *</label>
                </div>
                {formik.touched.tehsil && formik.errors.tehsil && (
                  <div className="invalid-feedback">{formik.errors.tehsil}</div>
                )}
              </div>

              <div className="col-md-6">
                <div className="form-floating">
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
                      (formik.values.tehsil in window.villagesByTehsil
                        ? window.villagesByTehsil[formik.values.tehsil].map((village) => (
                            <option key={village} value={village}>
                              {village}
                            </option>
                          ))
                        : [])}
                  </select>
                  <label htmlFor="village">Village / Panchayat *</label>
                </div>
                {formik.touched.village && formik.errors.village && (
                  <div className="invalid-feedback">{formik.errors.village}</div>
                )}
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-6">
              <div className="form-floating">
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
                <label htmlFor="pinCode">Pin Code <span className="text-muted">(Optional)</span></label>
              </div>
              {formik.touched.pinCode && formik.errors.pinCode && (
                <div className="invalid-feedback">{formik.errors.pinCode}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationStep;