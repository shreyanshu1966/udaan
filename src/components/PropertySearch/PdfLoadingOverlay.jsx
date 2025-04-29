import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PdfLoadingOverlay = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-5 rounded-lg shadow-lg text-center"
            style={{
              maxWidth: '300px',
              width: '90%'
            }}
          >
            <div className="spinner-border text-primary mb-3" 
              style={{ 
                width: '3rem', 
                height: '3rem',
                borderWidth: '0.25rem'
              }} 
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h6 className="mb-2 font-weight-bold">Generating PDF</h6>
            <p className="mb-0 text-muted small">Please wait while we prepare your document...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PdfLoadingOverlay;