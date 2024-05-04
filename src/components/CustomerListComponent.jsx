import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Link } from 'react-router-dom'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CustomerListComponent = () => {
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                
                setRowData(data._embedded.customers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const columnDefs = [
        
        { headerName: 'First name', field: 'firstname', sortable: true, filter: true },
        { headerName: 'Last name', field: 'lastname', sortable: true, filter: true },
        { headerName: 'Street Address', field: 'streetaddress', sortable: true, filter: true },
        { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true },
        { headerName: 'City', field: 'city', sortable: true, filter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
    ];

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        PTPal
                    </Typography>
                    <div style={{ marginLeft: 'auto' }}>
                        <Button color="inherit">Customer</Button>
                        <Button color="inherit" component={Link} to="/training">Training</Button>
                    </div>
                </Toolbar>
            </AppBar>
            <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 64px)', width: '1500px'}}>
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

export default CustomerListComponent;
