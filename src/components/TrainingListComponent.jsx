import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { format } from 'date-fns';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const TrainingListComponent = () => {
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                
                setRowData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    };

    const columnDefs = [
        { headerName: 'Customer First Name', field: 'customer.firstname', sortable: true, filter: true },
        { headerName: 'Date', field: 'date', sortable: true, filter: true, valueFormatter: (params) => formatDate(params.value) },
        { headerName: 'Duration (in min)', field: 'duration', sortable: true, filter: true },
        { headerName: 'Activity', field: 'activity', sortable: true, filter: true },
        
    ];

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        PTPal
                    </Typography>
                    <div style={{ marginLeft: 'auto' }}>
                    <Button color="inherit" component={Link} to="/customer">Customer</Button>
                    <Button color="inherit" component={Link} to="/training">Training</Button>
                    </div>
                </Toolbar>
            </AppBar>
            <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 64px)', width: '1500px' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    pagination={true}
                    autoSizeColumns={true}
                />
            </div>
        </>
    );
};

export default TrainingListComponent;
