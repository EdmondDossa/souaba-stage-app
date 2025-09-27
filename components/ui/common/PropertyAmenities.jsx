import Image from 'next/image';
import SvgIcon from './SvgIcon';

// Mapping des noms d'amenities vers les noms de fichiers SVG
const amenityIcons = {
  wifi: "wifi",
  parking: "Parking 1",
  climatisation: "flocon",
  cuisine: "kitchen",
  piscine: "piscine",
  securite: "Security et hygiene",
  salle_sport: "espace",
  room_service: "kitchen",
  television: "tv",
  balcon: "balcony 1",
  buanderie: "laundry 1",
  ascenseur: "ascenseur",
  espace_detente: "espace"
};

export default function PropertyAmenities({ amenities, title = "Commodités offertes" }) {
  return (
    <div className="space-y-6 ">
      <h3 className="text-xl font-montserrat-bold font-bold text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-3">
        {amenities.map((amenity, index) => {
          const iconName = amenityIcons[amenity.icon] || "wifi";
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <SvgIcon
                  name={iconName}
                  size={20}
                />
              </div>
              <span className="text-gray-700 text-sm font-montserrat-medium">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
