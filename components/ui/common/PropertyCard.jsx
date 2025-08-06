import React from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";

export default function PropertyCard({
  imageUrl,
  price,
  title,
  isFavorite,
  location,
  rating = 0,
  className,
  showRate = false,
  ...rest
}) {
  // Fonction pour générer les étoiles
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Étoiles pleines
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          fill="#FFD700"
          stroke="#FFD700"
          className="text-yellow-400"
        />
      );
    }

    // Demi-étoile
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={16} stroke="#FFD700" fill="none" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={16} fill="#FFD700" stroke="#FFD700" />
          </div>
        </div>
      );
    }

    // Étoiles vides
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={16}
          stroke="#D1D5DB"
          fill="none"
          className="text-gray-300"
        />
      );
    }

    return stars;
  };

  return (
    <div
      className={`relative w-full max-w-sm overflow-hidden ${className || ""}`}
      {...rest}
    >
      {/* Image Container */}
      <div
        className="w-full h-64 bg-cover rounded-xl"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="relative h-full w-full rounded-xl bg-black/50">
          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 text-white px-3 py-1 text-[17px] font-bold ">
            {price}
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

        <p className="text-gray-600 text-sm">{location}</p>
      </div>
    </div>
  );
}
