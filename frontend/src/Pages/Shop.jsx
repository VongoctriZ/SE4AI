import React from "react";
import Hero from '../Components/Hero/Hero';
import BestSellers from "../Components/BestSellers/BestSellers";
import Popular from "../Components/Popular/Popular";
import Offers from "../Components/Offers/Offers";
import NewCollections from "../Components/NewCollections/NewCollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";
import SideBar from "../Components/SideBar/SideBar";
import Recommendations from "../Components/Recommendations/Recommendations";

const Shop = () => {
    return (
        <div>
            {/* <SideBar/> */}
            <Hero />
            {/* <Recommendations /> */}
            <BestSellers />
            {/* <Popular /> */}
            {/* <Offers /> */}
            <NewCollections />
            {/* <NewsLetter /> */}
        </div>
    )
}

export default Shop;