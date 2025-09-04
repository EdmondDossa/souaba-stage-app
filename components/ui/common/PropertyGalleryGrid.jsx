"use client";
import Image from "next/image";
import { useState } from "react";

export default function PropertyGalleryGrid({ images, propertyName }) {
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Calculer le nombre de photos restantes (après les 5 premières affichées)
  const remainingPhotos = Math.max(0, images.length - 5);

  const openModal = (index = 0) => {
    setModalImageIndex(index);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-[400px]">
        {/* Image principale */}
        <div 
          className="col-span-2 relative rounded-l-lg overflow-hidden cursor-pointer"
          onClick={() => openModal(0)}
        >
          <Image
            src={images[0]}
            alt="Image principale"
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>

        {/* Images secondaires */}
        <div className="grid grid-rows-2 gap-2">
          <div 
            className="relative overflow-hidden cursor-pointer"
            onClick={() => openModal(1)}
          >
            <Image
              src={images[1]}
              alt="Image 2"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div 
            className="relative overflow-hidden cursor-pointer"
            onClick={() => openModal(2)}
          >
            <Image
              src={images[2]}
              alt="Image 3"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="grid grid-rows-2 gap-2">
          <div 
            className="relative overflow-hidden rounded-tr-lg cursor-pointer"
            onClick={() => openModal(3)}
          >
            <Image
              src={images[3]}
              alt="Image 4"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div 
            className="relative overflow-hidden rounded-br-lg cursor-pointer"
            onClick={() => remainingPhotos > 0 ? openModal(0) : openModal(4)}
          >
            <Image
              src={images[4]}
              alt="Image 5"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {/* Badge dynamique pour photos restantes */}
            {remainingPhotos > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all">
                <span className="text-white font-semibold text-lg">
                  +{remainingPhotos} Photo{remainingPhotos > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour voir toutes les photos */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-6xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {modalImageIndex + 1} / {images.length} - {propertyName}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Image principale */}
            <div className="relative h-[70vh] bg-gray-100">
              <Image
                src={images[modalImageIndex]}
                alt={`${propertyName} ${modalImageIndex + 1}`}
                fill
                className="object-contain"
              />
              
              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all text-xl"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all text-xl"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Miniatures */}
            <div className="p-4 max-h-[20vh] overflow-y-auto">
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`relative w-20 h-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === modalImageIndex 
                        ? 'border-primary opacity-100' 
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${propertyName} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
