import './App.css'
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kids_banner from './Components/Assets/banner_kids.png'
import Profile from './Pages/Profile';
import ShopContextProvider from './Context/ShopContext';

import Header from './Components/Header/Header';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        {/* <Navbar /> */}
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/men' element={
            // <ShopCategory banner={men_banner} category="men" />
            <ShopContextProvider category="men">
              <ShopCategory banner={men_banner} category="men" />
            </ShopContextProvider>
          } />
          <Route path='/women' element={
            // <ShopCategory banner={women_banner} category="women" />
            <ShopContextProvider category="women">
              <ShopCategory banner={women_banner} category="women" />
            </ShopContextProvider>
          } />
          <Route path='/kids' element={
            // <ShopCategory banner={kids_banner} category="kid" />
            <ShopContextProvider category="kids">
              <ShopCategory banner={kids_banner} category="kids" />
            </ShopContextProvider>

          } />
          {/* <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>
           */}

          <Route path='/product/:productId' element={
            <ShopContextProvider>
              <Product />
            </ShopContextProvider>
          } />
          <Route path='/cart' element={<Cart />} />
          <Route path='/user/login' element={<LoginSignup />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;