import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PropertySearchForm from './components/PropertySearch/PropertySearchForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<PropertySearchForm />}/>
      </Routes>
    </Router>
  );
};

export default App;
