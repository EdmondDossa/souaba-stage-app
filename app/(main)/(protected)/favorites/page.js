"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import getAxiosInstance from "@/lib/request";
import PropertyList from "@/components/ui/common/PropertyList";

export default function FavoritesPage() {
  const http = useMemo(() => getAxiosInstance(), []);
  const [favorites, setFavorites] = useState({
    hotels: [],
    accommodations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const combinedFavorites = useMemo(() => {
    const hotels = Array.isArray(favorites.hotels) ? favorites.hotels : [];
    const accommodations = Array.isArray(favorites.accommodations)
      ? favorites.accommodations
      : [];

    return [
      ...hotels.map((hotel) => ({ ...hotel, isFavorite: true })),
      ...accommodations.map((acc) => ({ ...acc, isFavorite: true })),
    ];
  }, [favorites]);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await http.get("/favorites");
      setFavorites({
        hotels: data?.hotels || [],
        accommodations: data?.accommodations || [],
      });
    } catch (err) {
      console.error("Erreur chargement favoris:", err);
      setError("Impossible de charger vos favoris pour le moment.");
      setFavorites({ hotels: [], accommodations: [] });
    } finally {
      setLoading(false);
    }
  }, [http]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleFavoriteChange = useCallback((payload) => {
    if (!payload || payload.isFavorite) return;

    setFavorites((prev) => {
      if (payload.favoriteKind === "hotel") {
        return {
          ...prev,
          hotels: (prev.hotels || []).filter(
            (hotel) => String(hotel.hotel_id ?? hotel.id) !== String(payload.id)
          ),
        };
      }
      return {
        ...prev,
        accommodations: (prev.accommodations || []).filter(
          (acc) =>
            String(acc.accommodation_id ?? acc.id) !== String(payload.id)
        ),
      };
    });
  }, []);

  return (
    <div className="w-full mt-6">
      <div className="px-4 md:px-12">
        <h1 className="text-2xl md:text-3xl font-montserrat-bold text-gray-700">
          Mes favoris
        </h1>
      </div>

      {error && (
        <div className="mx-4 md:mx-12 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-montserrat-bold text-red-700">
          {error}
        </div>
      )}

      <PropertyList
        showOnMap={false}
        propertyList={combinedFavorites}
        isLoading={loading}
        cardFullWidth={false}
        onFavoriteChange={handleFavoriteChange}
      />
    </div>
  );
}
