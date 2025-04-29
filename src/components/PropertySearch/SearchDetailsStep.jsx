import React from 'react';
import { identifierTypes } from '../../data/indianStates';
import { generateYearOptions } from './utils';
import { motion } from 'framer-motion';
import { Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { FaMapMarked, FaUserAlt, FaIdCard, FaFileAlt, FaBuilding } from 'react-icons/fa';

const SearchDetailsStep = ({ formik }) => {
  const getStepIcon = (searchMethod) => {
    switch (searchMethod) {
      case 'propertyAddress': return <FaMapMarked />;
      case 'ownerName': return <FaUserAlt />;
      case 'propertyIdentifier': return <FaIdCard />;
      case 'registrationDetails': return <FaFileAlt />;
      case 'companyName': return <FaBuilding />;
      default: return null;
    }
  };

  const getStepTitle = (searchMethod) => {
    switch (searchMethod) {
      case 'propertyAddress': return 'Property Address Details';
      case 'ownerName': return 'Owner / Party Name Details';
      case 'propertyIdentifier': return 'Property Identifier Details';
      case 'registrationDetails': return 'Registration Document Details';
      case 'companyName': return 'Company Information';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="step-container"
    >
      <Paper elevation={2} className="p-4 mb-4">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStepIcon(formik.values.searchMethod)}
            {getStepTitle(formik.values.searchMethod)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Please provide the specific details for your selected search method
          </Typography>
        </Box>

        {/* Property Address Form Fields */}
        {formik.values.searchMethod === 'propertyAddress' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Enter as many details as possible for better results
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Plot / House / Flat Number"
                id="plotNumber"
                name="plotNumber"
                value={formik.values.plotNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="E.g., 42, Flat 301, etc."
                helperText="Recommended for better results"
              />

              <TextField
                fullWidth
                label="Building / Apartment Name"
                id="buildingName"
                name="buildingName"
                value={formik.values.buildingName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="E.g., Sunshine Towers"
              />

              <TextField
                fullWidth
                label="Street / Road Name"
                id="streetName"
                name="streetName"
                value={formik.values.streetName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="E.g., Gandhi Road"
              />
            </Box>
          </motion.div>
        )}

        {/* Owner Name Form Fields */}
        {formik.values.searchMethod === 'ownerName' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Enter the full name exactly as it appears in property records
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                required
                fullWidth
                label="Full Name of Owner / Party"
                id="ownerName"
                name="ownerName"
                value={formik.values.ownerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                helperText={formik.touched.ownerName && formik.errors.ownerName}
                placeholder="Enter full name as in documents"
              />

              <TextField
                fullWidth
                label="Father's / Husband's Name"
                id="fatherHusbandName"
                name="fatherHusbandName"
                value={formik.values.fatherHusbandName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Helps distinguish common names"
                helperText="Optional"
              />
            </Box>
          </motion.div>
        )}

        {/* Property Identifier Form Fields */}
        {formik.values.searchMethod === 'propertyIdentifier' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Select the type of identifier and enter its value exactly as it appears in documents
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="identifierType-label">Identifier Type *</InputLabel>
                <Select
                  labelId="identifierType-label"
                  id="identifierType"
                  name="identifierType"
                  value={formik.values.identifierType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.identifierType && Boolean(formik.errors.identifierType)}
                  label="Identifier Type *"
                >
                  <MenuItem value="">Select Identifier Type</MenuItem>
                  {identifierTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                required
                fullWidth
                label="Identifier Value"
                id="identifierValue"
                name="identifierValue"
                value={formik.values.identifierValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.identifierValue && Boolean(formik.errors.identifierValue)}
                helperText={formik.touched.identifierValue && formik.errors.identifierValue}
                placeholder="Enter the exact value"
              />
            </Box>
          </motion.div>
        )}

        {/* Registration Details Form Fields */}
        {formik.values.searchMethod === 'registrationDetails' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Enter the document number and Sub-Registrar Office where it was registered
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="sro-label">Sub-Registrar Office (SRO) *</InputLabel>
                <Select
                  labelId="sro-label"
                  id="sro"
                  name="sro"
                  value={formik.values.sro}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sro && Boolean(formik.errors.sro)}
                  label="Sub-Registrar Office (SRO) *"
                >
                  <MenuItem value="">Select SRO</MenuItem>
                  {formik.values.district && (
                    <MenuItem value={`SRO-${formik.values.district}`}>
                      SRO-{formik.values.district}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <TextField
                required
                fullWidth
                label="Document / Deed Number"
                id="documentNumber"
                name="documentNumber"
                value={formik.values.documentNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.documentNumber && Boolean(formik.errors.documentNumber)}
                helperText={formik.touched.documentNumber && formik.errors.documentNumber}
                placeholder="E.g., 1234/2024"
              />

              <FormControl fullWidth>
                <InputLabel id="registrationYear-label">Year of Registration *</InputLabel>
                <Select
                  labelId="registrationYear-label"
                  id="registrationYear"
                  name="registrationYear"
                  value={formik.values.registrationYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.registrationYear && Boolean(formik.errors.registrationYear)}
                  label="Year of Registration *"
                >
                  <MenuItem value="">Select Year</MenuItem>
                  {generateYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </motion.div>
        )}

        {/* Company Name Form Fields */}
        {formik.values.searchMethod === 'companyName' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Enter the exact company name. Adding the CIN/LLPIN will improve accuracy.
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                required
                fullWidth
                label="Company Name"
                id="companyName"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
                placeholder="Enter full registered company name"
              />

              <TextField
                fullWidth
                label="CIN / LLPIN"
                id="cinLlpin"
                name="cinLlpin"
                value={formik.values.cinLlpin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="E.g., U74999MH2018PTC123456"
                helperText="Recommended for better accuracy"
                inputProps={{ maxLength: 21 }}
              />
            </Box>
          </motion.div>
        )}
      </Paper>
    </motion.div>
  );
};

export default SearchDetailsStep;