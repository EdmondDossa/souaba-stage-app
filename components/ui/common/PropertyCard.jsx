"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Bed, Bath, CarFront as Car } from "lucide-react";
import PropertyEllipsis from "./PropertyEllipsis";
import renderStars from "@/utils/render-star";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import getAxiosInstance from "@/lib/request";
import useAuthContext from "@/context/auth";

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
  imageContainerClassName = "",
  id,
  type,
  cardFullWidth = true,
  favoriteKind = "accommodation",
  onFavoriteChange,
  ...rest
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLogged } = useAuthContext();
  const [favorite, setFavorite] = useState(Boolean(isFavorite));
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    setFavorite(Boolean(isFavorite));
  }, [isFavorite]);

  const resolvedFavoriteKind = favoriteKind === "hotel" ? "hotel" : "accommodation";
  const bookingParams = new URLSearchParams();
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const capacity = searchParams.get("capacity");

  if (checkIn) bookingParams.set("check_in", checkIn);
  if (checkOut) bookingParams.set("check_out", checkOut);
  if (capacity) bookingParams.set("capacity", capacity);

  const baseHref =
    type === "hotel" ? `/hotels-details/${id}` : `/appartement-details/${id}`;
  const href = bookingParams.toString()
    ? `${baseHref}?${bookingParams.toString()}`
    : baseHref;

  const handleFavoriteToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (favoriteLoading || !id) return;

    if (!isLogged) {
      router.push("/login");
      return;
    }

    const http = getAxiosInstance();
    const nextFavorite = !favorite;

    setFavoriteLoading(true);
    try {
      if (nextFavorite) {
        const endpoint =
          resolvedFavoriteKind === "hotel"
            ? "/favorites/hotel"
            : "/favorites/accommodation";
        const payload =
          resolvedFavoriteKind === "hotel"
            ? { hotelId: id }
            : { accommodationId: id };
        await http.post(endpoint, payload);
      } else {
        const endpoint =
          resolvedFavoriteKind === "hotel"
            ? `/favorites/hotel/${id}`
            : `/favorites/accommodation/${id}`;
        await http.delete(endpoint);
      }

      setFavorite(nextFavorite);
      if (onFavoriteChange) {
        onFavoriteChange({
          id,
          favoriteKind: resolvedFavoriteKind,
          isFavorite: nextFavorite,
        });
      }
    } catch (error) {
      console.error("Erreur favoris:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };
  return (
    <div
      className={`relative w-full ${!cardFullWidth ? "max-w-[298px]" : ""} min-w-[200px] overflow-hidden ${
        className || ""
      }`}
      {...rest}
    >
      {/* Image Container */}
      <Link href={href}>
        <div
          className={`w-full h-72 lg:h-80 mt-2 bg-cover rounded-xl ${
            imageContainerClassName ?? ""
          }`}
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
            {isLogged && (
              <button
                type="button"
                aria-pressed={favorite}
                disabled={favoriteLoading}
                onClick={handleFavoriteToggle}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart
                  size={20}
                  fill={favorite ? "red" : "none"}
                  stroke={favorite ? "red" : "currentColor"}
                  strokeWidth={2}
                />
              </button>
            )}
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
      </Link>

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
