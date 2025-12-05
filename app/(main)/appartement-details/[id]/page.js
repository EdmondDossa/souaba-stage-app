"use client";
import React, { useState, useEffect, useRef } from "react";
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

const AppartementDetails = () => {
  const params = useParams();
  const hasFetchedRef = useRef(false);
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const http = getAxiosInstance();
  const [pageData, setPageData] = useState();
  const router = useRouter();

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

  const updateGuestCount = (type, operation) => {
    setReservationData((prev) => ({
      ...prev,
      [type]:
        operation === "increment"
          ? prev[type] + 1
          : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }));
  };

  useEffect(() => {
    const details = async () => {
      try {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        const request = await http.get(
          `/accommodations?accommodation_id=${params.id}&limit=1`
        );
        if (request.data.data?.[0]) setPageData(request.data.data[0]);
      } catch (error) {
        console.error("Error fetching accommodation details:", error);
        toast.error("Une erreur est survenue. Veuillez rechargez la page!");
      }
    };
    details();
    window.scrollTo({ top: 0 });
  }, [params.id]);

  if (!pageData) return null;

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

    //le nombre de jours à faire dans cet appart
    const days_offset = (new Date(checkOut) - new Date(checkIn)) / 86_400_000;
    try {
      const data = {
        checkInDate: arrivalDate,
        checkOutDate: departureDate,
        numberOfGuests: adults + babies + children,
        totalPrice: days_offset * pageData.price_per_night,
        accommodationId: params.id,
      };
      toast.loading("Réservation en cours ...");
      const res = await http.post("/reservations", data);
      router.push(
        `/make-reservation?r=${res.data.reservation_id}&h=${res.data.accommodation_id}`
      );
      toast.dismiss();
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la réservation!");
    }
  }

  const appartMedias = pageData.AccommodationMedia;
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                    {pageData.address}, {pageData.country}
                  </span>
                </div>
                <div className="text-xl  mt-2  font-bold text-gray-900 font-montserrat-bold">
                  {pageData ? pageData?.price_per_night : property.price}{" "}
                  {property.currency}/ {property.period}
                </div>
              </div>
              <div className="flex items-center space-x-3">
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
                  (amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2"
                    >
                      <SvgIcon
                        name={(typeof amenity === "string"
                          ? amenity
                          : amenity.icon
                        ).toLowerCase()}
                        size={24}
                        className="filter "
                      />
                      <span className="text-gray-700 font-medium">
                        {typeof amenity === "string" ? amenity : amenity.name}
                      </span>
                    </div>
                  )
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
          <div className="lg:col-span-1">
            <PropertyReservationForm
              price={pageData.price_per_night}
              currency={property.currency}
              period={property.period}
              onBook={saveReservation}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppartementDetails;
