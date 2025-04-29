import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { indianStates, districtsByState,urbanAreasByDistrict,tehsilsByDistrict,villagesByTehsil,identifierTypes,propertyTypes} from '../data/indianStates';

const PropertySearchForm = () => {
  // State for controlling conditional form fields and UI elements
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedTehsils, setSelectedTehsils] = useState([]);
  const [selectedUrbanAreas, setSelectedUrbanAreas] = useState([]);
  const [currentDate] = useState(new Date());
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState({});
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Toggle tooltip for specific fields
  const toggleTooltip = (fieldName) => {
    setShowTooltip(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // Form validation schema
  const validationSchema = Yup.object({
    state: Yup.string().required('Please select a state'),
    district: Yup.string().required('Please select a district'),
    areaType: Yup.string().required('Please select urban or rural'),
    // Conditional validation based on area type
    cityTown: Yup.string().when('areaType', {
      is: 'urban',
      then: () => Yup.string().required('Please select a city/town'),
      otherwise: () => Yup.string()
    }),
    locality: Yup.string().when('areaType', {
      is: 'urban',
      then: () => Yup.string().required('Please enter a locality'),
      otherwise: () => Yup.string()
    }),
    tehsil: Yup.string().when('areaType', {
      is: 'rural',
      then: () => Yup.string().required('Please select a tehsil/taluk'),
      otherwise: () => Yup.string()
    }),
    village: Yup.string().when('areaType', {
      is: 'rural',
      then: () => Yup.string().required('Please select a village'),
      otherwise: () => Yup.string()
    }),
    pinCode: Yup.string()
      .matches(/^[0-9]{6}$/, 'Pin code must be exactly 6 digits')
      .nullable(),
    searchMethod: Yup.string().required('Please select a search method'),
    // Rest of your validation rules remain the same
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      state: '',
      district: '',
      areaType: '',
      cityTown: '',
      locality: '',
      tehsil: '',
      village: '',
      pinCode: '',
      searchMethod: '',
      plotNumber: '',
      buildingName: '',
      streetName: '',
      ownerName: '',
      fatherHusbandName: '',
      identifierType: '',
      identifierValue: '',
      sro: '',
      documentNumber: '',
      registrationYear: '',
      companyName: '',
      cinLlpin: '',
      propertyType: 'Any',
      registrationDateFrom: null,
      registrationDateTo: null
    },
    validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);
      console.log('Form submitted with values:', values);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedData(values); // Store the submitted values
        setSearchSuccess(true);
        // Don't hide success message automatically
        // setTimeout(() => setSearchSuccess(false), 3000);
      }, 1500);
    }
  });

  // Update available districts when state changes (same as your original code)
  useEffect(() => {
    if (formik.values.state) {
      const districts = districtsByState[formik.values.state] || [];
      setSelectedDistricts(districts);
      
      // Reset district and dependent fields if state changes
      if (formik.values.district && !districts.includes(formik.values.district)) {
        formik.setFieldValue('district', '');
        formik.setFieldValue('cityTown', '');
        formik.setFieldValue('locality', '');
        formik.setFieldValue('tehsil', '');
        formik.setFieldValue('village', '');
      }
    } else {
      setSelectedDistricts([]);
    }
  }, [formik.values.state]);

  useEffect(() => {
    if (formik.values.district && formik.values.areaType === 'rural') {
      const tehsils = tehsilsByDistrict[formik.values.district] || [];
      setSelectedTehsils(tehsils);
      
      // Reset tehsil and village if district changes
      if (formik.values.tehsil && !tehsils.includes(formik.values.tehsil)) {
        formik.setFieldValue('tehsil', '');
        formik.setFieldValue('village', '');
      }
    } else {
      setSelectedTehsils([]);
    }
  }, [formik.values.district, formik.values.areaType]);

  useEffect(() => {
    if (formik.values.district && formik.values.areaType === 'urban') {
      const urbanAreas = urbanAreasByDistrict[formik.values.district] || [];
      setSelectedUrbanAreas(urbanAreas);
      
      // Reset cityTown and locality if district changes
      if (formik.values.cityTown && !urbanAreas.includes(formik.values.cityTown)) {
        formik.setFieldValue('cityTown', '');
        formik.setFieldValue('locality', '');
      }
    } else {
      setSelectedUrbanAreas([]);
    }
  }, [formik.values.district, formik.values.areaType]);

  // Helper function to check if a section is complete (for progress indicator)
  const isSectionComplete = (sectionNumber) => {
    switch (sectionNumber) {
      case 1:
        return formik.values.state && formik.values.district && formik.values.areaType && 
          ((formik.values.areaType === 'urban' && formik.values.cityTown && formik.values.locality) || 
           (formik.values.areaType === 'rural' && formik.values.tehsil && formik.values.village));
      case 2:
        return formik.values.searchMethod;
      case 3:
        if (!formik.values.searchMethod) return false;
        switch (formik.values.searchMethod) {
          case 'propertyAddress':
            return formik.values.plotNumber || formik.values.buildingName || formik.values.streetName; 
          case 'ownerName':
            return !!formik.values.ownerName;
          case 'propertyIdentifier':
            return !!formik.values.identifierType && !!formik.values.identifierValue;
          case 'registrationDetails':
            return !!formik.values.sro && !!formik.values.documentNumber && !!formik.values.registrationYear;
          case 'companyName':
            return !!formik.values.companyName;
          default:
            return false;
        }
      default:
        return false;
    }
  };

  // Helper function to check if we can proceed to next step
  const canProceedToNextStep = () => {
    return isSectionComplete(activeStep);
  };

  // Navigate between steps
  const handleNextStep = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate years for registration dropdown
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 30; year--) {
      years.push(year);
    }
    return years;
  };

  // Handle form reset
  const handleReset = () => {
    formik.resetForm();
    setSelectedDistricts([]);
    setSelectedUrbanAreas([]);
    setSelectedTehsils([]);
    setActiveStep(1);
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">Property Search</h2>
              <p className="mb-0 text-light">{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="d-none d-md-block">
              <span className="badge bg-light text-primary p-2">Standardized Search Form</span>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="px-3 pt-3">
          <div className="d-flex justify-content-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className="text-center position-relative flex-fill"
                style={{ cursor: step <= activeStep ? 'pointer' : 'default' }}
                onClick={() => {
                  if (step <= activeStep) {
                    setActiveStep(step);
                  }
                }}
              >
                <div 
                  className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${
                    step < activeStep ? 'bg-success' : 
                    step === activeStep ? 'bg-primary' : 'bg-light'
                  }`}
                  style={{ width: '40px', height: '40px', color: step <= activeStep ? 'white' : '#aaa' }}
                >
                  {isSectionComplete(step) ? '✓' : step}
                </div>
                <div 
                  className={`small ${step === activeStep ? 'fw-bold' : ''}`}
                  style={{ color: step <= activeStep ? 'black' : '#aaa' }}
                >
                  {step === 1 ? 'Location' : 
                   step === 2 ? 'Search Method' : 
                   step === 3 ? 'Details' : 'Filters'}
                </div>
                {step < 4 && (
                  <div className="progress" style={{ height: '2px', position: 'absolute', top: '20px', width: 'calc(100% - 40px)', right: '-50%', zIndex: 0 }}>
                    <div 
                      className={`progress-bar ${step < activeStep ? 'bg-success' : 'bg-light'}`} 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="card-body">
          {searchSuccess && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Success!</strong> Your property search has been submitted.
              <button type="button" className="btn-close" onClick={() => setSearchSuccess(false)}></button>
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            {/* Step 1: Location */}
            {activeStep === 1 && (
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
                              (villagesByTehsil[formik.values.tehsil] || []).map((village) => (
                                <option key={village} value={village}>
                                  {village}
                                </option>
                              ))}
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
            )}
            
            {/* Step 2: Search Method */}
            {activeStep === 2 && (
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
            )}
            
            {/* Step 3: Search Details */}
            {activeStep === 3 && (
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
            )}
            
            {/* Step 4: Optional Filters */}
            {activeStep === 4 && (
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
            )}
            
            {/* Navigation buttons */}
            <div className="d-flex justify-content-between mt-4">
              <div>
                {activeStep > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={handlePrevStep}
                  >
                    <i className="bi bi-arrow-left me-1">←</i> Previous
                  </button>
                )}
              </div>
              
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleReset}
                >
                  Clear Form
                </button>
                
                {activeStep < 4 ? (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleNextStep}
                    disabled={!canProceedToNextStep()}
                  >
                    Next <i className="bi bi-arrow-right ms-1">→</i>
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Searching...
                      </>
                    ) : (
                      <>Search Property</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Summary Display */}
          {submittedData && searchSuccess && (
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
                              `${submittedData.registrationDateFrom.toLocaleDateString()} to ${
                                submittedData.registrationDateTo 
                                  ? submittedData.registrationDateTo.toLocaleDateString() 
                                  : 'Present'
                              }`
                            }
                          </li>
                        )}
                      </ul>
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
                        setSearchSuccess(false);
                        setSubmittedData(null);
                        // Here you would typically navigate to search results
                        alert("In a real app, this would show your search results.");
                      }}
                    >
                      View Search Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySearchForm;
