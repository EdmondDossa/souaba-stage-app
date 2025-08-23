"use client";
import { PropertyCard } from "@/components/ui/common";
import Paginator from "@/components/ui/common/Paginator";
import { Dot, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import FilterSideBar from "@/app/(main)/find-accomodation/components/FilterSideBar";

const FindAccomodation = () => {
  const Properties = [
    {
      imageUrl: "/images/new-property1.jpg",
      price: "620 000 FCFA",
      title: "Appartement bien meublé",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 2,
    },
    {
      imageUrl: "/images/new-property2.jpg",
      price: "720 000 FCFA",
      title: "Appartement Familial Confortable",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: true,
      ellipsis: 3,
    },
    {
      imageUrl: "/images/new-property3.jpg",
      price: "820 000 FCFA",
      title: "Maison de plage d'été",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 1,
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 1,
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 2,
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      ellipsis: 4,
    },
  ];

  const navItems = ["Hôtel", "Résidence", "Villas", "Plus"];

  const [currentFilter, setCurrentFilter] = useState("Hôtel");

  function handleFilterChange(filter) {
    setCurrentFilter(filter);
  }

  function handlePageChange(page) {
    //
  }

  function handleFilterUpdate(filters){
    console.log(filters);
    //
  }

  return (
    <>
      <div className="max-w-7xl relative mx-auto px-20 mt-15 font-montserrat font-bold text-gray-800">
        {/* Search filter bar */}
        <nav className="flex justify-between items-center text-sm">
          <ul className="flex gap-x-3">
            {navItems.map((item, i) => (
              <li
                onClick={() => handleFilterChange(item)}
                className={`flex items-center cursor-pointer`}
                key={item}
              >
                {i > 0 && <Dot size={35} className="text-gray-300 -me-2" />}{" "}
                <span
                  className={` ${
                    item === currentFilter ? "active-border" : ""
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <div>
            <FilterSideBar onFilterUpdate={handleFilterUpdate}  />
          </div>
        </nav>

        {/* Property List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  pb-4 scrollbar-hide w-full mt-10">
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
              className="flex-shrink-0"
            />
          ))}
        </div>
        <Paginator
          onPageChange={handlePageChange}
          defaultPage={1}
          totalPages={15}
        />
      </div>
    </>
  );
};

export default FindAccomodation;
