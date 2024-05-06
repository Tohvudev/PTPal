import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar, Typography } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';

const EditButton = ({ customerUrl, rowData, onClick }) => {
    const handleClick = () => {
        onClick(rowData);
    };

    return (
        <button onClick={handleClick}>Edit</button>
    );
};

const DeleteButton = ({ customerUrl, onClick }) => {
    const handleClick = () => {
        onClick(customerUrl);
    };

    return (
        <button onClick={handleClick}>Delete</button>
    );
};

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
    const [editCustomer, setEditCustomer] = useState(null);
    const [deleteCustomerUrl, setDeleteCustomerUrl] = useState(null);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

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
            console.log('Customers data:', data._embedded.customers);
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
        setOpenEditDialog(false);
        setEditCustomer(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditCustomer({ ...editCustomer, [name]: value });
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

    const handleEditClick = (customerData) => {
        setEditCustomer(customerData);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (customerUrl) => {
        setDeleteCustomerUrl(customerUrl);
        setOpenDeleteConfirmation(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setOpenDeleteConfirmation(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(deleteCustomerUrl, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete customer');
            }
            fetchData(); 
            handleCloseDeleteConfirmation(); 
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleConfirmEdit = async () => {
        try {
            const response = await fetch(editCustomer._links.customer.href, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editCustomer),
            });
            if (!response.ok) {
                throw new Error('Failed to update customer');
            }
            fetchData(); 
            handleClose(); 
        } catch (error) {
            console.error('Error updating customer:', error);
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
        {
            headerName: 'Actions',
            field: 'actions',
            width: 180,
            cellRenderer: (params) => {
                return (
                    <>
                        <EditButton customerUrl={params.data._links.customer.href} rowData={params.data} onClick={handleEditClick} />
                        <DeleteButton customerUrl={params.data._links.customer.href} onClick={handleDeleteClick} />
                    </>
                );
            },
        },
    ];
    const csvData = rowData.map(row => ({
        'Customer First Name': row.firstname,
        'Customer Last Name': row.lastname,
        'Postcode': row.postcode,
        'City': row.city,
        'Phone': row.phone,
        'Email': row.email,
    }));

    return (
        <>
            <AppBar position="static">
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        PTPal
                    </Typography>
                    <div>
                    <CSVLink data={csvData} filename={"customers.csv"}>
                            <Button color="inherit">Export to CSV</Button>
                        </CSVLink>
                        <Button color="inherit" onClick={handleAddCustomer}>Add Customer</Button>
                        <Button color="inherit" component={Link} to="/training">Training</Button>
                    </div>
                </Toolbar>
            </AppBar>
            <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 64px)', width: '1500px', margin: '0 auto' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    pagination={true}
                    autoSizeColumns={true}
                />
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{deleteCustomerUrl ? 'Delete Customer?' : 'Add New Customer'}</DialogTitle>
                <DialogContent>
                    {!deleteCustomerUrl && (
                        <>
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
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {!deleteCustomerUrl && (
                        <>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleAddCustomerSubmit}>Add</Button>
                        </>
                    )}
                    {deleteCustomerUrl && (
                        <>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleConfirmDelete}>Delete</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
            <Dialog open={openEditDialog} onClose={handleClose}>
                <DialogTitle>Edit Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        fullWidth
                        value={editCustomer ? editCustomer.firstname : ''}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="lastname"
                        name="lastname"
                        label="Last Name"
                        fullWidth
                        value={editCustomer ? editCustomer.lastname : ''}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="streetaddress"
                        name="streetaddress"
                        label="Street Address"
                        fullWidth
                        value={editCustomer ? editCustomer.streetaddress : ''}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="postcode"
                        name="postcode"
                        label="Postcode"
                        fullWidth
                        value={editCustomer ? editCustomer.postcode : ''}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="city"
                        name="city"
                        label="City"
                        fullWidth
                        value={editCustomer ? editCustomer.city : ''}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="phone"
                        name="phone"
                        label="Phone"
                        fullWidth
                        value={editCustomer ? editCustomer.phone : ''}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        fullWidth
                        value={editCustomer ? editCustomer.email : ''}
                        onChange={handleEditInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirmEdit}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteConfirmation} onClose={handleCloseDeleteConfirmation}>
                <DialogTitle>Delete Customer?</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this customer?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CustomerListComponent;
