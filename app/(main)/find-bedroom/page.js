"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Filter } from 'lucide-react';

const FindBedroomPage = () => {
  const [activeTab, setActiveTab] = useState('Hôtel');
  const [favorites, setFavorites] = useState([]);

  const tabs = ['Hôtel', 'Résidence', 'Villas', 'Plus'];

  const apartments = [
    {
      id: 1,
      title: "Appartement bien meublé",
      location: "100 Smart Street, LA, USA",
      price: "3 100 000 FCFA",
      image: "/images/new-property1.jpg",
      images: [
        "/images/new-property1.jpg",
        "/images/new-property2.jpg",
        "/images/new-property3.jpg",
        "/images/new-property4.jpg"
      ]
    },
    {
      id: 2,
      title: "Bâtiment de rêve incroyable",
      location: "100 Smart Street, LA, USA",
      price: "3 100 000 FCFA",
      image: "/images/new-property2.jpg",
      images: [
        "/images/new-property2.jpg",
        "/images/new-property1.jpg",
        "/images/new-property3.jpg",
        "/images/new-property4.jpg"
      ]
    },
    {
      id: 3,
      title: "Appartement pour garçons",
      location: "100 Smart Street, LA, USA",
      price: "3 100 000 FCFA",
      image: "/images/new-property3.jpg",
      images: [
        "/images/new-property3.jpg",
        "/images/new-property1.jpg",
        "/images/new-property2.jpg",
        "/images/new-property4.jpg"
      ]
    },
    {
      id: 4,
      title: "Studio moderne centre-ville",
      location: "250 Downtown Avenue, Paris, FR",
      price: "2 800 000 FCFA",
      image: "/images/new-property4.jpg",
      images: [
        "/images/new-property4.jpg",
        "/images/new-property1.jpg",
        "/images/new-property2.jpg",
        "/images/new-property3.jpg"
      ]
    },
    {
      id: 5,
      title: "Loft industriel avec terrasse",
      location: "89 Industrial Street, NYC, USA",
      price: "4 200 000 FCFA",
      image: "/images/new-property1.jpg",
      images: [
        "/images/new-property1.jpg",
        "/images/new-property3.jpg",
        "/images/new-property4.jpg",
        "/images/new-property2.jpg"
      ]
    },
    {
      id: 6,
      title: "Appartement familial spacieux",
      location: "156 Family Road, London, UK",
      price: "3 600 000 FCFA",
      image: "/images/new-property2.jpg",
      images: [
        "/images/new-property2.jpg",
        "/images/new-property4.jpg",
        "/images/new-property1.jpg",
        "/images/new-property3.jpg"
      ]
    },
    {
      id: 7,
      title: "Penthouse avec vue panoramique",
      location: "45 Skyline Tower, Dubai, UAE",
      price: "5 500 000 FCFA",
      image: "/images/new-property3.jpg",
      images: [
        "/images/new-property3.jpg",
        "/images/new-property2.jpg",
        "/images/new-property4.jpg",
        "/images/new-property1.jpg"
      ]
    },
    {
      id: 8,
      title: "Appartement cosy près de la plage",
      location: "78 Ocean View, Miami, USA",
      price: "3 400 000 FCFA",
      image: "/images/new-property4.jpg",
      images: [
        "/images/new-property4.jpg",
        "/images/new-property3.jpg",
        "/images/new-property1.jpg",
        "/images/new-property2.jpg"
      ]
    },
    {
      id: 9,
      title: "Duplex moderne avec jardin",
      location: "123 Garden Street, Toronto, CA",
      price: "4 100 000 FCFA",
      image: "/images/new-property1.jpg",
      images: [
        "/images/new-property1.jpg",
        "/images/new-property4.jpg",
        "/images/new-property3.jpg",
        "/images/new-property2.jpg"
      ]
    },
    {
      id: 10,
      title: "Studio étudiant équipé",
      location: "67 University Road, Boston, USA",
      price: "2 200 000 FCFA",
      image: "/images/new-property2.jpg",
      images: [
        "/images/new-property2.jpg",
        "/images/new-property1.jpg",
        "/images/new-property4.jpg",
        "/images/new-property3.jpg"
      ]
    },
    {
      id: 11,
      title: "Appartement de luxe meublé",
      location: "234 Luxury Lane, Monaco, MC",
      price: "6 800 000 FCFA",
      image: "/images/new-property3.jpg",
      images: [
        "/images/new-property3.jpg",
        "/images/new-property4.jpg",
        "/images/new-property2.jpg",
        "/images/new-property1.jpg"
      ]
    }
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header avec onglets et filtres */}
        <div className="flex items-center justify-between mb-8">
          {/* Onglets */}
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-lg font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
            ))}
          </div>

          {/* Bouton Filtres */}
          <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors">
            <Filter size={20} className="text-gray-600" />
            <span className="text-gray-700 font-medium">Filtres</span>
          </button>
        </div>

        {/* Grille des appartements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apartment) => (
            <div key={apartment.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
              {/* Image avec carrousel */}
              <div className="relative h-72 overflow-hidden rounded-t-2xl">
                <Image
                  src={apartment.image}
                  alt={apartment.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Bouton favori */}
                <button
                  onClick={() => toggleFavorite(apartment.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm bg-white/90"
                >
                  <Heart 
                    size={18} 
                    className={`${
                      favorites.includes(apartment.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-500 hover:text-red-400'
                    } transition-colors`}
                  />
                </button>

                {/* Prix overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black/75 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                    <span className="font-bold text-lg">{apartment.price}</span>
                  </div>
                </div>

                {/* Indicateurs de carousel */}
                <div className="absolute bottom-4 right-4 flex space-x-1.5">
                  {apartment.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === 0 
                          ? 'bg-white' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {apartment.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  {apartment.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination ou Load More */}
        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Voir plus d&apos;hébergements
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindBedroomPage;