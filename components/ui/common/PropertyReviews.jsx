"use client";
import React from "react";
import { Star } from "lucide-react";

const PropertyReviews = ({
  rating = 5.0,
  reviewCount = 100,
  reviews = [],
  ratingCategories = [
    { label: "Équipements", rating: 5.0 },
    { label: "Hygiène", rating: 4.0 },
    { label: "Communication", rating: 5.0 },
    { label: "Emplacement de la propriété", rating: 5.0 },
    { label: "Rapport qualité-prix", rating: 4.0 }
  ],
}) => {
  const handleImageError = (e) => {
    e.target.src = "/images/profile.png";
  };

  return (
    <div className="">
      <div className="flex space-x-4 mb-6 mt-5">
        <div>
          <h3 className="text-xl  font-bold text-gray-700">
            Avis
          </h3>{" "}
        </div>
        <div className="flex items-center space-x-2">
          <Star size={20} fill="#FFD700" className="text-yellow-400" />
          <span className="font-montserrat-bold text-lg">{(+rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Grille de notation */}
      <div className="grid w-[800px] grid-cols-2 gap-3 mb-8">
        {ratingCategories.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.label}</span>
            <div className="flex items-center space-x-2">
              <div className="w-50 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(item.rating / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold min-w-[2rem]">
                {item.rating.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Commentaires */}
      <div className="grid w-[800px] grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3 p-4rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={review.profileImage || "/images/profile.png"}
                alt={`Photo de profil de ${review.author}`}
                className="w-12 h-12 rounded-full object-cover"
                onError={handleImageError}
              />
              <div>
                <div className="font-semibold text-sm">{review.author}</div>
                <div className="text-xs text-gray-500">{review.date}</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {review.content}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-10 mb-10 border border-primary text-black px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-all font-semibold">
        Afficher les {reviews.length} avis
      </button>
    </div>
  );
};


export default PropertyReviews;
