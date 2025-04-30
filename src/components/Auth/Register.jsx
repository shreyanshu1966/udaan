import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { FaUserPlus } from 'react-icons/fa';
import Navbar from '../Navbar';
import Footer from '../Footer';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { register, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          backgroundColor: '#f5f5f5'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '450px' }}
        >
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                <FaUserPlus className="me-2" /> Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign up to save your property searches
              </Typography>
            </Box>
            
            {(error || formError) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {formError || error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                helperText="Password must be at least 6 characters"
              />
              
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#26a69a', textDecoration: 'none' }}>
                    Login here
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Box>
      <Footer />
    </div>
  );
};

export default Register;