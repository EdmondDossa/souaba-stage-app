import Image from "next/image";
import { getAmenityIcon } from "@/data/amenitiesMap";

const hotelRooms = [
  {
    id: 1,
    name: "Chambre Standard",
    price: "150 000 FCFA",
    image: "/images/new-property1.jpg",
    features: ["1 lit double", "Baignoire", "Wifi", "Climatisation"]
  },
  {
    id: 2,
    name: "Chambre Deluxe",
    price: "250 000 FCFA",
    image: "/images/new-property2.jpg",
    features: ["1 lit king", "Vue sur la ville", "Mini-bar", "Balcon"]
  },
  {
    id: 3,
    name: "Suite Présidentielle",
    price: "500 000 FCFA",
    image: "/images/new-property3.jpg",
    features: ["Salon séparé", "Jacuzzi", "Service de conciergerie", "Terrasse", "Piscine", "Bar", "Restaurant", "Parking", "Ascenseur", "Cuisine", "Laverie", "Sécurité"]
  }
];

export default function HotelRooms() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Types de chambres disponibles</h3>
      <div className="space-y-4">
        {hotelRooms.map((room) => {
          const topFeatures = room.features.slice(0, 10);
          const bottomFeatures = room.features.slice(10);

          return (
            <div
              key={room.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg text-gray-900">
                      {room.name}
                    </h4>
                    <div className="text-right">
                      <span className="text-xl font-bold text-primary">
                        {room.price}
                      </span>
                      <p className="text-sm text-gray-600">/ nuit</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {topFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Image
                          src={getAmenityIcon(feature)}
                          alt={feature}
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Sélectionner cette chambre
                  </button>
                </div>
              </div>
              {bottomFeatures.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-md text-gray-800 mb-2">
                    Équipements inclus
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {bottomFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
