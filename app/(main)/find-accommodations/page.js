"use client";
import foundAccomodityMap from "@/public/images/search-home-map.png";
import { X } from "lucide-react";
import Image from "next/image";
import FilterSideBar from "../find-hosting/components/FilterSideBar";
import { PropertyCard } from "@/components/ui/common";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import getAxiosInstance from "@/lib/request";
import { useRouter } from "next/navigation";
import Paginator from "@/components/ui/common/Paginator";
import PropertyCardSkeleton from "@/components/ui/common/PropertyCardSkeleton";
const FoundProducts = () => {
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Mise a jour du filters a chaque changement de searchParams
  const [filters, setFilters] = useState(
    searchParams ? Object.fromEntries(searchParams) : {}
  );

  const http = getAxiosInstance();
  const router = useRouter();

  // Synchroniser filters avec searchParams
  useEffect(() => {
    if (searchParams) {
      const newFilters = Object.fromEntries(searchParams);
      setFilters(newFilters);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const filtersThemes = Object.values(filters);
  const byLabelObject={
    "Tout":"popular",
    "Tout voir":"popular",
    "Populaire":"popular",
    "Proche":"nearby",
    "Prix-du plus bas au plus élevé":"price_asc",
    "Prix-du plus élevé au plus bas":"price_desc"
  };
 const ratingObject={
    "4.5 et plus":{
      min:4.5,
      max:5
    },
    "4.0-4.5":{
      min:4.0,
      max:4.5
    },
    "3.5-4.0":{
      min:3.5,
      max:4.0
    },
    "3.0-3.5":{
      min:3.0,
      max:3.5
    },
    "2.5-3.0":{
      min:2.5,
      max:3.0
    } 
 }

  const extractListAndTotalPages = (payload) => {
    const list =
      (Array.isArray(payload?.data?.data) && payload.data.data) ||
      (Array.isArray(payload?.data) && payload.data) ||
      (Array.isArray(payload?.items) && payload.items) ||
      (Array.isArray(payload) && payload) ||
      [];

    const total =
      payload?.data?.totalPages ||
      payload?.totalPages ||
      payload?.meta?.totalPages ||
      payload?.pagination?.totalPages ||
      1;

    return { list, totalPages: Math.max(1, total || 1) };
  };

  // Fonction pour transformer les données d'accommodation
  const transformAccommodation = (acc) => ({
    id: acc.accommodation_id,
    type: "accommodation",
    imageUrl:
      (acc?.AccommodationMedia || []).find((m) => m.is_primary)?.media
        ?.file_path ||
      acc?.AccommodationMedia?.[0]?.media?.file_path ||
      "/images/placeholder.jpg",
    price: `${parseInt(acc.price_per_night).toLocaleString('fr-FR')} FCFA`,
    title: acc.name,
    location: `${acc.address}, ${acc.city}, ${acc.country}`,
    rating: acc.avgRating,
    bedrooms: acc.number_of_rooms,
    bathrooms: acc.number_of_bathrooms,
    parking: acc.number_of_parking,
    isFavorite: acc.isFavorite
  });

  // Fonction pour transformer les chambres d'hôtel
  const transformHotelRoom = (hotel, roomCategory) => ({
    id: `${hotel.hotel_id}-${roomCategory.room_category_id}`,
    type: "hotel",
    imageUrl:
      (roomCategory?.HotelRoomCategoryMedia || []).find((m) => m.is_primary)
        ?.media?.file_path ||
      roomCategory?.HotelRoomCategoryMedia?.[0]?.media?.file_path ||
      (hotel?.HotelMedia || []).find((m) => m.is_primary)?.media?.file_path ||
      hotel?.HotelMedia?.[0]?.media?.file_path ||
      "/images/placeholder.jpg",
    price: Number.isFinite(Number(roomCategory.price_per_night))
      ? `${Number(roomCategory.price_per_night).toLocaleString("fr-FR")} FCFA`
      : "",
    title: `${hotel.name} - ${roomCategory.name}`,
    location: `${hotel.address}, ${hotel.city}, ${hotel.country}`,
    rating: hotel.avgRating,
    bedrooms: roomCategory.capacity,
    bathrooms: roomCategory.number_of_bathrooms,
    parking: 1, 
    isFavorite: hotel.isFavorite
  });

 
  const normalizeProperties = (items, type) => {
    if (!Array.isArray(items)) return [];

    if (type === "Hôtels") {
      // Pour les hôtels une carte est cree par catégorie de chambre
      return items.flatMap((hotel) =>
        (hotel.HotelRoomCategories || []).map((roomCategory) =>
          transformHotelRoom(hotel, roomCategory)
        )
      );
    } else {
      return items.map(transformAccommodation);
    }
  };

  useEffect(() => {
    const getFilteredProperties = async () => {
      try {
        setIsLoading(true);
        console.log("Executing query with filters:", filters, "page:", currentPage);
        
        if (!filters.type) {
          console.warn("No type specified");
          setFilteredProperties([]);
          setTotalPages(1);
          setIsLoading(false);
          return;
        }

        const typeEndpoints = {
          Hôtels: "/hotels",
          Appartements: "/accommodations",
          Villas: "/accommodations",
          Studios: "/accommodations",
          Résidences: "/accommodations",
        };

        const typeMapping = {
          Appartements: "APARTMENT",
          Villas: "VILLA",
          Studios: "STUDIO",
          Résidences: "RESIDENCE",
        };

        const endpoint = typeEndpoints[filters.type];

        if (!endpoint) {
          console.warn("Type de propriété non reconnu:", filters.type);
          return;
        }

        // Construction des paramètres selon le type
        let params;
        if (filters.type === "Hôtels") {
          // Format pour les hôtels
          params = new URLSearchParams({
            sortBy: byLabelObject[filters.byLabel] || "popular",
            ...(filters.byPrice && { priceMax: filters.byPrice }),
            ...(filters.byRating && { ratingMin: ratingObject[filters.byRating]?.min }),
            ...(filters.byRating && { ratingMax: ratingObject[filters.byRating]?.max }),
            ...(filters.byCommodities && { amenities: filters.byCommodities }),
          });
        } else {
          // Format pour les accommodations
          params = new URLSearchParams({
            type: typeMapping[filters.type],
            sortBy: byLabelObject[filters.byLabel] || "popular",
            ...(filters.byPrice && { priceMax: filters.byPrice }),
            ...(filters.byRating && { ratingMin: ratingObject[filters.byRating]?.min }),
            ...(filters.byRating && { ratingMax: ratingObject[filters.byRating]?.max }),
            ...(filters.byCommodities && { amenities: filters.byCommodities }),
            ...(filters.byBedrooms && { bedrooms: filters.byBedrooms }),
          });
        }

        params.set("page", currentPage);

        const response = await http.get(`${endpoint}?${params.toString()}`);
        console.log(`${filters.type} data:`, response.data);

        const { list, totalPages: apiTotalPages } =
          extractListAndTotalPages(response.data);

        // Normaliser les données selon le type
        const normalizedData = normalizeProperties(list, filters.type);
        setFilteredProperties(normalizedData);
        setTotalPages(apiTotalPages);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    
    if (filters.type) {
      getFilteredProperties();
    }
  }, [filters, currentPage]); 

    function handleFilterUpdate(filters) {
    console.log("filter:",filters);
    setCurrentPage(1);
    const query = new URLSearchParams(filters);
    router.replace(`/find-accommodations?type=${filters.type}&${query}`);
    
  }

  return (
    <div className="flex items-start mb-10 overflow-y-auto">
      <div className="w-1/2 overflow-auto pl-20">
        <div className="sticky">
          <h1 className="font-montserrat-bold text-gray-700 text-2xl mt-10">
            {isLoading
              ? "Chargement..."
              : `${filteredProperties.length} résultat${
                  filteredProperties.length > 1 ? "s" : ""
                } trouvé${filteredProperties.length > 1 ? "s" : ""}`}
          </h1>
          <div className="flex mr-9 mb-15 gap-x-2">
            <ul className="flex flex-wrap text-[12px] gap-2 mt-3">
              {filtersThemes.map((theme) => (
                <li
                  className="flex items-center gap-x-2 px-3 py-2 bg-gray-300 hover:bg-gray-200 transition rounded-3xl group cursor-pointer whitespace-nowrap"
                  key={theme}
                >
                  <span>{theme}</span>
                  <X className="w-4 h-4 group-hover:text-red-600 flex-shrink-0" />
                </li>
              ))}
            </ul>
            <div>
              <FilterSideBar onFilterUpdate={handleFilterUpdate} initialState={filters} />
            </div>
          </div>
        </div>
        <div className="mt-10 h-screen gap-y-10 flex flex-col p-4 overflow-y-auto me-15">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <PropertyCardSkeleton
                key={idx}
                layout="list"
                className="max-w-full flex-shrink-0 shadow-2xl mb-5 rounded-b-2xl [&_.bg-img]:rounded-b-none"
              />
            ))
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id || index}
                id={property.id}
                type={property.type}
                imageUrl={property.imageUrl}
                price={property.price}
                title={property.title}
                location={property.location}
                rating={property.rating}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                parking={property.parking}
                isFavorite={property.isFavorite}
                favoriteKind={property.type === "hotel" ? "hotel" : "accommodation"}
                showEllipsis={false}
                showAmenities={true}
                coloredAmeneties={true}
                showPrice={true}
                showRate={true}
                className="max-w-full flex-shrink-0 shadow-2xl mb-5 rounded-b-2xl [&_.bg-img]:rounded-b-none"
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">Aucun résultat trouvé</p>
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <Paginator
              defaultPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              nextPageTitle="Voir plus de résultats"
            />
          )}
        </div>
      </div>
      <aside className="w-1/2">
        <Image
          className="w-full h-[calc(100vh-50px)] object-cover"
          src={foundAccomodityMap}
          alt="found products map"
        />
      </aside>
    </div>
  );
};

export default FoundProducts;
