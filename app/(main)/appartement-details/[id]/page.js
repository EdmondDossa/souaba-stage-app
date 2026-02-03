"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { Star, MapPin, Heart, CodeSquare } from "lucide-react";
import Image from "next/image";
import getAxiosInstance from "@/lib/request";
import {
  PropertyReservationForm,
  PropertyReviewsAppart,
  PropertyGalleryGrid,
  SvgIcon,
  PropertyGalleryAppart,
  PropertyGallery,
} from "../../../../components/ui/common";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PropertyDetailsSkeleton from "@/components/ui/common/PropertyDetailsSkeleton";
import { getAmenityIcon, getAmenityLabel } from "@/data/amenitiesMap";
import useAuthContext from "@/context/auth";
import { differenceInDays } from "date-fns";

const AppartementDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const http = useMemo(() => getAxiosInstance(), []);
  const [pageData, setPageData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isLogged } = useAuthContext();

  const normalizeMediaArray = useCallback((mediaArray = []) => {
    const list = Array.isArray(mediaArray) ? mediaArray : [];

    if (!list.length) {
      return [
        {
          media: { file_path: "/images/acceuil-first-image.webp" },
          is_primary: true,
        },
      ];
    }

    return list.map((item) => {
      if (item?.media?.file_path) return item;

      const filePath =
        item?.file_path || (typeof item === "string" ? item : undefined);

      return {
        ...item,
        media: {
          ...(item?.media || {}),
          file_path: filePath || "/images/acceuil-first-image.webp",
        },
        is_primary: item?.is_primary ?? false,
      };
    });
  }, []);

  // Normalise les données provenant d'une réservation (accommodation ou hôtel + chambre)
  const buildPageDataFromReservation = useCallback((reservation) => {
    if (!reservation) return null;

    const accommodation =
      reservation.accommodation ||
      reservation.Accommodation ||
      reservation.accommodation_details;

    const roomDetail =
      reservation.roomDetails?.[0] ||
      reservation.room_details?.[0] ||
      reservation.room_detail?.[0];

    const hotelRoomCategory =
      roomDetail?.hotelRoomCategory ||
      roomDetail?.HotelRoomCategory ||
      roomDetail?.hotel_room_category;

    const hotel =
      reservation.hotel ||
      reservation.Hotel ||
      accommodation?.Hotel ||
      hotelRoomCategory?.Hotel ||
      roomDetail?.Hotel ||
      roomDetail?.hotel;

    const mediaSource =
      accommodation?.AccommodationMedia ||
      accommodation?.accommodation_media ||
      hotelRoomCategory?.HotelRoomCategoryMedia ||
      hotelRoomCategory?.hotel_room_category_media ||
      hotel?.HotelMedia ||
      hotel?.hotel_media ||
      [];

    const name =
      accommodation?.name || hotelRoomCategory?.name || hotel?.name || "";

    const description =
      accommodation?.description ||
      hotelRoomCategory?.description ||
      hotel?.description ||
      "";

    const pricePerNight =
      accommodation?.price_per_night ||
      hotelRoomCategory?.price_per_night ||
      roomDetail?.price_at_booking ||
      0;

    return {
      name: name || "Hébergement",
      description,
      AccommodationMedia: normalizeMediaArray(mediaSource),
      amenities:
        accommodation?.amenities ||
        hotelRoomCategory?.amenities ||
        hotel?.amenities ||
        [],
      securities:
        accommodation?.securities || accommodation?.securityFeatures || [],
      reviews: reservation?.reviews || [],
      price_per_night: pricePerNight || 0,
      number_of_rooms:
        accommodation?.number_of_rooms ||
        hotelRoomCategory?.number_of_rooms ||
        0,
      number_of_bathrooms:
        accommodation?.number_of_bathrooms ||
        hotelRoomCategory?.number_of_bathrooms ||
        0,
      number_of_parking: accommodation?.number_of_parking || 0,
      address: accommodation?.address || hotel?.address || "",
      city: accommodation?.city || hotel?.city || "",
      country: accommodation?.country || hotel?.country || "",
      district: accommodation?.district || hotel?.district || "",
      avgRating:
        accommodation?.avgRating ||
        hotel?.avgRating ||
        hotelRoomCategory?.avgRating,
    };
  }, [normalizeMediaArray]);

  // État pour les favoris
  const [isFavorite, setIsFavorite] = useState(false);

  // Données de la propriété
  const property = {
    id: propertyId || "1",
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
      "/images/new-property4.jpg",
    ],
    bedrooms: 3,
    bathrooms: 2,
    parking: true,
    rating: 5.0,
    reviewCount: 100,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    amenities: [
      { name: "Cuisine", icon: "kitchen" },
      { name: "Télévision avec Netflix", icon: "tv" },
      { name: "Climatiseur", icon: "flocon" },
      { name: "Internet sans fil gratuit", icon: "wifi" },
      { name: "Rondelle", icon: "laundry 1" },
      { name: "Balcon ou terrasse", icon: "balcony 1" },
    ],
    cancellationPolicies: [
      {
        title: "Annulation Moins de 48h avant le jour J:",
        description: "Pas de remboursement",
      },
      {
        title: "Annulation Moins de 48h et 1 semaine avant le jour J:",
        description: "Montant à rembourser : 25% du total du montant",
      },
      {
        title: "Annulation Entre 1 semaine et 1 mois avant le jour J:",
        description: "Montant à rembourser : 50% du total du montant",
      },
    ],
    securityFeatures: [
      "Nettoyage quotidien",
      "Désinfections et stérilisations",
      "Extincteurs",
      "Détecteurs de fumée",
    ],
    reviews: [
      {
        id: 1,
        author: "John Doberman",
        date: "Mar 12 2020",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 2,
        author: "John Doberman",
        date: "Mar 12 2020",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 3,
        author: "John Doberman",
        date: "Mar 12 2020",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 4,
        author: "John Doberman",
        date: "Mar 12 2020",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
  };

  useEffect(() => {
    const details = async () => {
      try {
        setIsLoading(true);
        // 1. On tente de récupérer une réservation complète (cas hôtel ou accommodation)
        try {
          const reservationResponse = await http.get(
            `/reservations/${params.id}`
          );
          const reservationData = reservationResponse?.data;
          const normalizedReservation = buildPageDataFromReservation(
            reservationData
          );

          if (normalizedReservation) {
            setPageData(normalizedReservation);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          if (error?.response?.status !== 404) {
            console.error("Error fetching reservation details:", error);
          }
        }

        // 2. Fallback: récupération directe de l'accommodation (comportement existant)
        const request = await http.get(
          `/accommodations?accommodation_id=${params.id}&limit=1`
        );
        const payload = request?.data || {};
        const data =
          payload?.data?.[0] ||
          payload?.data ||
          payload?.accommodation ||
          null;

        if (!data) {
          setPageData(null);
          return;
        }

        setPageData({
          ...data,
          AccommodationMedia: normalizeMediaArray(
            data?.AccommodationMedia || data?.accommodation_media || data?.images
          ),
          amenities: data?.amenities || [],
          securities: data?.securities || data?.securityFeatures || [],
          reviews: data?.reviews || [],
          price_per_night: data?.price_per_night || 0,
          number_of_rooms: data?.number_of_rooms || 0,
          number_of_bathrooms: data?.number_of_bathrooms || 0,
          number_of_parking: data?.number_of_parking || 0,
        });
      } catch (error) {
        console.error("Error fetching accommodation details:", error);
        toast.error("Une erreur est survenue. Veuillez rechargez la page!");
      } finally {
        setIsLoading(false);
      }
    };
    details();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
    }
  }, [params.id, http, buildPageDataFromReservation, normalizeMediaArray]);

  useEffect(() => {
    if (!isLogged) {
      setIsFavorite(false);
      return;
    }
    setIsFavorite(Boolean(pageData?.isFavorite));
  }, [pageData?.isFavorite, isLogged]);

  if (isLoading) {
    return <PropertyDetailsSkeleton showSearch={false} />;
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Aucune information sur cet hébergement pour le moment.
      </div>
    );
  }

  async function saveReservation({
    checkIn,
    checkOut,
    babies,
    adults,
    children,
  }) {
    if (!checkIn || !checkOut) {
      return toast.error("Vous devez renseignez la date d'arrivée et de départ");
    }
    const arrivalDate = new Date(checkIn);
    const departureDate = new Date(checkOut);

    if (departureDate < arrivalDate) {
      return toast.error("La date de départ doit être après la date d'arrivée");
    }

    if (new Date(arrivalDate).getTime() + 86_400_000 < new Date().getTime()) {
      return toast.error(
        "La date d'arrivée doit être au minimum celle d'aujourd'hui"
      );
    }

    try {
      const availabilityResponse = await http.get(
        `/accommodations/${params.id}/availability`,
        {
          params: {
            check_in: arrivalDate.toISOString(),
            check_out: departureDate.toISOString(),
            capacity: adults + children || 1,
          },
        }
      );
      const availabilityPayload =
        availabilityResponse?.data?.data || availabilityResponse?.data || null;
      if (!availabilityPayload?.isAvailable) {
        return toast.error(
          "Cet hébergement n'est pas disponible pour ces dates."
        );
      }

      //le nombre de jours à faire dans cet appart
      const days_offset = Math.max(
        1,
        differenceInDays(departureDate, arrivalDate)
      );
      const pendingReservation = {
        type: "accommodation",
        accommodationId: params.id,
        checkInDate: arrivalDate.toISOString(),
        checkOutDate: departureDate.toISOString(),
        numberOfGuests: adults + babies + children,
        totalPrice: days_offset * pageData.price_per_night,
        pricePerNight: pageData.price_per_night,
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "pendingReservation",
          JSON.stringify(pendingReservation)
        );
      }
      router.push(`/make-reservation?type=accommodation`);
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la réservation!");
    }
  }

  const appartMedias = pageData.AccommodationMedia || [];
  const locationText = [pageData?.address, pageData?.city, pageData?.country]
    .filter(Boolean)
    .join(", ");
  const currency = pageData?.currency || property.currency;
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
        {/* Section Galerie d'images */}
        <div className="mb-8 mt-10 lg:mt-0">
          <PropertyGallery hotelsMedias={appartMedias} />
        </div>

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Détails */}
          <div className="lg:col-span-2 space-y-5">
            {/* En-tête avec titre et actions */}
            <div className="flex justify-between items-center lg:items-start">
              <div className="h-[120px]">
                <h1 className="text-xl  lg:text-3xl whitespace-nowrap lg:whitespace-normal font-bold text-gray-900 mt-10  font-montserrat-bold">
                  {pageData ? pageData?.name : property.title}
                </h1>
                <div className="flex items-center text-gray-600   mt-2 font-montserrat">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">
                    {locationText || property.location}
                  </span>
                </div>
                <div className="text-xl  mt-2  font-bold text-gray-900 font-montserrat-bold">
                  {pageData ? pageData?.price_per_night : property.price}{" "}
                  {currency}/ {property.period}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isLogged && (
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart
                      size={24}
                      className={
                        isFavorite
                          ? "fill-red-500 stroke-red-500"
                          : "stroke-yellow-500 text-gray-400"
                      }
                    />
                  </button>
                )}
                <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                  <SvgIcon name="share" size={24} className="filter " />
                </button>
              </div>
            </div>

            {/* Équipements */}
            <div className="grid grid-cols-3 mt-10  gap-1 lg:w-[580px]">
              <div className="border-2 border-primary pl-4 pr-4 pt-10 w-[110px] h-[130px] md:w-[176px] md:h-[160px] rounded-lg  p-5 text-center hover:shadow-md transition-shadow">
                <SvgIcon
                  name="bed"
                  size={35}
                  className="mx-auto mb-3 filter brightness-0 saturate-100 hue-rotate-200"
                />
                <div className="text-md font-semibold">
                  {pageData.number_of_rooms} chambres
                </div>
              </div>
              <div className="border-2 w-[110px] h-[130px] md:w-44 md:h-40 border-primary rounded-lg pl-4 pr-4 pt-10 text-center hover:shadow-md transition-shadow">
                <SvgIcon
                  name="bathtub"
                  size={35}
                  className="mx-auto mb-3 filter brightness-0 saturate-100 hue-rotate-200"
                />
                <div className="text-md font-semibold">
                  {pageData.number_of_bathrooms} salles de bains
                </div>
              </div>
              <div className="border-2 w-[110px] h-[130px] md:w-44 md:h-40 border-primary pl-4 pr-4 pt-10 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <SvgIcon
                  name="parking"
                  size={35}
                  className="mx-auto mb-3 filter brightness-0 saturate-100 hue-rotate-200"
                />
                <div className="text-md font-semibold">
                  {pageData.number_of_parking} parking
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-[16px] w-[785px]font-bold mb-4  font-montserrat-bold">
                Description de l&apos;appartement
              </h2>
              <div className="text-gray-400 text-justify text-sm mt-4 leading-relaxed whitespace-pre-line">
                {pageData?.description}
              </div>
            </div>

            {/* Commodités */}
            <div className="">
              <h2 className="text-xl lg:text-2xl font-bold mb-6 font-montserrat-bold pt-10">
                Commodités offertes
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(pageData?.amenities || property.amenities).map(
                  (amenity, index) => {
                    const raw =
                      typeof amenity === "string"
                        ? amenity
                        : amenity?.name || amenity?.icon || amenity;
                    const label = getAmenityLabel(raw);
                    const icon = getAmenityIcon(raw);
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2"
                      >
                        {icon?.endsWith(".svg") ? (
                          <Image
                            src={icon}
                            alt={label}
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <SvgIcon
                            name={String(raw).toLowerCase()}
                            size={24}
                            className="filter "
                          />
                        )}
                        <span className="text-gray-700 font-medium">
                          {label}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
              <button className="mt-6 text-black border-2 px-7 py-4 rounded-lg border-primary font-semibold  transition-all">
                Afficher les{" "}
                {(pageData?.amenities || property.amenities).length} équipements
              </button>
            </div>

            {/* Conditions d'annulation */}
            <div className=" mt-20">
              <h2 className="text-xl lg:text-2xl font-bold mb-6 pt-10 font-montserrat-bold">
                Conditions d&apos;annulation
              </h2>
              <div className="space-y-4 text-[14px]">
                {property.cancellationPolicies.map((policy, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-montserrat-bold  text-black mb-1">
                        {policy.title}
                      </p>
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
            <div className="mt-15 ">
              <h2 className="text-xl lg:text-2xl font-bold mb-6 pt-10 flex items-center font-montserrat-bold">
                Sécurité et hygiène
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:w-[580px]">
                {(pageData?.securities || property.securityFeatures).map(
                  (feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2"
                    >
                      <SvgIcon
                        name="Security et hygiene"
                        size={24}
                        className="mr-3 filter "
                      />

                      <span className="text-gray-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Avis */}
            <PropertyReviewsAppart
              rating={pageData?.avgRating || property.rating}
              reviewCount={pageData?.reviews?.length || property.reviewCount}
              reviews={pageData?.reviews || property.reviews}
            />
          </div>

          {/* Colonne de droite - Formulaire de réservation */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
            <div className="lg:pr-0">
              <PropertyReservationForm
                price={pageData.price_per_night}
                currency={property.currency}
                period={property.period}
                onBook={saveReservation}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppartementDetails;
