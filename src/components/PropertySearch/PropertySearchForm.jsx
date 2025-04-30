import React, { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { Box, Container, Paper, Typography, LinearProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './PropertySearch.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { indianStates, districtsByState, urbanAreasByDistrict, tehsilsByDistrict } from '../../data/indianStates';
import LocationStep from './LocationStep';
import SearchMethodStep from './SearchMethodStep';
import SearchDetailsStep from './SearchDetailsStep';
import FiltersStep from './FiltersStep';
import ResultsSummary from './ResultsSummary';
import ProgressIndicator from './ProgressIndicator';
import { isSectionComplete } from './utils';
import { useLocation } from 'react-router-dom';
import { propertyAPI } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

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
  padding: '1rem 0', // Decreased from 2rem to 1rem
};

const PropertySearchForm = () => {
  const location = useLocation();
  const savedSearchParams = location.state?.savedSearchParams;
  const { user } = useContext(AuthContext);

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
    areaType: Yup.string().required('Please select an area type'),
    cityTown: Yup.string().when('areaType', {
      is: 'urban',
      then: () => Yup.string().required('Please enter a city/town')
    }),
    tehsil: Yup.string().when('areaType', {
      is: 'rural',
      then: () => Yup.string().required('Please select a tehsil/taluka')
    }),
    village: Yup.string().when('areaType', {
      is: 'rural',
      then: () => Yup.string().required('Please enter a village')
    }),
    pinCode: Yup.string()
      .matches(/^[0-9]{6}$/, 'Pin code must be exactly 6 digits')
      .nullable(),
    searchMethod: Yup.string().required('Please select a search method'),
    // Other validation rules can be added as needed
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: savedSearchParams || {
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
      registrationDateTo: null,
      mapCoordinates: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setErrorMessage(null);
      console.log('Form submitted with values:', values);
      
      try {
        // Call the backend API to generate data
        const response = await propertyAPI.generateProperty(values);
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
      
      // Reset dependent fields if they're not in the current selection
      if (formik.values.district && !districts.includes(formik.values.district)) {
        formik.setFieldValue('district', '');
        formik.setFieldValue('areaType', '');
        formik.setFieldValue('cityTown', '');
        formik.setFieldValue('tehsil', '');
        formik.setFieldValue('village', '');
      }
    } else {
      setSelectedDistricts([]);
      formik.setFieldValue('district', '');
    }
  }, [formik.values.state]);

  // Update available urban areas or tehsils when district or area type changes
  useEffect(() => {
    if (formik.values.district && formik.values.areaType === 'urban') {
      const urbanAreas = urbanAreasByDistrict[formik.values.district] || [];
      setSelectedUrbanAreas(urbanAreas);
      
      // Reset dependent field if it's not in the current selection
      if (formik.values.cityTown && !urbanAreas.includes(formik.values.cityTown)) {
        formik.setFieldValue('cityTown', '');
      }
    } else if (formik.values.district && formik.values.areaType === 'rural') {
      const tehsils = tehsilsByDistrict[formik.values.district] || [];
      setSelectedTehsils(tehsils);
      
      // Reset dependent fields if they're not in the current selection
      if (formik.values.tehsil && !tehsils.includes(formik.values.tehsil)) {
        formik.setFieldValue('tehsil', '');
        formik.setFieldValue('village', '');
      }
    }
  }, [formik.values.district, formik.values.areaType]);

  // Set initial values based on saved search params
  useEffect(() => {
    if (savedSearchParams) {
      console.log('Initializing form with saved search params:', savedSearchParams);
      
      // Prefill districts dropdown
      if (savedSearchParams.state) {
        const districts = districtsByState[savedSearchParams.state] || [];
        setSelectedDistricts(districts);
      }
      
      // Prefill urban areas dropdown
      if (savedSearchParams.district && savedSearchParams.areaType === 'urban') {
        const urbanAreas = urbanAreasByDistrict[savedSearchParams.district] || [];
        setSelectedUrbanAreas(urbanAreas);
      }
      
      if (savedSearchParams.district && savedSearchParams.areaType === 'rural') {
        const tehsils = tehsilsByDistrict[savedSearchParams.district] || [];
        setSelectedTehsils(tehsils);
      }
      
      // If it's a saved search from dashboard (complete search), run it immediately
      if (location.state?.fromDashboard && isSectionComplete(4, savedSearchParams)) {
        // Set to last step to show we're on the final stage
        setActiveStep(4);
        
        // Run the search immediately 
        (async () => {
          await handleFormSubmit(savedSearchParams);
        })();
      }
    }
  }, [savedSearchParams, location.state]);

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

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Call the backend API to generate data
      const response = await propertyAPI.generateProperty(values);
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
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex flex-col">
        <Navbar /> {/* Add Navbar */}
        <Box sx={backgroundStyle} className="flex-grow">
          <Container 
            maxWidth={false} // Changed from "lg" to false
            sx={{ 
              maxWidth: '1400px !important', // Increased max width
              mt: 2 // Added top margin
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 4 },
                  borderRadius: 2,
                  mb: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {!searchSuccess ? (
                  <>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        component="h1"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      >
                        <FaSearch className="me-2" />
                        Property Search
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        Search across multiple databases to verify property information
                      </Typography>
                    </Box>

                    <ProgressIndicator
                      activeStep={activeStep}
                      setActiveStep={setActiveStep}
                      isSectionComplete={isSectionComplete}
                    />

                    {isSubmitting && (
                      <Box sx={{ mb: 4 }}>
                        <LinearProgress />
                        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                          Searching across databases...
                        </Typography>
                      </Box>
                    )}

                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4"
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
                          currentDate={currentDate}
                        />
                      )}

                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          {activeStep > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary me-2"
                              onClick={handlePrevStep}
                            >
                              Previous
                            </button>
                          )}
                          <button
                            type="button"
                              className="btn btn-outline-danger"
                              onClick={handleReset}
                          >
                            Reset
                          </button>
                        </div>
                        
                        <div>
                          {activeStep < 4 ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleNextStep}
                              disabled={!canProceedToNextStep()}
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn btn-success"
                              disabled={isSubmitting || !canProceedToNextStep()}
                            >
                              {isSubmitting ? 'Searching...' : 'Search Property'}
                            </button>
                          )}
                        </div>
                      </Box>
                    </form>
                  </>
                ) : (
                  <ResultsSummary 
                    submittedData={submittedData} 
                    setSearchSuccess={setSearchSuccess} 
                    setSubmittedData={setSubmittedData} 
                    setActiveStep={setActiveStep}
                    user={user}
                  />
                )}
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