import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Orders from './Pages/Orders';  
import ProfileInfo from './Pages/ProfileInfo';
import SearchResults from './Pages/SearchResults';

import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kids_banner from './Components/Assets/banner_kids.png';

import ShopContextProvider from './Context/ShopContext';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/men' element={
            <ShopContextProvider category="men">
              <ShopCategory banner={men_banner} category="men" />
            </ShopContextProvider>
          } />
          <Route path='/women' element={
            <ShopContextProvider category="women">
              <ShopCategory banner={women_banner} category="women" />
            </ShopContextProvider>
          } />
          <Route path='/kids' element={
            <ShopContextProvider category="kids">
              <ShopCategory banner={kids_banner} category="kids" />
            </ShopContextProvider>
          } />
          <Route path='/product/:productId' element={
            <ShopContextProvider>
              <Product />
            </ShopContextProvider>
          } />
          <Route path='/cart' element={<Cart />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/user/login' element={<LoginSignup />} />
          <Route path='/user/signup' element={<LoginSignup />} />
          <Route path='/user/reset_password' element={<LoginSignup />} />
          <Route path='/profile' element={<ProfileInfo />} />
          <Route path='/search/:query' element={<SearchResults />} /> 
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
