import Image from "next/image";
import { getAmenityIcon, getAmenityLabel } from "@/data/amenitiesMap";
import SvgIcon from "./SvgIcon";

export default function PropertyAmenities({ amenities, title = "Commodités offertes" }) {
  const normalizedAmenities = (amenities || []).map((amenity) => {
    const raw = typeof amenity === "string" ? amenity : amenity?.name || amenity?.icon || amenity;
    return {
      label: getAmenityLabel(raw),
      icon: getAmenityIcon(raw),
      raw,
    };
  });

  return (
    <div className="space-y-6 ">
      <h3 className="text-xl font-montserrat-bold font-bold text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-y-3 gap-x-3">
        {normalizedAmenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                {amenity.icon?.endsWith(".svg") ? (
                  <Image src={amenity.icon} alt={amenity.label} width={20} height={20} />
                ) : (
                  <SvgIcon name={String(amenity.raw).toLowerCase()} size={20} />
                )}
              </div>
              <span className="text-gray-700 text-sm font-montserrat-medium">{amenity.label}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
