import React from "react";
import "./SideBar.css";
import { Link, Navigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const SideBar = () => {
  const CategoryHeader = ({ title }) => (
    <header className="category-header">{title}</header>
  );
  
  const CategoryItem = ({ href, children }) => (
    <Link to={href}>
      <div>
        <Button className="category-item">{children}</Button>
        <hr/>
      </div>
    </Link>
  );
  
  return (
    <section className="main-container">
        <CategoryHeader title="Category" />
        <CategoryItem href="/product">New product</CategoryItem>
        <CategoryItem href="/summer-collection-2024">Summer Collection 2024</CategoryItem>
        <CategoryItem href="/men">Men</CategoryItem>
        <CategoryItem href="/women">Women</CategoryItem>
        <CategoryItem href="/kids">Kids</CategoryItem>
        <CategoryItem href="/sales">Sales</CategoryItem>
        <CategoryHeader title="Best seller" />
      </section>
  );
};

export default SideBar;
