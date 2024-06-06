// import React from 'react'
import './Navbar.css'
import logo from '../../assets/Image_Header/logo.png'
// import navProfile from '../../assets/profile.jpg'
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>DeepFashion</p>
      </div>
      <img src={'https://assets.leetcode.com/users/cuonghacknao2003/avatar_1717211947.png'} alt="" className="nav-profile" />
    </div>

  )
}

export default Navbar