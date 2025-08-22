import Image from "next/image";
import { Star } from "lucide-react";

export default function HotelRooms() {
  const rooms = [
    {
      id: 1,
      type: "Standard",
      image: "/images/new-property1.jpg",
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
      
      {/* En-tête du tableau */}
      <div className="bg-gray-100 text-gray-900 rounded-t-lg">
        <div className="grid grid-cols-6 gap-6 p-4 text-sm font-bold">
          <div className="col-span-2">Type de chambre</div>
          <div>Capacité d'accueil</div>
          <div>Prix par nuit</div>
          <div>Nombre de lits</div>
          <div className="text-center">Réservation</div>
        </div>
      </div>

      {/* Liste des chambres */}
      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-6 gap-6 items-center">
              {/* Type et image */}
              <div className="col-span-2 flex items-center space-x-4">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={room.image}
                    alt={room.type}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 text-lg">{room.type}</h4>
                  <p className="text-sm text-gray-700">{room.description}</p>
                  <div className="text-sm text-gray-600">
                    3 lits • 2 salles de bains
                  </div>
                </div>
              </div>

              {/* Capacité */}
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {room.capacity}
                </div>
                <div className="text-sm text-gray-600">personnes</div>
              </div>

              {/* Prix */}
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {room.price}
                </div>
                <div className="text-sm text-gray-600">par nuit</div>
              </div>

              {/* Nombre de lits */}
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {room.guests}
                </div>
                <div className="text-sm text-gray-600">lit(s)</div>
              </div>

              {/* Bouton réserver */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: room.rating }, (_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Très bien</div>
                  <div className="text-xs text-gray-600">50 avis</div>
                </div>
                <button className="bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors whitespace-nowrap">
                  Je réserve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
