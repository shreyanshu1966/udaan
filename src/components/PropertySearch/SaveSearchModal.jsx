import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import { savedSearchAPI } from '../../utils/api';

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
      
      // Prepare the data to save
      const dataToSave = {
        searchName,
        searchParams: searchData,
        searchResults: {
          propertyId: searchData.generatedData?.propertyId || searchData.generatedData?.doris?.propertyId,
          ownerName: searchData.generatedData?.doris?.ownerName,
          propertyAddress: `${searchData.generatedData?.doris?.plotNumber || ''} ${searchData.generatedData?.doris?.streetName || ''}`.trim(),
          propertyType: searchData.generatedData?.doris?.propertyType,
          district: searchData.district,
          state: searchData.state
        }
      };
      
      // Call API to save search
      await savedSearchAPI.saveSearch(dataToSave);
      
      setSuccess('Search saved successfully!');
      
      // Reset form
      setSearchName('');
      
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error saving search:', error);
      setError('Failed to save search. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaSave className="me-2" />
          Save Search
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form.Group className="mb-3">
          <Form.Label>Search Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a name for this search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            disabled={saving}
          />
          <Form.Text className="text-muted">
            Give your search a descriptive name so you can find it later.
          </Form.Text>
        </Form.Group>
        
        <div className="d-flex mt-4">
          <small className="text-muted">
            <em>Saving this search will allow you to access it later from your dashboard.</em>
          </small>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          variant="outline-secondary"
          onClick={onClose}
          disabled={saving}
        >
          <FaTimes className="me-1" /> Cancel
        </Button>
        
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Search'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SaveSearchModal;