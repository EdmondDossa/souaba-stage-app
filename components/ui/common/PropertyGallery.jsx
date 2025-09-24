"use client";
import Image from "next/image";
import { useState } from "react";

export default function PropertyGallery({ images, propertyName }) {
  const [mainImage, setMainImage] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Image principale */}
      <div className="relative rounded-[8px] overflow-hidden h-[350px]">
        <div className="relative w-full h-full rounded-[8px] overflow-hidden">
          <img
            src={images[mainImage]}
            alt="room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      </div>

      {/* Grille d'images secondaires */}
      <div className="grid grid-cols-2 gap-2 h-[350px]">
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative rounded-[8px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setMainImage(index + 1)}
          >
            <div className="w-full h-full rounded-[8px] bg-center bg-no-repeat bg-contain">
              <div className="relative w-full h-full rounded-[8px] overflow-hidden">
                <img
                  src={image}
                  alt="room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            </div>
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white flex items-center gap-x-4">
                  <span className="block text-6xl font-montserrat-bold">
                    +{images.length - 4}
                  </span>
                  <div className="flex flex-col">
                    <span className="block text-lg font-montserrat-medium">
                      More
                    </span>
                    <span className="block font-montserrat-bold text-xl">Photos</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
