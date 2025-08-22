"use client";
import Image from "next/image";
import { useState } from "react";

export default function PropertyGallery({ images, propertyName }) {
  const [mainImage, setMainImage] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px] lg:h-[500px]">
      {/* Image principale */}
      <div className="relative rounded-2xl overflow-hidden">
        <Image
          src={images[mainImage]}
          alt={propertyName}
          fill
          className="object-cover"
        />
        {/* Badge utilisateur en bas à gauche */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/images/new-property1.jpg"
              alt="John Doberman"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div className="text-xs">
            <div className="font-bold text-gray-900">John Doberman</div>
            <div className="text-gray-600">À partir de 1 000 000 FCFA</div>
          </div>
        </div>
      </div>

      {/* Grille d'images secondaires */}
      <div className="grid grid-cols-2 gap-2">
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={index}
            className="relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setMainImage(index + 1)}
          >
            <Image
              src={image}
              alt={`${propertyName} ${index + 2}`}
              fill
              className="object-cover"
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  +{images.length - 5} Photos
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
