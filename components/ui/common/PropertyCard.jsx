import React from "react";
import Image from "next/image";
import { Heart, Star, Bed, Bath, Car, Ellipsis } from "lucide-react";
import PropertyEllipsis from "./PropertyEllipsis";
import renderStars from "@/utils/render-star";

export default function PropertyCard({
  imageUrl,
  price,
  title,
  isFavorite,
  location,
  rating = 0,
  bedrooms = 3,
  bathrooms = 1,
  parking = 2,
  className,
  showRate = false,
  showAmenities = false,
  showEllipsis = false,
  ellipsis = 0,
  ...rest
}) {

  return (
    <div
      className={`relative w-full max-w-[320px] overflow-hidden ${className || ""}`}
      {...rest}
    >
      {/* Image Container */}
      <div
        className="w-full h-72 bg-cover rounded-xl"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="relative h-full w-full rounded-xl bg-black/50">
          {/* Price Tag */}
          <div className="absolute bottom-1 left-4 w-full">
            <div className="flex justify-between items-center">
              <strong className="font-montserrat-medium text-white  text-[17px] font-bold"> {price}</strong>
              {
                showEllipsis &&  <PropertyEllipsis current={ellipsis} />
              }
            </div>
          </div>
          {/* Stars Rating */}
          {showRate && (
            <div className="absolute top-4 left-4 p-2  flex items-center gap-1 mb-2">
              {renderStars(rating)}
            </div>
          )}
          {/* Heart Icon */}
          <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
            <Heart
              size={20}
              fill={isFavorite ? "red" : "none"}
              stroke={isFavorite ? "red" : "currentColor"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>

        <p className="text-gray-600 text-sm mb-3">{location}</p>

        {/* Amenities with icons */}
        {showAmenities && (
          <div className="flex items-center gap-4 text-gray-600">
            {/* Bedrooms */}
            <div className="flex items-center gap-1">
              <Bed size={18} className="text-gray-700" />
              <span className="text-sm font-medium">{bedrooms}</span>
            </div>
            
            {/* Bathrooms */}
            <div className="flex items-center gap-1">
              <Bath size={18} className="text-gray-700" />
              <span className="text-sm font-medium">{bathrooms}</span>
            </div>
            
            {/* Parking */}
            <div className="flex items-center gap-1">
              <Car size={18} className="text-gray-700" />
              <span className="text-sm font-medium">{parking}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
