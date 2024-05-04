import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Link } from 'react-router-dom'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CustomerListComponent = () => {
    const [rowData, setRowData] = useState([]);
    const [open, setOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleAddCustomer = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const handleAddCustomerSubmit = async () => {
        try {
            const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomer),
            });
            if (!response.ok) {
                throw new Error('Failed to add customer');
            }
            fetchData(); 
            handleClose(); 
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

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
                        <Button color="inherit" onClick={handleAddCustomer}>Add Customer</Button>
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
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        fullWidth
                        value={newCustomer.firstname}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="lastname"
                        name="lastname"
                        label="Last Name"
                        fullWidth
                        value={newCustomer.lastname}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="streetaddress"
                        name="streetaddress"
                        label="Street Address"
                        fullWidth
                        value={newCustomer.streetaddress}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="postcode"
                        name="postcode"
                        label="Postcode"
                        fullWidth
                        value={newCustomer.postcode}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="city"
                        name="city"
                        label="City"
                        fullWidth
                        value={newCustomer.city}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="phone"
                        name="phone"
                        label="Phone"
                        fullWidth
                        value={newCustomer.phone}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        fullWidth
                        value={newCustomer.email}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddCustomerSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CustomerListComponent;
