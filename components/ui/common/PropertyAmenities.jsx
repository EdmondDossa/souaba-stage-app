import Image from 'next/image';

// Composant pour afficher les icônes SVG
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
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {amenities.map((amenity, index) => {
          const iconName = amenityIcons[amenity.icon] || "wifi";
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <SvgIcon
                  name={iconName}
                  size={20}
                  className=""
                />
              </div>
              <span className="text-gray-700 text-sm font-medium">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
