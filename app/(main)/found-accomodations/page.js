"use client";
import foundAccomodityMap from "@/public/images/search-home-map.png";
import { X } from "lucide-react";
import Image from "next/image";
import FilterSideBar from "../find-accomodation/components/FilterSideBar";
import { PropertyCard } from "@/components/ui/common";

const FoundProducts = () => {
  const filtersThemes = ["100, Rue Smart", "12 Mars 2021", "Courte Période"];

  const Properties = [
    {
      imageUrl: "/images/new-property1.jpg",
      price: "620 000 FCFA",
      title: "Appartement bien meublé",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 2,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property2.jpg",
      price: "720 000 FCFA",
      title: "Appartement Familial Confortable",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: true,
      ellipsis: 3,

      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property3.jpg",
      price: "820 000 FCFA",
      title: "Maison de plage d'été",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 1,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 1,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 2,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 4,
      ownerInfo: {
        photo: "/images/owner-photo.png",
        fullname: "John Doberman",
        minPrice: "600 000",
        maxPrice: "1 200 000",
      },
    },
  ];

  return (
    <div className="flex items-start mb-10">
      <div className="w-1/2 pl-20 max-h-screen overflow-y-scroll">
        <h1 className="font-montserrat-bold text-gray-700 text-2xl mt-10">
          10 résultats trouvés
        </h1>
        <div className="flex items-end gap-x-5">
          <ul className="flex items-center text-[12px] gap-x-3 mt-5">
            {filtersThemes.map((theme) => (
              <li
                className="flex items-center justify-center p-2 bg-gray-300 hover:bg-gray-200 transition rounded-3xl group cursor-pointer"
                key={theme}
              >
                {theme}
                <span>
                  <X className="w-4 h-5 ms-4 group-hover:text-red-600" />
                </span>
              </li>
            ))}
          </ul>
          <div>
            <FilterSideBar onFilterUpdate={()=>{}} />
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-end mx-10">
          {Properties.map((property, index) => (
            <PropertyCard
              key={index}
              imageUrl={property.imageUrl}
              price={property.price}
              title={property.title}
              location={property.location}
              isFavorite={property.isFavorite}
              showEllipsis={true}
              ellipsis={property.ellipsis}
              showAmenities={true}
              ownerInfo={property.ownerInfo}
              showPrice={false}
              className="flex-shrink-0 shadow-sm rounded-b-xl mb-10 [&_.ameneties_svg]:text-primary "
            />
          ))}
        </div>
      </div>
      <aside className="w-1/2">
        <Image
          className="w-full"
          src={foundAccomodityMap}
          alt="found products map"
        />
      </aside>
    </div>
  );
};

export default FoundProducts;
