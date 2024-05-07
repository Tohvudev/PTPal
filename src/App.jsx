import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageComponent from './components/LandingPageComponent';
import CustomerListComponent from './components/CustomerListComponent';
import TrainingListComponent from './components/TrainingListComponent'; 
import CalendarPageComponent from './components/CalendarPageComponent'; 
import ChartComponent from './components/ChartComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageComponent />} />
        <Route path="/customer" element={<CustomerListComponent />} /> 
        <Route path="/training" element={<TrainingListComponent />} />
        <Route path="/calendar" element={<CalendarPageComponent />} />
        <Route path="/chart" element={<ChartComponent />} />    
      </Routes>
    </Router>
  );
}

export default App;
