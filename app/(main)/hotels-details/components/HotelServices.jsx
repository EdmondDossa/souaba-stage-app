import { Utensils, Car, Wifi, Coffee, Dumbbell, Waves } from "lucide-react";
import Image from "next/image";
import React from "react";


const SvgIcon = ({ name, size = 24, className = "" }) => {
    return (
        <Image
            src={`/icons/${name}.svg`}
            alt={name}
            width={size}
            height={size}
            className={className}
        />
    );
};
const hotelServices = [
  { name: "Restaurant", icon: "kitchen", description: "Restaurant gastronomique ouvert 24h/24" },
  { name: "Parking", icon: "kitchen", description: "Parking privé et sécurisé" },
  { name: "WiFi gratuit", icon: Wifi, description: "Internet haut débit dans tout l'hôtel" },
  { name: "Room Service", icon: Coffee, description: "Service en chambre 24h/24" },
  { name: "Salle de sport", icon: Dumbbell, description: "Équipements de fitness modernes" },
  { name: "Piscine", icon: Waves, description: "Piscine extérieure chauffée" }
];

export default function HotelServices() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Services de l'hôtel</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelServices.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
