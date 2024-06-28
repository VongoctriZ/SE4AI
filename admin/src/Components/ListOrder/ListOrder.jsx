import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { format } from 'date-fns';

// Helper function to format date
const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
};

// Helper function to format price in VND currency
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

const ListOrder = () => {
    // State variables
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Function to fetch orders from the backend
    const fetchOrder = async () => {
        try {
            const response = await fetch('http://localhost:4000/order/allorders');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setAllOrders(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrder();
    }, []);

    // Function to handle status change of an order
    const statusHandle = async (id, status) => {
        try {
            const response = await fetch('http://localhost:4000/order/update/status', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, status: status })
            });
            if (!response.ok) {
                throw new Error('Failed to change status');
            }

            // Update the order status in the state
            setAllOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === id ? { ...order, status: status } : order
                )
            );
            setSnackbarMessage('Order status updated successfully');
        } catch (error) {
            setError('Error changing status: ' + error.message);
        }
    };

    // Function to handle closing of the snackbar
    const handleSnackbarClose = () => {
        setSnackbarMessage('');
    };

    // Define columns for DataGrid
    const columns = [
        { field: 'id', headerName: 'ID', width: 130, align: 'center', headerAlign: 'center' },
        { field: 'userId', headerName: 'User ID', width: 130, align: 'center', headerAlign: 'center' },
        {
            field: 'total_money',
            headerName: 'Total Money',
            width: 150,
            align: 'right',
            headerAlign: 'center',
            renderCell: (params) => formatPrice(params.value),
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            width: 170,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => formatDate(params.value)
        },
        { field: 'status', headerName: 'Status', width: 140, align: 'center', headerAlign: 'center' },
        {
            field: 'actions',
            headerName: 'Change Status',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                params.row.status === 'pending' ? (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => statusHandle(params.row.id, 'accepted')}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => statusHandle(params.row.id, 'rejected')}
                            style={{ marginLeft: 8 }}
                        >
                            Reject
                        </Button>
                    </>
                ) : null
            ),
        },
    ];

    // Show loading spinner while fetching data
    if (loading) {
        return <CircularProgress />;
    }

    // Show error message if there is an error
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ height: 580, width: '100%' }}>
            <DataGrid
                rows={allOrders}
                columns={columns}
                pageSize={5}
                checkboxSelection={false}
            />
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
};

export default ListOrder;
