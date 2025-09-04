import { useState } from "react";
import { DropdownMenu } from "radix-ui";
import SelectComponent from "./Select";
import { SlidersHorizontal } from "lucide-react";
import renderStars from "@/utils/render-star";

const FilterSideBar = ({ initialState, onFilterUpdate }) => {
  const [filterStatus, setFilterStatus] = useState(
    initialState || {
      byLabel: "Tout",
      byPrice: 60_000,
      byRating: "4.5 et plus",
      byCommodities: "WIFI",
      byBedrooms: "1",
    }
  );

  const pricesOptions = Array.from({ length: 6 })
    .map((_, i) => (i + 1) * 60_000)
    .map((price) => price.toLocaleString("FR-fr") + " F");

  const filterMenus = [
    "Tout",
    "Populaire",
    "Proche",
    "Prix-du plus bas au plus élevé",
  ];

  const ratingOptions = [
    "4.5 et plus",
    "4.0-4.5",
    "3.5-4.0",
    "3.0-3.5",
    "2.5-3.0",
  ];

  const commoditiesOptions = [
    "Télévision",
    "Wifi",
    "Rondelle",
    "Balcon",
    "Nettoyeur",
    "Radio",
    "Ascenseur",
    "Autre",
  ];

  const bedroomsOptions = ["1", "1+", "2+", "3+", "4+", "5+"];

  function handleFilterUpdate(filterType, value) {
    const updatedData = { ...filterStatus, [filterType]: value };
    setFilterStatus(updatedData);
    onFilterUpdate(updatedData);
  }

  return (
    <DropdownMenu.Root sticky="always" modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-x-3 px-4 py-2 border border-gray-400 rounded-3xl hover:bg-gray-100 transition">
          <SlidersHorizontal /> Filtres
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-[430px] px-7 py-4 h-[550px]  rounded-md bg-white  shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]">
          <div>
            <div>
              <h1 className="font-montserrat-bold text-gray-600 text-sm">
                Trier par
              </h1>
              {/* Section Labels pour le filtrage */}
              <div className="flex justify-between items-center mt-4 gap-x-1">
                {filterMenus.map((item) => (
                  <div key={item}>
                    <button
                      onClick={() => handleFilterUpdate("byLabel", item)}
                      className={`block text-[12px] text-gray-500 rounded-3xl font-bold px-2 py-1 whitespace-nowrap transition ${
                        filterStatus.byLabel === item
                          ? "text-white bg-blue-600"
                          : "bg-gray-100  hover:bg-blue-100"
                      } `}
                    >
                      {item}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtrer by Price */}
            <div>
              <h1 className="font-montserrat-bold text-gray-600 mt-5 text-sm">
                Gamme de prix
              </h1>
              <SelectComponent
                onChange={(price) => handleFilterUpdate("byPrice", price)}
                placeholder={"60 000 F"}
                options={pricesOptions}
              />
            </div>
          </div>

          {/* Filter by rating */}
          <div>
            <h1 className="font-montserrat-bold text-gray-600 mt-5 text-sm">
              Avis
            </h1>
            <ul className="w-64">
              {ratingOptions.map((rating, i) => (
                <li
                  key={rating}
                  onClick={()=> handleFilterUpdate("byRating",rating)}
                  className="flex items-center justify-between gap-x-4"
                >
                  <label
                    htmlFor={i}
                    className="flex items-center mb-2 gap-x-1 text-md cursor-pointer"
                  >
                    {renderStars(parseFloat(rating))}{" "}
                    <span className="ms-2 font-bold text-sm text-gray-700">
                      {" "}
                      {rating}{" "}
                    </span>
                  </label>
                  <input
                    id={i}
                    name="commodities"
                    type="radio"
                    className="w-8 h-4 cursor-pointer"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Filter by Commodities */}
          <div>
            <h1 className="font-montserrat-bold text-gray-600 mt-5 text-sm">
              Commodité
            </h1>
            <SelectComponent
              onChange={(price) => handleFilterUpdate("byPrice", price)}
              placeholder={commoditiesOptions[0]}
              options={commoditiesOptions}
            />
          </div>

          {/* Section Labels pour le filtrage */}
          <h1 className="font-montserrat-bold text-gray-600 mt-5 text-sm">
            Chambres à coucher
          </h1>
          <div className="flex justify-between items-center mt-4">
            {bedroomsOptions.map((item) => (
              <div key={item}>
                <button
                  onClick={() => handleFilterUpdate("byBedrooms", item)}
                  className={`block text-[12px] text-gray-500 rounded-3xl font-bold px-3 py-1 whitespace-nowrap transition ${
                    filterStatus.byBedrooms === item
                      ? "text-white bg-blue-600"
                      : "bg-gray-100  hover:bg-blue-100"
                  } `}
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default FilterSideBar;
