import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ListProduct = () => {
  const [allProducts, setAllProducts] = React.useState([]);

  // Fetch product data from the server
  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/product/allproducts');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use useEffect to fetch product data when the component mounts
  React.useEffect(() => {
    fetchInfo();
  }, []);

  // Remove a product by its ID
  const removeProduct = async (id) => {
    try {
      const response = await fetch('http://localhost:4000/product/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) throw new Error('Failed to remove product');

      // Remove product from state without refetching
      setAllProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'name', headerName: 'Name', width: 200, align: 'center', headerAlign: 'center' },
    { field: 'new_price', headerName: 'New Price', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'rating', headerName: 'Rating', width: 110, align: 'center', headerAlign: 'center' },
    { field: 'review_counts', headerName: 'Review Counts', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'all_time_quantity_sold', headerName: 'Quantity Sold', width: 150, align: 'center', headerAlign: 'center' },
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
    <div style={{ height: 580, width: '100%' }}>
      <DataGrid
        rows={allProducts}
        columns={columns}
        pageSize={5}
        checkboxSelection={false}
        // Enable virtualization for better performance with large data sets
        disableVirtualization={false}
      />
    </div>
  );
};

export default ListProduct;
