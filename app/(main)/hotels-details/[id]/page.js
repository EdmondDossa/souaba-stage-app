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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import getAxiosInstance from "@/lib/request";
import { useParams } from "next/navigation";
import MobileSearchMenu from "@/components/ui/common/MobileSearchMenu";
import PropertyDetailsSkeleton from "@/components/ui/common/PropertyDetailsSkeleton";
import toast from "react-hot-toast";
import { differenceInDays } from "date-fns";
import useAuthContext from "@/context/auth";

export default function HotelDetails() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { isLogged } = useAuthContext();

  const [hotelsData, setHotelsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [availabilityRooms, setAvailabilityRooms] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const hasfetchedData = useRef(false);
  const roomsSectionRef = useRef(null);

  const http = useMemo(() => getAxiosInstance(), []);

  const parseDateParam = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const handleBooking = async ({ selectedRooms, totalPerNight }) => {
    const checkIn = parseDateParam(searchParams.get("check_in"));
    const checkOut = parseDateParam(searchParams.get("check_out"));

    if (!checkIn || !checkOut) {
      toast.error("Veuillez sélectionner vos dates d'arrivée et de départ.");
      if (roomsSectionRef.current) {
        roomsSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("La date de départ doit être après la date d'arrivée.");
      return;
    }

    const nights = Math.max(1, differenceInDays(checkOut, checkIn));
    const capacityParam = Number.parseInt(
      searchParams.get("capacity") || "1",
      10
    );
    const derivedGuests = selectedRooms.reduce(
      (sum, room) => sum + room.quantity * (room.capacity || 1),
      0
    );
    const numberOfGuests =
      Number.isFinite(capacityParam) && capacityParam > 0
        ? capacityParam
        : Math.max(1, derivedGuests);

    const pendingReservation = {
      type: "hotel",
      hotelId: id,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      numberOfGuests,
      totalPrice: totalPerNight * nights,
      totalPerNight,
      rooms: selectedRooms.map(({ roomCategoryId, quantity }) => ({
        roomCategoryId,
        quantity,
      })),
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "pendingReservation",
        JSON.stringify(pendingReservation)
      );
    }
    router.push(`/make-reservation?type=hotel`);
  };

  const handleAvailabilitySearch = useCallback(async ({
    check_in,
    check_out,
    capacity,
  }) => {
    if (!check_in || !check_out) {
      toast.error("Veuillez sélectionner vos dates d'arrivée et de départ.");
      return;
    }
    const toIsoDate = (value) => {
      if (!value) return value;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toISOString();
    };
    try {
      setAvailabilityLoading(true);
      const { data } = await http.get(`/hotels/${id}/availability`, {
        params: {
          check_in: toIsoDate(check_in),
          check_out: toIsoDate(check_out),
          capacity: capacity || 1,
        },
      });
      const list =
        (Array.isArray(data?.data) && data.data) ||
        (Array.isArray(data) && data) ||
        [];
      setAvailabilityRooms(list);

      const params = new URLSearchParams(searchParams.toString());
      params.set("check_in", check_in);
      params.set("check_out", check_out);
      params.set("capacity", String(capacity || 1));
      router.replace(`/hotels-details/${id}?${params.toString()}`);
    } catch (error) {
      console.error("Erreur disponibilité hôtel:", error);
      toast.error("Impossible de récupérer les disponibilités.");
      setAvailabilityRooms([]);
    } finally {
      setAvailabilityLoading(false);
    }
  }, [http, id, router, searchParams]);

  useEffect(() => {
    hasfetchedData.current = false;
  }, [id]);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setIsLoading(true);
        if (hasfetchedData.current) return;
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
        setIsFavorite(Boolean(hotel?.isFavorite));
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotelData();
    window.scrollTo({ top: 0 });
  }, [id, http]);

  useEffect(() => {
    if (availabilityRooms !== null) return;
    const check_in = searchParams.get("check_in");
    const check_out = searchParams.get("check_out");
    const capacity = Number.parseInt(searchParams.get("capacity") || "1", 10);
    if (check_in && check_out) {
      handleAvailabilitySearch({ check_in, check_out, capacity });
    }
  }, [searchParams, availabilityRooms, handleAvailabilitySearch]);

  useEffect(() => {
    if (!isLogged) {
      setIsFavorite(false);
      return;
    }
    setIsFavorite(Boolean(hotelsData?.isFavorite));
  }, [hotelsData?.isFavorite, isLogged]);

  const renderSkeleton = () => <PropertyDetailsSkeleton />;

  if (isLoading) {
    return renderSkeleton();
  }

  if (!hotelsData) return null;

  const hotelsRooms = hotelsData.HotelRoomCategories || [];
  const availabilityByRoomId = new Map(
    (availabilityRooms || []).map((room) => [
      room?.room_category_id ??
        room?.roomCategoryId ??
        room?.hotel_room_category_id ??
        room?.id,
      room,
    ])
  );
  const availabilityState =
    availabilityRooms === null
      ? "idle"
      : availabilityRooms.length
        ? "available"
        : "empty";
  const roomsToShow =
    availabilityRooms === null
      ? hotelsRooms
      : hotelsRooms.map((room) => {
          const roomId =
            room?.room_category_id ??
            room?.roomCategoryId ??
            room?.hotel_room_category_id ??
            room?.id;
          const availability = availabilityByRoomId.get(roomId);
          const availableRooms =
            availability?.availableRooms ??
            availability?.available_rooms ??
            (availability ? availability?.available : undefined);
          return {
            ...room,
            availableRooms:
              typeof availableRooms === "number" ? availableRooms : 0,
          };
        });
  const hotelsMedias = hotelsData.HotelMedia || [];
  const locationText = [
    hotelsData?.address,
    hotelsData?.city,
    hotelsData?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-28">
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
                isFavorite={isFavorite}
              />

              <div className="mt-8">
                <PropertyAmenities amenities={hotelsData?.amenities || []} />
              </div>
            </div>
          </div>

          {/* Carte de réservation */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
            <div className="lg:overflow-visible">
              <PropertyBookingCard
                onBook={() => {
                  if (roomsSectionRef.current) {
                    roomsSectionRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                amenities={hotelsData?.amenities || []}
              />
            </div>
          </div>
        </div>

        <div className="mt-24"></div>
        {/* Places disponibles */}
        <div>
          <h3 className="text-xl ml-10  mt-10 font-montserrat-bold font-bold text-gray-700 mb-3">
            Disponibilité
          </h3>
          <div className="mt-5 hidden lg:block">
            <SearchBar
              isCentered={false}
              hideDestination
              defaultCapacity={1}
              initialValues={{
                check_in: searchParams.get("check_in") || "",
                check_out: searchParams.get("check_out") || "",
                capacity: searchParams.get("capacity") || 1,
              }}
              onSearch={handleAvailabilitySearch}
            />
          </div>
          <div className="mt-5 block lg:hidden">
            <MobileSearchMenu
              className="max-w-[280px] border border-gray-700 rounded-xl"
              hideDestination
              defaultCapacity={1}
              initialValues={{
                check_in: searchParams.get("check_in") || "",
                check_out: searchParams.get("check_out") || "",
                capacity: searchParams.get("capacity") || 1,
              }}
              onSearch={handleAvailabilitySearch}
            />
          </div>
        </div>

        {/* Chambres disponibles - Pleine largeur */}
        <div className="mt-8 p-6" ref={roomsSectionRef}>
          <HotelRooms
            hotelRooms={roomsToShow}
            onBook={handleBooking}
            availabilityState={availabilityState}
            availabilityLoading={availabilityLoading}
          />
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
