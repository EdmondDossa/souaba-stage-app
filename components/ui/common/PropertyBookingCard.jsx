"use client";
import { Heart, Share2, Star, Tv, Wifi, Home, Car, Shield, UtensilsCrossed, Wind } from "lucide-react";
import { useState } from "react";

export default function PropertyBookingCard({ 
  title, 
  location, 
  rating, 
  price, 
  propertyType = "hôtel",
  onBook 
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header avec favoris et partage */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 text-sm mb-3 flex items-center">
            <Star className="w-4 h-4 text-orange-500 mr-1" />
            {location}
          </p>
          <div className="flex items-center space-x-1">
            {renderStars(rating)}
            <span className="text-sm text-gray-600 ml-1">({rating}.0)</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Heart 
              size={20} 
              className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"} 
            />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Share2 size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Points forts */}
      <div className="space-y-4 mb-8">
        <h4 className="font-semibold text-gray-900 text-lg">Point fort de l'établissement</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Tv className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Télévision avec Netflix</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wifi className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Internet sans fil gratuit</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Balcon ou terrasse</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Parking</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Ascenseur</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Cuisine</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wind className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Climatiseur</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Buanderie</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-sm text-gray-700">Espace détente</span>
          </div>
        </div>
      </div>

      {/* Bouton de réservation */}
      <button
        onClick={onBook}
        className="w-full bg-red-500 text-white py-4 rounded-lg font-bold hover:bg-red-600 transition-colors text-base"
      >
        Réserver maintenant
      </button>
    </div>
  );
}
