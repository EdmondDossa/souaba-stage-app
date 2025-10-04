"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertyGallery({ images, propertyName }) {
  const [mainImage, setMainImage] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Calculer le nombre de photos restantes
  const remainingPhotos = Math.max(0, images.length - 5);
  const displayedImages = images.slice(1, 5);

  const openModal = (index = 0) => {
    console.log(modalImageIndex);
    console.log(images);

    setModalImageIndex(index);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Image principale */}
      <div className="relative rounded-[8px] overflow-hidden h-[350px]">
        <div
          onClick={() => openModal(mainImage)}
          className="relative w-full h-full rounded-[8px] overflow-hidden"
        >
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
        {displayedImages.map((image, index) => (
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
              <div
                onClick={() => openModal(mainImage)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-white flex items-center gap-x-4">
                  <span className="block text-6xl font-montserrat-bold">
                    +{images.length - 4}
                  </span>
                  <div className="flex flex-col">
                    <span className="block text-lg font-montserrat-medium">
                      Voir plus
                    </span>
                    <span className="block font-montserrat-bold text-xl">
                      Photos
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <>
        {showModal && ( 
          <div
            className="fixed inset-0  bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image principale */}
              <div className="bg-gradient-to-b relative from-gray-100 from-[85%] to-gray-800/50  w-[90%] mx-auto rounded-xl mt-2 px-4 pt-4">
                <div className="relative h-[60vh] mx-auto w-[80%] bg-gray-100">
                  <Image
                    src={images[modalImageIndex]}
                    alt={`${propertyName} ${modalImageIndex + 1}`}
                    fill
                    className="object-cover w-full  bg-black bg-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-radial via-transparent to-transparent from-white/0  from-[80%]"></div>
                  {/* Navigation buttons */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevModalImage}
                        className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center  shadow-2xs transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextModalImage}
                        className="absolute   -right-6 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center  shadow-2xs transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                {/* Indicateurs de navigation */}
                {images.length > 1 && (
                  <div className="flex items-center justify-center bottom-3 left-0 right-0 absolute gap-x-3">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => openModal(i)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          i === modalImageIndex ? 'bg-white' : 'bg-gray-900/50'
                        }`}
                        aria-label={`Aller à l'image ${i + 1}`}
                      />
                    ))}
              </div>
            )}
                </div>

              </div>

              {/* Miniatures */}
              <div className="py-4 w-[90%] mx-auto max-h-[25vh] overflow-y-auto">
                <div className="flex flex-wrap space-x-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setModalImageIndex(index)}
                      className={`relative w-16 h-14 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                        index === modalImageIndex
                          ? "border-blue-500"
                          : "border-gray-200"
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
    </div>
  );
}
