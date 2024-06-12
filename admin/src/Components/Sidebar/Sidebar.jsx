// import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to={'/dashboard'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <AddShoppingCartOutlinedIcon fontSize="large"></AddShoppingCartOutlinedIcon>
          <p>Dashboard</p>
        </div>

      </Link>
      <Link to={'/addproduct'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <AddShoppingCartOutlinedIcon fontSize="large"></AddShoppingCartOutlinedIcon>
          <p>Add Product</p>
        </div>
      </Link>

      <Link to={'/listproduct'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <ShoppingCartOutlinedIcon fontSize="large"></ShoppingCartOutlinedIcon>
          <p>List Product</p>
        </div>
      </Link>

      <Link to={'/adduser'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <PersonAddAltOutlinedIcon fontSize="large"></PersonAddAltOutlinedIcon>
          <p>Add User</p>
        </div>
      </Link>

      <Link to={'/listuser'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <GroupOutlinedIcon fontSize="large"></GroupOutlinedIcon>
          <p>List User</p>
        </div>
      </Link>

    </div>
  )
}

export default Sidebar