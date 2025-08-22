"use client";
import React from 'react';
import { Bed, Bath, Car } from 'lucide-react';

const PropertyFeatures = ({ 
  bedrooms = 3,
  bathrooms = 2,
  hasParking = true,
  additionalFeatures = []
}) => {
  const features = [
    {
      icon: Bed,
      label: bedrooms === 1 ? 'chambre' : 'chambres',
      value: bedrooms,
      color: 'text-blue-600'
    },
    {
      icon: Bath,
      label: bathrooms === 1 ? 'salle de bains' : 'salles de bains',
      value: bathrooms,
      color: 'text-cyan-600'
    }
  ];

  if (hasParking) {
    features.push({
      icon: Car,
      label: 'Parking',
      value: '',
      color: 'text-green-600'
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Caractéristiques
      </h2>
      
      <div className="flex flex-wrap gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div 
              key={index}
              className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-3 min-w-0"
            >
              <div className={`flex-shrink-0 p-2 rounded-lg bg-white ${feature.color}`}>
                <IconComponent size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-1">
                  {feature.value && (
                    <span className="text-lg font-bold text-gray-900">
                      {feature.value}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {feature.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Fonctionnalités additionnelles */}
        {additionalFeatures.map((feature, index) => (
          <div 
            key={`additional-${index}`}
            className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-3"
          >
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyFeatures;
