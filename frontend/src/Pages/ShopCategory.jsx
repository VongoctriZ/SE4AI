// import React, { useContext } from 'react'
// import './CSS/ShopCategory.css'
// import { ShopContext } from '../Context/ShopContext'
// import dropdown_icon from '../Components/Assets/dropdown_icon.png'
// import Item from '../Components/Item/Item'


// const ShopCategory = (props) => {
//   // console.log("ShopCategory:", props);
//   const { allProduct } = useContext(ShopContext);
//   return (
//     <div className="shop-category">
//       <img className="shop-category-banner" src={props.banner} alt="" />
//       <div className="shop-category-indexSort">
//         <p>
//           <span>Showing 1-12</span> ouf of 36 products
//         </p>
//         <div className="shop-category-sort">
//           Sort by <img src={dropdown_icon} alt="" />
//         </div>
//       </div>
//       <div className="shop-category-products">
//         {allProduct.map((item, i) => {
//           // console.log("props.category: ", props.category);
//           // console.log("item.category: ", item.category[0]);
//           if (props.category === item.category[0]) {
//             return <Item key={i} id={item.id} name={item.name} image={item.thumbnail_url} new_price={item.new_price} old_price={item.old_price} />
//           } else {
//             return null;
//           }
//         })}
//       </div>
//       <div className="shop-category-load-more">
//         Explore More
//       </div>
//     </div>
//   )
// }
// export default ShopCategory;



import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { allProduct } = useContext(ShopContext);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Calculate total pages
  const totalPages = Math.ceil(allProduct.length / itemsPerPage);

  // Calculate the items to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = allProduct.slice(startIndex, startIndex + itemsPerPage);

  // Handler for changing pages
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="shop-category">
      <img className="shop-category-banner" src={props.banner} alt="" />
      <div className="shop-category-indexSort">
        <p>
          <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, allProduct.length)}</span> of {allProduct.length} products
        </p>
        <div className="shop-category-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shop-category-products">
        {currentItems.map((item, i) => {
          if (props.category === item.category[0]) {
            return <Item key={item.id} id={item.id} name={item.name} image={item.thumbnail_url} new_price={item.new_price} old_price={item.old_price} />;
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