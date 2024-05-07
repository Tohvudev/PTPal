import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function LandingPageComponent() {
  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '1500px', margin: 'auto' }}>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component={Link} to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            PTPal
          </Typography>

          <div>
            <Button color="inherit" component={Link} to="/calendar">Calendar</Button>
            <Button color="inherit" component={Link} to="/chart">Charts</Button>
            <Button color="inherit" component={Link} to="/customer">Customer</Button>
            <Button color="inherit" component={Link} to="/training">Training</Button>
          </div>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <h1>Welcome to PTPal (Personal Trainer Pal)</h1>
        <p>Check out charts for a chart view of the activities.</p>
        <p>Check out the calendar to see a calendar view of trainings.</p>
        <p>Remember, you can go back to this site by pressing "PTPal" on the top left (works on all pages)</p>
      </div>
    </div>
  );
}

export default LandingPageComponent;
