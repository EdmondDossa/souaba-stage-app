"use client";
import React from "react";

const PropertyCardSkeleton = ({ className = "", layout = "grid" }) => {
  const imageHeight = layout === "list" ? "h-48" : "h-40";

  return (
    <div
      className={`animate-pulse bg-white rounded-2xl shadow-md overflow-hidden ${className}`}
    >
      <div className={`bg-gray-200 ${imageHeight} w-full`} />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-10" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
