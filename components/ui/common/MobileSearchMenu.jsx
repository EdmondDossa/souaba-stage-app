import React from "react";
import { useRef, useState, useMemo, useEffect } from "react";
import useAuthContext from "@/context/auth";
import { usePathname } from "next/navigation";
import Calendar from "@/components/ui/common/Calendar";
import { dateToLetters } from "@/utils/dateToLetters";

import {
  Menu,
  User,
  Search,
  X,
  MapPin,
  Building,
  ChevronDown,
} from "lucide-react";
import { DESTINATION_DATA } from "@/data/destination-locations";

const MobileSearchMenu = ({
  className,
  onSearch,
  hideDestination = false,
  initialValues,
  defaultCapacity = 0,
}) => {
  const formatInitialDate = (value) => {
    if (!value) return "";
    if (value.includes("/")) return value;
    const parts = value.split("-");
    if (parts.length !== 3) return value;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const formatInitialCapacity = (value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };

  // SearchBar states
  const [destination, setDestination] = useState(
    initialValues?.city?.trim() || "",
  );
  const [arrivalDate, setArrivalDate] = useState(
    formatInitialDate(initialValues?.check_in),
  );
  const [departureDate, setDepartureDate] = useState(
    formatInitialDate(initialValues?.check_out),
  );
  const [adults, setAdults] = useState(() => {
    const initial = formatInitialCapacity(initialValues?.capacity);
    return initial > 0 ? initial : defaultCapacity;
  });
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [activeGuestType, setActiveGuestType] = useState(null);

  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateErrorMessage, setDateErrorMessage] = useState("");

  const destinationRef = useRef(null);
  const arrivalDateRef = useRef(null);
  const departureDateRef = useRef(null);
  const guestsRef = useRef(null);

  const handleDestinationKeyDown = (e) => {
    if (!showDestinationDropdown) return;
    const actions = {
      ArrowDown: () =>
        setActiveIndex((i) => Math.min(i + 1, filteredDestinations.length - 1)),
      ArrowUp: () => setActiveIndex((i) => Math.max(i - 1, 0)),
      Enter: () =>
        activeIndex >= 0 &&
        selectDestination(filteredDestinations[activeIndex]),
      Escape: () => toggleDropdown("destination", false),
    };
    if (actions[e.key]) {
      e.preventDefault();
      actions[e.key]();
    }
  };

  const selectDestination = (value) => {
    setDestination(value.name);
    toggleDropdown("destination", false);
  };
  const slugifyLabel = (value) =>
    String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const buildDestinationSuggestions = () => {
    const abidjan = DESTINATION_DATA["Abidjan"];
    const communes = abidjan?.communes || [];
    const suggestions = [
      {
        id: "abidjan-city",
        name: "Abidjan",
        description: "Côte d'Ivoire",
        type: "city",
        icon: MapPin,
      },
      ...communes.map((commune) => ({
        id: `abidjan-${slugifyLabel(commune)}`,
        name: `${commune}, Abidjan`,
        description: "Commune d'Abidjan",
        type: "neighborhood",
        icon: MapPin,
      })),
      ...(DESTINATION_DATA.villes || []).map((ville) => ({
        id: slugifyLabel(ville),
        name: ville,
        description: "Côte d'Ivoire",
        type: "city",
        icon: MapPin,
      })),
    ];
    return suggestions;
  };

  const SUGGESTIONS = [...buildDestinationSuggestions()];

  useEffect(() => {
    if (!initialValues) return;
    setDestination(initialValues?.city?.trim() || "");
    setArrivalDate(formatInitialDate(initialValues?.check_in));
    setDepartureDate(formatInitialDate(initialValues?.check_out));
    const initialCapacity = formatInitialCapacity(initialValues?.capacity);
    setAdults(initialCapacity > 0 ? initialCapacity : defaultCapacity);
    setChildren(0);
    setBabies(0);
  }, [initialValues, defaultCapacity]);

  const handleSearch = () => {
    if (!arrivalDate || !departureDate) {
      setDateErrorMessage(
        "Sélectionnez une date d'arrivée et une date de départ pour lancer la recherche.",
      );
      return;
    }
    if (dateErrorMessage) {
      setDateErrorMessage("");
    }
    const check_in = arrivalDate.split("/").reverse().join("-");
    const check_out = departureDate.split("/").reverse().join("-");
    const capacity = adults + children;
    if (onSearch) {
      onSearch({
        check_in,
        check_out,
        capacity: capacity > 0 ? capacity : defaultCapacity || 1,
        destination: destination.trim(),
      });
      return;
    }
  };

  const toggleDropdown = (dropdown, state) => {
    switch (dropdown) {
      case "destination":
        setShowDestinationDropdown(state);
        if (!state) setActiveIndex(-1);
        break;
      case "date":
        setShowDateDropdown(state);
        if (!state) setCurrentDateField(null);
        break;
      case "guests":
        setShowGuestsDropdown(state);
        break;
    }
  };

  const handleDateOpen = (field) => {
    setShowDateDropdown(true);
    setCurrentDateField(field);
    setSelectedDate(new Date());
  };

  const handleDateSelect = (date, field) => {
    const formattedDate = date.toLocaleDateString("fr-FR");
    const nextArrival = field === "arrival" ? formattedDate : arrivalDate;
    const nextDeparture = field === "departure" ? formattedDate : departureDate;
    if (field === "arrival") setArrivalDate(formattedDate);
    else if (field === "departure") setDepartureDate(formattedDate);
    toggleDropdown("date", false);
    if (nextArrival && nextDeparture && dateErrorMessage) {
      setDateErrorMessage("");
    }
  };

  const filteredDestinations = useMemo(() => {
    if (!destination) return SUGGESTIONS;
    const q = destination.toLowerCase();
    return SUGGESTIONS.filter((s) => s.name.toLowerCase().includes(q));
  }, [destination]);

  const showDateError = Boolean(dateErrorMessage);
  const arrivalError = showDateError && !arrivalDate;
  const departureError = showDateError && !departureDate;

  return (
    <div className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Destination */}
        {!hideDestination && (
          <div ref={destinationRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              placeholder="Quelle ville préférez-vous ?"
              className="w-full px-3 py-2 text-sm focus:outline-none"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                toggleDropdown("destination", true);
              }}
              onFocus={() => toggleDropdown("destination", true)}
              onKeyDown={handleDestinationKeyDown}
              autoComplete="off"
            />
            <div>
              <hr className="w-full" />
            </div>

            {showDestinationDropdown && filteredDestinations.length > 0 && (
              <ul
                className="fixed z-[110] bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto w-[calc(100vw-4rem)] max-w-sm max-h-[50vh]"
                style={{
                  top:
                    destinationRef.current?.getBoundingClientRect().bottom +
                    4 +
                    "px",
                  left: "1rem",
                  right: "1rem",
                }}
              >
                {filteredDestinations.map((suggestion, idx) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <li
                      key={suggestion.id}
                      className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        idx === activeIndex ? "bg-gray-50" : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectDestination(suggestion);
                      }}
                    >
                      <IconComponent
                        size={20}
                        className="text-black mr-3 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-bold text-black truncate">
                          {suggestion.name}
                        </div>
                        <div className="text-xs text-black truncate">
                          {suggestion.description}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Date d'arrivée */}
        <div ref={arrivalDateRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date d'arrivée
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ajouter une date"
              onClick={() => handleDateOpen("arrival")}
              value={dateToLetters(arrivalDate)}
              readOnly
              className={`w-full px-3 py-2 text-sm focus:outline-none cursor-pointer border rounded transition ${
                arrivalError ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
              }`}
            />
            {showDateDropdown && currentDateField === "arrival" && (
              <div
                className="fixed z-[110]"
                style={{
                  top:
                    arrivalDateRef.current?.getBoundingClientRect().bottom +
                    4 +
                    "px",
                  left: "1rem",
                  right: "1rem",
                }}
              >
                <Calendar
                  selectedDate={arrivalDate || null}
                  minDate={new Date()}
                  rangeStart={arrivalDate || null}
                  rangeEnd={departureDate || null}
                  onDateSelect={(date) => handleDateSelect(date, "arrival")}
                />
              </div>
            )}
          </div>
          <div>
            <hr className="w-full" />
          </div>
        </div>

        {/* Date de départ */}
        <div ref={departureDateRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de départ
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ajouter une date"
              onClick={() => handleDateOpen("departure")}
              value={dateToLetters(departureDate)}
              readOnly
              className={`w-full px-3 py-2 text-sm focus:outline-none cursor-pointer border rounded transition ${
                departureError ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
              }`}
            />
            {showDateDropdown && currentDateField === "departure" && (
              <div
                className="fixed z-[110]"
                style={{
                  top:
                    departureDateRef.current?.getBoundingClientRect().bottom +
                    4 +
                    "px",
                  left: "1rem",
                  right: "1rem",
                }}
              >
                <Calendar
                  selectedDate={departureDate || null}
                  minDate={arrivalDate || new Date()}
                  rangeStart={arrivalDate || null}
                  rangeEnd={departureDate || null}
                  onDateSelect={(date) => handleDateSelect(date, "departure")}
                />
              </div>
            )}
          </div>
          <div>
            <hr className="w-full" />
          </div>
        </div>

        {/* Nombre d'invités */}
        <div ref={guestsRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre d'invités
          </label>
          <div className="flex gap-2">
            {[
              {
                label: "Adulte",
                value: adults,
                type: "adults",
                setter: setAdults,
                getter: adults,
              },
              {
                label: "Enfants",
                value: children,
                type: "children",
                setter: setChildren,
                getter: children,
              },
              {
                label: "Bébé",
                value: babies,
                type: "babies",
                setter: setBabies,
                getter: babies,
              },
            ].map(({ label, type, setter, getter }) => (
              <div key={label} className="flex-1 relative">
                <label
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGuestType(type);
                    setShowGuestsDropdown(!showGuestsDropdown);
                  }}
                  className="text-xs flex items-center text-gray-400 cursor-pointer font-bold gap-x-1"
                >
                  <span>{getter || label}</span>
                  <ChevronDown size={12} className="text-gray-400" />
                </label>

                {showGuestsDropdown && activeGuestType === type && (
                  <div className="absolute z-[110] bg-white border border-gray-300 shadow-lg w-14 left-0 top-full mt-2 rounded-lg">
                    <div className="p-1 max-h-44 overflow-y-auto">
                      {(type === "adults"
                        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                        : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                      ).map((number) => (
                        <button
                          key={number}
                          onClick={() => {
                            setter(number);
                            setShowGuestsDropdown(false);
                            setActiveGuestType(null);
                          }}
                          className="text-center w-full px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDateError && (
          <div className="px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded mt-2">
            {dateErrorMessage}
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-80 transition-colors flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Recherche
        </button>
      </div>
    </div>
  );
};

export default MobileSearchMenu;
