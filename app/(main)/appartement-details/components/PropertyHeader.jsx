"use client";
import React, { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';

const PropertyHeader = ({ 
  title = "Appartement bien meublé",
  price = "300 000",
  currency = "FCFA",
  period = "Nuit",
  onFavoriteToggle,
  onShare 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    if (onFavoriteToggle) {
      onFavoriteToggle(newFavoriteState);
    }
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else {
      // Fallback: copier l'URL dans le presse-papier
      navigator.clipboard.writeText(window.location.href);
      // Ici tu pourrais ajouter une notification toast
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start">
        {/* Section titre et prix */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {title}
          </h1>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-medium text-gray-600">Prix Total:</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl md:text-3xl font-bold text-primary">
                {price}
              </span>
              <span className="text-lg font-medium text-gray-700">
                {currency}
              </span>
              <span className="text-base text-gray-500">
                / {period}
              </span>
            </div>
          </div>
        </div>

        {/* Section actions */}
        <div className="flex items-center space-x-3 ml-4">
          {/* Bouton partage */}
          <button
            onClick={handleShareClick}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
            aria-label="Partager cette propriété"
          >
            <Share2 
              size={18} 
              className="text-gray-600 group-hover:text-gray-800 transition-colors"
            />
          </button>

          {/* Bouton favoris */}
          <button
            onClick={handleFavoriteClick}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
              isFavorite 
                ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart 
              size={18} 
              className={`transition-all duration-200 ${
                isFavorite 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Ligne de séparation optionnelle */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <span>• Disponible à la réservation</span>
          <span className="mx-2">•</span>
          <span>Confirmation instantanée</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
