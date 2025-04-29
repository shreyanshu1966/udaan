import React from 'react';

const PdfLoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
    >
      <div 
        className="bg-white p-4 rounded shadow-lg text-center"
      >
        <div className="spinner-border text-primary mb-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mb-0">Generating PDF...</p>
      </div>
    </div>
  );
};

export default PdfLoadingOverlay;