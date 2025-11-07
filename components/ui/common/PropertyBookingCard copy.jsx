"use client";
import { Heart, Share2, Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import SvgIcon from "./SvgIcon";

const amenityIcons = {
  wifi: "wifi",
  parking: "Parking 1",
  climatisation: "flocon",
  cuisine: "kitchen",
  piscine: "piscine",
  securite: "Security et hygiene",
  salle_sport: "espace",
  room_service: "kitchen",
  television: "tv",
  balcon: "balcony 1",
  buanderie: "laundry 1",
  ascenseur: "ascenseur",
  espace_detente: "espace",
};

export default function PropertyBookingCard({
  title,
  location,
  rating,
  price,
  propertyType = "hôtel",
  onBook,
  amenities,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Points forts */}
      <div className="mb-8">
        <h2 className="font-montserrat-bold text-center text-2xl text-gray-700">
          {" "}
          Point fort de <br /> l'établissement{" "}
        </h2>
        <hr className="mx-4 text-gray-300 h-2 mt-3" />
        <div className="flex flex-col items-center justify-center py-2">
          <div className="flex flex-col">
            {amenities.map((amenity, index) => {
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <SvgIcon name={amenityIcons[amenity.icon]} size={20} />
                  </div>
                  <span className="text-gray-700 text-sm font-montserrat-medium">
                    {amenity.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bouton de réservation */}
      <div className="mx-auto w-full md:w-[80%]">
        <button
          onClick={onBook}
          className="mx-auto w-full font-montserrat-bold text-center px-4  rounded-3xl bg-red-600 text-white py-4  font-bold hover:bg-primary-600 transition-colors text-sm"
        >
          Réserver maintenant
        </button>
      </div>
    </div>
  );
}
