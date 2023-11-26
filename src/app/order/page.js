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
    MenuItem,
    InputAdornment,
    IconButton,
} from '@mui/material';
// import Button from '@mui/material/Button';
import EventIcon from '@mui/icons-material/Event';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import axios from 'axios';
import { baseURL } from '../token';
import ErrorSnackbar from '@/components/errorcomp';

const Order = () => {
    const statusoptions = ['Pending', 'Fulfilled', "Cancelled", "Processing", "Other"];
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleShowError = (message) => {
        setErrorMessage(message);
        setErrorOpen(true);
    };

    const handleCloseError = () => {
        setErrorOpen(false);
    };

    const [values, setValues] = useState({
        someDate: '', // Your state for the date value
    });

    useEffect(() => {
        // Set the default value to today's date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${year}-${month}-${day}`;

        setValues({ ...values, someDate: formattedToday });
    }, []);
    const typeOptions = ['showrooms', 'warehouses', 'service centres'];
    const [newItem, setNewItem] = useState({
        date: '',
        status: '',
        selling_price: '',
        inventory_id: '',
        from_location_id: '',
        to_location_id: '',
    });
    const [filteritem, setFilteritem] = useState({
        maxPrice: '',
        minPrice: '',
        startDate: '',
        endDate: "",
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
        console.log(item);
        setSelectedItem(item);
    };

    const handleUpdate = async (id) => {
        try {
            console.log(selectedItem);
            const response = await axios.put(
                `${baseURL}orderRoute/orders/${id}`,
                selectedItem
            );
            console.log(response);
            const updatedInventory = inventoryData.map(item =>
                item.order_id === response.data.user.order_id ? response.data.user : item
            );
            // Fetch data before updating state
            setInventoryData(updatedInventory);
            await fetchdata();
            console.log(updatedInventory);
            setNewItem({
                date: '',
                status: '',
                selling_price: '',
                inventory_id: '',
                from_location_id: '',
                to_location_id: '',
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
                `${baseURL}orderRoute/orders/${id}`
            );
            fetchdata();
        } catch (error) {
            handleShowError('Error : ' + error?.response?.data?.message);
            console.error('Error creating inventory item:', error);
        }
    }
    const handleCreate = async () => {
        try {
            if (!newItem?.date || !newItem?.status || !newItem?.selling_price || !newItem?.inventory_id || !newItem?.from_location_id || !newItem?.to_location_id) {
                handleShowError('please fill all field!');
                return;
            }
            console.log(newItem);
            const response = await axios.post(
                `${baseURL}orderRoute/orders`,
                newItem
            );
            // Fetch data before updating state
            await fetchdata();
            setInventoryData([...inventoryData, response.data.user]);
            setNewItem({
                date: '',
                status: '',
                selling_price: '',
                inventory_id: '',
                from_location_id: '',
                to_location_id: '',
            });
            fetchdata();
        } catch (error) {
            handleShowError('Error creating inventory item: ' + error?.response?.data?.message);
            console.error('Error creating inventory item:', error?.response?.data?.message);
        }
    };
    const fetchdata = async () => {
        axios.get(`${baseURL}orderRoute/orders`)
            .then((response) => {
                setFilteritem('');
                console.log("data", response.data.user, filteritem);
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
            console.log("filteritem", filteritem);
            const response = await axios.get(
                `${baseURL}orderRoute/orders/filter`,
                {
                    params: {
                        maxPrice: filteritem?.maxPrice,
                        minPrice: filteritem?.minPrice,
                        startDate: filteritem?.startDate,
                        endDate: filteritem?.endDate
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
    useEffect(() => {
        handleFilter();
    }, [filteritem])
    return (
        <div style={{ margin: '20px' }}>
            <h1 style={{ display: 'flex', justifyContent: 'center' }}>Orders Page</h1>
            <Grid style={{ marginTop: '20px' }} container spacing={2}>
                <Grid item xs={3}>
                    <TextField
                        label="Date"
                        name="date"
                        type="date"
                        value={newItem?.date}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    // InputProps={{
                    //     endAdornment: (
                    //         <InputAdornment position="end">
                    //             <IconButton>
                    //                 <EventIcon />
                    //             </IconButton>
                    //         </InputAdornment>
                    //     ),
                    // }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Status"
                        name="status"
                        select
                        value={newItem.status}
                        onChange={handleChange}
                        fullWidth
                    >

                        {statusoptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="SellingPrice"
                        type="number"
                        name="selling_price"
                        value={newItem.selling_price}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Inventory_id"
                        name="inventory_id"
                        type="number"
                        value={newItem.inventory_id}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="from_location_id"
                        name="from_location_id"
                        type="number"
                        value={newItem.from_location_id}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="to_location_id"
                        name="to_location_id"
                        type="number"
                        value={newItem.to_location_id}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                {/* <Grid item xs={6}>
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
                </Grid> */}
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
                        label="Minprice"
                        name="minPrice"
                        type="number"
                        value={filteritem.minPrice}
                        onChange={handlefilterChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Maxprice"
                        name="maxPrice"
                        type="number"
                        value={filteritem.maxPrice}
                        onChange={handlefilterChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        name="startDate"
                        label="Start Date"
                        InputLabelProps={{ shrink: true, required: true }}
                        type="date"
                        value={filteritem?.startDate}
                        onChange={handlefilterChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        name="endDate"
                        label="End Date"
                        InputLabelProps={{ shrink: true, required: true }}
                        type="date"
                        value={filteritem?.endDate}
                        onChange={handlefilterChange}
                        fullWidth
                    />
                </Grid>
            </Grid>
            < TableContainer style={{ marginTop: '20px' }
            } component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Selling Price</TableCell>
                            <TableCell>Inventory Id</TableCell>
                            <TableCell>From Location Id</TableCell>
                            <TableCell>To Location Id</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {inventoryData.map((item) => ( */}
                        {(filteritem?.length != 0 ? filteredData : inventoryData).map((item) => (
                            <TableRow key={item?.order_id}>
                                <TableCell>{item?.order_id}</TableCell>
                                <TableCell>
                                    {selectedItem?.order_id === item?.order_id ? (
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
                                            {statusoptions.map((option) => (
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
                                    {selectedItem?.order_id === item?.order_id ? (
                                        <TextField
                                            name="date"
                                            value={selectedItem?.date}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    date: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        item?.date
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedItem?.order_id === item?.order_id ? (
                                        <TextField
                                            name="sellingprice"
                                            value={selectedItem?.selling_price}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    selling_price: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        item?.selling_price
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedItem?.order_id === item?.order_id ? (
                                        <TextField
                                            name="inventoryid"
                                            value={selectedItem?.inventory_id}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    inventory_id: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        item?.inventory_id
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedItem?.order_id === item?.order_id ? (
                                        <TextField
                                            name="from_location_id"
                                            value={selectedItem?.from_location_id}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    from_location_id: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        item?.from_location_id
                                    )}
                                </TableCell>
                                <TableCell>
                                    {selectedItem?.order_id === item?.order_id ? (
                                        <TextField
                                            name="to_location_id"
                                            value={selectedItem?.to_location_id}
                                            onChange={(e) => {
                                                setSelectedItem((prevItem) => ({
                                                    ...prevItem,
                                                    to_location_id: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        item?.to_location_id
                                    )}
                                </TableCell>
                                {/* <TableCell>
                                    {selectedItem?.order_id === item?.order_id ? (
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
                                </TableCell> */}
                                <TableCell>
                                    {
                                        selectedItem?.order_id === item?.order_id ? (
                                            <Button variant="contained" onClick={() => handleUpdate(item?.order_id)}>
                                                Save
                                            </Button>
                                        ) : (
                                            <Button variant="outlined" onClick={() => handleEdit(item)}>
                                                Edit
                                            </Button>
                                        )
                                    }
                                    <Button variant="outlined" onClick={() => handleDelete(item?.order_id)}>
                                        Delete
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table >
            </TableContainer >
            <ErrorSnackbar
                open={errorOpen}
                message={errorMessage}
                handleClose={handleCloseError}
            />
        </div >
    );
};

export default Order;
