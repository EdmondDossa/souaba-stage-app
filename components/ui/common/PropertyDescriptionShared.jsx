"use client";
import { Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthContext from "@/context/auth";

export default function PropertyDescriptionShared({
  description,
  location,
  title,
  name,
  isFavorite: isFavoriteProp,
  onFavoriteToggle,
}) {
  const safeDescription = description || "";
  const safeLocation = location || "";
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;
  const [isFavorite, setIsFavorite] = useState(false);
  const { isLogged } = useAuthContext();

  useEffect(() => {
    if (!isLogged) {
      setIsFavorite(false);
      return;
    }
    if (typeof isFavoriteProp !== "undefined") {
      setIsFavorite(Boolean(isFavoriteProp));
    }
  }, [isFavoriteProp, isLogged]);

  const shouldTruncate = safeDescription.length > maxLength;
  const displayText = isExpanded
    ? safeDescription
    : safeDescription.slice(0, maxLength);

  return (
    <div>
      <div className="mb-6 lg:mt-0 -mt-10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="lg:text-2xl text-xl font-montserrat-bold font-bold text-gray-700 mb-1">
              {name}
            </h3>
          </div>
          <div className="flex gap-x-3 text-primary">
            {isLogged && (
              <button
                onClick={() => {
                  const next = !isFavorite;
                  setIsFavorite(next);
                  if (onFavoriteToggle) {
                    onFavoriteToggle(next);
                  }
                }}
                className=" pb-4 pr-2 hover:bg-gray-100 rounded-full transition-colors"
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
            <Share2 />
          </div>
        </div>
        <p className="flex gap-x-2 text-gray-400 text-sm font-montserrat-medium font-bold">
          <span>
            {" "}
            <img src="/icons/loc 1.svg" alt="" />{" "}
          </span>
          {safeLocation}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-montserrat-bold font-bold text-gray-700 mb-3">
          Description de {title}
        </h3>
        <p className="text-justify text-gray-600 text-sm  leading-5">
          {" "}
          {displayText}{" "}
        </p>
        {shouldTruncate && (
          <button
            className="text-primary font-montserrat-medium mt-2"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
      </div>
    </div>
  );
}
