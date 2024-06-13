import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import CommentBox from '../Components/CommentBox/CommentBox'; // Import the CommentBox component
import './CSS/Product.css';

const Product = () => {
    const { allProduct, allComments } = useContext(ShopContext);
    const { productId } = useParams();
    const product = allProduct.find((e) => e.id === Number(productId));
    const [displayContent, setDisplayContent] = useState('description');
    const [averageRating, setAverageRating] = useState(0);

    const comments = allComments.filter((comment) => comment.product_id === Number(productId)); // Assuming comments have a 'product_id' field

    useEffect(() => {
        if (comments.length > 0) {
            const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
            setAverageRating(totalRating / comments.length);
        }
    }, [comments]);

    // console.log("avg rating: ",averageRating);

    if (!product) {
        return <div>Product not found</div>;
    }

    const handleDescriptionClick = () => {
        if (displayContent !== 'description') {
            setDisplayContent('description');
        }
    };

    const handleCommentsClick = () => {
        if (displayContent !== 'comments') {
            setDisplayContent('comments');
        }
    };

    return (
        <div>
            <Breadcrumbs product={product} />
            <ProductDisplay product={product} rating={averageRating} />
            <div className="product-details">
                <div className="product-details-nav">
                    <div
                        className={`product-details-nav-button ${displayContent === 'description' ? 'active' : ''}`}
                        onClick={handleDescriptionClick}
                    >
                        Description
                    </div>
                    <div
                        className={`product-details-nav-button ${displayContent === 'comments' ? 'active' : ''}`}
                        onClick={handleCommentsClick}
                    >
                        Reviews ({comments.length})
                    </div>
                </div>
                <div className="product-details-content">
                    {displayContent === 'description' ? (
                        <DescriptionBox {...product} displayFlag={displayContent} />
                    ) : (
                        <CommentBox comments={comments} displayFlag={displayContent} />
                    )}
                </div>
            </div>
            {/* <RelatedProducts /> */}
        </div>
    );
};

export default Product;