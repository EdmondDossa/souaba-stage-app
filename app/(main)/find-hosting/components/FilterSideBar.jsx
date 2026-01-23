import { useState, useEffect } from "react";
import { DropdownMenu } from "radix-ui";
import SelectComponent from "./Select";
import { SlidersHorizontal } from "lucide-react";
import renderStars from "@/utils/render-star";
import { Button } from "@/components/ui/common";

const FilterSideBar = ({
  initialState,
  onFilterUpdate,
  contentSide = "bottom",
  triggerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(
    initialState || {
      byLabel: "Tout",
      byPrice: "",
      byRating: "",
      byCommodities: "",
      byBedrooms: "",
    },
  );
  useEffect(() => {
    if (initialState) {
      setFilterStatus(initialState);
    }
  }, [initialState]);

  const pricesOptions = Array.from({ length: 6 }, (_, i) => {
    const price = (i + 1) * 60000;
    return {
      label: `${price.toLocaleString("fr-FR")} F`,
      value: price,
    };
  });

  const filterMenus = [
    "Tout",
    "Populaire",
    "Proche",
    "Prix-du plus bas au plus élevé",
    "Prix-du plus élevé au plus bas",
  ];

  const ratingOptions = [
    "Tous",
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

  const bedroomsOptions = ["Tous", "1", "2", "3", "4", "5+"];

  function handleFilterUpdate(filterType, value) {
    const updatedData = { ...filterStatus, [filterType]: value };
    setFilterStatus(updatedData);
  }

  const applyFilters = () => {
    if (onFilterUpdate) {
      onFilterUpdate(filterStatus);
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu.Root
      sticky="always"
      modal={false}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenu.Trigger asChild>
        <button
          className={`flex items-center gap-x-3 px-4 py-2 border border-gray-400 rounded-3xl hover:bg-gray-100 transition ${triggerClassName}`}
        >
          <SlidersHorizontal /> Filtres
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={contentSide}
          align="center"
          sideOffset={12}
          className="w-[90vw] max-w-[430px] max-h-[80vh] px-7 py-4 rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto pr-1">
            <div>
              <h1 className="font-montserrat-bold text-gray-600 text-sm">
                Trier par
              </h1>
              <div className="flex flex-wrap justify-between items-center mt-4 gap-x-0.5 gap-y-2">
                {filterMenus.map((item) => (
                  <div key={item}>
                    <button
                      onClick={() => handleFilterUpdate("byLabel", item)}
                      className={`block text-[12px] text-gray-500 rounded-3xl font-bold px-2 py-1 whitespace-nowrap transition ${
                        filterStatus.byLabel === item
                          ? "text-white bg-primary"
                          : "bg-gray-100 hover:bg-primary/10"
                      }`}
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
                placeholder={"Tous les prix"}
                options={pricesOptions}
                value={filterStatus.byPrice}
              />
            </div>

            {/* Filter by rating */}
            <div>
              <h1 className="font-montserrat-bold text-gray-600 mt-5 text-sm">
                Avis
              </h1>
              <ul className="w-full">
                {ratingOptions.map((rating, i) => (
                  <li
                    key={rating}
                    onClick={() => handleFilterUpdate("byRating", rating)}
                    className={`flex items-center justify-between gap-x-4 cursor-pointer ${
                      filterStatus.byRating === rating ? "text-primary" : ""
                    }`}
                  >
                    <label
                      htmlFor={i}
                      className="flex items-center mb-2 gap-x-1 text-md cursor-pointer"
                    >
                      {rating === "Tous"
                        ? null
                        : renderStars(parseFloat(rating))}{" "}
                      <span
                        className={`ms-2 font-bold text-sm ${
                          filterStatus.byRating === rating
                            ? "text-primary"
                            : "text-gray-700"
                        }`}
                      >
                        {rating}
                      </span>
                    </label>
                    <input
                      id={i}
                      name="rating"
                      type="radio"
                      checked={filterStatus.byRating === rating}
                      onChange={() => {}}
                      className="w-8 h-4 cursor-pointer"
                      style={{ accentColor: "var(--color-primary)" }}
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
                onChange={(commodity) =>
                  handleFilterUpdate("byCommodities", commodity)
                }
                placeholder={"Toutes commodités"}
                options={commoditiesOptions}
                value={filterStatus.byCommodities}
              />
            </div>

            {/* Chambres à coucher */}
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
                        ? "text-white bg-primary"
                        : "bg-gray-100 hover:bg-primary/10"
                    }`}
                  >
                    {item}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Button className="w-full !bg-primary" onClick={applyFilters}>
              Rechercher
            </Button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default FilterSideBar;
