import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBuilding, FaUser, FaIdCard, FaFileAlt, FaIndustry } from 'react-icons/fa';
import { Box, Paper, Typography } from '@mui/material';

const searchMethods = [
  {
    id: 'propertyAddress',
    label: 'Property Address Details',
    desc: 'Use specific address elements',
    icon: FaBuilding
  },
  {
    id: 'ownerName',
    label: 'Owner / Party Name',
    desc: 'Use the name of the person/entity associated',
    icon: FaUser
  },
  {
    id: 'propertyIdentifier',
    label: 'Property Identifier',
    desc: 'Use unique ID like Khasra, Khata, Municipal No., etc.',
    icon: FaIdCard
  },
  {
    id: 'registrationDetails',
    label: 'Registration Details',
    desc: 'Use Deed/Document number and SRO',
    icon: FaFileAlt
  },
  {
    id: 'companyName',
    label: 'Company Name',
    desc: 'Find properties linked to a company',
    icon: FaIndustry
  }
];

const SearchMethodStep = ({ formik }) => {
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
          backgroundColor: 'rgba(255, 255, 255, 0.98)'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ 
            color: 'primary.main', 
            mb: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontWeight: 500 
          }}>
            <FaSearch className="me-2" />
            Select Search Method
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Choose how you want to search for the property
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr' 
          },
          gap: 3 
        }}>
          {searchMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Paper
                elevation={formik.values.searchMethod === method.id ? 3 : 1}
                onClick={() => formik.setFieldValue('searchMethod', method.id)}
                sx={{
                  p: 3,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid',
                  borderColor: formik.values.searchMethod === method.id ? 
                    'primary.main' : 'transparent',
                  backgroundColor: formik.values.searchMethod === method.id ?
                    'rgba(33, 150, 243, 0.04)' : '#fff',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    backgroundColor: 'rgba(33, 150, 243, 0.02)',
                    '& .method-icon': {
                      transform: 'scale(1.1)',
                      color: '#2196f3'
                    }
                  }
                }}
              >
                <Box 
                  className="method-icon"
                  sx={{ 
                    color: formik.values.searchMethod === method.id ? 
                      'primary.main' : 'text.secondary',
                    fontSize: '2rem',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    // Using our own color directly for customization
                    ...(formik.values.searchMethod === method.id && {
                      color: '#26a69a'
                    }),
                  }}
                >
                  <method.icon />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: formik.values.searchMethod === method.id ?
                      'primary.main' : 'text.primary'
                  }}
                >
                  {method.label}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.4
                  }}
                >
                  {method.desc}
                </Typography>
                {formik.values.searchMethod === method.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.8rem'
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Paper>
            </motion.div>
          ))}
        </Box>

        {formik.touched.searchMethod && formik.errors.searchMethod && (
          <Typography 
            color="error" 
            variant="body2" 
            sx={{ 
              mt: 2,
              textAlign: 'center' 
            }}
          >
            {formik.errors.searchMethod}
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
};

export default SearchMethodStep;