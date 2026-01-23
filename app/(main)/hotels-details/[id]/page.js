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
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import getAxiosInstance from "@/lib/request";
import { useParams } from "next/navigation";
import MobileSearchMenu from "@/components/ui/common/MobileSearchMenu";
import PropertyDetailsSkeleton from "@/components/ui/common/PropertyDetailsSkeleton";

export default function HotelDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [hotelsData, setHotelsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasfetchedData = useRef(false);
  const roomsSectionRef = useRef(null);

  const http = getAxiosInstance();

  const handleBooking = () => {
    if (roomsSectionRef.current) {
      roomsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setIsLoading(true);
        if (hasfetchedData.current && hotelsData) return;
        hasfetchedData.current = true;
        const response = await http.get(`/hotels?hotel_id=${id}&limit=1`);
        const payload = response?.data || {};
        const hotel =
          payload?.data?.[0] || payload?.data || payload?.hotel || null;

        if (!hotel) {
          setHotelsData(null);
          return;
        }

        // Normaliser les médias pour éviter les crash si vide
        const normalizedMedia =
          hotel?.HotelMedia?.length > 0
            ? hotel.HotelMedia
            : [
                {
                  media: { file_path: "/images/acceuil-first-image.webp" },
                  is_primary: true,
                },
              ];

        setHotelsData({
          ...hotel,
          HotelMedia: normalizedMedia,
          HotelRoomCategories: hotel?.HotelRoomCategories || [],
          amenities: hotel?.amenities || [],
          reviews: hotel?.reviews || [],
        });
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotelData();
    window.scrollTo({ top: 0 });
  }, [id, hotelsData]);

  const renderSkeleton = () => <PropertyDetailsSkeleton />;

  if (isLoading) {
    return renderSkeleton();
  }

  if (!hotelsData) return null;

  const hotelsRooms = hotelsData.HotelRoomCategories;
  const hotelsMedias = hotelsData.HotelMedia || [];
  const locationText = [
    hotelsData?.address,
    hotelsData?.city,
    hotelsData?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 mt-10 lg:mt-0">
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
                location={locationText}
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
          <div className="mt-5 hidden lg:block">
            <SearchBar isCentered={false} />
          </div>
          <div className="mt-5 block lg:hidden">
            <MobileSearchMenu className="max-w-[280px] border border-gray-700 rounded-xl" />
          </div>
        </div>

        {/* Chambres disponibles - Pleine largeur */}
        <div className="mt-8 p-6" ref={roomsSectionRef}>
          <HotelRooms hotelRooms={hotelsRooms} />
        </div>

        <div className="mt-0 md:mt-52 lg:hidden"></div>

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
