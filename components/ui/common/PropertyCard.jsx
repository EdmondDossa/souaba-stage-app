import React from "react";
import Image from "next/image";
import {
  Heart,
  Bed,
  Bath,
  CarFront as Car,
} from "lucide-react";
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
  coloredAmeneties = false,
  showEllipsis = false,
  ellipsis = 0,
  showPrice = true,
  ownerInfo = null,
  imageContainerClassName="",
  ...rest
}) {
  return (
    <div
      className={`relative w-full max-w-[298px] overflow-hidden ${
        className || ""
      }`}
      {...rest}
    >
      {/* Image Container */}
      <div
        className={`w-full h-96 bg-cover rounded-xl ${ imageContainerClassName ?? ""}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="relative card-body h-full w-full rounded-xl bg-black/50 bg-img">
          {/* Price Tag */}
          <div className="absolute bottom-1 left-4 w-full">
            <div className="flex justify-between items-center">
              <strong className="font-montserrat-medium text-white block text-[17px] font-bold">
                {showPrice && price}
              </strong>
              {showEllipsis && <PropertyEllipsis current={ellipsis} />}
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
          {ownerInfo && (
            <div className="flex items-center absolute m-3 bottom-0 text-sm gap-x-2 mx-2">
              <div className="shrink-0">
                {" "}
                <Image
                  className="w-16 h-16"
                  width={200}
                  height={200}
                  alt=""
                  src={ownerInfo.photo}
                />{" "}
              </div>
              <div className="text-white">
                <span className="block"> Répertorié par: </span>
                <strong className="block font-montserrat-bold">
                  {" "}
                  {ownerInfo.fullname}{" "}
                </strong>
                <span className="block whitespace-nowrap font-bold">
                  {" "}
                  {`À partir de: ${ownerInfo.minPrice}-${ownerInfo.maxPrice} FCFA `}{" "}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <h3 className="text-lg font-semibold font-montserrat-bold text-gray-700 mb-1">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 font-bold">{location}</p>

        {/* Amenities with icons */}
        {showAmenities && (
          <div
            className={`flex items-center gap-4 text-gray-600 ameneties ${
              coloredAmeneties ? "[&_svg]:text-primary" : ""
            }`}
          >
            {/* Bedrooms */}
            <div className="flex items-center gap-1">
              <Bed size={23} className="text-gray-700 " />
              <span className="text-sm font-montserrat-bold">{bedrooms}</span>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-1">
              <Bath size={23} className="text-gray-700" />
              <span className="text-sm font-montserrat-bold">{bathrooms}</span>
            </div>

            {/* Parking */}
            <div className="flex items-center gap-1">
              <Car size={23} className="text-gray-700 " />
              <span className="text-sm font-montserrat-bold">{parking}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
