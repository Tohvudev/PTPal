import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { format } from 'date-fns';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Toolbar, Typography } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';

const TrainingListComponent = () => {
    const [rowData, setRowData] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [openAddTraining, setOpenAddTraining] = useState(false);
    const [openEditTraining, setOpenEditTraining] = useState(false);
    const [openDeleteTraining, setOpenDeleteTraining] = useState(false);
    const [newTraining, setNewTraining] = useState({
        id: '',
        date: '',
        duration: '',
        activity: '',
        customer: ''
    });
    const [editTraining, setEditTraining] = useState({
        id: '',
        date: '',
        duration: '',
        activity: '',
        customer: ''
    });
    const [deleteTrainingId, setDeleteTrainingId] = useState('');

    useEffect(() => {
        fetchData();
        fetchCustomers();
    }, []);

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

    const fetchCustomers = async () => {
        try {
            const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers');
            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleAddTraining = () => {
        setOpenAddTraining(true);
        setNewTraining({
            ...newTraining,
            id: '',
        });
    };

    const handleCloseAddTraining = () => {
        setOpenAddTraining(false);
        setNewTraining({
            date: '',
            duration: '',
            activity: '',
            customer: ''
        });
    };

    const handleEditTraining = (data) => {
        setEditTraining(data);
        setOpenEditTraining(true);
    };

    const handleCloseEditTraining = () => {
        setOpenEditTraining(false);
        setEditTraining({
            id: '',
            date: '',
            duration: '',
            activity: '',
            customer: ''
        });
    };

    const handleDeleteTraining = (id) => {
        setDeleteTrainingId(id);
        setOpenDeleteTraining(true);
    };

    const handleCloseDeleteTraining = () => {
        setOpenDeleteTraining(false);
        setDeleteTrainingId('');
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTraining({ ...newTraining, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditTraining({ ...editTraining, [name]: value });
    };

    const handleAddTrainingSubmit = async () => {
        try {
            const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: newTraining.date,
                    duration: newTraining.duration,
                    activity: newTraining.activity,
                    customer: `https://localhost:8080/api/customers/${newTraining.id}`
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add training');
            }
            fetchData();
            handleCloseAddTraining();
        } catch (error) {
            console.error('Error adding training:', error);
        }
    };

    const handleEditTrainingSubmit = async () => {
        try {
            const response = await fetch(`https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings/${editTraining.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editTraining),
            });
            if (!response.ok) {
                throw new Error('Failed to update training');
            }
            fetchData();
            handleCloseEditTraining();
        } catch (error) {
            console.error('Error updating training:', error);
        }
    };

    const handleDeleteTrainingSubmit = async () => {
        try {
            const response = await fetch(`https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings/${deleteTrainingId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete training');
            }
            fetchData();
            handleCloseDeleteTraining();
        } catch (error) {
            console.error('Error deleting training:', error);
        }
    };

    const columnDefs = [
        { headerName: 'id', field: 'customer.id', sortable: true, filter: true },
        { headerName: 'Customer First Name', field: 'customer.firstname', sortable: true, filter: true },
        { headerName: 'Customer Last Name', field: 'customer.lastname', sortable: true, filter: true },
        { headerName: 'Date', field: 'date', sortable: true, filter: true, valueFormatter: (params) => formatDate(params.value) },
        { headerName: 'Duration (in min)', field: 'duration', sortable: true, filter: true },
        { headerName: 'Activity', field: 'activity', sortable: true, filter: true },
        {
            headerName: 'Actions',
            field: 'actions',
            width: 180,
            cellRenderer: (params) => {
                return (
                    <>
                        <button onClick={() => handleEditTraining(params.data)}>Edit</button>
                        <button onClick={() => handleDeleteTraining(params.data.id)}>Delete</button>
                    </>
                );
            },
        },
    ];
   
    const csvData = rowData.map(row => ({
        'Customer ID': row.customer.id,
        'Customer First Name': row.customer.firstname,
        'Customer Last Name': row.customer.lastname,
        'Date': formatDate(row.date),
        'Duration (in min)': row.duration,
        'Activity': row.activity,
    }));

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6" component={Link} to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        PTPal
                    </Typography>
                    <div style={{ marginLeft: 'auto' }}>
                        <CSVLink data={csvData} filename={"trainings.csv"}>
                        <Button style={{ color : 'white'}}>Export to CSV</Button>
                        </CSVLink>
                        <Button color="inherit" component={Link} to="/customer">Customer</Button>
                        <Button color="inherit" onClick={handleAddTraining}>Add Training</Button>
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
            <Dialog open={openAddTraining} onClose={handleCloseAddTraining}>
                <DialogTitle>Add Training</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="id"
                        name="id"
                        label="Customer ID"
                        fullWidth
                        value={newTraining.id}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="date"
                        name="date"
                        label="Date"
                        type="datetime-local"
                        fullWidth
                        value={newTraining.date}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="duration"
                        name="duration"
                        label="Duration (in min)"
                        fullWidth
                        value={newTraining.duration}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="activity"
                        name="activity"
                        label="Activity"
                        fullWidth
                        value={newTraining.activity}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddTraining}>Cancel</Button>
                    <Button onClick={handleAddTrainingSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditTraining} onClose={handleCloseEditTraining}>
                <DialogTitle>Edit Training</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="date"
                        name="date"
                        label="Date"
                        type="datetime-local"
                        fullWidth
                        value={editTraining.date}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="duration"
                        name="duration"
                        label="Duration (in min)"
                        fullWidth
                        value={editTraining.duration}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="activity"
                        name="activity"
                        label="Activity"
                        fullWidth
                        value={editTraining.activity}
                        onChange={handleEditInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditTraining}>Cancel</Button>
                    <Button onClick={handleEditTrainingSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteTraining} onClose={handleCloseDeleteTraining}>
                <DialogTitle>Delete Training</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this training?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteTraining}>Cancel</Button>
                    <Button onClick={handleDeleteTrainingSubmit}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TrainingListComponent;
