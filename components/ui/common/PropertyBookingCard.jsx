"use client";
import { Heart, Share2, Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import SvgIcon from "./SvgIcon";

export default function PropertyBookingCard({ onBook, amenities }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Points forts */}
        <div className="mb-8 hidden lg:block">
          <h2 className="font-montserrat-bold text-center text-2xl text-gray-700">
            {" "}
            Point fort de <br /> l'établissement{" "}
          </h2>
          <hr className="mx-4 text-gray-300 h-2 mt-3" />
          <div className="flex flex-col items-center justify-center py-2">
            <div className="flex flex-col">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <SvgIcon name={amenity} size={20} />
                  </div>
                  <span className="text-gray-700 text-sm font-montserrat-medium">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton de réservation */}
        <div className="mx-auto w-full md:w-[80%]">
          <button
            onClick={onBook}
            className="mx-auto w-full font-montserrat-bold text-center px-4 rounded-3xl bg-red-600 text-white py-4  font-bold hover:bg-primary-600 transition-colors text-sm"
          >
            Réserver maintenant
          </button>
        </div>
      </div>
    </>
  );
}
