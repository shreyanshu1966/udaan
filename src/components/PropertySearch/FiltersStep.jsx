import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { propertyTypes } from '../../data/indianStates';
import { motion } from 'framer-motion';
import { Box, Paper, Typography, FormControl, Select, MenuItem, Alert } from '@mui/material';
import { FaFilter, FaCalendar, FaHome } from 'react-icons/fa';

const FiltersStep = ({ formik, indianStates }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="step-container"
    >
      <Paper 
        elevation={3} 
        className="p-4 mb-4"
        sx={{
          borderRadius: 2,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          }
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaFilter className="me-2" />
            Refine Your Search
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Add optional filters to narrow down your search results
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
              <FaHome className="me-2" />
              Property Type
            </Typography>
            <FormControl fullWidth>
              <Select
                id="propertyType"
                name="propertyType"
                value={formik.values.propertyType}
                onChange={formik.handleChange}
                sx={{
                  '& .MuiSelect-select': {
                    padding: '15px',
                    borderRadius: '8px'
                  },
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }
                }}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Filter by specific property category
              </Typography>
            </FormControl>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
              <FaCalendar className="me-2" />
              Registration Date Range
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Useful for finding recent transactions or properties registered in a specific period
            </Typography>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <Typography variant="subtitle2" sx={{ mb: 1 }}>From</Typography>
                <DatePicker
                  id="registrationDateFrom"
                  selected={formik.values.registrationDateFrom}
                  onChange={(date) => formik.setFieldValue('registrationDateFrom', date)}
                  className="form-control date-picker-custom"
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={30}
                  placeholderText="Select start date"
                  customInput={
                    <input
                      className="form-control"
                      style={{
                        height: '48px',
                        borderColor: '#e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  }
                />
              </div>
              <div className="col-md-6">
                <Typography variant="subtitle2" sx={{ mb: 1 }}>To</Typography>
                <DatePicker
                  id="registrationDateTo"
                  selected={formik.values.registrationDateTo}
                  onChange={(date) => formik.setFieldValue('registrationDateTo', date)}
                  className="form-control date-picker-custom"
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  minDate={formik.values.registrationDateFrom}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={30}
                  disabled={!formik.values.registrationDateFrom}
                  placeholderText={formik.values.registrationDateFrom ? "Select end date" : "Select start date first"}
                  customInput={
                    <input
                      className="form-control"
                      style={{
                        height: '48px',
                        borderColor: '#e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  }
                />
              </div>
            </div>
          </Box>
        </Box>

        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            },
            backgroundColor: 'rgba(33, 150, 243, 0.08)',
            border: '1px solid rgba(33, 150, 243, 0.2)'
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Ready to submit your search
          </Typography>
          <Typography variant="body2">
            You've entered information for a property {' '}
            {formik.values.areaType === 'urban' 
              ? `in ${formik.values.cityTown}, ${indianStates.find(s => s.value === formik.values.state)?.label}` 
              : formik.values.areaType === 'rural'
                ? `in ${formik.values.village}, ${formik.values.tehsil} tehsil, ${indianStates.find(s => s.value === formik.values.state)?.label}`
                : ''
            }.
            Click "Search Property" below to submit your query.
          </Typography>
        </Alert>
      </Paper>
    </motion.div>
  );
};

export default FiltersStep;