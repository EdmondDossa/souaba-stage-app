"use client";
import { PropertyGallery, PropertyDescriptionShared, PropertyAmenities, PropertyBookingCard, SecuritySection, HotelRooms } from "@/components/ui/common";
import { hotelData } from "./data/hotelData";
import { useRouter } from "next/navigation";

export default function HotelDetails() {
  const router = useRouter();

  const handleBooking = () => {
    router.push("/make-reservation")
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
            />
          </div>
        </div>

        {/* Chambres disponibles - Pleine largeur */}
        <div className="mt-8 p-6">
          <HotelRooms />
        </div>

        {/* Sécurité et hygiène - Après le tableau */}
        <div className="mt-8 p-6">
          <SecuritySection />
        </div>
      </div>
    </div>
  );
}
