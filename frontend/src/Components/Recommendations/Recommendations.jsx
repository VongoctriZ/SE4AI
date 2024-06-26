// import React, { useEffect, useState } from 'react';
// import './Recommendations.css';
// import Item from '../Item/Item';

// const Recommendations = () => {
//     const [recommendedProducts, setRecommendedProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem('user'));
//         setUser(userData);
//         console.log("User data: ", userData);
//     }, []);

//     useEffect(() => {
//         if (user) {
//             fetch('http://localhost:4000/recommendation/foryou', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ user_id: user.Id })
//             })
//                 .then((response) => response.json())
//                 .then((data) => {
//                     setRecommendedProducts(data);
//                     setLoading(false);
//                 })
//                 .catch((err) => {
//                     setError(err.message);
//                     setLoading(false);
//                 });
//         } else {
//             setLoading(false);
//         }
//     }, [user]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!user) {
//         return null; // Return null if user is not logged in
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className="recommendations">
//             <h1>RECOMMENDATIONS</h1>
//             <hr />
//             <div className="recommendations-item">
//                 {recommendedProducts.map((item, i) => (
//                     <Item
//                         key={i}
//                         id={item.id}
//                         name={item.name}
//                         image={item.thumbnail_url}
//                         new_price={item.new_price}
//                         old_price={item.old_price}
//                         rating={item.rating}
//                         quantity_sold={item.all_time_quantity_sold}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Recommendations;


import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './Recommendations.css';
import Item from '../Item/Item';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Recommendations = () => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        console.log("User data: ", userData);
    }, []);

    useEffect(() => {
        if (user) {
            fetch('http://localhost:4000/recommendation/foryou', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: user.Id })
            })
                .then((response) => response.json())
                .then((data) => {
                    setRecommendedProducts(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null; // Return null if user is not logged in
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="recommendations">
            <h1>RECOMMENDATIONS</h1>
            <hr />
            <Slider {...settings} className="recommendations-slider">
                {recommendedProducts.map((item, i) => (
                    <Item
                        key={i}
                        id={item.id}
                        name={item.name}
                        image={item.thumbnail_url}
                        new_price={item.new_price}
                        old_price={item.old_price}
                        rating={item.rating}
                        quantity_sold={item.all_time_quantity_sold}
                    />
                ))}
            </Slider>
        </div>
    );
}

export default Recommendations;
