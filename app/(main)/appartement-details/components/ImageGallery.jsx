"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Images par défaut si aucune n'est fournie
  const defaultImages = [
    "/images/new-property1.jpg",
    "/images/new-property2.jpg", 
    "/images/new-property3.jpg",
    "/images/new-property4.jpg",
    "/images/acceuil-first-image.webp"
  ];

  const galleryImages = images.length > 0 ? images : defaultImages;
  const additionalPhotosCount = Math.max(0, galleryImages.length - 5);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const selectImage = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="w-full">
      {/* Image principale */}
      <div className="relative mb-4">
        <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden group">
          <Image
            src={galleryImages[selectedImageIndex]}
            alt={`Image ${selectedImageIndex + 1} de la propriété`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          
          {/* Navigation flèches */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                aria-label="Image précédente"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                aria-label="Image suivante"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Indicateur "+X photos" */}
          {additionalPhotosCount > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              +{additionalPhotosCount} photos
            </div>
          )}

          {/* Indicateurs de pagination */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    selectedImageIndex === index 
                      ? 'bg-white w-6' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid des miniatures */}
      <div className="grid grid-cols-5 gap-2">
        {galleryImages.slice(0, 5).map((image, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImageIndex === index 
                ? 'border-primary ring-2 ring-primary/20 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <Image
              src={image}
              alt={`Miniature ${index + 1}`}
              fill
              className="object-cover"
            />
            
            {/* Overlay pour la dernière image avec compteur */}
            {index === 4 && galleryImages.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  +{galleryImages.length - 4}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-500">
          {selectedImageIndex + 1} / {galleryImages.length}
        </p>
      </div>
    </div>
  );
};

export default ImageGallery;
