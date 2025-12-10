"use client";
import { PropertyCard } from "@/components/ui/common";
import Paginator from "@/components/ui/common/Paginator";
import { Dot } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import FilterSideBar from "@/app/(main)/find-accomodation/components/FilterSideBar";
import { useRouter } from "next/navigation";
import getAxiosInstance from "@/lib/request";
import NoResults from "@/components/ui/common/NotFoundResults";

const FindAccomodation = () => {
  const [hotels, setHotels] = useState();
  const [accommodations, setAccommodations] = useState();
  const [properties, setProperties] = useState();
  const hasFetchedRef = useRef(false);
  const [currentFilter, setCurrentFilter] = useState("Hôtels");
  useEffect(() => {
    const http = getAxiosInstance();
    const fetchAccomodation = async () => {
      if (hasFetchedRef.current) {
        return;
      }

      try {
        hasFetchedRef.current = true;
        const accomodationsResponse = await http.get("/accommodations");
        const hotelsResponse = await http.get("/hotels");
        const properties = await http.get("/properties");
        setProperties(properties.data.data);
        setHotels(hotelsResponse.data);
        setAccommodations(accomodationsResponse.data);
        hasFetchedRef.current = true;
        console.log(properties.data);
        console.log("Accomodations:", accomodationsResponse.data);
        console.log("Hotels:", hotelsResponse.data);
      } catch (error) {
        hasFetchedRef.current = false;
        console.log(error);
      }
    };
    fetchAccomodation();
  });

  const filterPropertiesByType = (properties, selectedType) => {
    if (!properties || !Array.isArray(properties)) return [];

    if (selectedType === "Tout voir") {
      return properties;
    }

    return properties.filter((property) => {
      const isHotel = !!property.hotel_id;
      const accommodationType = property.type; // APARTMENT, STUDIO, VILLA

      switch (selectedType) {
        case "Hôtels":
          return isHotel;
        case "Résidences":
          return !isHotel && property.name?.toLowerCase().includes("résidence");
        case "Appartements":
          return !isHotel && accommodationType === "APARTMENT";
        case "Villas":
          return !isHotel && accommodationType === "VILLA";
        case "Studios":
          return !isHotel && accommodationType === "STUDIO";
        default:
          return true;
      }
    });
  };
  console.log(properties);
  const filteredProperties = filterPropertiesByType(properties, currentFilter);
  console.log(filteredProperties);
  const router = useRouter();

  const Properties = [
    {
      imageUrl: "/images/new-property1.jpg",
      price: "620 000 FCFA",
      title: "Appartement bien meublé",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 2,
    },
    {
      imageUrl: "/images/new-property2.jpg",
      price: "720 000 FCFA",
      title: "Appartement Familial Confortable",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: true,
      ellipsis: 3,
    },
    {
      imageUrl: "/images/new-property3.jpg",
      price: "820 000 FCFA",
      title: "Maison de plage d'été",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 1,
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 1,
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 2,
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 4,
    },
  ];

  const navItems = [
    "Hôtels",
    "Appartements",
    "Villas",
    "Studios",
    "Résidences",
    "Plus",
  ];

  function handleFilterChange(filter) {
    setCurrentFilter(filter);
  }

  function handlePageChange(page) {
    //
  }

  function handleFilterUpdate(filters) {
    const query = new URLSearchParams(filters);
    router.push(`/found-accomodations?type=${currentFilter}&${query}`);
  }
  if (!properties) {
    return;
  }
  return (
    <>
      <div className="max-w-7xl relative mx-auto px-20 mt-15 font-montserrat font-bold text-gray-800">
        {/* Search filter bar */}
        <nav className="flex justify-between items-center text-sm">
          <ul className="flex gap-x-3">
            {navItems.map((item, i) => (
              <li
                onClick={() => handleFilterChange(item)}
                className={`flex items-center cursor-pointer`}
                key={item}
              >
                {i > 0 && <Dot size={35} className="text-gray-300 -me-2" />}{" "}
                <span
                  className={` ${
                    item === currentFilter ? "active-border" : ""
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <div>
            <FilterSideBar onFilterUpdate={handleFilterUpdate} />
          </div>
        </nav>

        {/* Property List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 pb-4 scrollbar-hide w-full mt-10">
          {filteredProperties.length == 0 ? (
            <div className="flex w-full col-span-4 justify-center items-center mx-auto bg-gray-50 my-2 roundd-md">
              <NoResults />
            </div>
          ) : (
            filteredProperties.map((property, index) => {
            const isHotel = property.hotel_id;
            const mediaArray = isHotel
              ? property.HotelMedia
              : property.AccommodationMedia ??
                property.accommodation_media ??
                property.images;
            console.log(mediaArray);
            const primaryImage =
              mediaArray?.find((media) => media.is_primary)?.media?.file_path ||
              mediaArray?.[0]?.media?.file_path ||
              mediaArray?.[0].file_path;
            console.log(primaryImage);
            return (
              <PropertyCard
                key={index}
                id={property.accommodation_id ?? property.hotel_id}
                imageUrl={primaryImage || "/images/acceuil-first-image.webp"}
                price={
                  isHotel
                    ? "Prix sur demande"
                    : `${property.price_per_night} FCFA`
                }
                title={property.name}
                location={`${property.address}, ${property.city}, ${property.country}`}
                rating={property.avgRating || 0}
                isFavorite={false}
                className="max-w-full [&_.card-body]:text-red-500"
                type={isHotel ? "hotel" : property.type}
              />
            );
          })
          )}

         
        </div>
        <Paginator
          onPageChange={handlePageChange}
          defaultPage={1}
          totalPages={15}
        />
      </div>
    </>
  );
};

export default FindAccomodation;
