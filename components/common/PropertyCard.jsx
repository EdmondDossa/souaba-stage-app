import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function PropertyCard({
  imageUrl,
  price,
  title,
  location,
  className,
  ...rest
}) {
  return (
    <div
      className={`relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-white ${
        className || ""
      }`}
      {...rest}
    >
      {/* Image Container */}
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
        />
        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {price}
        </div>
        {/* Heart Icon */}
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-red-500 transition-colors">
          <Heart size={20} fill="currentColor" strokeWidth={1} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{location}</p>
      </div>
    </div>
  );
}
