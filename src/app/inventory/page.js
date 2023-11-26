'use client'
import './styles.css';
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem
} from '@mui/material';
import axios from 'axios';
import { baseURL } from '../token';
import ErrorSnackbar from '@/components/errorcomp';

const Inventory = () => {
    const typeOptions = ['Available for Sale', 'In Service', 'Awaiting Health Check', 'Returned', 'On Hold', 'Backordered', 'Discontinued', 'Under Maintenance/Repair', 'Reserved', 'Out of Stock'];
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleShowError = (message) => {
        setErrorMessage(message);
        setErrorOpen(true);
    };

    const handleCloseError = () => {
        setErrorOpen(false);
    };


    const [newItem, setNewItem] = useState({
        make: '',
        model: '',
        quantity: '',
        status: '',
        location_id: '',
    });

    const [inventoryData, setInventoryData] = useState([
        // 3
        //     make: 'Brand A',
        //     model: 'Model X',
        //     quantity: 10,
        //     status: 'Available',
        //     location: {
        //         state: '',
        //         city: '',
        //         name: 'Sample Location',
        //     },
        // },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const [selectedItem, setSelectedItem] = useState(null);

    const handleEdit = (item) => {
        setSelectedItem(item);
    };

    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(
                `${baseURL}inventoryRoute/inventory/${id}`,
                selectedItem
            );
            const updatedInventory = inventoryData.map(item =>
                item.inventory_id === response.data.user.inventory_id ? response.data.user : item
            );
            setInventoryData(updatedInventory);
            setNewItem({
                make: '',
                model: '',
                quantity: '',
                status: '',
                location_id: '',
            });
            setSelectedItem(null);
            fetchdata();
        } catch (error) {
            handleShowError('Error : ' + error?.response?.data?.message);
            console.error('Error updating inventory item:', error);
        }
    };
    const handleDelete = async (id) => {
        try {
            console.log(newItem);
            const response = await axios.delete(
                `${baseURL}inventoryRoute/inventory/${id}`
            );
            fetchdata();
        } catch (error) {
            handleShowError('Error : ' + error?.response?.data?.message);
            console.error('Error creating inventory item:', error);
        }
    }
    const handleCreate = async () => {
        try {
            if (!newItem?.make || !newItem?.model || !newItem?.quantity || !newItem?.status || !newItem?.location_id) {
                handleShowError('Error : ' + "please fill all feilds!");
                return;
            }
            console.log(newItem);
            const response = await axios.post(
                `${baseURL}inventoryRoute/inventory`,
                newItem
            );
            setInventoryData([...inventoryData, response.data.user]);
            setNewItem({
                make: '',
                model: '',
                quantity: '',
                status: '',
                location_id: '',
            });
            fetchdata();
        } catch (error) {
            handleShowError('Error : ' + error?.response?.data?.message);
            console.error('Error creating inventory item:', error);
        }
    };
    const fetchdata = async () => {
        axios.get(`${baseURL}inventoryRoute/inventory`)
            .then((response) => {
                console.log("data", response.data.user);
                setInventoryData(response.data.user);
            })
            .catch((error) => {
                handleShowError('Error : ' + error?.response?.data?.message);
                console.error('Error fetching data:', error);
            });
    }
    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <div style={{ margin: '20px' }}>
            <h1 style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>Inventory Page</h1>
            <Grid style={{ marginTop: '20px' }} container spacing={2}>
                <Grid item xs={3}>
                    <TextField
                        label="Make"
                        name="make"
                        value={newItem.make}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Model Name"
                        name="model"
                        value={newItem.model}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                {/* <Grid item xs={3}>
                    <TextField
                        label="Status"
                        name="status"
                        value={newItem.status}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid> */}
                <Grid item xs={3}>
                    <TextField
                        label="Status"
                        name="status"
                        select
                        value={newItem.status}
                        onChange={handleChange}
                        fullWidth
                    >
                        {typeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Location ID"
                        name="location_id"
                        type="number"
                        value={newItem.location_id}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={handleCreate}>
                        Create
                    </Button>
                </Grid>
            </Grid>

            <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <TableContainer style={{ marginTop: '20px' }} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Inventory ID</TableCell>
                                <TableCell>Brand or Manufacturer</TableCell>
                                <TableCell>ModelName</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Location_id</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Location Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventoryData.map((item) => (
                                <TableRow key={item?.inventory_id}>
                                    <TableCell>{item?.inventory_id}</TableCell>
                                    <TableCell>
                                        {selectedItem?.inventory_id === item?.inventory_id ? (
                                            <TextField
                                                name="make"
                                                value={selectedItem?.make}
                                                onChange={(e) => {
                                                    setSelectedItem((prevItem) => ({
                                                        ...prevItem,
                                                        make: e.target.value,
                                                    }));
                                                }}
                                            />
                                        ) : (
                                            item?.make
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {selectedItem?.inventory_id === item?.inventory_id ? (
                                            <TextField
                                                name="model"
                                                value={selectedItem?.model}
                                                onChange={(e) => {
                                                    setSelectedItem((prevItem) => ({
                                                        ...prevItem,
                                                        model: e.target.value,
                                                    }));
                                                }}
                                            />
                                        ) : (
                                            item?.model
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {selectedItem?.inventory_id === item?.inventory_id ? (
                                            <TextField
                                                name="quantity"
                                                type="number"
                                                value={selectedItem?.quantity}
                                                onChange={(e) => {
                                                    setSelectedItem((prevItem) => ({
                                                        ...prevItem,
                                                        quantity: e.target.value,
                                                    }));
                                                }}
                                            />
                                        ) : (
                                            item?.quantity
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {selectedItem?.inventory_id === item?.inventory_id ? (
                                            <TextField
                                                name="status"
                                                select
                                                value={selectedItem?.status}
                                                onChange={(e) => {
                                                    setSelectedItem((prevItem) => ({
                                                        ...prevItem,
                                                        status: e.target.value,
                                                    }));
                                                }}
                                            >
                                                {typeOptions.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        ) : (
                                            item?.status
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {selectedItem?.inventory_id === item?.inventory_id ? (
                                            <TextField
                                                name="location_id"
                                                type="number"
                                                value={selectedItem?.location_id}
                                                onChange={(e) => {
                                                    setSelectedItem((prevItem) => ({
                                                        ...prevItem,
                                                        location_id: e.target.value,
                                                    }));
                                                }}
                                            />
                                        ) : (
                                            item?.location_id
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {item?.location?.state}
                                    </TableCell>
                                    <TableCell>
                                        {item?.location?.city}
                                    </TableCell>
                                    <TableCell>
                                        {item?.location?.name}
                                    </TableCell>
                                    <TableCell>
                                        {selectedItem?.inventory_id === item?.inventory_id ? (
                                            <Button variant="contained" onClick={() => { handleUpdate(item?.inventory_id) }}>Save</Button>
                                        ) :
                                            (
                                                <Button variant="outlined" onClick={() => handleEdit(item)}>Edit</Button>
                                            )
                                        }
                                        {/* Add a button for delete action */}
                                        <Button variant="outlined" onClick={() => { handleDelete(item?.inventory_id) }}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </div>
            <ErrorSnackbar
                open={errorOpen}
                message={errorMessage}
                handleClose={handleCloseError}
            />
        </div >
    );
};

export default Inventory;
