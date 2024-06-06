import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/Image_Header/logo.png'

const Footer = () => {
    return (
        <div className="footer">
            <a href="/">
            <div className="footer-logo">
                <img src={footer_logo} alt="" />
                <h1 className='brand'>DeepFashion</h1>
            </div>
            </a>
            <ul className="footer-links">
                <li>Shop</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Follow Us</li>
            </ul>
            <div className="footer-copyright">
                <hr />
                <p>@ 2024 DeepFashion - All Right Reserved</p>
            </div>
        </div>
    )
}


export default Footer;