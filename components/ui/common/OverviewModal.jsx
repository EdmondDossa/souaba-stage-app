"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SvgIcon from "./SvgIcon";
import { getAmenityIcon, getAmenityLabel } from "@/data/amenitiesMap";


const Star = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.172L12 18.896 4.664 23.17l1.402-8.172L.132 9.211l8.2-1.192z" />
  </svg>
);

// Component OverviewModal

export default function OverviewModal({ isOpen, selectedRoom, onClose, hotelRooms }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Récupérer les images depuis HotelRoomCategoryMedia
  const images = selectedRoom?.HotelRoomCategoryMedia?.length
    ? selectedRoom.HotelRoomCategoryMedia.map(media => media.media?.file_path).filter(Boolean)
    : [];

  useEffect(() => {
    if (isOpen) {
      // Bloquer le scroll du body
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setCurrentImageIndex(0);
  }, [isOpen, selectedRoom]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
   
  }, [isOpen, currentImageIndex, images]);

  const prevImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((i) => (i + 1) % images.length);
  };

  const closeOverview = () => {
    onClose?.();
  };

  const roomAmenities = useMemo(() => {
    return (selectedRoom?.amenities || []).map((amenity) => {
      const raw = typeof amenity === "string" ? amenity : amenity?.name || amenity?.icon || amenity;
      return {
        label: getAmenityLabel(raw),
        icon: getAmenityIcon(raw),
        raw,
      };
    });
  }, [selectedRoom]);

  if (!isOpen || !selectedRoom) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={closeOverview}
      role="dialog"
      aria-modal="true"
      aria-label={`${selectedRoom.type} overview`}
    >
      <div
        className="bg-white rounded-xl w-5xl h-[90vh]  overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Section gauche - Images */}
        <div className=" flex flex-col ml-[2px] w-[75%]">
          {/* Image principale */}
          <div className="bg-gradient-to-b relative from-gray-100 from-[85%] to-gray-800/50 w-[95%] mx-auto rounded-xl mt-2 px-3 pt-4 flex-1 min-h-[220px]">
            <div className="relative h-full mx-auto w-[95%] bg-gray-100 rounded-lg overflow-hidden">
              {images.length ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={selectedRoom.name || "room image"}
                  fill
                  className="object-cover w-full bg-black bg-blend-overlay"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                  <SvgIcon name="image-placeholder" size={48} className="mb-2 opacity-30" />
                  <span className="text-sm">Aucune image disponible</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800/30 via-transparent to-transparent"></div>
              
              {/* Boutons de navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Image précédente"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Image suivante"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Indicateurs de navigation */}
            {images.length > 1 && (
              <div className="flex items-center justify-center bottom-3 left-0 right-0 absolute gap-x-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentImageIndex ? 'bg-white' : 'bg-gray-900/50'
                    }`}
                    aria-label={`Aller à l'image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Galerie de miniatures */}
          {images.length > 1 && (
            <div className="py-4 w-[90%] mx-auto max-h-[25vh] overflow-y-auto">
              <div className="flex space-x-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-12 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-orange-500 opacity-100"
                        : "border-gray-200 opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`Voir image ${index + 1}`}
                  >
                    <Image src={img} alt={`${selectedRoom.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section droite - Détails */}
        <div className="w-[45%] -ml-6 bg-white flex flex-col">
          
          <div className="flex justify-between items-start p-6 pb-4 ">
            <h2 className="text-xl font-bold text-black">{selectedRoom.name}</h2>
            <button onClick={closeOverview} className="text-gray-400 hover:text-gray-600 text-xl" aria-label="Fermer">
              ×
            </button>
          </div>

          
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
           
            {/* Équipements/Amenities */}
            <div className="space-y-4">
              <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                {roomAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {amenity.icon?.endsWith(".svg") ? (
                      <Image src={amenity.icon} alt={amenity.label} width={16} height={16} />
                    ) : (
                      <SvgIcon name={String(amenity.raw).toLowerCase()} size={16} />
                    )}
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

          
            {/* Capacité et Salles de bain */}
            <div>
              <div className="flex items-center space-x-2 text-black mb-2">
                <SvgIcon name="bed" size={16} className="text-gray-700" />
                <span className="font-medium">Capacité: {selectedRoom.capacity} personne(s)</span>
              </div>
              <div className="flex items-center space-x-2 text-black">
                <SvgIcon name="bathtub" size={16} className="text-gray-700" />
                <span className="font-medium">{selectedRoom.number_of_bathrooms} salle(s) de bain</span>
              </div>
            </div>

            {/* Prix */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-primary">
                  {Number(selectedRoom.price_per_night).toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-sm text-gray-600">/ nuit</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-black mb-2">Description :</h4>
              <p className="text-black text-sm leading-relaxed">
                {selectedRoom.description || "Aucune description disponible"}
              </p>
            </div>

            {/* Type de chambre */}
            <div>
              <h4 className="font-semibold text-black mb-2">Type de chambre :</h4>
              <p className="text-sm text-gray-700">{selectedRoom.type}</p>
            </div>

            {/* Disponibilité */}
            <div>
              <h4 className="font-semibold text-black mb-2">Disponibilité :</h4>
              <p className="text-sm text-gray-700">{selectedRoom.number_of_rooms} chambre(s) disponible(s)</p>
            </div>

            {/* Équipements détaillés */}
            {roomAmenities.length > 0 && (
              <div>
                <h4 className="font-semibold text-black mb-3">Équipements inclus :</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  {roomAmenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span>✓</span>
                      <span>{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
