import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import product_cart_icon from '../../assets/cart_icon.png'
// anh loi --> tao sau
import list_product_icon from '../../assets/star_icon.png'

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to={'/addproduct'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <img src={product_cart_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      
      <Link to={'/listproduct'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <img src={list_product_icon} alt="" />
          <p>Product List</p>
        </div></Link>

    </div>
  )
}

export default Sidebar