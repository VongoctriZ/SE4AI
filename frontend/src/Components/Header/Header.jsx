// Header.js
import React, { useEffect, useContext, useRef, useState } from "react";
import "./Header.css";
import logo from "../Assets/Image_Header/logo.png";
import avatar from "../Assets/Image_Header/avatar.png";
import profile from "../Assets/Image_Header/profile.jpg";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Search from "../Search/Search";

const Header = () => {  

  const [menu, setMenu] = useState('');
  const { getTotalCartItems } = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    console.log("searched query: ", searchQuery); // Log searchQuery when it changes
  }, [searchQuery]);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  return (
    <div className="header">
      <Link to="/" className="logo-link" onClick={() => setMenu("")}>
        <div className="logo-container">
          <img loading="lazy" src={logo} alt="DeepFashion logo" className="logo" />
          <h1 className="logo-text">DeepFashion</h1>
        </div>
      </Link>

      <div className="header-middle">
        <Search onSearch={handleSearch} />
        <nav className="navigation">
          <ul ref={menuRef} className="nav-links">
            <li className={`nav-item ${menu === "men" ? "active" : ""}`} onClick={() => setMenu("men")}>
              <Link to="/men">Men</Link>
            </li>
            <li className={`nav-item ${menu === "women" ? "active" : ""}`} onClick={() => setMenu("women")}>
              <Link to="/women">Women</Link>
            </li>
            <li className={`nav-item ${menu === "kids" ? "active" : ""}`} onClick={() => setMenu("kids")}>
              <Link to="/kids">Kids</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="header-right">
        {localStorage.getItem("auth-token") ? (
          <div className="account">
            <div className="cart-container">
              <Link to="/cart" className="cart-link">
                <div className="cart-count">
                  {getTotalCartItems > 0 ? <p>Cart ({getTotalCartItems})</p> : <p>Cart</p>}
                </div>
              </Link>
              <Button id="basic-button" aria-controls={open ? "basic-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={handleClick}>
                <img loading="lazy" src={avatar} alt="User avatar" className="avatar" />
              </Button>
            </div>
            <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ "aria-labelledby": "basic-button" }}>
              <MenuItem onClick={handleClose}>
                <Link to="/profile" className="menu-link">My account</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/cart" className="menu-link">Cart</Link>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("auth-token");
                  window.location.replace("/");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Button>
            <div className="cart-container">
              <div className="cart-count">
                <Link to="/user/login" className="login-link">Login</Link>
              </div>
              <img loading="lazy" src={profile} alt="Profile avatar" className="avatar" />
            </div>
          </Button>
        )}
      </div>

    </div>
  );
};

export default Header;