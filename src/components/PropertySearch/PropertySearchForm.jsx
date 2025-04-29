import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Box, Container, Paper, Typography, LinearProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FaSearch, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './PropertySearch.css';
import Navbar from '@/components/Navbar'; // Import Navbar
import Footer from '@/components/Footer'; // Import Footer
import { indianStates, districtsByState, urbanAreasByDistrict, tehsilsByDistrict, villagesByTehsil } from '../../data/indianStates';
import LocationStep from './LocationStep';
import SearchMethodStep from './SearchMethodStep';
import SearchDetailsStep from './SearchDetailsStep';
import FiltersStep from './FiltersStep';
import ResultsSummary from './ResultsSummary';
import ProgressIndicator from './ProgressIndicator';
import { isSectionComplete } from './utils';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// Add background styles
const backgroundStyle = {
  backgroundImage: 'url("/images/property-bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '2rem 0',
};

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
  const [errorMessage, setErrorMessage] = useState(null);

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
      setErrorMessage(null);
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
        
        // Show a more specific error message
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('Error generating property data. Please try again.');
        }
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
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex flex-col">
        <Navbar /> {/* Add Navbar */}
        <Box sx={backgroundStyle} className="flex-grow">
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                {/* Header */}
                <Box 
                  sx={{ 
                    background: 'linear-gradient(45deg, #2c3e50 30%, #26a69a 90%)',
                    padding: 3,
                    color: 'white',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Typography variant="h4" sx={{ fontWeight: 500 }}>
                        <FaSearch className="me-2" />
                        Property Search
                      </Typography>
                      <Typography variant="subtitle1">
                        {currentDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </div>
                    <Box 
                      sx={{ 
                        display: { xs: 'none', md: 'block' },
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                      }}
                    >
                      <Typography variant="body2">
                        <FaBuilding className="me-2" />
                        Standardized Search Form
                      </Typography>
                    </Box>
                  </div>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ px: 3, pt: 3 }}>
                  <ProgressIndicator 
                    activeStep={activeStep} 
                    setActiveStep={setActiveStep} 
                    isSectionComplete={(step) => isSectionComplete(step, formik.values)} 
                  />
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 3 }}>
                  {isSubmitting && (
                    <LinearProgress 
                      sx={{ 
                        mb: 2,
                        height: 6,
                        borderRadius: 3,
                      }} 
                    />
                  )}

                  {searchSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <FaMapMarkerAlt className="me-2" />
                        <strong>Success!</strong> Your property search has been submitted.
                        <button type="button" className="btn-close" onClick={() => setSearchSuccess(false)}></button>
                      </div>
                    </motion.div>
                  )}

                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> {errorMessage}
                        <button type="button" className="btn-close" onClick={() => setErrorMessage(null)}></button>
                      </div>
                    </motion.div>
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
                    
                    {/* Enhanced Navigation Buttons */}
                    <motion.div 
                      className="d-flex justify-content-between mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
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
                            style={{ 
                              backgroundColor: '#2c3e50', 
                              borderColor: '#2c3e50',
                              boxShadow: '0 3px 5px 2px rgba(44, 62, 80, 0.3)'
                            }}
                            onClick={handleNextStep}
                            disabled={!canProceedToNextStep()}
                          >
                            Next <i className="bi bi-arrow-right ms-1">→</i>
                          </button>
                        ) : (
                          <button 
                            type="submit" 
                            className="btn btn-success"
                            style={{ backgroundColor: '#26a69a', borderColor: '#26a69a' }}
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
                    </motion.div>
                  </form>

                  {/* Enhanced Summary Display */}
                  {submittedData && searchSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ResultsSummary 
                        submittedData={submittedData} 
                        setSearchSuccess={setSearchSuccess}
                        setSubmittedData={setSubmittedData}
                        setActiveStep={setActiveStep}
                      />
                    </motion.div>
                  )}
                </Box>
              </Paper>
            </motion.div>
          </Container>
        </Box>
        <Footer /> {/* Add Footer */}
      </div>
    </ThemeProvider>
  );
};

export default PropertySearchForm;