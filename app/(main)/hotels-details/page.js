"use client";
import {
  PropertyGallery,
  PropertyDescriptionShared,
  PropertyAmenities,
  PropertyBookingCard,
  SecuritySection,
  HotelRooms,
  PropertyReviews,
  SearchBar,
} from "@/components/ui/common";
import { hotelData } from "./data/hotelData";
import { useRouter } from "next/navigation";

export default function HotelDetails() {
  const router = useRouter();

  const handleBooking = () => {
    router.push("/make-reservation");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Galerie d'images */}
        <div className="mb-8">
          <PropertyGallery
            images={hotelData.images}
            propertyName={hotelData.name}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description et Commodités fusionnées */}
            <div className="p-6">
              <PropertyDescriptionShared
                description={hotelData.description}
                title={hotelData.title}
                name={hotelData.name}
                location={hotelData.location}
              />

              <div className="mt-8">
                <PropertyAmenities amenities={hotelData.amenities} />
              </div>
            </div>
          </div>

          {/* Carte de réservation */}
          <div className="lg:col-span-1">
            <PropertyBookingCard
              title={hotelData.name}
              location={hotelData.location}
              rating={hotelData.rating}
              price={hotelData.price}
              propertyType="hôtel"
              onBook={handleBooking}
              amenities={hotelData.amenities}
            />
          </div>
        </div>

        <div className="mt-24"></div>
        {/* Places disponibles */}
        <div>
          <h3 className="text-xl  mt-10 font-montserrat-bold font-bold text-gray-700 mb-3">
            Disponibilité
          </h3>
          <div className="mt-5">
            <SearchBar  isCentered={false}/>
          </div>
        </div>

        {/* Chambres disponibles - Pleine largeur */}
        <div className="mt-8 p-6">
          <HotelRooms />
        </div>

        <div className="mt-0 md:mt-52"></div>

        {/* Sécurité et hygiène - Après le tableau */}
        <div className="p-6">
          <SecuritySection />
        </div>

        {/* Avis - Avant la newsletter */}
        <div className="mt-8 p-6">
          <PropertyReviews
            rating={hotelData.rating}
            reviewCount={hotelData.reviewCount}
            reviews={hotelData.reviews}
          />
        </div>
      </div>
    </div>
  );
}
