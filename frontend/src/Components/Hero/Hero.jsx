import React, { useState } from 'react';
import './Hero.css';
import men_banner from '../Assets/banner_mens.png';
import women_banner from '../Assets/banner_women.png';
import kids_banner from '../Assets/banner_kids.png';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const banners = [men_banner, women_banner, kids_banner];

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handleMouseEnter = () => {
    setShowButtons(true);
  };

  const handleMouseLeave = () => {
    setShowButtons(false);
  };

  return (
    <div className="hero">
      <div
        className="carousel"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`carousel-button prev ${showButtons ? 'visible' : 'hidden'}`}
          onClick={handlePrevClick}
        >
          ❮
        </button>
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {banners.map((banner, index) => (
            <div key={index} className="carousel-image-container">
              <img src={banner} alt={`Banner ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </div>
        <button
          className={`carousel-button next ${showButtons ? 'visible' : 'hidden'}`}
          onClick={handleNextClick}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Hero;
