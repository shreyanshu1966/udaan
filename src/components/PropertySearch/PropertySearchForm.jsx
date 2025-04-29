import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { indianStates, districtsByState, urbanAreasByDistrict, tehsilsByDistrict, villagesByTehsil } from '../../data/indianStates';
import LocationStep from './LocationStep';
import SearchMethodStep from './SearchMethodStep';
import SearchDetailsStep from './SearchDetailsStep';
import FiltersStep from './FiltersStep';
import ResultsSummary from './ResultsSummary';
import ProgressIndicator from './ProgressIndicator';
import { isSectionComplete } from './utils';

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
    // Other validation rules can be added as needed
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
    onSubmit: async (values) => {
      setIsSubmitting(true);
      console.log('Form submitted with values:', values);
      
      try {
        // Call the backend API to generate data
        const response = await axios.post('http://localhost:5000/api/generate-property', values);
        console.log('Generated data from backend:', response.data);
        
        setIsSubmitting(false);
        setSubmittedData({
          ...values,
          generatedData: response.data
        });
        setSearchSuccess(true);
      } catch (error) {
        console.error('Error generating property data:', error);
        setIsSubmitting(false);
        alert('Error generating property data. Please try again.');
      }
    }
  });

  // Update available districts when state changes
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

  // Helper function to check if we can proceed to next step
  const canProceedToNextStep = () => {
    return isSectionComplete(activeStep, formik.values);
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
        
        <div className="px-3 pt-3">
          <ProgressIndicator 
            activeStep={activeStep} 
            setActiveStep={setActiveStep} 
            isSectionComplete={(step) => isSectionComplete(step, formik.values)} 
          />
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
              <LocationStep 
                formik={formik} 
                selectedDistricts={selectedDistricts}
                selectedUrbanAreas={selectedUrbanAreas}
                selectedTehsils={selectedTehsils}
                toggleTooltip={toggleTooltip}
                showTooltip={showTooltip}
              />
            )}
            
            {/* Step 2: Search Method */}
            {activeStep === 2 && (
              <SearchMethodStep 
                formik={formik}
              />
            )}
            
            {/* Step 3: Search Details */}
            {activeStep === 3 && (
              <SearchDetailsStep 
                formik={formik}
              />
            )}
            
            {/* Step 4: Optional Filters */}
            {activeStep === 4 && (
              <FiltersStep 
                formik={formik}
                indianStates={indianStates}
              />
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
            <ResultsSummary 
              submittedData={submittedData} 
              setSearchSuccess={setSearchSuccess}
              setSubmittedData={setSubmittedData}
              setActiveStep={setActiveStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySearchForm;