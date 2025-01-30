import React from "react";
import AmazonProductCard from "./AmazonProductCard"; // Ensure this path is correct

const FeaturedProducts = ({ amazonProducts }) => {
  const allProducts = amazonProducts?.products || [];
  const featuredProducts = allProducts.filter(product => product.featured === true);

  if (featuredProducts.length === 0) {
    return null; // Don't render the component if there are no featured products
  }

  return (
    <div
      id="featured-products-container"
      className="mt-8 max-w-6xl mx-auto px-4"
    >
      <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
      <div
        id="featured-products-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        {featuredProducts.map((product) => (
          <AmazonProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
