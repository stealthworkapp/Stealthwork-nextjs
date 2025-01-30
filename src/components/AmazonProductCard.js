import React from "react";

const AmazonProductCard = ({ product }) => {
  // Destructure product properties for easier access
  const { name, imageUrl, productUrl } = product;

  return (
    <div
      className="bg-gray-900 rounded-lg shadow-md overflow-hidden max-w-sm"
      id="amazon-product-card"
    >
      {/* Product name container */}
      <div className="p-4" id="product-name-container">
        <h3
          className="text-lg font-semibold truncate"
          title={name}
          id="product-name"
        >
          {name}
        </h3>
      </div>

      {/* Product image container */}
      <div className="h-48 overflow-hidden" id="product-image-container">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          id="product-image"
        />
      </div>

      {/* Buy now button container */}
      <div className="p-4" id="buy-button-container">
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center py-2 px-4 rounded text-gray-800 font-semibold transition duration-300"
          id="buy-now-button"
        >
          Buy Now
        </a>
      </div>
    </div>
  );
};

export default AmazonProductCard;
