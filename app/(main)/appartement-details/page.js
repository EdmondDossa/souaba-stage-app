"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart, Share, Bed, Bath, Car, Star, Shield, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { PropertyGallery } from '@/components/ui/common';

const AppartementDetails = () => {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');

  // États pour la galerie
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // États pour le formulaire de réservation
  const [reservationData, setReservationData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    babies: 0
  });

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
      "/images/new-property2.jpg"
    ],
    bedrooms: 3,
    bathrooms: 2,
    parking: true,
    rating: 5.0,
    reviewCount: 100,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    amenities: [
      { name: "Cuisine", icon: "🍳" },
      { name: "Télévision avec Netflix", icon: "📺" },
      { name: "Climatiseur", icon: "❄️" },
      { name: "Internet sans fil gratuit", icon: "📶" },
      { name: "Rondelle", icon: "🧺" },
      { name: "Balcon ou terrasse", icon: "🏡" }
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
        <div className="lg:col-span-2 space-y-8">
          
          {/* En-tête avec titre et actions */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-montserrat-bold">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
              <div className="text-2xl font-bold text-primary">
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
                  className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                <Share size={24} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Équipements */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <Bed size={28} className="mx-auto mb-3 text-primary" />
              <div className="text-xl font-semibold">{property.bedrooms}</div>
              <div className="text-sm text-gray-600 font-medium">chambres</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <Bath size={28} className="mx-auto mb-3 text-primary" />
              <div className="text-xl font-semibold">{property.bathrooms}</div>
              <div className="text-sm text-gray-600 font-medium">salles de bains</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <Car size={28} className="mx-auto mb-3 text-primary" />
              <div className="text-xl font-semibold">Parking</div>
              <div className="text-sm text-gray-600 font-medium">Disponible</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold mb-4 font-montserrat-bold">Description de l'appartement</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
              {property.description}
            </div>
          </div>

          {/* Commodités */}
          <div>
            <h2 className="text-2xl font-bold mb-6 font-montserrat-bold">Commodités offertes</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2">
                  <span className="text-2xl">{amenity.icon}</span>
                  <span className="text-gray-700 font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 text-primary font-semibold underline hover:no-underline transition-all">
              Afficher les 10 équipements
            </button>
          </div>

          {/* Conditions d'annulation */}
          <div>
            <h2 className="text-2xl font-bold mb-6 font-montserrat-bold">Conditions d'annulation</h2>
            <div className="space-y-4">
              {property.cancellationPolicies.map((policy, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{policy.title}</p>
                    <p className="text-gray-600">{policy.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 text-primary font-semibold underline hover:no-underline transition-all">
              Voir toutes les conditions
            </button>
          </div>

          {/* Sécurité et hygiène */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center font-montserrat-bold">
              <Shield size={24} className="mr-3 text-primary" />
              Sécurité et hygiène
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {property.securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Avis */}
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <h2 className="text-2xl font-bold font-montserrat-bold">Avis</h2>
              <div className="flex items-center space-x-2">
                <Star size={20} fill="#FFD700" className="text-yellow-400" />
                <span className="font-bold text-lg">{property.rating}</span>
                <span className="text-gray-500">({property.reviewCount} avis)</span>
              </div>
            </div>
            
            {/* Grille de notation */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Équipements', rating: 5.0 },
                { label: 'Hygiène', rating: 5.0 },
                { label: 'Communication', rating: 5.0 },
                { label: 'Emplacement de la propriété', rating: 5.0 }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(item.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold min-w-[2rem]">{item.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Commentaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {property.reviews.map((review) => (
                <div key={review.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">
                        {review.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
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
            
            <button className="mt-8 border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-all font-semibold">
              Afficher les {property.reviewCount} avis
            </button>
          </div>
        </div>

        {/* Colonne de droite - Formulaire de réservation */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-4 shadow-lg">
            <div className="mb-6">
              <div className="text-xl font-bold mb-1 text-gray-800">
                Prix Total:
              </div>
              <div className="text-3xl font-bold text-primary">
                ********** FCFA
              </div>
            </div>

            <div className="space-y-5">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Arrivée
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={reservationData.checkIn}
                      onChange={(e) => setReservationData(prev => ({...prev, checkIn: e.target.value}))}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Départ
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={reservationData.checkOut}
                      onChange={(e) => setReservationData(prev => ({...prev, checkOut: e.target.value}))}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Nombre d'invités */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nombre d'invités
                </label>
                
                {/* Adultes */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
                    <div>
                      <div className="font-semibold">Adultes</div>
                      <div className="text-sm text-gray-500">18 ans ou plus</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateGuestCount('adults', 'decrement')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={reservationData.adults <= 1}
                      >
                        <Minus size={16} className={reservationData.adults <= 1 ? "text-gray-300" : "text-gray-600"} />
                      </button>
                      <span className="font-semibold min-w-[2rem] text-center">{reservationData.adults}</span>
                      <button
                        onClick={() => updateGuestCount('adults', 'increment')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Enfants */}
                  <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
                    <div>
                      <div className="font-semibold">Enfants</div>
                      <div className="text-sm text-gray-500">2-17 ans</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateGuestCount('children', 'decrement')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={reservationData.children <= 0}
                      >
                        <Minus size={16} className={reservationData.children <= 0 ? "text-gray-300" : "text-gray-600"} />
                      </button>
                      <span className="font-semibold min-w-[2rem] text-center">{reservationData.children}</span>
                      <button
                        onClick={() => updateGuestCount('children', 'increment')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Bébés */}
                  <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
                    <div>
                      <div className="font-semibold">Bébés</div>
                      <div className="text-sm text-gray-500">Moins de 2 ans</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateGuestCount('babies', 'decrement')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={reservationData.babies <= 0}
                      >
                        <Minus size={16} className={reservationData.babies <= 0 ? "text-gray-300" : "text-gray-600"} />
                      </button>
                      <span className="font-semibold min-w-[2rem] text-center">{reservationData.babies}</span>
                      <button
                        onClick={() => updateGuestCount('babies', 'increment')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton de réservation */}
              <button className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                Réserver maintenant
              </button>

              {/* Informations supplémentaires */}
              <div className="text-center text-sm text-gray-500 space-y-1">
                <p>Vous ne serez pas débité pour le moment</p>
                <p className="flex items-center justify-center space-x-1">
                  <Shield size={14} />
                  <span>Paiement sécurisé</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Newsletter */}
      <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 font-montserrat-bold">
          Restez informé des meilleures offres
        </h3>
        <p className="text-gray-600 mb-6">
          Inscrivez-vous à notre newsletter pour recevoir des offres exclusives et des conseils de voyage
        </p>
        <div className="flex max-w-md mx-auto space-x-3">
          <input
            type="email"
            placeholder="Votre adresse email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all">
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppartementDetails;