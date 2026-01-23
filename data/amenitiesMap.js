"use client";

/**
 * Mapping des commodités vers un libellé normalisé et l'icône correspondante.
 * On centralise ici pour éviter de dupliquer des chemins d'assets.
 */
const DEFAULT_AMENITY_ICON = "/icons/espace.svg";

export const AMENITIES = [
  { key: "piscine", label: "Piscine", icon: "/icons/piscine.svg" },
  { key: "jacuzzi", label: "Jacuzzi", icon: "/icons/piscine.svg" },
  { key: "patio", label: "Patio", icon: "/icons/espace.svg" },
  { key: "barbecue", label: "Barbecue", icon: "/icons/espace.svg" },
  { key: "brasero", label: "Brasero", icon: "/icons/espace.svg" },
  { key: "billard", label: "Billard", icon: "/icons/espace.svg" },
  { key: "cheminee", label: "Cheminée", icon: "/icons/espace.svg" },
  { key: "piano", label: "Piano", icon: "/icons/espace.svg" },
  { key: "restaurant", label: "Restaurant", icon: "/icons/kitchen.svg" },
  { key: "bar", label: "Bar", icon: "/icons/kitchen.svg" },
  { key: "wifi", label: "Wifi", icon: "/icons/wifi.svg" },
  { key: "parking", label: "Parking", icon: "/icons/parking.svg" },
  { key: "climatisation", label: "Climatisation", icon: "/icons/flocon.svg" },
  { key: "tv", label: "TV", icon: "/icons/tv.svg" },
  { key: "mini-bar", label: "Mini-bar", icon: "/icons/kitchen.svg" },
  { key: "balcon", label: "Balcon", icon: "/icons/balcony 1.svg" },
  { key: "baignoire", label: "Baignoire", icon: "/icons/bathtub.svg" },
  { key: "salon", label: "Salon", icon: "/icons/espace.svg" },
  {
    key: "desinfectants",
    label: "Désinfectants",
    icon: "/icons/Security et hygiene.svg",
  },
  {
    key: "extincteurs",
    label: "Extincteurs",
    icon: "/icons/Security et hygiene.svg",
  },
  { key: "ascenseur", label: "Ascenseur", icon: "/icons/ascenseur.svg" },
  { key: "cuisine", label: "Cuisine", icon: "/icons/kitchen.svg" },
  { key: "laverie", label: "Laverie", icon: "/icons/laundry 1.svg" },
  { key: "securite", label: "Sécurité", icon: "/icons/Security et hygiene.svg" },
];

const AMENITIES_MAP = AMENITIES.reduce((acc, item) => {
  const normalizedKey = normalizeAmenity(item.key);
  acc[normalizedKey] = item;
  acc[normalizeAmenity(item.label)] = item;
  return acc;
}, {});

function normalizeAmenity(value) {
  if (!value) return "";
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function getAmenityIcon(name) {
  const normalized = normalizeAmenity(name);
  return AMENITIES_MAP[normalized]?.icon || DEFAULT_AMENITY_ICON;
}

export function getAmenityLabel(name) {
  const normalized = normalizeAmenity(name);
  return AMENITIES_MAP[normalized]?.label || name || "";
}

export { DEFAULT_AMENITY_ICON, AMENITIES_MAP };
