"use client";
import React, { useEffect } from "react";
import { PropertyCard, PropertyCardSkeleton, SvgIcon } from ".";
import { useRef, useState } from "react";
import Image from "next/image";
import NoResults from "./NotFoundResults";

const PropertyList = ({
  propertyList = [],
  sectionTitleFirstBloc,
  sectionTitleLastBloc,
  showOnMap,
  showRating = false,
  isLoading = false,
  cardFullWidth = true,
  onFavoriteChange,
  disablePagination = false,
}) => {
  const carouselRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const useLocalPagination = !disablePagination;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  //Fonction du mobile (carousel)
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Ajuster le rendu desktop (pagination 2 lignes) / mobile (scroll horizontal)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const ref = carouselRef.current;
    if (!ref) return;

    const updateScrollButtons = () => {
      const maxScroll = ref.scrollWidth - ref.clientWidth;
      setCanScrollLeft(ref.scrollLeft > 0);
      setCanScrollRight(ref.scrollLeft < maxScroll - 1);
    };

    updateScrollButtons();
    ref.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      ref.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [propertyList, cardFullWidth, isDesktop]);

  const normalizeText = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const normalizePropertyType = (property) => {
    const rawType =
      property?.type ||
      property?.property_type ||
      property?.propertyType ||
      property?.accommodation_type ||
      property?.accommodationType ||
      property?.accommodation_category ||
      property?.Accommodation?.type ||
      property?.Accommodation?.accommodation_type ||
      "";

    const normalized = normalizeText(rawType);
    const name = normalizeText(property?.name);

    if (
      property?.hotel_id ||
      normalized.includes("hotel") ||
      name.includes("hotel")
    )
      return "HOTEL";
    if (
      normalized.includes("resid") ||
      name.includes("resid")
    )
      return "RESIDENCE";
    if (
      normalized.includes("apart") ||
      name.includes("appart") ||
      name.includes("apart")
    )
      return "APARTMENT";
    if (normalized.includes("villa") || name.includes("villa")) return "VILLA";
    if (normalized.includes("studio") || name.includes("studio"))
      return "STUDIO";

    if (normalized.includes("accommodation")) {
      if (name.includes("resid"))
        return "RESIDENCE";
      if (name.includes("appart") || name.includes("apart"))
        return "APARTMENT";
      if (name.includes("villa")) return "VILLA";
      if (name.includes("studio")) return "STUDIO";
    }

    return normalized ? normalized.toUpperCase() : "UNKNOWN";
  };

  const ITEMS_PER_PAGE = 8; // 2 lignes de 4 cartes en desktop
  const totalPages = useLocalPagination
    ? Math.max(1, Math.ceil((propertyList?.length || 0) / ITEMS_PER_PAGE))
    : 1;

  useEffect(() => {
    if (!useLocalPagination) return;
    if (currentPage > totalPages - 1) {
      setCurrentPage(0);
    }
  }, [propertyList, totalPages, currentPage, useLocalPagination]);

  const displayedList =
    useLocalPagination && isDesktop
      ? propertyList.slice(
          currentPage * ITEMS_PER_PAGE,
          (currentPage + 1) * ITEMS_PER_PAGE
        )
      : propertyList;
  const skeletonCount = isDesktop ? ITEMS_PER_PAGE : 4;

  const getMinHotelPrice = (hotel) => {
    const prices =
      hotel?.HotelRoomCategories?.map((room) =>
        Number.parseFloat(room?.price_per_night)
      ).filter((p) => Number.isFinite(p)) || [];
    if (!prices.length) return null;
    return Math.min(...prices);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const hasSectionTitle = Boolean(sectionTitleFirstBloc || sectionTitleLastBloc);

  return (
    <div className="mt-2 px-4 md:px-12  font-montserrat-bold text-gray-700">
      <div
        className={`flex items-center ${
          hasSectionTitle ? "justify-between" : "justify-end"
        }`}
      >
        {hasSectionTitle && (
          <div className="py-2 space-y-1 md:space-y-2 w-fit">
            <h1 className="font-bold text-[24px] md:text-xl lg:text-3xl leading-tight">
              {sectionTitleFirstBloc}
            </h1>
            <h1 className="font-bold text-[24px] md:text-xl lg:text-3xl leading-tight">
              {sectionTitleLastBloc}
            </h1>
            <div className="w-12 md:w-1/3 h-1 bg-primary mt-2"></div>
          </div>
        )}

        <div className="flex items-center space-x-2 lg:space-x-4">
          {showOnMap && (
            <div className="hidden lg:flex items-center space-x-2 cursor-pointer">
              <Image src="/icons/ic_map.svg" width={20} height={20} alt="" />
              <h4 className="font-semibold text-[15px]">
                Afficher sur la carte
              </h4>
            </div>
          )}

          {/* Pagination desktop (2 lignes) */}
          {!showOnMap &&
            useLocalPagination &&
            isDesktop &&
            propertyList.length >= ITEMS_PER_PAGE && (
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  currentPage === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-amber-400"
                }`}
                aria-label="Page précédente"
              >
                <SvgIcon name={"arrowLeft"} className={""} size={18} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  currentPage >= totalPages - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-amber-400"
                }`}
                aria-label="Page suivante"
              >
                <SvgIcon name={"arrowRight"} className={""} size={18} />
              </button>
            </div>
          )}

          {!showOnMap && (
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => scroll(carouselRef, "left")}
                disabled={!canScrollLeft}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  canScrollLeft
                    ? "bg-primary text-white hover:bg-amber-400"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                aria-label="Précédent"
              >
                <SvgIcon name={"arrowLeft"} className={""} size={18} />
              </button>
              <button
                onClick={() => scroll(carouselRef, "right")}
                disabled={!canScrollRight}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  canScrollRight
                    ? "bg-primary text-white hover:bg-amber-400"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                aria-label="Suivant"
              >
                <SvgIcon name={"arrowRight"} className={""} size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={carouselRef}
        className={`flex lg:grid ${
          cardFullWidth ? "lg:grid-cols-1" : "lg:grid-cols-4"
        } gap-x-8 md:gap-x-8 overflow-x-auto lg:overflow-visible scrollbar-hide scroll-smooth`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading ? (
          Array.from({ length: skeletonCount }).map((_, idx) => (
            <PropertyCardSkeleton
              key={idx}
              className="shrink-0 w-full"
              layout={isDesktop ? "grid" : "list"}
            />
          ))
        ) : displayedList.length > 0 ? (
          displayedList.map((property, index) => {
            // Déterminer le type et extraire les informations appropriées
            const normalizedType = normalizePropertyType(property);
            const isHotel = normalizedType === "HOTEL";
            const hotelMinPrice = isHotel ? getMinHotelPrice(property) : null;

            const mediaArray = isHotel
              ? property.HotelMedia ||
                property.hotel_media ||
                property.images ||
                []
              : property.AccommodationMedia ??
                property.accommodation_media ??
                property.images ??
                [];

            const primaryImage =
              property.primaryImage ||
              mediaArray?.find((media) => media.is_primary)?.media?.file_path ||
              mediaArray?.find((media) => media.is_primary)?.file_path ||
              mediaArray?.[0]?.media?.file_path ||
              mediaArray?.[0]?.file_path;

            const cardId = isHotel
              ? property.hotel_id ?? property.id
              : property.accommodation_id ?? property.id;

            return (
              <PropertyCard
                cardFullWidth={cardFullWidth}
                key={index}
                id={cardId}
                isFavorite={Boolean(property?.isFavorite)}
                imageUrl={primaryImage || "/images/acceuil-first-image.webp"}
                price={
                  isHotel
                    ? hotelMinPrice !== null
                      ? `${hotelMinPrice.toLocaleString("fr-FR")} FCFA`
                      : ""
                    : `${property.price_per_night} FCFA`
                }
                title={property.name}
                location={`${property.address}, ${property.city}, ${property.country}`}
                rating={property.avgRating || 0}
                showRate={showRating}
                className="shrink-0 w-full"
                type={isHotel ? "hotel" : property.type}
                favoriteKind={isHotel ? "hotel" : "accommodation"}
                onFavoriteChange={onFavoriteChange}
              />
            );
          })
        ) : (
          <div className="flex w-full col-span-4 justify-center items-center mx-auto bg-gray-50 my-2 roundd-md">
            <NoResults />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PropertyList);
