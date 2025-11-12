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
import { hotelData } from "../data/hotelData";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, use } from "react";
import getAxiosInstance from "@/lib/request";
import { useParams } from "next/navigation";
import { HotelsRoom } from "../../(protected)/add-establishment/steps-components";

export default function HotelDetails() {

  const router = useRouter();
  const { id } = useParams();

  const [hotelsData, setHotelsData] = useState(null);
  const hasfetchedData = useRef(false);
  
  const http = getAxiosInstance();

  const handleBooking = () => {
    router.push("/make-reservation");
  };

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        if (hasfetchedData.current) return;
        hasfetchedData.current = true;
        const response = await http.get(`/hotels?hotel_id=${id}&limit=1`);
        setHotelsData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };
    fetchHotelData();
  }, [id]);

  if (!hotelsData) return;

  const hotelsRooms = hotelsData.HotelRoomCategories;
  const hotelsMedias = hotelsData.HotelMedia;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Galerie d'images */}
        <div className="mb-8">
          <PropertyGallery hotelsMedias={hotelsMedias} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description et Commodités fusionnées */}
            <div className="p-6">
              <PropertyDescriptionShared
                description={hotelsData?.description}
                title="Hotels"
                name={hotelsData.name}
                location={hotelsData?.address}
              />

              <div className="mt-8">
                <PropertyAmenities amenities={hotelsData?.amenities || []} />
              </div>
            </div>
          </div>

          {/* Carte de réservation */}
          <div className="lg:col-span-1">
            <PropertyBookingCard
              onBook={handleBooking}
              amenities={hotelsData?.amenities || []}
            />
          </div>
        </div>

        <div className="mt-24"></div>
        {/* Places disponibles */}
        <div>
          <h3 className="text-xl ml-10  mt-10 font-montserrat-bold font-bold text-gray-700 mb-3">
            Disponibilité
          </h3>
          <div className="mt-5">
            <SearchBar isCentered={false} />
          </div>
        </div>

        {/* Chambres disponibles - Pleine largeur */}
        <div className="mt-8 p-6">
          <HotelRooms hotelRooms={hotelsRooms} />
        </div>

        <div className="mt-0 md:mt-52"></div>

        {/* Sécurité et hygiène - Après le tableau */}
        <div className="p-6">
          <SecuritySection />
        </div>

        {/* Avis - Avant la newsletter */}
        <div className=" p-6">
          <PropertyReviews reviews={hotelsData?.reviews || []} />
        </div>
      </div>
    </div>
  );
}
