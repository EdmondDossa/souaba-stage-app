"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, MapPin, Heart } from 'lucide-react';
import Image from 'next/image';
import { 
  PropertyReservationForm, 
  PropertyReviews, 
  PropertyGalleryGrid, 
  SvgIcon, 
  PropertyGallery 
} from '../../../components/ui/common';

const AppartementDetails = () => {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');

  // État pour les favoris
  const [isFavorite, setIsFavorite] = useState(false);

  // Données de la propriété
  const property = {
    id: propertyId || '1',
    title: "Appartement bien meublé",
    location: "100 Smart Street, LA, États-Unis",
    price: "300 000",
    currency: "FCFA",
    period: "Nuit",
    images: [
      "/images/new-property1.jpg",
      "/images/new-property2.jpg", 
      "/images/new-property3.jpg",
      "/images/new-property4.jpg",
      "/images/new-property1.jpg",
      "/images/new-property2.jpg",
      "/images/new-property3.jpg",
      "/images/new-property4.jpg"
    ],
    bedrooms: 3,
    bathrooms: 2,
    parking: true,
    rating: 5.0,
    reviewCount: 100,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    amenities: [
      { name: "Cuisine", icon: "kitchen" },
      { name: "Télévision avec Netflix", icon: "tv" },
      { name: "Climatiseur", icon: "flocon" },
      { name: "Internet sans fil gratuit", icon: "wifi" },
      { name: "Rondelle", icon: "laundry 1" },
      { name: "Balcon ou terrasse", icon: "balcony 1" }
    ],
    cancellationPolicies: [
      {
        title: "Annulation Moins de 48h avant le jour J:",
        description: "Pas de remboursement"
      },
      {
        title: "Annulation Moins de 48h et 1 semaine avant le jour J:",
        description: "Montant à rembourser : 25% du total du montant"
      },
      {
        title: "Annulation Entre 1 semaine et 1 mois avant le jour J:",
        description: "Montant à rembourser : 50% du total du montant"
      }
    ],
    securityFeatures: [
      "Nettoyage quotidien",
      "Désinfections et stérilisations", 
      "Extincteurs",
      "Détecteurs de fumée"
    ],
    reviews: [
      {
        id: 1,
        author: "John Doberman",
        date: "Mar 12 2020",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        id: 2,
        author: "John Doberman", 
        date: "Mar 12 2020",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        id: 3,
        author: "John Doberman",
        date: "Mar 12 2020", 
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        id: 4,
        author: "John Doberman",
        date: "Mar 12 2020",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }
    ]
  };

  const updateGuestCount = (type, operation) => {
    setReservationData(prev => ({
      ...prev,
      [type]: operation === 'increment' 
        ? prev[type] + 1 
        : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }));
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Galerie d'images */}
        <div className="mb-8">
          <PropertyGallery
            images={property.images}
            propertyName={property.title}
          />
        </div>

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Colonne de gauche - Détails */}
          <div className="lg:col-span-2 space-y-5">

            {/* En-tête avec titre et actions */}
            <div className="flex justify-between items-start">
              <div className="h-[120px]">
                <h1 className="text-3xl font-bold text-gray-900 mt-10  font-montserrat-bold">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600   mt-2 font-montserrat">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <div className="text-xl  mt-2  font-bold text-gray-900 font-montserrat-bold">
                  {property.price} {property.currency}/ {property.period}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Heart
                    size={24}
                    className={isFavorite ? "fill-red-500 stroke-red-500"
      : "stroke-yellow-500 text-gray-400"}
                  />
                </button>
                <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                  <SvgIcon name="share" size={24} className="filter " />
                </button>
              </div>
            </div>

            {/* Équipements */}
            <div className="grid grid-cols-3 mt-10  gap-1 w-[580px]">
              <div className="border-2 border-primary pl-4 pr-4 pt-10 w-[176px] h-[160px] rounded-lg  p-5 text-center hover:shadow-md transition-shadow">
                <SvgIcon name="bed" size={35} className="mx-auto mb-3 filter brightness-0 saturate-100 hue-rotate-[200deg]" />
                <div className="text-md font-semibold">{property.bedrooms} chambres</div>
                
              </div>
              <div className="border-2 w-[176px] h-[160px] border-primary rounded-lg pl-4 pr-4 pt-10 text-center hover:shadow-md transition-shadow">
                <SvgIcon name="bathtub" size={35} className="mx-auto mb-3 filter brightness-0 saturate-100 hue-rotate-[200deg]" />
                <div className="text-md font-semibold">{property.bathrooms} salles de bains</div>
                
              </div>
              <div className="border-2 w-[176px] h-[160px] border-primary pl-4 pr-4 pt-10 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <SvgIcon name="parking" size={35} className="mx-auto mb-3 filter brightness-0 saturate-100 hue-rotate-[200deg]" />
                <div className="text-md font-semibold">Parking</div>
                
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-[15px] w-[785px]font-bold mb-4  font-montserrat-bold">Description de l&apos;appartement</h2>
              <div className="text-gray-400  mt-4 leading-relaxed whitespace-pre-line text-base">
                {property.description}
              </div>
            </div>

            {/* Commodités */}
            <div className=''>
              <h2 className="text-2xl font-bold mb-6 font-montserrat-bold pt-10">Commodités offertes</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2">
                    <SvgIcon name={amenity.icon} size={24} className="filter " />
                    <span className="text-gray-700 font-medium">{amenity.name}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 text-black border-2 px-7 py-4 rounded-lg border-primary font-semibold  transition-all">
                Afficher les 10 équipements
              </button>
            </div>

            {/* Conditions d'annulation */}
            <div className=' mt-20'>
              <h2 className="text-2xl font-bold mb-6 pt-10 font-montserrat-bold">Conditions d&apos;annulation</h2>
              <div className="space-y-4">
                {property.cancellationPolicies.map((policy, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-montserrat-bold  text-black mb-1">{policy.title}</p>
                      <p className="text-gray-600 ">{policy.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 text-primary font-semibold underline hover:no-underline transition-all">
                Voir toutes les conditions
              </button>
            </div>

            {/* Sécurité et hygiène */}
            <div className='mt-15 '>
              <h2 className="text-2xl font-bold mb-6 pt-10 flex items-center font-montserrat-bold">

                Sécurité et hygiène
              </h2>
              <div className="grid grid-cols-2 gap-4 w-[580px]">
                {property.securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2">

                    <SvgIcon name="Security et hygiene" size={24} className="mr-3 filter " />

                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avis */}
            <PropertyReviews
              rating={property.rating}
              reviewCount={property.reviewCount}
              reviews={property.reviews}
              
            />
          </div>

          {/* Colonne de droite - Formulaire de réservation */}
          <div className="lg:col-span-1">
            <PropertyReservationForm
              price={property.price}
              currency={property.currency}
              period={property.period}
              onBook={(reservationData) => {
                console.log('Données de réservation:', reservationData);
                // Logique de réservation
              }}
            />
          </div>
        </div>
      </div>

      
    </>
  );
};

export default AppartementDetails;