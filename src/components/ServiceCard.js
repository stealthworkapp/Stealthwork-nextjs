import React from "react";
import Link from "next/link";

const ServiceCard = ({ icon: Icon, title, description, link }) => {
  return (
    <div
      className="bg-gray-900 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 flex flex-col h-full"
      id={`service-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Card content wrapper */}
      <div className="flex-grow">
        {/* Icon */}
        <Icon className="w-12 h-12 text-blue-400 mb-4" />

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 text-gray-100">{title}</h3>

        {/* Description */}
        <p className="text-gray-300 mb-4">{description}</p>
      </div>

      {/* Button container */}
      <div className="mt-auto">
        {link && (
          <Link
            href={link}
            className="inline-block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
            id={`service-card-link-${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            Try it now
          </Link>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
