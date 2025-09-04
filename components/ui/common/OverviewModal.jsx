"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SvgIcon from "./SvgIcon";

const Star = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.172L12 18.896 4.664 23.17l1.402-8.172L.132 9.211l8.2-1.192z" />
  </svg>
);

// Component OverviewModal

export default function OverviewModal({ isOpen, selectedRoom, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Normaliser images (soit selectedRoom.images soit selectedRoom.image)
  const images = selectedRoom?.images?.length
    ? selectedRoom.images
    : selectedRoom?.image
    ? [selectedRoom.image]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentImageIndex, images]);

  if (!isOpen || !selectedRoom) return null;

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={closeOverview}
      role="dialog"
      aria-modal="true"
      aria-label={`${selectedRoom.type} overview`}
    >
      <div
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Section gauche - Images */}
        <div className="flex-1 flex flex-col">
          {/* Image principale */}
          <div className="relative flex-1 bg-gray-100 min-h-[320px]">
            {images.length ? (
              <Image
                src={images[currentImageIndex]}
                alt={selectedRoom.type || "room image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Pas d'image
              </div>
            )}

            {/* Boutons de navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Image précédente"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <span className="text-xl">‹</span>
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Image suivante"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <span className="text-xl">›</span>
                </button>
              </>
            )}
          </div>

          {/* Galerie de miniatures */}
          {images.length > 1 && (
            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-orange-500 opacity-100"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`Voir image ${index + 1}`}
                  >
                    <Image src={img} alt={`${selectedRoom.type} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section droite - Détails */}
        <div className="w-96 bg-white flex flex-col">
          {/* En-tête */}
          <div className="flex justify-between items-start p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">{selectedRoom.type}</h2>
            <button onClick={closeOverview} className="text-gray-400 hover:text-gray-600 text-2xl" aria-label="Fermer">
              ×
            </button>
          </div>

          {/* Contenu défilable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Icônes d'équipements principaux */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span>👁️</span>
                <span>Vue</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-6 h-6"><SvgIcon name="flocon" size={16} /></span>
                <span>Climatisation</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-6 h-6"><SvgIcon name="bathtub" size={16} /></span>
                <span>Salle de bains</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="w-6 h-6"><SvgIcon name="tv" size={16} /></span>
                <span>Télévision à écran plat</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-6 h-6"><SvgIcon name="wifi" size={16} /></span>
                <span>Wi-Fi Gratuit</span>
              </div>
            </div>

            {/* Configuration du lit */}
            <div className="border-b pb-4">
              <div className="flex items-center space-x-2 text-gray-900">
                <span className="w-6 h-6"><SvgIcon name="bed" size={16} /></span>
                <span className="font-medium">1 lit double</span>
              </div>
            </div>

            {/* Note et commentaires */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.max(0, Math.min(5, selectedRoom.rating || 0)) }, (_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  Lits confortables, notés {selectedRoom.rating ?? "—"} (d'après {selectedRoom.reviewsCount ?? "—"} commentaires)
                </span>
              </div>
            </div>

            {/* Description détaillée */}
            <div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedRoom.description ??
                  "Cette chambre double climatisée dispose d'une télévision par satellite à écran plat et d'une salle de bains privative. Le logement comprend 1 lit."}
              </p>
            </div>

            {/* Salle de bains privative */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Dans votre salle de bains privative :</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2"><span>✓</span><span>Douche</span></div>
                <div className="flex items-center space-x-2"><span>✓</span><span>Sèche-cheveux</span></div>
                <div className="flex items-center space-x-2"><span>✓</span><span>Toilettes</span></div>
              </div>
            </div>

            {/* Vue */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Vue :</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-700"><span>✓</span><span>Vue</span></div>
            </div>

            {/* Équipements */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Équipements :</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2"><span>✓</span><span>Climatisation</span></div>
                <div className="flex items-center space-x-2"><span>✓</span><span>Chaînes satellite</span></div>
                <div className="flex items-center space-x-2"><span>✓</span><span>Bureau</span></div>
                <div className="flex items-center space-x-2"><span>✓</span><span>Radio</span></div>
                <div className="flex items-center space-x-2"><span>✓</span><span>Téléphone</span></div>
                <div className="flex items-center space-x-2"><span>✓</span><span>Télévision à écran plat</span></div>
              </div>
            </div>

            {/* Fumeurs */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Fumeurs :</h4>
              <div className="text-sm text-gray-700">{selectedRoom.smoking ?? "non-fumeurs"}</div>
            </div>
          </div>

          {/* Prix et réservation */}
          <div className="p-6 border-t bg-gray-50">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900">{selectedRoom.price ?? "—"}</div>
              <div className="text-sm text-gray-600">par nuit</div>
            </div>
            <button
              className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
              onClick={() => alert("Réserver maintenant — intégrer ton flow de réservation")}
            >
              Réserver maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
