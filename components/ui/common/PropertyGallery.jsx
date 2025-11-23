"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertyGalleryHotels({ hotelsMedias }) {
  const [mainImage, setMainImage] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Calculer le nombre de photos restantes

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const remainingPhotos = Math.max(0, hotelsMedias.length - 5);
  const displayedImages = hotelsMedias.slice(1, 5);

  const openModal = (index = 0) => {
    if (!isMobile) {
      setModalImageIndex(index);
      setShowModal(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleMobileModalOpen = (index) => {
    setMainImage(index + 1);
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % hotelsMedias.length);
  };

  const prevModalImage = () => {
    setModalImageIndex(
      (prev) => (prev - 1 + hotelsMedias.length) % hotelsMedias.length
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Image principale */}
      <div className="relative rounded-[8px] overflow-hidden h-[200px] md:h-[350px]">
        <div
          onClick={() => openModal(mainImage)}
          className="relative w-full h-full rounded-[8px] overflow-hidden"
        >
          <img
            src={hotelsMedias[mainImage].media.file_path}
            alt="room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      </div>

      {/* Grille d'images secondaires */}
      <div className="flex  max-w-[400px] lg:max-w-full lg:place-items-stretch  lg:justify-start gap-x-3 bg-white lg:bg-auto shadow-2xl lg:m-0 -mt-28 z-10 mx-4 rounded-xl lg:p-0 p-2  lg:w-full lg:grid lg:grid-cols-2 lg:gap-2 h-[85px] lg:h-[350px]">
        {displayedImages.map((image, index) => (
          <div
            key={index}
            className="relative rounded-[8px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleMobileModalOpen(index)}
          >
            <div className="w-full h-full rounded-[8px] bg-center bg-no-repeat bg-contain">
              <div className="relative w-full h-full rounded-[8px] overflow-hidden">
                <img
                  src={image.media.file_path}
                  alt="room"
                  className="w-[100px] h-[70px] lg:max-w-full lg:w-full lg:h-full object-fit"
                />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            </div>
            {index === 3 && hotelsMedias.length > 5 && (
              <div
                onClick={() => openModal(mainImage)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-white flex items-center gap-x-4">
                  <span className="block text-6xl font-montserrat-bold">
                    +{hotelsMedias.length - 4}
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
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
                    src={hotelsMedias[modalImageIndex].media.file_path}
                    alt={`Image ${modalImageIndex + 1}`}
                    fill
                    className="object-cover w-full  bg-black bg-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-radial via-transparent to-transparent from-white/0  from-[80%]"></div>
                  {/* Navigation buttons */}
                  {hotelsMedias.length > 1 && (
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
                  {hotelsMedias.length > 1 && (
                    <div className="flex items-center justify-center bottom-3 left-0 right-0 absolute gap-x-3">
                      {hotelsMedias.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => openModal(i)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            i === modalImageIndex
                              ? "bg-white"
                              : "bg-gray-900/50"
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
                  {hotelsMedias.map((image, index) => (
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
                        src={image.media.file_path}
                        alt={`Image ${index + 1}`}
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
