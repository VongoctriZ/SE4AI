import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ListUser = () => {
  // State to hold all user data
  const [allUsers, setAllUsers] = useState([]);

  // Fetch user data from the backend
  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/user/allusers');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      // Transform data to include 'id' field for DataGrid
      const transformedData = data.map(user => ({
        ...user,
        id: user._id // Ensure each user object has an 'id' field for DataGrid
      }));
      setAllUsers(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchInfo();
  }, []);

  // Handle removing a user
  const removeUser = async (id) => {
    try {
      const response = await fetch('http://localhost:4000/user/removeuser', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id }) // Send _id in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to remove user');
      }

      const result = await response.json();

      if (result.success) {
        // Update the state to remove the user
        setAllUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      } else {
        console.error('Error removing user:', result.message);
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  // Define columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'fullName', headerName: 'Full Name', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'address', headerName: 'Address', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'email', headerName: 'Email', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'password', headerName: 'Password', width: 130, align: 'center', headerAlign: 'center' },
    {
      field: 'remove',
      headerName: 'Remove',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      // Render a remove icon with an onClick handler to remove the user
      renderCell: (params) => (
        <strong>
          <HighlightOffIcon
            style={{ cursor: 'pointer', color: 'red' }}
            onClick={() => removeUser(params.row.id)}
          />
        </strong>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      {/* Render the DataGrid with user data */}
      <DataGrid
        rows={allUsers}
        columns={columns}
        pageSize={5}
        checkboxSelection={false}
      />
    </div>
  );
};

export default ListUser;
