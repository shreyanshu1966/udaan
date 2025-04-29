import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { propertyTypes } from '../../data/indianStates';

const FiltersStep = ({ formik, indianStates }) => {
  return (
    <div className="step-container">
      <div className="card mb-4 border-primary">
        <div className="card-header bg-primary bg-opacity-10 text-primary">
          <h4 className="mb-0">Step 4: Optional Filters</h4>
          <p className="mb-0 small">Narrow down your search results (optional)</p>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="propertyType" className="form-label fw-bold">
                Property Type
              </label>
              <select
                id="propertyType"
                name="propertyType"
                className="form-select"
                onChange={formik.handleChange}
                value={formik.values.propertyType}
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="form-text">Filter by specific property category</div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label fw-bold">Registration Date Range</label>
              <div className="form-text mb-2">Useful for finding recent transactions or properties registered in a specific period</div>
            </div>
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="registrationDateFrom" className="form-label">
                From
              </label>
              <DatePicker
                id="registrationDateFrom"
                selected={formik.values.registrationDateFrom}
                onChange={(date) => formik.setFieldValue('registrationDateFrom', date)}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={30}
                placeholderText="Select start date"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="registrationDateTo" className="form-label">
                To
              </label>
              <DatePicker
                id="registrationDateTo"
                selected={formik.values.registrationDateTo}
                onChange={(date) => formik.setFieldValue('registrationDateTo', date)}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                minDate={formik.values.registrationDateFrom}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={30}
                disabled={!formik.values.registrationDateFrom}
                placeholderText={formik.values.registrationDateFrom ? "Select end date" : "Select start date first"}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="alert alert-info">
        <div className="d-flex">
          <div className="me-2">
            <i className="bi bi-info-circle">ⓘ</i>
          </div>
          <div>
            <p className="mb-1"><strong>Ready to submit your search</strong></p>
            <p className="mb-0 small">
              You've entered information for a property {' '}
              {formik.values.areaType === 'urban' 
                ? `in ${formik.values.cityTown}, ${indianStates.find(s => s.value === formik.values.state)?.label}` 
                : formik.values.areaType === 'rural'
                  ? `in ${formik.values.village}, ${formik.values.tehsil} tehsil, ${indianStates.find(s => s.value === formik.values.state)?.label}`
                  : ''
              }.
              Click "Search Property" below to submit your query.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersStep;