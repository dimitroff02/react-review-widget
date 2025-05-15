import React from 'react';
import styles from './ProductDetails.module.css';
import ReviewList from './ReviewList';
import mockReviews from './mockReviews';

const ProductDetails = ({ product }) => {
  if (!product) return <p>Product not found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        <div className={styles.productImageWrapper}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.productImage}
          />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.title}</h1>
          <p className={styles.productPrice}>${product.price}</p>
          <p className={styles.highlight}>USA, USA, USA!</p>
          <p className={styles.productDescription}>{product.description}</p>
        </div>
      </div>

      <ReviewList reviews={mockReviews} />
    </div>
  );
};

export default ProductDetails;
