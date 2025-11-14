"use client";
import React from "react";
import { PropertyCard, SvgIcon } from ".";
import { useRef, useState } from "react";
import Image from "next/image";
import NoResults from "./NotFoundResults";

const PropertyList = ({
  propertyList,
  sectionTitleFirstBloc,
  sectionTitleLastBloc,
  showOnMap,
}) => {
  const carouselRef = useRef(null);

  // États pour tracker les boutons actifs (null, 'left', ou 'right')
  const [activeButtons, setActiveButtons] = useState({
    news: "right",
    nearby: "right",
    topRated: "right",
    featured: "right",
  });

  //Fonction du mobile (carousel)
  const scroll = (ref, direction, carouselKey) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });

      // Mettre à jour le bouton actif - un seul à la fois
      setActiveButtons((prev) => ({
        ...prev,
        [carouselKey]: direction,
      }));
    }
  };

  return (
    <div className="mt-2 px-4 md:px-12  font-montserrat-bold text-gray-700">
      <div className="flex justify-between items-center">
        <div className="py-2 space-y-1 md:space-y-2 w-fit">
          <h1 className="font-bold text-[24px] md:text-xl lg:text-3xl leading-tight">
            {sectionTitleFirstBloc}
          </h1>
          <h1 className="font-bold text-[24px] md:text-xl lg:text-3xl leading-tight">
            {sectionTitleLastBloc}
          </h1>
          <div className="w-12 md:w-1/3 h-1 bg-primary mt-2"></div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {showOnMap && (
            <div className="hidden lg:flex items-center space-x-2 cursor-pointer">
              <Image src="/icons/ic_map.svg" width={20} height={20} alt="" />
              <h4 className="font-semibold text-[15px]">
                Afficher sur la carte
              </h4>
            </div>
          )}

          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => scroll(carouselRef, "left", "featured")}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                activeButtons.featured === "left"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-label="Précédent"
            >
              <SvgIcon name={"arrowLeft"} className={""} size={18} />
            </button>
            <button
              onClick={() => scroll(carouselRef, "right", "featured")}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                activeButtons.featured === "right"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-label="Suivant"
            >
              <SvgIcon name={"arrowRight"} className={""} size={18} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex lg:grid lg:grid-cols-4 gap-x-8 md:gap-x-8 overflow-x-auto lg:overflow-visible scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {propertyList.length > 0 ? (
          propertyList.map((property, index) => {
            // Déterminer le type et extraire les informations appropriées
            const isHotel = property.type === "hotel";

            const mediaArray = isHotel
              ? property.HotelMedia
              :( property.AccommodationMedia ?? property.accommodation_media ?? property.images);

            const primaryImage =
              mediaArray?.find((media) => media.is_primary)?.media?.file_path ||
              mediaArray?.[0]?.media?.file_path || mediaArray?.[0].file_path;

            return (
              <PropertyCard
                key={index}
                id={property.accommodation_id ?? property.hotel_id }
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
                className="flex-shrink-0"
                type={isHotel ? "hotel" : property.type}
              />
            );
          })
        ) : (
          <div className="flex w-full col-span-4 justify-center items-center mx-auto bg-gray-50 my-2 roundd-md" ><NoResults /></div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PropertyList);
