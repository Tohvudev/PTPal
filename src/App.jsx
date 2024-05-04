import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageComponent from './components/LandingPageComponent';
import CustomerListComponent from './components/CustomerListComponent';
import TrainingListComponent from './components/TrainingListComponent';  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageComponent />} />
        <Route path="/customer" element={<CustomerListComponent />} /> 
        <Route path="/training" element={<TrainingListComponent />} /> 
      </Routes>
    </Router>
  );
}

export default App;
