import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ListUser = () => {
  const [allUsers, setAllUsers] = React.useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/user/allusers');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const transformedData = data.map(user => ({
        ...user,
        id: user._id // Ensure each user object has an 'id' field for DataGrid
      }));
      setAllUsers(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchInfo();
  }, []);

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
        setAllUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      } else {
        console.error('Error removing user:', result.message);
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };


  const columns = [
    { field: 'Id', headerName: 'ID', width: 130, align: 'center', headerAlign: 'center' },
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
      renderCell: (params) => (
        <strong>
          <HighlightOffIcon onClick={() => removeUser(params.row.id)} />
        </strong>
      ),
    },
  ];

  return (
    
    <div style={{ height: 400, width: '100%' }}>
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
