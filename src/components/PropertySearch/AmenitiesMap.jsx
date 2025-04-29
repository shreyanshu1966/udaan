import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Box, Typography, ButtonGroup, Button, Slider } from '@mui/material';
import { FaSchool, FaHospital, FaSubway, FaShoppingCart, FaUtensils } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for different amenity types
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// Component to recenter map when property location changes
function SetViewOnChange({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  
  return null;
}

const amenityTypes = [
  { id: 'school', label: 'Schools', icon: <FaSchool />, color: '#FF5722', osmTag: 'amenity=school' },
  { id: 'hospital', label: 'Healthcare', icon: <FaHospital />, color: '#E91E63', osmTag: 'amenity=hospital' },
  { id: 'transport', label: 'Transportation', icon: <FaSubway />, color: '#2196F3', osmTag: 'public_transport=station' },
  { id: 'shopping', label: 'Shopping', icon: <FaShoppingCart />, color: '#4CAF50', osmTag: 'shop=supermarket' },
  { id: 'food', label: 'Restaurants', icon: <FaUtensils />, color: '#FFC107', osmTag: 'amenity=restaurant' }
];

const AmenitiesMap = ({ propertyLocation }) => {
  const [places, setPlaces] = useState([]);
  const [selectedType, setSelectedType] = useState('school');
  const [radius, setRadius] = useState(1000); // 1km default
  const [loading, setLoading] = useState(false);
  
  // Fetch amenities using Overpass API
  useEffect(() => {
    const fetchAmenities = async () => {
      setLoading(true);
      try {
        const currentType = amenityTypes.find(type => type.id === selectedType);
        
        // Overpass API query
        const query = `
          [out:json][timeout:25];
          (
            node["${currentType.osmTag.split('=')[0]}"]
            ["${currentType.osmTag.split('=')[0]}"="${currentType.osmTag.split('=')[1]}"]
            (around:${radius},${propertyLocation.lat},${propertyLocation.lng});
          );
          out body;
          >;
          out skel qt;
        `;
        
        const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        if (response.data && response.data.elements) {
          setPlaces(response.data.elements);
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (propertyLocation?.lat && propertyLocation?.lng) {
      fetchAmenities();
    }
  }, [propertyLocation, selectedType, radius]);

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
  };

  const handleRadiusChange = (event, newValue) => {
    setRadius(newValue);
  };
  
  const currentTypeInfo = amenityTypes.find(type => type.id === selectedType);
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Nearby Amenities
      </Typography>
      
      {propertyLocation.isPinpointed ? (
        <div className="alert alert-success mb-3 small">
          <i className="bi bi-pin-map me-2"></i>
          Using exact location pinpointed on map
        </div>
      ) : (
        <div className="alert alert-info mb-3 small">
          <i className="bi bi-info-circle me-2"></i>
          Using approximate coordinates based on property data
        </div>
      )}
      
      <Box sx={{ mb: 2 }}>
        <ButtonGroup variant="outlined" fullWidth>
          {amenityTypes.map(type => (
            <Button 
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              variant={selectedType === type.id ? "contained" : "outlined"}
              startIcon={type.icon}
              style={{ backgroundColor: selectedType === type.id ? type.color : 'transparent', 
                      color: selectedType === type.id ? 'white' : type.color,
                      borderColor: type.color }}
            >
              {type.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>Search Radius: {radius/1000} km</Typography>
        <Slider
          value={radius}
          onChange={handleRadiusChange}
          min={500}
          max={5000}
          step={500}
          marks
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value/1000} km`}
          style={{ color: currentTypeInfo.color }}
        />
      </Box>
      
      <Box sx={{ height: 400, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer 
          center={[propertyLocation.lat, propertyLocation.lng]} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <SetViewOnChange center={[propertyLocation.lat, propertyLocation.lng]} />
          
          {/* Property marker */}
          <Marker 
            position={[propertyLocation.lat, propertyLocation.lng]} 
            icon={L.divIcon({
              className: 'property-marker',
              html: `<div style="background-color: #2c3e50; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white;"></div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })}
          >
            <Popup>
              <Typography variant="subtitle2">Property Location</Typography>
            </Popup>
          </Marker>
          
          {/* Radius circle */}
          <Circle 
            center={[propertyLocation.lat, propertyLocation.lng]}
            radius={radius}
            pathOptions={{ 
              fillColor: currentTypeInfo.color,
              fillOpacity: 0.1,
              color: currentTypeInfo.color,
              weight: 1
            }}
          />
          
          {/* Amenity markers */}
          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
              icon={createCustomIcon(currentTypeInfo.color)}
            >
              <Popup>
                <Typography variant="subtitle2">{place.tags?.name || 'Unnamed location'}</Typography>
                <Typography variant="body2">
                  {Object.entries(place.tags || {})
                    .filter(([key]) => !key.includes('name') && !key.includes('source'))
                    .slice(0, 3)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </Typography>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
      
      {loading && (
        <Box sx={{ mt: 2 }}>
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <Typography>Loading amenities...</Typography>
          </div>
        </Box>
      )}
      
      {!loading && places.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">
            Found {places.length} {currentTypeInfo.label.toLowerCase()} within {radius/1000} km
          </Typography>
        </Box>
      )}
      
      {!loading && places.length === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            No {currentTypeInfo.label.toLowerCase()} found within this radius
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AmenitiesMap;