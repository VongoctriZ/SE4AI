import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ListProduct = () => {
  const [allProducts, setAllProducts] = React.useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/product/allproducts');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      await fetch('http://localhost:4000/product/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
      });
      fetchInfo();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'name', headerName: 'Name', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'old_price', headerName: 'Old Price', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'new_price', headerName: 'New Price', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'category', headerName: 'Category', width: 130, align: 'center', headerAlign: 'center' },
    {
      field: 'remove',
      headerName: 'Remove',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <strong>
          <HighlightOffIcon onClick={() => removeProduct(params.row.id)} />
        </strong>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={allProducts}
        columns={columns}
        pageSize={5}
        checkboxSelection={false}
      />
    </div>

  );
};

export default ListProduct;