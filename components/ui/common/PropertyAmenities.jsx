import { 
  Wifi, 
  Car, 
  AirVent, 
  ChefHat, 
  Waves,
  Shield,
  Dumbbell,
  Coffee,
  Tv,
  Home,
  UtensilsCrossed,
  Wind
} from "lucide-react";

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  climatisation: Wind,
  cuisine: UtensilsCrossed,
  piscine: Waves,
  securite: Shield,
  salle_sport: Dumbbell,
  room_service: Coffee,
  television: Tv,
  balcon: Home,
  buanderie: Home,
  ascenseur: Home,
  espace_detente: Shield
};

export default function PropertyAmenities({ amenities, title = "Commodités offertes" }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {amenities.map((amenity, index) => {
          const IconComponent = amenityIcons[amenity.icon] || Wifi;
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-gray-700 text-sm font-medium">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
