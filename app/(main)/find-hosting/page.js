"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useMemo } from "react";
import getAxiosInstance from "@/lib/request";
import NoResults from "@/components/ui/common/NotFoundResults";
import PropertyList from "@/components/ui/common/PropertyList";
import Paginator from "@/components/ui/common/Paginator";
import FilterSideBar from "@/app/(main)/find-hosting/components/FilterSideBar";
import { Dot } from "lucide-react";
import PropertyCardSkeleton from "@/components/ui/common/PropertyCardSkeleton";

const MapPlaceholder = () => (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
    <p className="text-gray-500">Chargement de la carte...</p>
  </div>
);

const Map = dynamic(() => import("@/components/ui/common/Map"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

export default function FindHostingPage() {
  const [property, setProperty] = useState("Tout voir");
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterSideBarParams, setFilterSideBarParams] = useState({});

  const http = useMemo(() => getAxiosInstance(), []);
  const limit = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentRequestParams = { page: currentPage, limit };

      // Map filterSideBarParams to DTO parameters
      if (filterSideBarParams.byLabel && filterSideBarParams.byLabel !== "Tout") {
        const sortByMap = {
          Populaire: "popular",
          Proche: "nearby",
          "Prix-du plus bas au plus élevé": "price_asc",
          "Prix-du plus élevé au plus bas": "price_desc",
        };
        const sortBy = sortByMap[filterSideBarParams.byLabel];
        if (sortBy) {
          currentRequestParams.sortBy = sortBy;
        }
      }

      if (filterSideBarParams.byPrice) {
        const priceValue = Number(filterSideBarParams.byPrice);
        if (Number.isFinite(priceValue) && priceValue > 0) {
          currentRequestParams.priceMax = priceValue;
        }
      }

      if (filterSideBarParams.byRating && filterSideBarParams.byRating !== "Tous") {
        const ratingMap = {
          "4.5 et plus": 4.5,
          "4.0-4.5": 4.0,
          "3.5-4.0": 3.5,
          "3.0-3.5": 3.0,
          "2.5-3.0": 2.5,
        };
        const ratingValue = ratingMap[filterSideBarParams.byRating];
        if (Number.isFinite(ratingValue)) {
          currentRequestParams.rating = ratingValue;
        }
      }

      if (filterSideBarParams.byCommodities) {
        if (Array.isArray(filterSideBarParams.byCommodities)) {
          if (filterSideBarParams.byCommodities.length) {
            currentRequestParams.amenities = filterSideBarParams.byCommodities;
          }
        } else if (String(filterSideBarParams.byCommodities).trim()) {
          currentRequestParams.amenities = [
            String(filterSideBarParams.byCommodities).trim(),
          ];
        }
      }

      const resolveBedroomsValue = (value) => {
        if (!value || value === "Tous") return null;
        if (value === "5+") return 5;
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
      };

      const bedroomsValue = resolveBedroomsValue(filterSideBarParams.byBedrooms);
      if (bedroomsValue !== null) {
        currentRequestParams.bedrooms = bedroomsValue;
      }
      
      const accommodationTypeMap = {
        "Hôtels": "HOTEL",
        "Résidences": "RESIDENCE",
        "Appartements": "APARTMENT",
        "Villas": "VILLA",
        "Studio": "STUDIO",
      };

      if (accommodationTypeMap[property]) {
        currentRequestParams.type = accommodationTypeMap[property];
      }

      const response = await http.get("/search/properties", {
        params: currentRequestParams,
      });
      const properties = response.data?.data || [];
      const total = response.data?.pagination?.total ?? response.data?.total ?? 0;
      const totalPagesFromApi =
        response.data?.pagination?.totalPages ?? Math.ceil(total / limit);
      const safeTotalPages =
        Number.isFinite(totalPagesFromApi) && totalPagesFromApi > 0
          ? totalPagesFromApi
          : 1;

      setDisplayedProperties(properties);
      setTotalPages(safeTotalPages);

      if (properties.length === 0) {
        setError("Aucun résultat trouvé pour cette catégorie et ces filtres.");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de chargement des propriétés.");
      setDisplayedProperties([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [property, currentPage, filterSideBarParams, http]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navItems = [
    "Tout voir",
    "Hôtels",
    "Résidences",
    "Appartements",
    "Villas",
    "Studio",
  ];

  function handleFilterChange(newProperty) {
    setProperty(newProperty);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handleFilterSideBarUpdate(filters) {
    setFilterSideBarParams(filters);
    setCurrentPage(1);
  }
  
  return (
    <div className="w-full">
      <nav className="max-w-7xl relative mx-auto px-4 sm:px-6 lg:px-20 mt-15 font-montserrat font-bold text-gray-800 flex justify-between items-center text-sm">
        <ul className="flex gap-x-3 overflow-x-auto">
          {navItems.map((item, i) => (
            <li
              onClick={() => handleFilterChange(item)}
              className="flex-shrink-0 flex items-center cursor-pointer"
              key={item}
            >
              {i > 0 && <Dot size={35} className="text-gray-300 -me-2" />}{" "}
              <span
                className={`p-2 ${
                  item === property ? "active-border" : ""
                }`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <FilterSideBar onFilterUpdate={handleFilterSideBarUpdate} />
        </div>
      </nav>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <FilterSideBar
          onFilterUpdate={handleFilterSideBarUpdate}
          contentSide="top"
          triggerClassName="bg-white shadow-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-150px)] mt-4">
        <div className="overflow-y-auto px-4">
          {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                      <PropertyCardSkeleton key={idx} />
                  ))}
               </div>
          ) : error ? (
              <div className="text-red-500 text-center font-bold my-4 p-4 bg-red-100 border border-red-300 rounded-md h-full flex items-center justify-center">
                  <p>{error}</p>
              </div>
          ) : displayedProperties.length > 0 ? (
              <>
                  <PropertyList
                      propertyList={displayedProperties}
                      isLoading={loading}
                  />
                  {totalPages > 1 && (
                      <Paginator
                          onPageChange={handlePageChange}
                          defaultPage={currentPage}
                          totalPages={totalPages}
                      />
                  )}
              </>
          ) : (
              <div className="h-full flex items-center justify-center">
                  <NoResults />
              </div>
          )}
        </div>

        <div className="hidden lg:block w-full h-full sticky top-[100px]">
          <Map properties={displayedProperties} />
        </div>
      </div>
    </div>
  );
}
