"use client";
import foundAccomodityMap from "@/public/images/search-home-map.png";
import { X } from "lucide-react";
import Image from "next/image";
import FilterSideBar from "../find-accomodation/components/FilterSideBar";
import { PropertyCard } from "@/components/ui/common";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import getAxiosInstance from "@/lib/request";
import { useRouter } from 'next/navigation'
import { handleClientScriptLoad } from "next/script";
const FoundProducts = () => {
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  // Mettre à jour filters à chaque changement de searchParams
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
    }
  }, [searchParams]);

  const filtersThemes = Object.values(filters);
  const byLabelObject={
    "Tout voir":"all",
    "Populaire":"popular",
    "Proche":"nearby",
    "Prix-du plus bas au plus élevé":"price_asc",
    "Prix-du plus élevé au plus bas":"price_desc"
  } ;
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

  const Properties = [
    {
      imageUrl: "/images/new-property1.jpg",
      price: "620 000 FCFA",
      title: "Appartement bien meublé",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 2,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property2.jpg",
      price: "720 000 FCFA",
      title: "Appartement Familial Confortable",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: true,
      ellipsis: 3,

      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property3.jpg",
      price: "820 000 FCFA",
      title: "Maison de plage d'été",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 1,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 1,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 2,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 4,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
  ];

  useEffect(() => {
    const getFilteredProperties = async () => {
      try {
        console.log("Executing query with filters:", filters);
        
        if (!filters.type) {
          console.warn("No type specified");
          return;
        }

        const typeEndpoints = {
          Hôtels: "/hotels",
          Appartements: "/APARTEMENT",
          Villas: "/VILLAS",
          Studios: "/STUDIOS",
          Résidences: "/RESIDENCES",
        };

        const endpoint = typeEndpoints[filters.type];

        if (!endpoint) {
          console.warn("Type de propriété non reconnu:", filters.type);
          return;
        }

        const params = new URLSearchParams({
          sortBy: byLabelObject[filters.byLabel] || "popular",
          priceMax: filters.byPrice || 100000,
          ratingMin: ratingObject[filters.byRating]?.min || 4,
          ratingMax: ratingObject[filters.byRating]?.max || 5,
          amenities: filters.byCommodities || ["WiFi", "Piscine", "Parking"],
          bedrooms: filters.byBedrooms || 2,
        });

        const response = await http.get(`${endpoint}?${params.toString()}`);
        console.log(`${filters.type} data:`, response.data);

        setFilteredProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    
    if (filters.type) {
      getFilteredProperties();
    }
  }, [filters]); 

    function handleFilterUpdate(filters) {
    console.log("filter:",filters);
    const query = new URLSearchParams(filters);
    const params = new URLSearchParams({
          sortBy: byLabelObject[filters.byLabel] || "popular",
          priceMax: filters.byPrice || 100000,
          ratingMin: ratingObject[filters.byRating]?.min || 4,
          ratingMax: ratingObject[filters.byRating]?.max || 5,
          amenities: filters.byCommodities || ["WiFi", "Piscine", "Parking"],
          bedrooms: filters.byBedrooms || 2,
        });
    console.log(query);
    router.replace(`/found-accomodations?type=${filters.type}&${query}`);
    
  }

  return (
    <div className="flex items-start mb-10 overflow-y-auto">
      <div className="w-1/2 overflow-auto pl-20">
        <div className="sticky">
          <h1 className="font-montserrat-bold text-gray-700 text-2xl mt-10">
            10 résultats trouvés
          </h1>
          <div className="flex items-end gap-x-5">
            <ul className="flex text-[12px] gap-x-3 mt-5">
              {filtersThemes.map((theme) => (
                <li
                  className="flex row flex-wrap justify-center p-2 bg-gray-300 hover:bg-gray-200 transition rounded-2xl group cursor-pointer"
                  key={theme}
                >
                  {theme}
                  <span>
                    <X className="w-4 h-5 ms-4 group-hover:text-red-600" />
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <FilterSideBar onFilterUpdate={handleFilterUpdate} initialState={filters} />
            </div>
          </div>
        </div>
        <div className="mt-10 h-screen gap-y-10 flex flex-col p-4 overflow-y-auto me-15">
          {Properties.map((property, index) => (
            <PropertyCard
              key={index}
              imageUrl={property.imageUrl}
              price={property.price}
              title={property.title}
              location={property.location}
              isFavorite={property.isFavorite}
              showEllipsis={true}
              ellipsis={property.ellipsis}
              showAmenities={true}
              coloredAmeneties={true}
              showPrice={true}
              className="max-w-full flex-shrink-0 shadow-2xl mb-5 rounded-b-2xl  [&_.bg-img]:rounded-b-none"
            />
          ))}
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
