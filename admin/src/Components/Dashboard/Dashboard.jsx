import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import './Dashboard.css';

const Dashboard = () => {
  const [allProducts, setAllProducts] = React.useState([]);
  const [salesData, setSalesData] = React.useState({ men: 0, women: 0, kids: 0 });
  const [allUsers, setAllUsers] = React.useState([]);
  const [customerCount, setCustomerCount] = React.useState(0);
  const [orderCount, setOrderCount] = React.useState(0);

  // Function to fetch product and user data
  const fetchInfo = async () => {
    try {
      // Fetch product data
      const productResponse = await fetch('http://localhost:4000/product/allproducts');
      if (!productResponse.ok) throw new Error('Failed to fetch product data');
      const productData = await productResponse.json();
      setAllProducts(productData);

      // Calculate sales data
      const sales = { men: 0, women: 0, kids: 0 };
      productData.forEach(product => {
        if (product.category.includes('men')) sales.men += product.all_time_quantity_sold;
        if (product.category.includes('women')) sales.women += product.all_time_quantity_sold;
        if (product.category.includes('kids')) sales.kids += product.all_time_quantity_sold;
      });
      setSalesData(sales);

      // Fetch user data
      const userResponse = await fetch('http://localhost:4000/user/allusers');
      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      const userData = await userResponse.json();
      const transformedData = userData.map(user => ({ ...user, id: user._id }));
      setAllUsers(transformedData);

      // Set customer and order counts
      setCustomerCount(transformedData.length);
      setOrderCount(sales.men + sales.women + sales.kids);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data when component mounts
  React.useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="container">
      <div className='dashboard-chart'>
        <h2 className="chart-title">Sales by Category</h2>
        <BarChart
          className='barchart'
          xAxis={[{ id: 'barCategories', data: ['Men', 'Women', 'Kids'], scaleType: 'band' }]}
          series={[{ data: [salesData.men, salesData.women, salesData.kids], label: 'Sales' }]}
          width={500}
          height={300}
        />
        <div className="stats-container">
          <div className="stat-card">
            <h3>Customers</h3>
            <p>{customerCount}</p>
          </div>
          <div className="stat-card">
            <h3>Sold</h3>
            <p>{orderCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;