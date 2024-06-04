import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../Assets/Image_Header/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import profile_icon from "../Assets/profile.jpg";
import { Link, Navigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/circle-arrow-up-svgrepo-com.png";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Navbar = () => {
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
    <div className="navbar">
      <a href="/">
        <div className="nav-logo">
          <img src={logo} className="logo-image" alt="" />
          <p>DeepFashion</p>
        </div>
      </a>

      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
        <li
          onClick={() => {
            setMenu("shop");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("men");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/men">
            Men
          </Link>
          {menu === "men" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("women");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/women">
            Women
          </Link>
          {menu === "women" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("kids");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kids
          </Link>
          {menu === "kids" ? <hr /> : <></>}
        </li>
      </ul>
      {localStorage.getItem("auth-token") ? (
        <div className="account">
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Dashboard
          </Button>
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
          <Link
            to="/user/login"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Login
          </Link>
        </Button>
      )}

      {/* <div className="nav-login-cart">

                <Link to="/cart"><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div> */}
    </div>
  );
};

export default Navbar;
