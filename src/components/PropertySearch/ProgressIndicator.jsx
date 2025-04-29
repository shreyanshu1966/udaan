import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { FaMapMarkerAlt, FaSearch, FaClipboardList, FaFilter } from 'react-icons/fa';

const ProgressIndicator = ({ activeStep, setActiveStep, isSectionComplete }) => {
  const steps = [
    { number: 1, label: 'Location', icon: FaMapMarkerAlt },
    { number: 2, label: 'Search Method', icon: FaSearch },
    { number: 3, label: 'Details', icon: FaClipboardList },
    { number: 4, label: 'Filters', icon: FaFilter }
  ];

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', mb: 1 }}>
        {/* Progress Line */}
        <Box
          sx={{
            position: 'absolute',
            top: '20px',
            left: '10%',
            right: '10%',
            height: '3px',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            borderRadius: '4px',
            zIndex: 0
          }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((activeStep - 1) / 3) * 100}%`,
              backgroundColor: '#2196f3'
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              height: '100%',
              borderRadius: '4px'
            }}
          />
        </Box>

        {/* Steps */}
        {steps.map((step) => (
          <motion.div
            key={step.number}
            initial={{ scale: 0.9, y: 0 }}
            animate={{ 
              scale: activeStep === step.number ? 1.1 : 1,
              y: activeStep === step.number ? -4 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{ 
              flex: 1, 
              textAlign: 'center',
              cursor: step.number <= activeStep ? 'pointer' : 'default',
              zIndex: 1,
              position: 'relative'
            }}
            onClick={() => {
              if (step.number <= activeStep) {
                setActiveStep(step.number);
              }
            }}
            whileHover={step.number <= activeStep ? { y: -6 } : {}}
          >
            <motion.div
              initial={false}
              animate={{
                scale: isSectionComplete(step.number) ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  backgroundColor: step.number < activeStep ? '#4caf50' :
                                 step.number === activeStep ? '#2196f3' : '#fff',
                  border: '2px solid',
                  borderColor: step.number <= activeStep ? 
                             step.number === activeStep ? '#2196f3' : '#4caf50' : '#e0e0e0',
                  color: step.number <= activeStep ? '#fff' : '#757575',
                  transition: 'all 0.3s ease',
                  boxShadow: step.number === activeStep ? '0 0 0 4px rgba(33, 150, 243, 0.2)' : 'none',
                  fontSize: '1.2rem'
                }}
              >
                {isSectionComplete(step.number) ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    ✓
                  </motion.div>
                ) : (
                  <step.icon />
                )}
              </Box>
            </motion.div>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: step.number <= activeStep ? 'text.primary' : 'text.disabled',
                fontWeight: step.number === activeStep ? 600 : 400,
                transition: 'all 0.3s ease'
              }}
            >
              {step.label}
            </Typography>
            {step.number === activeStep && (
              <motion.div
                layoutId="activeStep"
                style={{
                  width: '100%',
                  height: '2px',
                  background: '#2196f3',
                  position: 'absolute',
                  bottom: '-4px',
                  borderRadius: '2px'
                }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default ProgressIndicator;