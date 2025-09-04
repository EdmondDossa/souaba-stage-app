import Image from "next/image";
import { Star } from "lucide-react";
import { useState } from "react";
import OverviewModal from "./OverviewModal";
import SvgIcon from "./SvgIcon";

export default function HotelRooms() {
  // États pour gérer l'overview
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);

  // Fonction pour ouvrir l'overview
  const openOverview = (room) => {
    setSelectedRoom(room);
    setIsOverviewOpen(true);
  };

  // Fonction pour fermer l'overview
  const closeOverview = () => {
    setSelectedRoom(null);
    setIsOverviewOpen(false);
  };

  const rooms = [
    {
      id: 1,
      type: "Standard",
      image: "/images/new-property1.jpg",
      images: [
        "/images/new-property1.jpg",
        "/images/new-property2.jpg",
        "/images/new-property3.jpg"
      ],
      description: "Un petite description",
      capacity: "5",
      price: "800 000 FCFA",
      guests: "1",
      availability: "0 OFFRES",
      rating: 5
    },
    {
      id: 2,
      type: "Suite",
      image: "/images/new-property2.jpg",
      images: [
        "/images/new-property2.jpg",
        "/images/new-property1.jpg",
        "/images/new-property4.jpg"
      ],
      description: "Un petite description",
      capacity: "5",
      price: "900 000 FCFA",
      guests: "1",
      availability: "0 OFFRES",
      rating: 5
    },
    {
      id: 3,
      type: "Standard",
      image: "/images/new-property3.jpg",
      images: [
        "/images/new-property3.jpg",
        "/images/new-property1.jpg"
      ],
      description: "Un petite description",
      capacity: "5",
      price: "600 000 FCFA",
      guests: "1",
      availability: "0 OFFRES",
      rating: 5
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Disponibilité</h3>
      
        <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-white">
        <table className="min-w-full bg-white table-auto">
          <thead className="bg-orange-400 text-white">
            <tr className="text-sm font-semibold">
              <th scope="col" className="text-left px-6 py-4">Type de chambre</th>
              <th scope="col" className="text-left px-6 py-4">Description</th>
              <th scope="col" className="text-center px-6 py-4">Capacité d'accueil</th>
              <th scope="col" className="text-center px-6 py-4">Prix par nuit</th>
              <th scope="col" className="text-center px-6 py-4">Nombre de salle de bain</th>
              <th scope="col" className="text-center px-6 py-4">Sélectionnez des chambres</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {rooms.map((room) => (
              <tr key={room.id} className="border-t odd:bg-gray-50 even:bg-white">
                {/* Type de chambre */}
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-bold text-gray-900">{room.type}</div>
                  <div className="flex flex-col items-start space-y-2">
                    <button
                      type="button"
                      onClick={() => openOverview(room)}
                      className="w-20 h-16 rounded-md overflow-hidden relative flex-shrink-0 focus:outline-none"
                      aria-label={`Aperçu ${room.type}`}
                    >
                      <Image
                        src={room.image}
                        alt={room.type}
                        width={80}
                        height={64}
                        className="object-cover"
                      />
                    </button>

                    <div className="text-xs text-gray-500">
                      {room.beds ?? "3"} lits • {room.bathrooms ?? "2"} salle(s) de bain
                    </div>
                  </div>
                </td>

                {/* Description (image + texte) */}
                <td className="px-6 py-4 align-middle">
                  <div className="flex-1">
                      <p className="text-sm text-gray-700">{room.description}</p>
                      
                    </div>
                </td>

                {/* Capacité d'accueil */}
                <td className="px-6 py-4 align-middle text-center">
                  <div className="font-bold text-gray-900">{room.capacity}</div>
                  <div className="text-xs text-gray-500">personnes</div>
                </td>

                {/* Prix par nuit */}
                <td className="px-6 py-4 align-middle text-center">
                  <div className="font-bold text-gray-900">800000FCFA</div>
                </td>

                {/* Nombre de salle de bain */}
                <td className="px-6 py-4 align-middle text-center">
                  <div className="font-bold text-gray-900">{room.bathrooms ?? 1}</div>
                </td>

                {/* Sélectionnez des chambres */}
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center justify-between space-x-4">
                    {/* Select pour choisir le nombre de chambres */}
                    <select
                      defaultValue={room.selectedCount ?? 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (typeof room.onSelect === "function") room.onSelect(val, room.id);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                      aria-label={`Sélectionner le nombre de chambres pour ${room.type}`}
                    >
                      <option value={0}>0 (0FCFA)</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>

                    {/* Voir plus de détails (icône œil + texte) */}
                    <button
                      type="button"
                      onClick={() => openOverview(room)}
                      className="flex flex-col items-center text-xs text-orange-500 hover:underline"
                    >
                      {/* simple icône œil svg */}
                      <SvgIcon name="eye 1 1" size={16} className="mb-1" />
                      Voir plus de détails
                    </button>

                    {/* Résumé prix et bouton réserver */}
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900"></div>
                      <div className="text-xs text-gray-500 mb-2">******** FCFA</div>
                      <button
                        onClick={() => onReserve(room)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-orange-600 transition-colors"
                      >
                        Je réserve
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {rooms.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Aucune chambre disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
      {/* Overview Modal */}
      <OverviewModal
        isOpen={isOverviewOpen}
        selectedRoom={selectedRoom}
        onClose={closeOverview}
      />
    </div>
  );
}
