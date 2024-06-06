// import React from 'react'
import './Navbar.css'
import logo from '../../assets/Image_Header/logo.png'
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" className='image-logo-header' />
        <p>Admin</p>
      </div>
      <MarkEmailUnreadOutlinedIcon fontSize='large' className='icon-email'></MarkEmailUnreadOutlinedIcon>
      <NotificationsNoneOutlinedIcon fontSize='large' className='icon-noti'></NotificationsNoneOutlinedIcon>
      <img src={'https://assets.leetcode.com/users/cuonghacknao2003/avatar_1717211947.png'} alt="" className="nav-profile" />
    </div>

  )
}

export default Navbar