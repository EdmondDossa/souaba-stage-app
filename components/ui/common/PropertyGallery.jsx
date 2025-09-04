"use client";
import Image from "next/image";
import { useState } from "react";

export default function PropertyGallery({ images, propertyName }) {
  const [mainImage, setMainImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Calculer le nombre de photos restantes
  const remainingPhotos = Math.max(0, images.length - 5);
  const displayedImages = images.slice(1, 5);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px] lg:h-[500px]">
        {/* Image principale */}
        <div 
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => openModal(mainImage)}
        >
          <Image
            src={images[mainImage]}
            alt={propertyName}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
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
          {displayedImages.map((image, index) => (
            <div 
              key={index}
              className="relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                if (index === 3 && remainingPhotos > 0) {
                  openModal(0); // Ouvrir le modal avec toutes les photos
                } else {
                  setMainImage(index + 1);
                }
              }}
            >
              <Image
                src={image}
                alt={`${propertyName} ${index + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              {/* Badge pour photos restantes - uniquement sur la dernière image s'il y en a plus */}
              {index === 3 && remainingPhotos > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/60 transition-colors">
                  <span className="text-white font-bold text-lg">
                    +{remainingPhotos} Photo{remainingPhotos > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal pour voir toutes les photos */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
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
            <div className="relative h-[60vh] bg-gray-100">
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Miniatures */}
            <div className="p-4 max-h-[25vh] overflow-y-auto">
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`relative w-16 h-12 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === modalImageIndex 
                        ? 'border-blue-500 opacity-100' 
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
