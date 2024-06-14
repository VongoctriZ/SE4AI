// import React from 'react'
// import './Hero.css'
// import hand_icon from '../Assets/hand_icon.png'
// import arrow_icon from '../Assets/arrow.png'
// import hero_image from '../Assets/hero_image.png'
// import men_banner from './Components/Assets/banner_mens.png'
// import women_banner from './Components/Assets/banner_women.png'
// import kids_banner from './Components/Assets/banner_kids.png'

// const Hero = () => {
//   return (
//     <div className='hero'>
//       <div className="hero-left">
//         <h2>NEW ARRIVALS ONLY</h2>
//         <div>
//           <div className="hero-hand-icon">
//             <p>new</p>
//             <img src={hand_icon} alt="" />
//           </div>
//           <p>collections</p>
//           <p>for everyone</p>
//         </div>
//         <div className="hero-latest-btn">
//           <div>Latest Collection</div>
//           <img src={arrow_icon} alt="" />
//         </div>
//       </div>
//       <div className="hero-right">
//         {/* <img src={hero_image} alt="" /> */}
//       </div>
//     </div>
//   )
// }

// export default Hero;



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
        <div className="carousel-image-container">
          <img src={banners[currentIndex]} alt={`Banner ${currentIndex + 1}`} />
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
