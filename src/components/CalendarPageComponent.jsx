import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CalendarPageComponent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings');
      if (!response.ok) {
        throw new Error('Failed to fetch trainings data');
      }
      const trainingsData = await response.json();
      formatEventData(trainingsData);
    } catch (error) {
      console.error('Error fetching trainings data:', error);
    }
  };

  const formatEventData = (trainingsData) => {
    const formattedEvents = trainingsData.map(training => ({
      title: `${training.activity} - ${training.customer.firstname}`,
      start: new Date(training.date),
      end: moment(training.date).add(training.duration, 'minutes').toDate(),
      customer: training.customer,
    }));
    setEvents(formattedEvents);
  };

  return (
   <div style={{ height: 'calc(100vh - 64px)', width: '1500px', margin: 'auto' }}>
  <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          PTPal
        </Typography>

        <div>
          <Button color="inherit" component={Link} to="/customer">Customer</Button>
          <Button color="inherit" component={Link} to="/training">Training</Button>
        </div>
      </Toolbar>
    </AppBar>
  <div style={{ padding: '20px' }}>
    <h7>CALENDAR</h7>
    <div style={{ height: 800 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          margin: '50px',
          backgroundColor: 'white',
          border: '5px solid #ddd',
          color: 'black',
        }}
        eventPropGetter={(isSelected) => {
          const backgroundColor = isSelected ? '#3174ad' : '#2e8dcd';
          const borderColor = isSelected ? '#3174ad' : '#2e8dcd';
          return {
            style: {
              backgroundColor,
              borderColor,
              color: 'black',
            },
          };
        }}
        components={{
          month: {
            header: ({ label }) => (
              <div className="rbc-month-header" style={{ color: 'black' }}>
                {label}
              </div>
            ),
          },
          dateCellWrapper: ({ children, value }) => (
            <div className="rbc-date-cell" style={{ color: 'black' }}>
              {children}
            </div>
          ),
        }}
        formats={{
          monthHeaderFormat: 'MMMM YYYY',
          dayFormat: 'D',
        }}
      />
    </div>
  </div>
</div>

  );
}

export default CalendarPageComponent;
