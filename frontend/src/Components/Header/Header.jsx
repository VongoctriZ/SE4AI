import React, { useContext, useRef, useState } from "react";
import "./Header.css";
import logo from "../Assets/Image_Header/logo.png";
import avatar from "../Assets/Image_Header/avatar.png";
import profile from "../Assets/Image_Header/profile.jpg";
import cart_icon from "../Assets/Image_Header/cart_icon.png";
import { Link, Navigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Header = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);

  const menuRef = useRef();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  return (
    <div className="header">
      <a href="/">
        <div className="logo-container">
          <img loading="lazy" src={logo} alt="DeepFashion logo" className="logo" />
          <h1 className="logo-text">DeepFashion</h1>
        </div>
      </a>
      
      <div className="navigation">
        <ul ref={menuRef} className="nav-menu">
          <li onClick={() => {setMenu("shop"); }} >
            <Link style={{ textDecoration: "none" }} to="/">
              Shop
            </Link>
            {menu === "shop" ? <hr /> : <></>}
          </li> 
          <li onClick={() => {setMenu("men"); }}  >
            <Link style={{ textDecoration: "none" }} to="/men">
              Men
            </Link>
            {menu === "men" ? <hr /> : <></>}
          </li>
          <li onClick={() => { setMenu("women"); }} >
            <Link style={{ textDecoration: "none" }} to="/women">
              Women
            </Link>
            {menu === "women" ? <hr /> : <></>}
          </li>
          <li onClick={() => { setMenu("kids"); }} >
            <Link style={{ textDecoration: "none" }} to="/kids">
              Kids
            </Link>
            {menu === "kids" ? <hr /> : <></>}
          </li>
          {/* <li onClick={() => { setMenu("For you"); }} >
            <Link style={{ textDecoration: "none" }} to="/Foryou">
              For You
            </Link>
            {menu === "kids" ? <hr /> : <></>}
          </li> */}
        </ul>
      </div>
      {localStorage.getItem("auth-token") ? (
        <div className="account">
          <div className="cart-container">
            <Link to="/cart" style={{textDecoration: "none", color: "inherit"}}>
            {/* <img src={cart_icon} alt="" className="cart-icon" /> */}
            <div className="cart-count">
              { (getTotalCartItems > 0) ? ( <p>Cart ({getTotalCartItems})</p>
              ) : ( <p>Cart</p> ) }
            </div>
            </Link>

            <Button 
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            >
              <img loading="lazy" src={avatar} alt="" className="avatar" />
            </Button>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => setMenu("profile")}>
              <Link to="/profile" style={{ textDecoration: "none" }}>
                My account
              </Link>
            </MenuItem>
            <MenuItem onClick={() => setMenu("cart")}>
              <Link to="/cart" style={{ textDecoration: "none" }}>
                Cart
              </Link>
              {/* <div className="nav-cart-count">{getTotalCartItems()}</div> */}
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
              <Link to="/user/login" style={{textDecoration: "none", color: "inherit"}}>
                Login
              </Link>
            </div>
            <img loading="lazy" src={profile} alt="" className="avatar" />
          </div>
        </Button>
      )}
    </div>
  );
};

export default Header;
