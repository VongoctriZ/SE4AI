// import React from 'react'
import './Navbar.css'
import logo from '../../assets/Image_Header/logo.png'
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';

function notificationsLabel(count) {
  if (count === 0) {
    return 'no notifications';
  }
  if (count > 99) {
    return 'more than 99 notifications';
  }
  return `${count} notifications`;
}

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" className='image-logo-header' />
        <p>Admin</p>
      </div>
      <div className="nav-icons">
      <IconButton aria-label={notificationsLabel(100)} className='icon-noti'>
        <Badge badgeContent={100} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>
      
      <IconButton aria-label={notificationsLabel(100)} className='icon-email'>
        <Badge badgeContent={100} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>


      </div>
      <img src={'https://assets.leetcode.com/users/cuonghacknao2003/avatar_1717211947.png'} alt="" className="nav-profile" />
    </div>

  )
}

export default Navbar