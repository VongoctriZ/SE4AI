// import React from 'react'
import "./Admin.css"
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import AddUser from '../../Components/AddUser/AddUser'
import ListProduct from '../../Components/ListProduct/ListProduct'
import ListUser from '../../Components/ListUser/ListUser'
import Dashboard from '../../Components/Dashboard/Dashboard'

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/adduser' element={<AddUser />} />
        <Route path='/listproduct' element={<ListProduct />} />
        <Route path='/listuser' element={<ListUser />} />
      </Routes>
    </div>
  )
}

export default Admin