import React from "react"
import Hero from '../Components/Hero/Hero'
import Popular from "../Components/Popular/Popular";
import Offers from "../Components/Offers/Offers";
import NewCollections from "../Components/NewCollections/NewCollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";
import SideBar from "../Components/SideBar/SideBar";
const Shop = () => {
    return (
        <div>
            {/* <SideBar/> */}
            <Hero />
            <Popular />
            {/* <Offers /> */}
            <NewCollections />
            {/* <NewsLetter /> */}
        </div>
    )
}

export default Shop;