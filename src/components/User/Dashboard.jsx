import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { savedSearchAPI } from '../../utils/api';
import { 
  Box, Container, Typography, Paper, Tabs, Tab, Button, 
  Divider, Card, CardContent, Grid, Chip, IconButton, 
  Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaSearch, FaHistory, FaUserCircle, FaTrash, FaEdit, FaExternalLinkAlt } from 'react-icons/fa';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { formatDate } from '../PropertySearch/utils';

const Dashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchesLoading, setSearchesLoading] = useState(true);
  const [searchesError, setSearchesError] = useState(null);
  const [renameDialog, setRenameDialog] = useState({ open: false, id: null, name: '' });
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch saved searches
  useEffect(() => {
    const fetchSavedSearches = async () => {
      if (!user) return;
      
      try {
        setSearchesLoading(true);
        
        const response = await savedSearchAPI.getAllSearches();
        setSavedSearches(response.data);
        setSearchesError(null);
      } catch (error) {
        console.error('Error fetching saved searches:', error);
        setSearchesError('Failed to load your saved searches');
      } finally {
        setSearchesLoading(false);
      }
    };
    
    fetchSavedSearches();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const deleteSearch = async (id) => {
    if (!window.confirm('Are you sure you want to delete this saved search?')) return;
    
    try {
      await savedSearchAPI.deleteSearch(id);
      
      // Update state
      setSavedSearches(savedSearches.filter(search => search._id !== id));
    } catch (error) {
      console.error('Error deleting saved search:', error);
      alert('Failed to delete saved search');
    }
  };

  const openRenameDialog = (id, name) => {
    setRenameDialog({ open: true, id, name });
  };

  const handleRenameSearch = async () => {
    try {
      await savedSearchAPI.updateSearch(
        renameDialog.id, 
        { searchName: renameDialog.name }
      );
      
      // Update state
      setSavedSearches(savedSearches.map(search => 
        search._id === renameDialog.id 
          ? { ...search, searchName: renameDialog.name } 
          : search
      ));
      
      setRenameDialog({ open: false, id: null, name: '' });
    } catch (error) {
      console.error('Error renaming saved search:', error);
      alert('Failed to rename saved search');
    }
  };

  const runSavedSearch = (searchParams) => {
    // Navigate to search page with saved parameters and fromDashboard flag
    navigate('/search', { 
      state: { 
        savedSearchParams: searchParams,
        fromDashboard: true 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your dashboard...</p>
      </div>
    );
  }

  const formatSearchMethodName = (method) => {
    return method === 'propertyAddress' ? 'Property Address' :
    method === 'ownerName' ? 'Owner/Party Name' :
    method === 'propertyIdentifier' ? 'Property Identifier' :
    method === 'registrationDetails' ? 'Registration Details' :
    method === 'companyName' ? 'Company Name' : 
    method;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="lg">
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                <FaUserCircle className="me-2" /> My Dashboard
              </Typography>
              <Typography variant="body1">
                Welcome back, {user?.name}!
              </Typography>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs">
                <Tab icon={<FaSearch />} label="Saved Searches" iconPosition="start" />
                <Tab icon={<FaHistory />} label="Search History" iconPosition="start" />
                <Tab icon={<FaUserCircle />} label="My Profile" iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* Saved Searches Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Your Saved Searches
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FaSearch />}
                    onClick={() => navigate('/search')}
                  >
                    New Search
                  </Button>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {searchesLoading ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <Typography sx={{ mt: 2 }}>Loading your saved searches...</Typography>
                  </Box>
                ) : searchesError ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="error">{searchesError}</Typography>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      sx={{ mt: 2 }}
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </Box>
                ) : savedSearches.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">You don't have any saved searches yet</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      Save your searches to quickly access them later
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/search')}
                    >
                      Start Your First Search
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {savedSearches.map((search) => (
                      <Grid item xs={12} md={6} key={search._id}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            '&:hover': { boxShadow: 4 },
                            transition: 'box-shadow 0.3s ease'
                          }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                  {search.searchName}
                                </Typography>
                                <Box>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => openRenameDialog(search._id, search.searchName)}
                                    title="Rename"
                                  >
                                    <FaEdit />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error" 
                                    onClick={() => deleteSearch(search._id)}
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </IconButton>
                                </Box>
                              </Box>
                              
                              <Chip 
                                label={formatSearchMethodName(search.searchParams.searchMethod)} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                                sx={{ mb: 2 }} 
                              />
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Location:</strong> {search.searchParams.district}, {search.searchParams.state}
                                </Typography>
                                
                                {search.searchParams.searchMethod === 'propertyAddress' && (
                                  <Typography variant="body2" color="text.secondary">
                                    {search.searchParams.plotNumber} {search.searchParams.buildingName} {search.searchParams.streetName}
                                  </Typography>
                                )}
                                
                                {search.searchParams.searchMethod === 'ownerName' && (
                                  <Typography variant="body2" color="text.secondary">
                                    Owner: {search.searchParams.ownerName}
                                  </Typography>
                                )}
                                
                                {search.searchResults?.propertyId && (
                                  <Typography variant="body2" color="text.secondary">
                                    Property ID: {search.searchResults.propertyId}
                                  </Typography>
                                )}
                              </Box>
                              
                              <Typography variant="caption" color="text.secondary">
                                Saved on {formatDate(search.createdAt)}
                              </Typography>
                            </CardContent>
                            
                            <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<FaExternalLinkAlt />}
                                onClick={() => runSavedSearch(search.searchParams)}
                              >
                                Run Search
                              </Button>
                            </Box>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
            
            {/* Search History Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Search History
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  Your search history will be available in the next update.
                </Typography>
              </Box>
            )}
            
            {/* Profile Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {user?.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Account Type:</strong> {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Joined:</strong> {formatDate(user?.createdAt)}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Edit Profile
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
      <Footer />
      
      {/* Rename dialog */}
      <Dialog open={renameDialog.open} onClose={() => setRenameDialog({ ...renameDialog, open: false })}>
        <DialogTitle>Rename Saved Search</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Name"
            type="text"
            fullWidth
            variant="outlined"
            value={renameDialog.name}
            onChange={(e) => setRenameDialog({ ...renameDialog, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialog({ ...renameDialog, open: false })}>Cancel</Button>
          <Button onClick={handleRenameSearch} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;