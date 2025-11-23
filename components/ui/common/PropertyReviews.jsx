"use client";
import React, { useMemo } from "react";
import { Star } from "lucide-react";

const PropertyReviews = ({
  hotelData,
  reviews = [],
}) => {
  const handleImageError = (e) => {
    e.target.src = "/images/profile.png";
  };

  // Calculer les moyennes des notes à partir des reviews de l'API
  const calculatedRatings = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      // Données statiques par défaut si pas de reviews
      return {
        globalRating: 5.0,
        reviewCount: 0,
        categories: [
          { label: "Propreté", rating: 5.0, field: "cleanliness_rating" },
          { label: "Service", rating: 4.0, field: "service_rating" },
          { label: "Rapport qualité-prix", rating: 4.0, field: "value_for_money_rating" },
          { label: "Emplacement", rating: 5.0, field: "location_rating" },
          { label: "Confort", rating: 5.0, field: "comfort_rating" }
        ]
      };
    }

    // Calculer les moyennes réelles depuis l'API
    const totalReviews = reviews.length;
    const sumRatings = {
      cleanliness: 0,
      service: 0,
      valueForMoney: 0,
      location: 0,
      comfort: 0,
      global: 0
    };

    reviews.forEach(review => {
      sumRatings.cleanliness += review.cleanliness_rating || 0;
      sumRatings.service += review.service_rating || 0;
      sumRatings.valueForMoney += review.value_for_money_rating || 0;
      sumRatings.location += review.location_rating || 0;
      sumRatings.comfort += review.comfort_rating || 0;
      sumRatings.global += review.rating || 0;
    });

    return {
      globalRating: (sumRatings.global / totalReviews).toFixed(1),
      reviewCount: totalReviews,
      categories: [
        { label: "Propreté", rating: (sumRatings.cleanliness / totalReviews).toFixed(1), field: "cleanliness_rating" },
        { label: "Service", rating: (sumRatings.service / totalReviews).toFixed(1), field: "service_rating" },
        { label: "Rapport qualité-prix", rating: (sumRatings.valueForMoney / totalReviews).toFixed(1), field: "value_for_money_rating" },
        { label: "Emplacement", rating: (sumRatings.location / totalReviews).toFixed(1), field: "location_rating" },
        { label: "Confort", rating: (sumRatings.comfort / totalReviews).toFixed(1), field: "comfort_rating" }
      ]
    };
  }, [reviews]);

  // Formater les reviews pour l'affichage
  const formattedReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      // Données statiques par défaut
      return [
        {
          id: 1,
          author: "Utilisateur anonyme",
          date: "En attente d'avis",
          content: "Aucun avis disponible pour le moment. Soyez le premier à donner votre avis !",
          profileImage: "/images/profile.png",
          rating: 5
        }
      ];
    }

    return reviews.map(review => ({
      id: review.hotel_review_id,
      author: review.user?.name || review.user?.email || "Utilisateur anonyme",
      date: new Date(review.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content: review.comment,
      profileImage: review.user?.profile_picture || "/images/profile.png",
      rating: review.rating
    }));
  }, [reviews]);

  return (
    <div className="">
      <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6 mt-5">
        <div>
          <h3 className="text-xl  font-bold text-gray-700">
            Avis
          </h3>{" "}
        </div>
        <div className="flex items-center space-x-2">
          <Star size={20} fill="#FFD700" className="text-yellow-400" />
          <span className="font-montserrat-bold text-lg">{calculatedRatings.globalRating}</span>
          <span className="text-sm text-gray-600">({calculatedRatings.reviewCount} avis)</span>
        </div>
      </div>

      {/* Grille de notation */}
      <div className="grid w-full lg:w-[800px] grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
        {calculatedRatings.categories.map((item) => (
          <div key={item.field} className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.label}</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 lg:w-50 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(item.rating / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold min-w-[2rem]">
                {item.rating}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Commentaires */}
      <div className="grid lg:w-[800px] grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {formattedReviews.slice(0, 6).map((review) => (
          <div key={review.id} className="space-y-3 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={review.profileImage || "/images/profile.png"}
                alt={`Photo de profil de ${review.author}`}
                className="w-12 h-12 rounded-full object-cover"
                onError={handleImageError}
              />
              <div className="flex-1">
                <div className="font-semibold text-sm">{review.author}</div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500">{review.date}</div>
                  {review.rating && (
                    <div className="flex items-center space-x-1">
                      <Star size={12} fill="#FFD700" className="text-yellow-400" />
                      <span className="text-xs font-medium">{review.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {review.content}
            </p>
          </div>
        ))}
      </div>

      {formattedReviews.length > 0 && (
        <button className="mt-10 mb-10 border border-primary text-black px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-all font-semibold">
          Afficher les {formattedReviews.length} avis
        </button>
      )}
    </div>
  );
};


export default PropertyReviews;
