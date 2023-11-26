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
    MenuItem
} from '@mui/material';
import axios from 'axios';
import { baseURL } from '../token';
import ErrorSnackbar from '@/components/errorcomp';

const Location = () => {
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleShowError = (message) => {
        setErrorMessage(message);
        setErrorOpen(true);
    };

    const handleCloseError = () => {
        setErrorOpen(false);
    };

    const typeOptions = ['showrooms', 'warehouses', 'service centres'];
    const [newItem, setNewItem] = useState({
        name: '',
        type: '',
        city: '',
        state: '',
    });
    const [filteritem, setFilteritem] = useState({
        filterstate: '',
        filtercity: ''
    })

    const [inventoryData, setInventoryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };
    const handlefilterChange = (e) => {
        const { name, value } = e.target;
        setFilteritem((prevItem) => ({
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
                `${baseURL}locationRoute/location/${id}`,
                selectedItem
            );
            const updatedInventory = inventoryData.map(item =>
                item.location_id === response.data.user.location_id ? response.data.user : item
            );
            setInventoryData(updatedInventory);
            setNewItem({
                name: '',
                type: '',
                city: '',
                state: '',
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
                `${baseURL}locationRoute/location/${id}`
            );
            setFilteritem('');
            fetchdata();
        } catch (error) {
            handleShowError('Error : ' + error?.response?.data?.message);
            console.error('Error creating inventory item:', error);
        }
    }
    const handleCreate = async () => {
        try {
            if (!newItem?.name || !newItem?.type || !newItem?.city || !newItem?.state) {
                handleShowError('Error : ' + "Please fill all feilds!!");
                return;
            }
            console.log(newItem);
            const response = await axios.post(
                `${baseURL}locationRoute/location`,
                newItem
            );
            setInventoryData([...inventoryData, response.data.user]);
            setNewItem({
                name: '',
                type: '',
                city: '',
                state: '',
            });
            fetchdata();
        } catch (error) {
            handleShowError('Error : ' + error?.response?.data?.message);
            console.error('Error creating inventory item:', error);
        }
    };
    const fetchdata = async () => {
        axios.get(`${baseURL}locationRoute/location`)
            .then((response) => {
                setFilteritem('');
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
    const handleFilter = async () => {
        try {
            console.log("filteritem", filteritem.filtercity, filteritem.filterstate);
            const response = await axios.get(
                `${baseURL}locationRoute/location/filter`,
                {
                    params: {
                        city: filteritem?.filtercity,
                        state: filteritem.filterstate,
                    },
                }
            );
            console.log("dataaaa", response?.data);
            setFilteredData(response.data);
        } catch (error) {
            handleShowError('Error : ' + error?.response?.data?.message);
            console.error('Error filtering data:', error);
        }
    };
    const handleClearFilter = () => {
        setNewItem({
            ...newItem,
            city: '',
            state: '',
        });
        setFilteredData([]);
    };
    useEffect(() => {
        handleFilter();
    }, [filteritem])
    return (
        <div style={{ margin: '20px' }}>
            <h1 style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>Location Page</h1>
            <Grid style={{ marginTop: '20px' }} container spacing={2}>
                <Grid item xs={3}>
                    <TextField
                        label="Name"
                        name="name"
                        value={newItem.name}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="City"
                        name="city"
                        value={newItem.city}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="State"
                        name="state"
                        value={newItem.state}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Type"
                        name="type"
                        select
                        value={newItem.type}
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
                <Grid item xs={12}>
                    <Button variant="contained" onClick={handleCreate}>
                        Create
                    </Button>
                </Grid>
            </Grid>

            <h3 style={{ marginTop: '20px' }}>Filter data</h3>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <TextField
                        label="State"
                        name="filterstate"
                        value={filteritem.filterstate}
                        onChange={handlefilterChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="City"
                        name="filtercity"
                        value={filteritem.filtercity}
                        onChange={handlefilterChange}
                        fullWidth
                    />
                </Grid>
                {/* <Grid item xs={12}>
                    <Button variant="contained" onClick={handleFilter}>
                        Filter
                    </Button>
                    <Button variant="contained" onClick={handleClearFilter}>
                        Clear Filter
                    </Button>
                </Grid> */}
            </Grid>

            <TableContainer style={{ marginTop: '20px' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Location ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {inventoryData.map((item) => ( */}
                        {(filteritem?.length != 0 ? filteredData : inventoryData).map((item) => (
                            <TableRow key={item?.location_id}>
                                <TableCell>{item?.location_id}</TableCell>
                                <TableCell>
                                    {selectedItem?.location_id === item?.location_id ? (
                                        <TextField
                                            name="name"
                                            value={selectedItem?.name}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    name: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        item?.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedItem?.location_id === item?.location_id ? (
                                        <TextField
                                            name="state"
                                            value={selectedItem?.state}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    state: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        item?.state
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedItem?.location_id === item?.location_id ? (
                                        <TextField
                                            name="city"
                                            value={selectedItem?.city}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    city: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        item?.city
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedItem?.location_id === item?.location_id ? (
                                        <TextField
                                            name="type"
                                            select
                                            value={selectedItem?.type}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    type: e.target.value,
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
                                        item?.type
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedItem?.location_id === item?.location_id ? (
                                        <Button variant="contained" onClick={() => { handleUpdate(item?.location_id) }}>Save</Button>
                                    ) :
                                        (
                                            <Button variant="outlined" onClick={() => handleEdit(item)}>Edit</Button>
                                        )
                                    }
                                    <Button variant="outlined" onClick={() => { handleDelete(item?.location_id) }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <ErrorSnackbar
                open={errorOpen}
                message={errorMessage}
                handleClose={handleCloseError}
            />
        </div >
    );
};

export default Location;
