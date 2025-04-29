import React, { useState, useCallback, useEffect } from 'react';
import { indianStates, districtsByState, urbanAreasByDistrict } from '../../data/indianStates';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCity, FaHome, FaMapPin } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { stateNameToCode, alternativeStateNames } from '../../utils/stateMappings';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  marginBottom: '20px'
};

// Default center for India
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

// Map click handler component
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    },
  });
  return null;
}

const LocationStep = ({ formik, selectedDistricts, selectedUrbanAreas, selectedTehsils, toggleTooltip, showTooltip }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  
  // Handle map click to place a marker
  const handleMapClick = useCallback((event) => {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    setSelectedLocation({ lat, lng });
    
    // Perform reverse geocoding
    reverseGeocode(lat, lng);
  }, []);
  
  // Reverse geocoding to get address from coordinates using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      setLoadingAddress(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=10`,
        {
          headers: {
            'Accept-Language': 'en-US,en',
            'User-Agent': 'UdaanPropertySearchApp/1.0'
          }
        }
      );
      
      const data = await response.json();
      console.log("Nominatim full response:", data);
      
      if (data && data.address) {
        // Extract state and district from address components
        let state = "";
        let district = "";
        let pinCode = "";
        let city = "";
        let town = "";
        let village = "";
        
        // Extract all potential location identifiers
        if (data.address.state) {
          state = getStateCodeFromName(data.address.state);
        }
        
        console.log("All address components:", data.address);
        
        // Collect potential district names
        const potentialDistricts = [];
        if (data.address.district) potentialDistricts.push(data.address.district);
        if (data.address.county) potentialDistricts.push(data.address.county);
        if (data.address.state_district) potentialDistricts.push(data.address.state_district);
        if (data.address.city_district) potentialDistricts.push(data.address.city_district);
        if (data.address.region) potentialDistricts.push(data.address.region);
        if (data.address.subdistrict) potentialDistricts.push(data.address.subdistrict);

        // Collect potential city/town names
        const potentialCities = [];
        if (data.address.city) {
          city = data.address.city;
          potentialCities.push(data.address.city);
        }
        if (data.address.town) {
          town = data.address.town;
          potentialCities.push(data.address.town);
        }
        if (data.address.suburb) {
          potentialCities.push(data.address.suburb);
        }
        if (data.address.municipality) {
          potentialCities.push(data.address.municipality);
        }
        
        // Get village name if available
        if (data.address.village) {
          village = data.address.village;
          // Also add to potential cities in case it's misclassified
          potentialCities.push(data.address.village);
        }
        
        // Get PIN code if available
        if (data.address.postcode) {
          pinCode = data.address.postcode;
        }
        
        console.log("Potential district names:", potentialDistricts);
        console.log("Potential city/town names:", potentialCities);
        
        // Determine area type based on address components
        const isUrban = !!(data.address.city || data.address.town || data.address.suburb);
        const isRural = !!data.address.village;
        
        // Set area type if it can be determined
        if (isUrban) {
          formik.setFieldValue("areaType", "urban");
        } else if (isRural) {
          formik.setFieldValue("areaType", "rural");
        }
        
        // Update state field
        if (state) {
          formik.setFieldValue("state", state);
          
          // Wait for districts to load before attempting to match
          setTimeout(() => {
            try {
              // Get the districts for the selected state
              const stateDistricts = districtsByState[state] || [];
              console.log("Available districts for state:", stateDistricts);
              
              // Match district name
              let matchedDistrict = null;
              
              // Try to match each potential district name
              for (const potentialDistrict of potentialDistricts) {
                // Clean up the district name
                let cleanDistrict = potentialDistrict
                  .replace(/\s+district$/i, '')
                  .replace(/\s+\(.*\)$/, '')
                  .trim();
                
                console.log(`Trying to match cleaned district: "${cleanDistrict}"`);
                
                // Exact match
                if (stateDistricts.includes(cleanDistrict)) {
                  console.log(`Found exact match for district: ${cleanDistrict}`);
                  matchedDistrict = cleanDistrict;
                  break;
                }
                
                // Case-insensitive match
                const caseInsensitiveMatch = stateDistricts.find(
                  d => d.toLowerCase() === cleanDistrict.toLowerCase()
                );
                
                if (caseInsensitiveMatch) {
                  console.log(`Found case-insensitive match: ${caseInsensitiveMatch}`);
                  matchedDistrict = caseInsensitiveMatch;
                  break;
                }
                
                // Partial match
                for (const availableDistrict of stateDistricts) {
                  if (availableDistrict.toLowerCase().includes(cleanDistrict.toLowerCase()) || 
                      cleanDistrict.toLowerCase().includes(availableDistrict.toLowerCase())) {
                    console.log(`Found partial match: "${cleanDistrict}" matches with "${availableDistrict}"`);
                    matchedDistrict = availableDistrict;
                    break;
                  }
                }
                
                if (matchedDistrict) break;
              }
              
              // Set the matched district
              if (matchedDistrict) {
                formik.setFieldValue("district", matchedDistrict);
                
                // If district is a major city, auto-select it as the city too
                if (isMajorCity(matchedDistrict)) {
                  console.log(`Auto-selecting major city: ${matchedDistrict}`);
                  formik.setFieldValue("areaType", "urban");
                  setTimeout(() => {
                    formik.setFieldValue("cityTown", matchedDistrict);
                  }, 300);
                }
                
                // Now that we have a district, try to match city/town or village
                // Increase timeout to give district selection time to update urban areas
                setTimeout(() => {
                  try {
                    if (formik.values.areaType === 'urban') {
                      // Get available urban areas for this district
                      const urbanAreas = selectedUrbanAreas || [];
                      console.log("Available urban areas for district:", urbanAreas);
                      
                      // Special case: when city name is the same as district name
                      // This is common for major cities like Pune, Mumbai, etc.
                      if (potentialCities.includes(matchedDistrict)) {
                        console.log(`City name matches district name: ${matchedDistrict}`);
                        formik.setFieldValue("cityTown", matchedDistrict);
                        return;
                      }
                      
                      // Try to match city/town
                      let matchedCity = null;
                      
                      // Rest of your existing matching code...
                      // ...
                      
                      // If we've reached here without a match but have potential cities, use the first one
                      if (!matchedCity && potentialCities.length > 0) {
                        console.log(`No match found in urban areas list. Using best available: ${potentialCities[0]}`);
                        formik.setFieldValue("cityTown", potentialCities[0]);
                      }
                    } else if (formik.values.areaType === 'rural') {
                      // Get available tehsils for this district
                      const tehsils = selectedTehsils || [];
                      console.log("Available tehsils for district:", tehsils);
                      
                      // For rural areas, we'd need to match tehsil and village
                      // This would follow a similar pattern as city matching
                      // But requires knowledge of how tehsils are structured in your data
                    }
                  } catch (err) {
                    console.error("Error matching city/town:", err);
                  }
                }, 600); // Increased timeout
              } else {
                console.log("Could not match any district name with available districts");
              }
            } catch (err) {
              console.error("Error matching district:", err);
            }
          }, 500);
        }
        
        // Set PIN code regardless of other matches
        if (pinCode) {
          formik.setFieldValue("pinCode", pinCode);
        }
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    } finally {
      setLoadingAddress(false);
    }
  };
  
  // Helper function to get state code from state name
  const getStateCodeFromName = (stateName) => {
    // First check direct mappings
    if (stateNameToCode[stateName]) {
      return stateNameToCode[stateName];
    }
    
    // Check alternative names
    if (alternativeStateNames[stateName]) {
      return alternativeStateNames[stateName];
    }
    
    // Try to fuzzy match
    for (const [key, value] of Object.entries(stateNameToCode)) {
      if (stateName.includes(key) || key.includes(stateName)) {
        return value;
      }
    }
    
    return "";
  };

  // Helper to check if a district is also a major city
  const isMajorCity = (districtName) => {
    const majorCities = [
      "Pune", "Mumbai", "Mumbai City", "Nagpur", "Thane", "Delhi", 
      "Chennai", "Bengaluru", "Hyderabad", "Kolkata", "Jaipur", 
      "Ahmedabad", "Surat", "Lucknow", "Kanpur", "Patna"
    ];
    
    return majorCities.includes(districtName);
  };

  useEffect(() => {
    // Somewhere in this component or its parent:
    if (formik.values.district) {
      console.log("Current district:", formik.values.district);
      console.log("Urban areas data structure:", JSON.stringify(urbanAreasByDistrict, null, 2));
      console.log("Urban areas for this district:", urbanAreasByDistrict[formik.values.district]);
    }
  }, [formik.values.district]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="step-container"
    >
      <div className="card mb-4 shadow-sm border-primary">
        <div className="card-header bg-gradient-primary text-white">
          <div className="d-flex align-items-center">
            <FaMapMarkerAlt className="me-2 fs-4" />
            <div>
              <h4 className="mb-0">Step 1: Locate the Property</h4>
              <p className="mb-0 small">Specify the geographical area</p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="card-body bg-light mb-3">
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="mb-3">
                <FaMapPin className="me-2" />
                Pin Location on Map
              </h5>
              <div className="map-container">
                <MapContainer 
                  center={defaultCenter} 
                  zoom={5} 
                  style={mapContainerStyle}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onMapClick={handleMapClick} />
                  {selectedLocation && (
                    <Marker position={selectedLocation} />
                  )}
                </MapContainer>
              </div>
              {loadingAddress && (
                <div className="alert alert-info mt-2">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Fetching location details...
                </div>
              )}
              <p className="text-muted mt-2">
                <small>Click on the map to pin a location and automatically fetch state and district information</small>
              </p>
            </div>
          </div>
        </div>

        <div className="card-body bg-light">
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="form-floating">
                <select
                  id="state"
                  name="state"
                  className={`form-select ${formik.touched.state && formik.errors.state ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.state}
                >
                  <option value="">Select State/UT</option>
                  {indianStates.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
                <label htmlFor="state">State / Union Territory *</label>
              </div>
              {formik.touched.state && formik.errors.state && (
                <div className="invalid-feedback">{formik.errors.state}</div>
              )}
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <select
                  id="district"
                  name="district"
                  className={`form-select ${formik.touched.district && formik.errors.district ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.district}
                  disabled={!formik.values.state}
                >
                  <option value="">Select District</option>
                  {selectedDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <label htmlFor="district">District *</label>
              </div>
              {formik.touched.district && formik.errors.district && (
                <div className="invalid-feedback">{formik.errors.district}</div>
              )}
              {!formik.values.state && (
                <div className="form-text text-muted">Please select a state first</div>
              )}
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <label className="form-label fw-bold">
                <FaHome className="me-2" />
                Area Type *
              </label>
              <div className="d-flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`card flex-grow-1 cursor-pointer ${
                    formik.values.areaType === 'urban' ? 'border-primary bg-light' : ''
                  }`}
                  onClick={() => formik.setFieldValue('areaType', 'urban')}
                >
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={formik.values.areaType === 'urban'}
                        onChange={() => {}}
                      />
                      <label className="form-check-label">
                        <FaCity className="me-2" />
                        <span className="fw-bold">Urban</span>
                        <br />
                        <small className="text-muted">City, Town, Municipality</small>
                      </label>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`card flex-grow-1 cursor-pointer ${
                    formik.values.areaType === 'rural' ? 'border-primary bg-light' : ''
                  }`}
                  onClick={() => formik.setFieldValue('areaType', 'rural')}
                >
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={formik.values.areaType === 'rural'}
                        onChange={() => {}}
                      />
                      <label className="form-check-label">
                        <FaHome className="me-2" />
                        <span className="fw-bold">Rural</span>
                        <br />
                        <small className="text-muted">Village, Panchayat</small>
                      </label>
                    </div>
                  </div>
                </motion.div>
              </div>
              {formik.touched.areaType && formik.errors.areaType && (
                <div className="text-danger small mt-1">{formik.errors.areaType}</div>
              )}
            </div>
          </div>

          {formik.values.areaType === 'urban' && (
            <div className="row mb-3 animate__animated animate__fadeIn">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-floating">
                  <select
                    id="cityTown"
                    name="cityTown"
                    className={`form-select ${formik.touched.cityTown && formik.errors.cityTown ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cityTown}
                    disabled={!formik.values.district}
                  >
                    <option value="">Select City/Town</option>
                    {selectedUrbanAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="cityTown">City / Town / Municipal Corp *</label>
                </div>
                {formik.touched.cityTown && formik.errors.cityTown && (
                  <div className="invalid-feedback">{formik.errors.cityTown}</div>
                )}
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    id="locality"
                    name="locality"
                    type="text"
                    className={`form-control ${formik.touched.locality && formik.errors.locality ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.locality}
                    disabled={!formik.values.cityTown}
                    placeholder="Enter locality name"
                  />
                  <label htmlFor="locality">Locality / Ward / Sector *</label>
                </div>
                {formik.touched.locality && formik.errors.locality && (
                  <div className="invalid-feedback">{formik.errors.locality}</div>
                )}
              </div>
            </div>
          )}

          {formik.values.areaType === 'rural' && (
            <div className="row mb-3 animate__animated animate__fadeIn">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-floating">
                  <select
                    id="tehsil"
                    name="tehsil"
                    className={`form-select ${formik.touched.tehsil && formik.errors.tehsil ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tehsil}
                    disabled={!formik.values.district}
                  >
                    <option value="">Select Tehsil/Taluk/Mandal</option>
                    {selectedTehsils.map((tehsil) => (
                      <option key={tehsil} value={tehsil}>
                        {tehsil}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="tehsil">Tehsil / Taluk / Mandal *</label>
                </div>
                {formik.touched.tehsil && formik.errors.tehsil && (
                  <div className="invalid-feedback">{formik.errors.tehsil}</div>
                )}
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    id="village"
                    name="village"
                    className={`form-select ${formik.touched.village && formik.errors.village ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.village}
                    disabled={!formik.values.tehsil}
                  >
                    <option value="">Select Village/Panchayat</option>
                    {formik.values.tehsil &&
                      (formik.values.tehsil in window.villagesByTehsil
                        ? window.villagesByTehsil[formik.values.tehsil].map((village) => (
                            <option key={village} value={village}>
                              {village}
                            </option>
                          ))
                        : [])}
                  </select>
                  <label htmlFor="village">Village / Panchayat *</label>
                </div>
                {formik.touched.village && formik.errors.village && (
                  <div className="invalid-feedback">{formik.errors.village}</div>
                )}
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  id="pinCode"
                  name="pinCode"
                  type="text"
                  className={`form-control ${formik.touched.pinCode && formik.errors.pinCode ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.pinCode}
                  maxLength={6}
                  placeholder="6-digit PIN code"
                />
                <label htmlFor="pinCode">Pin Code <span className="text-muted">(Optional)</span></label>
              </div>
              {formik.touched.pinCode && formik.errors.pinCode && (
                <div className="invalid-feedback">{formik.errors.pinCode}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationStep;