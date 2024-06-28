import React from "react";
import Hero from '../Components/Hero/Hero';
import BestSellers from "../Components/BestSellers/BestSellers";
import NewCollections from "../Components/NewCollections/NewCollections";
import Recommendations from "../Components/Recommendations/Recommendations";

const Shop = () => {
    return (
        <div>
            <Hero />
            <Recommendations />
            <BestSellers />
            <NewCollections />
        </div>
    )
}

export default Shop;