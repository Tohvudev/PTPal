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
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PTPal
          </Typography>
          
          <Button color="inherit" component={Link} to="/customer">Customer</Button>
          
          <Button color="inherit" component={Link} to="/training">Training</Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <h1>This is a landing page</h1>
      </div>
    </div>
  );
}

export default LandingPageComponent;
