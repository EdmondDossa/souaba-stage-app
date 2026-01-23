"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getAxiosInstance from "@/lib/request";
import PropertyList from "@/components/ui/common/PropertyList";
import SearchBar from "@/components/ui/common/SearchBar";
import Paginator from "@/components/ui/common/Paginator";

const ALLOWED_TYPES = new Set([
  "all",
  "hotel",
  "accommodation",
  "residence",
  "villa",
  "studio",
  "apartment",
]);

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const http = useMemo(() => getAxiosInstance(), []);
  const [sortKey, setSortKey] = useState("default");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const query = useMemo(() => {
    const rawType = (searchParams.get("type") || "all").toLowerCase();
    const city = (searchParams.get("city") || "").trim();
    const page = toPositiveInt(searchParams.get("page"), 1);
    const limit = toPositiveInt(searchParams.get("limit"), 10);
    const capacity = toPositiveInt(searchParams.get("capacity"), null);

    return {
      check_in: searchParams.get("check_in") || "",
      check_out: searchParams.get("check_out") || "",
      city,
      capacity,
      type: ALLOWED_TYPES.has(rawType) ? rawType : "all",
      page,
      limit,
    };
  }, [searchParams]);

  useEffect(() => {
    if (!query.check_in || !query.check_out) {
      setProperties([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        page: query.page,
        limit: query.limit,
        totalPages: 1,
      }));
      setError("Veuillez sélectionner des dates pour la recherche.");
      setLoading(false);
      return;
    }

    let isActive = true;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          check_in: query.check_in,
          check_out: query.check_out,
          type: query.type,
          page: query.page,
          limit: query.limit,
        };

        if (query.city) {
          params.city = query.city;
        }

        if (query.capacity) {
          params.capacity = query.capacity;
        }

        const { data } = await http.get("/search/available", { params });
        const list = Array.isArray(data?.data) ? data.data : [];
        const apiPagination = data?.pagination || {};

        if (!isActive) return;

        setProperties(list);
        setPagination({
          total: apiPagination.total ?? list.length,
          page: apiPagination.page ?? query.page,
          limit: apiPagination.limit ?? query.limit,
          totalPages: apiPagination.totalPages ?? 1,
        });
      } catch (err) {
        console.error("Erreur de recherche:", err);
        if (!isActive) return;
        setProperties([]);
        setPagination({
          total: 0,
          page: query.page,
          limit: query.limit,
          totalPages: 1,
        });
        setError("Une erreur est survenue. Veuillez réessayer.");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isActive = false;
    };
  }, [query, http]);

  const handlePageChange = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    if (!params.get("limit")) {
      params.set("limit", String(query.limit));
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleTypeChange = (nextType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", nextType);
    params.set("page", "1");
    if (!params.get("limit")) {
      params.set("limit", String(query.limit));
    }
    router.push(`/search?${params.toString()}`);
  };

  const totalResults = pagination.total ?? 0;
  const sortedProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    if (sortKey === "default") return properties;

    const getHotelMinPrice = (hotel) => {
      const categories =
        hotel?.HotelRoomCategories ||
        hotel?.hotelRoomCategories ||
        hotel?.hotel_room_categories ||
        [];
      const prices = categories
        .map((room) => Number.parseFloat(room?.price_per_night))
        .filter((price) => Number.isFinite(price));
      return prices.length ? Math.min(...prices) : null;
    };

    const getPrice = (item) => {
      if (item?.hotel_id || item?.type === "hotel") {
        return getHotelMinPrice(item);
      }
      const price = Number.parseFloat(item?.price_per_night);
      return Number.isFinite(price) ? price : null;
    };

    const getRating = (item) => Number(item?.avgRating ?? item?.rating ?? 0);

    const list = [...properties];
    switch (sortKey) {
      case "price_asc":
        list.sort((a, b) => {
          const priceA = getPrice(a);
          const priceB = getPrice(b);
          if (priceA === null && priceB === null) return 0;
          if (priceA === null) return 1;
          if (priceB === null) return -1;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        list.sort((a, b) => {
          const priceA = getPrice(a);
          const priceB = getPrice(b);
          if (priceA === null && priceB === null) return 0;
          if (priceA === null) return 1;
          if (priceB === null) return -1;
          return priceB - priceA;
        });
        break;
      case "rating_desc":
        list.sort((a, b) => getRating(b) - getRating(a));
        break;
      case "rating_asc":
        list.sort((a, b) => getRating(a) - getRating(b));
        break;
      default:
        break;
    }

    return list;
  }, [properties, sortKey]);
  const searchBarInitialValues = useMemo(
    () => ({
      check_in: query.check_in,
      check_out: query.check_out,
      city: query.city,
      capacity: query.capacity,
    }),
    [query.check_in, query.check_out, query.city, query.capacity]
  );

  return (
    <div className="w-full mt-6">
      <div className="px-4 md:px-12 mb-6 space-y-4">
        <SearchBar
          isCentered={false}
          setError={setError}
          initialValues={searchBarInitialValues}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-4 py-2 text-sm font-montserrat-bold rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            Retour à l&apos;accueil
          </button>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-montserrat-bold text-gray-700">
                Type
              </label>
              <select
                value={query.type}
                onChange={(event) => handleTypeChange(event.target.value)}
                className="border border-gray-200 rounded-full px-3 py-2 text-sm text-gray-700 focus:outline-none"
              >
                <option value="all">Tout</option>
                <option value="hotel">Hôtels</option>
                <option value="residence">Résidences</option>
                <option value="apartment">Appartements</option>
                <option value="villa">Villas</option>
                <option value="studio">Studio</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-montserrat-bold text-gray-700">
                Trier par
              </label>
              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value)}
                className="border border-gray-200 rounded-full px-3 py-2 text-sm text-gray-700 focus:outline-none"
              >
                <option value="default">Pertinence</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating_desc">Meilleures notes</option>
                <option value="rating_asc">Notes les plus basses</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="mx-4 md:mx-12 mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-montserrat-bold text-red-700">
          {error}
        </div>
      )}
      <PropertyList
        sectionTitleFirstBloc="Résultats de la recherche"
        sectionTitleLastBloc={`${totalResults} résultat(s) trouvé(s)`}
        showOnMap={false}
        propertyList={sortedProperties}
        isLoading={loading}
        cardFullWidth={false}
        disablePagination={true}
      />
      {!loading && pagination.totalPages > 1 && (
        <Paginator
          defaultPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          nextPageTitle="Voir plus de résultats"
        />
      )}
    </div>
  );
}
