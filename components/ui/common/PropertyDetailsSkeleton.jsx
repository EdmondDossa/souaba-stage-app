"use client";
import React from "react";

const PropertyDetailsSkeleton = ({ showSearch = true }) => {
  return (
    <div className="bg-white min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8 mt-10 lg:mt-0 space-y-8">
        <div className="h-72 bg-gray-200 rounded-xl" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-5 bg-gray-200 rounded w-32" />
          {showSearch && <div className="h-12 bg-gray-200 rounded" />}
        </div>

        <div className="space-y-4">
          <div className="h-5 bg-gray-200 rounded w-40" />
          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <div className="h-5 bg-gray-200 rounded w-40" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsSkeleton;
