import React from 'react';
import logo from '@/assets/OP-LOGO-(NAVBAR).png';

const PdfTemplate = ({ data }) => {
  const formatDate = (date) => {
    if (!date || date === 'N/A') return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    // Add relative positioning to parent container
    <div className="relative">
      {/* Background Logo/Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 0,
          opacity: 0.03,
          transform: 'rotate(-30deg) scale(2.5)',
        }}
      >
        <img
          src={logo}
          alt=""
          className="w-96 h-96 object-contain"
        />
      </div>

      {/* Main Content */}
      <div 
        id="pdfTemplate" 
        className="p-8 bg-white relative"
        style={{ 
          fontFamily: 'Arial, sans-serif',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div className="flex items-center">
            <img src={logo} alt="Omniprop Logo" className="h-16 w-16 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-primary">OMNIPROP</h1>
              <p className="text-gray-600">Property Search Report</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Report Generated:</p>
            <p className="font-semibold">{formatDate(new Date())}</p>
            <p className="text-sm text-gray-500">Report ID: {data.doris?.propertyID || 'N/A'}</p>
          </div>
        </div>

        {/* DORIS Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            DORIS - Property Registration Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="info-group">
              <p className="text-gray-600">Owner Name</p>
              <p className="font-semibold">{data.doris?.ownerName}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Document Number</p>
              <p className="font-semibold">{data.doris?.documentNumber}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Registration Date</p>
              <p className="font-semibold">{formatDate(data.doris?.registrationDate)}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Property ID</p>
              <p className="font-semibold">{data.doris?.propertyID}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Land Type</p>
              <p className="font-semibold">{data.doris?.landType}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Land Area</p>
              <p className="font-semibold">{data.doris?.landArea}</p>
            </div>
          </div>
        </div>

        {/* DLR Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            DLR - Land Records
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="info-group">
              <p className="text-gray-600">Khasra Number</p>
              <p className="font-semibold">{data.dlr?.khasraNumber}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Khata Number</p>
              <p className="font-semibold">{data.dlr?.khataNumber}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Plot Number</p>
              <p className="font-semibold">{data.dlr?.plotNumber}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Land Use Type</p>
              <p className="font-semibold">{data.dlr?.landUseType}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Mutation Status</p>
              <p className="font-semibold">{data.dlr?.mutationStatus}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Last Updated</p>
              <p className="font-semibold">{formatDate(data.dlr?.lastUpdated)}</p>
            </div>
          </div>
        </div>

        {/* CERSAI Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            CERSAI - Encumbrance Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="info-group">
              <p className="text-gray-600">Mortgage Status</p>
              <p className="font-semibold">{data.cersai?.isMortgaged ? 'Yes' : 'No'}</p>
            </div>
            {data.cersai?.isMortgaged && (
              <>
                <div className="info-group">
                  <p className="text-gray-600">Bank Name</p>
                  <p className="font-semibold">{data.cersai?.bankName}</p>
                </div>
                <div className="info-group">
                  <p className="text-gray-600">Loan Amount</p>
                  <p className="font-semibold">{data.cersai?.loanAmount}</p>
                </div>
                <div className="info-group">
                  <p className="text-gray-600">Loan Type</p>
                  <p className="font-semibold">{data.cersai?.loanType}</p>
                </div>
                <div className="info-group">
                  <p className="text-gray-600">Loan Start Date</p>
                  <p className="font-semibold">{formatDate(data.cersai?.loanStartDate)}</p>
                </div>
                <div className="info-group">
                  <p className="text-gray-600">Loan End Date</p>
                  <p className="font-semibold">{formatDate(data.cersai?.loanEndDate)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* MCA21 Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            MCA21 - Company Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="info-group">
              <p className="text-gray-600">Company Name</p>
              <p className="font-semibold">{data.mca21?.companyName}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">CIN</p>
              <p className="font-semibold">{data.mca21?.companyCIN}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Company Type</p>
              <p className="font-semibold">{data.mca21?.companyType}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Status</p>
              <p className="font-semibold">{data.mca21?.status}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Director Name</p>
              <p className="font-semibold">{data.mca21?.directorName}</p>
            </div>
            <div className="info-group">
              <p className="text-gray-600">Incorporation Date</p>
              <p className="font-semibold">{formatDate(data.mca21?.incorporationDate)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center text-gray-600">
          <p className="text-sm">This document is computer generated and does not require physical signature.</p>
          <p className="text-sm mt-2">Report generated by OMNIPROP Property Search System</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>For verification, please visit www.omniprop.com</p>
            <p>Contact: support@omniprop.com | Tel: +91-XXXXXXXXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfTemplate;