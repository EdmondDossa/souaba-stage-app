import Image from 'next/image';
import SvgIcon from './SvgIcon';

export default function PropertyAmenities({ amenities, title = "Commodités offertes" }) {
  return (
    <div className="space-y-6 ">
      <h3 className="text-xl font-montserrat-bold font-bold text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-3">
        {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <SvgIcon
                  name={amenity}
                  size={20}
                />
              </div>
              <span className="text-gray-700 text-sm font-montserrat-medium">{amenity}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
