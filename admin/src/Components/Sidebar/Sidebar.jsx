// import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DashboardIcon from '@mui/icons-material/Dashboard';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to={'/dashboard'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <DashboardIcon fontSize="large"></DashboardIcon>
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
      <Link to={'/listorder'} style={{ textDecoration: "none" }}>
        <div className="sidebar-items">
          <ReceiptIcon fontSize="large"></ReceiptIcon>
          <p>List Order</p>
        </div>
      </Link>

    </div>
  )
}

export default Sidebar