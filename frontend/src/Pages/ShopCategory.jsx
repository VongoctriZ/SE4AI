import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { allProduct } = useContext(ShopContext);

  // const product = allProduct[0];
  // console.log("All attributes of the product:");
  // Object.keys(product).forEach(key => {
  //   console.log(`${key}`);
  // });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // State for sorting
  const [sortCriteria, setSortCriteria] = useState('name'); // Default sort by name

  // Calculate total pages
  const totalPages = Math.ceil(allProduct.length / itemsPerPage);

  // Sort products based on criteria
  const sortedProducts = [...allProduct].sort((a, b) => {
    switch (sortCriteria) {
      case 'new_price':
        return a.new_price - b.new_price;
      // case 'old_price':
      //   return a.old_price - b.old_price;
      case 'discount':
        return ((a.old_price - a.new_price) / a.old_price) - ((b.old_price - b.new_price) / b.old_price);
      case 'rating':
        return b.rating - a.rating;
      case 'review_counts':
        return b.review_counts - a.review_counts;
      case 'all_time_quantity_sold':
        return b.all_time_quantity_sold - a.all_time_quantity_sold;
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Calculate the items to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = allProduct.slice(startIndex, startIndex + itemsPerPage);

  // Handler for changing pages
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // Handler for changing sort criteria
  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  return (
    <div className="shop-category">
      <img className="shop-category-banner" src={props.banner} alt="" />
      <div className="shop-category-indexSort">
        <p>
          <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, allProduct.length)}</span> of {allProduct.length} products
        </p>
        <div className="shop-category-sort">
          {/* Sort by */}
          <select onChange={handleSortChange} value={sortCriteria}>
            <option value="name">Name</option>
            <option value="new_price">Price</option>
            {/* <option value="old_price">Price (Old)</option> */}
            <option value="discount">Discount</option>
            <option value="rating">Rating</option>
            <option value="review_counts">Review Counts</option>
            <option value="all_time_quantity_sold">Quantity Sold</option>
            <option value="date">Date</option>
          </select>
          {/* <img src={dropdown_icon} alt="" /> */}
        </div>
      </div>
      <div className="shop-category-products">
        {currentItems.map((item, i) => {
          if (props.category === item.category[0]) {
            return <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.thumbnail_url}
              new_price={item.new_price}
              old_price={item.old_price}
            // discount={item.discount}
            // rating={item.rating}
            // quantity_sold={item.all_time_quantity_sold}
            // date={item.date} 
            />;
          } else {
            return null;
          }
        })}
      </div>
      <div className="shop-category-pagination">
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ShopCategory;