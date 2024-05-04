import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import navProfile from '../../assets/profile.jpg'
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>SHOPER</p>
        <p>huy</p>
      </div>
      <img src={navProfile} alt="" className="nav-profile" />
    </div>

  )
}

export default Navbar