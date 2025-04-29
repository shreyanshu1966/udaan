import React from 'react';

const ProgressIndicator = ({ activeStep, setActiveStep, isSectionComplete }) => {
  return (
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
  );
};

export default ProgressIndicator;