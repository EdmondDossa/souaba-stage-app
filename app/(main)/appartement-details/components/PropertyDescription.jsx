"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PropertyDescription = ({ 
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  maxLength = 300
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = description.length > maxLength;
  const displayedDescription = shouldTruncate && !isExpanded 
    ? description.substring(0, maxLength) + "..."
    : description;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Description de l&apos;appartement
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed text-justify">
          {displayedDescription}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={toggleExpanded}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200"
          >
            <span>{isExpanded ? 'Voir moins' : 'Lire la suite'}</span>
            {isExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        )}
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">L&apos;espace</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Salon spacieux avec canapé convertible</li>
              <li>• Cuisine entièrement équipée</li>
              <li>• Balcon avec vue sur la ville</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Accès des voyageurs</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Accès complet à l&apos;appartement</li>
              <li>• Parking privé inclus</li>
              <li>• Entrée autonome</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;
