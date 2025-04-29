import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

const SaveSearchModal = ({ isOpen, onClose, searchData }) => {
  const [searchName, setSearchName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  const handleSave = async () => {
    if (!searchName.trim()) {
      setError('Please enter a name for this search');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // Prepare the data to save
      const dataToSave = {
        searchName,
        searchParams: {
          // Location information
          state: searchData.state,
          district: searchData.district,
          areaType: searchData.areaType,
          cityTown: searchData.cityTown || '',
          locality: searchData.locality || '',
          tehsil: searchData.tehsil || '',
          village: searchData.village || '',
          pinCode: searchData.pinCode || '',
          
          // Search method and details
          searchMethod: searchData.searchMethod,
          plotNumber: searchData.plotNumber || '',
          buildingName: searchData.buildingName || '',
          streetName: searchData.streetName || '',
          ownerName: searchData.ownerName || '',
          fatherHusbandName: searchData.fatherHusbandName || '',
          identifierType: searchData.identifierType || '',
          identifierValue: searchData.identifierValue || '',
          sro: searchData.sro || '',
          documentNumber: searchData.documentNumber || '',
          registrationYear: searchData.registrationYear || '',
          companyName: searchData.companyName || '',
          cinLlpin: searchData.cinLlpin || '',
          
          // Filters
          propertyType: searchData.propertyType || 'Any',
          registrationDateFrom: searchData.registrationDateFrom || null,
          registrationDateTo: searchData.registrationDateTo || null,
        },
        // Store a summary of results for quick reference
        searchResults: {
          propertyId: searchData.generatedData?.propertyId || searchData.generatedData?.doris?.propertyID,
          summary: {
            ownerName: searchData.generatedData?.doris?.ownerName || 'N/A',
            propertyId: searchData.generatedData?.propertyId || searchData.generatedData?.doris?.propertyID || 'N/A',
            propertyAddress: searchData.generatedData?.doris?.propertyAddress || 'N/A',
            propertyType: searchData.generatedData?.doris?.landType || 'N/A',
            district: searchData.district || 'N/A',
            state: searchData.state || 'N/A'
          }
        }
      };
      
      await axios.post('http://localhost:5000/api/saved-searches', dataToSave, config);
      
      setSuccess('Search saved successfully!');
      
      // Reset form and close modal after a delay
      setTimeout(() => {
        setSearchName('');
        setSuccess('');
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving search:', error);
      setError('Failed to save search. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header className="bg-light">
        <Modal.Title className="text-primary">
          <FaSave className="me-2" />
          Save This Search
        </Modal.Title>
        <Button variant="light" onClick={onClose} className="btn-close" />
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form.Group className="mb-3">
          <Form.Label>Search Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="E.g., Mumbai Property Search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            disabled={saving || success}
          />
          <Form.Text className="text-muted">
            Give your search a descriptive name so you can find it easily later.
          </Form.Text>
        </Form.Group>
        
        <div className="mb-3">
          <h6 className="mb-2">Search Summary</h6>
          <div className="p-2 bg-light rounded">
            <p className="mb-1">
              <strong>Location:</strong> {searchData.district}, {searchData.state}
            </p>
            <p className="mb-1">
              <strong>Search Method:</strong> {
                searchData.searchMethod === 'propertyAddress' ? 'Property Address' :
                searchData.searchMethod === 'ownerName' ? 'Owner/Party Name' :
                searchData.searchMethod === 'propertyIdentifier' ? 'Property Identifier' :
                searchData.searchMethod === 'registrationDetails' ? 'Registration Details' :
                searchData.searchMethod === 'companyName' ? 'Company Name' : 
                searchData.searchMethod
              }
            </p>
            {searchData.generatedData?.doris?.propertyID && (
              <p className="mb-0">
                <strong>Property ID:</strong> {searchData.generatedData.doris.propertyID}
              </p>
            )}
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
          <FaTimes className="me-1" /> Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={saving || !searchName.trim() || !!success}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="me-1" /> Save Search
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SaveSearchModal;