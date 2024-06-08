import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import CommentBox from '../Components/CommentBox/CommentBox'; // Import the CommentBox component

const Product = () => {
  const { allProduct,
    //  allComments
     } = useContext(ShopContext);
  const { productId } = useParams();
  const product = allProduct.find((e) => e.id === Number(productId));
  // const comments = allComments.filter((comment) => comment.product_id === productId); // Assuming comments have a 'product_id' field

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <div className="product-details">
        <DescriptionBox {...product} />
        {/* <CommentBox comments={comments} /> */}
      </div>
      <RelatedProducts />
    </div>
  );
};

export default Product;
