"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, MapPin, Building, ChevronDown } from "lucide-react";
import React from "react";
import { dateToLetters } from "@/utils/dateToLetters";
import Calendar from "./Calendar";

// Constantes
const SUGGESTIONS = [
  {
    id: 1,
    name: "Abidjan",
    description: "Côte d'Ivoire",
    type: "city",
    icon: MapPin,
  },
  {
    id: 2,
    name: "Abids",
    description: "Hyderabad, Telangana, India",
    type: "city",
    icon: MapPin,
  },
  {
    id: 3,
    name: "Abidos Hotel Apartment Dubai Land",
    description: "Dubai, Dubai Emirate, United Arab Emirates",
    type: "hotel",
    icon: Building,
  },
  {
    id: 4,
    name: "Hotel Abi d'Oru",
    description: "Olbia, Sardinia, Italy",
    type: "hotel",
    icon: Building,
  },
  {
    id: 5,
    name: "Abidos Hotel Apartment Al Barsha",
    description: "Dubai, Dubai Emirate, United Arab Emirates",
    type: "hotel",
    icon: Building,
  },
  { id: 6, name: "Dakar", description: "Sénégal", type: "city", icon: MapPin },
  {
    id: 7,
    name: "Saint-Louis",
    description: "Sénégal",
    type: "city",
    icon: MapPin,
  },
  {
    id: 8,
    name: "Ziguinchor",
    description: "Sénégal",
    type: "city",
    icon: MapPin,
  },
];

function SearchBar({ isCentered = true }) {
  const [destination, setDestination] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [activeGuestType, setActiveGuestType] = useState(null); // 'adults', 'children', 'babies'

  //Dropdown destination
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  //Dropdown date
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null); // 'arrival' ou 'departure'
  const [selectedDate, setSelectedDate] = useState(new Date());

  const destinationRef = useRef(null);
  const arrivalDateRef = useRef(null);
  const departureDateRef = useRef(null);
  const guestsRef = useRef(null);

  // Gestion des clics à l'extérieur pour fermer les dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fermer le dropdown destination
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationDropdown(false);
      }

      // Fermer le dropdown date
      if (
        arrivalDateRef.current &&
        !arrivalDateRef.current.contains(event.target) &&
        departureDateRef.current &&
        !departureDateRef.current.contains(event.target)
      ) {
        setShowDateDropdown(false);
        setCurrentDateField(null);
      }

      // Fermer le dropdown invités
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
        setActiveGuestType(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredDestinations = useMemo(() => {
    if (!destination) return SUGGESTIONS;
    const q = destination.toLowerCase();
    return SUGGESTIONS.filter((s) => s.name.toLowerCase().includes(q));
  }, [destination]);

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
    if (field === "arrival") setArrivalDate(formattedDate);
    else if (field === "departure") setDepartureDate(formattedDate);
    toggleDropdown("date", false);
  };

  const selectDestination = (value) => {
    setDestination(value.name);
    toggleDropdown("destination", false);
  };

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

  const handleSearch = () => {
    console.log({
      destination,
      arrivalDate,
      departureDate,
      adults,
      children,
      babies,
    });
    alert("Recherche lancée ! (Voir la console pour les détails)");
  };

  return (
    <div
      className={`relative  bg-white rounded-full p-2 shadow-lg flex items-center justify-between max-w-4xl  border border-gray-200  ${
        isCentered ? "mx-auto" : ""
      }`}
    >
      <div className="px-4 py-2 relative" ref={destinationRef}>
        <label
          htmlFor="destination"
          className="block text-start text-sm  text-gray-700 font-montserrat-medium font-bold"
        >
          Destination
        </label>
        <input
          type="text"
          id="destination"
          placeholder="Quelle ville préférez-vous ?"
          className="w-full focus:outline-none text-[13px] text-gray-800 font-bold placeholder-gray-400"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            toggleDropdown("destination", true);
          }}
          onFocus={() => toggleDropdown("destination", true)}
          onClick={() => toggleDropdown("destination", true)}
          onKeyDown={handleDestinationKeyDown}
          autoComplete="off"
        />

        {showDestinationDropdown && filteredDestinations.length > 0 && (
          <ul className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto w-56 h-48 left-0 top-full mt-2">
            {filteredDestinations.map((suggestion, idx) => {
              const IconComponent = suggestion.icon;
              return (
                <li
                  key={suggestion.id}
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    idx === activeIndex ? "bg-gray-50" : ""
                  } ${
                    idx !== filteredDestinations.length - 1
                      ? "border-b border-gray-100"
                      : ""
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

      <div className="border-l border-gray-200 h-12"></div>

      <div className="flex-1 px-4 py-2 relative" ref={arrivalDateRef}>
        <label
          htmlFor="arrivalDate"
          className="block text-start font-bold font-montserrat-medium text-sm text-gray-700"
        >
          Date d'arrivée
        </label>
        <input
          type="text"
          id="arrivalDate"
          placeholder="Ajouter une date"
          className="w-full focus:outline-none text-[13px] text-sm text-gray-800  font-bold placeholder-gray-400 cursor-pointer"
          onClick={() => handleDateOpen("arrival")}
          value={dateToLetters(arrivalDate)}
          readOnly
        />

        {showDateDropdown && currentDateField === "arrival" && (
          <Calendar
            selectedDate={arrivalDate || new Date()}
            onDateSelect={(date) => handleDateSelect(date, "arrival")}
          />
        )}
      </div>

      <div className="border-l border-gray-200 h-12"></div>

      <div className="flex-1 px-4 py-2 relative" ref={departureDateRef}>
        <label
          htmlFor="departureDate"
          className="block text-start text-[13px] font-montserrat-medium font-bold text-sm text-gray-700"
        >
          Date de départ
        </label>
        <input
          type="text"
          id="departureDate"
          placeholder="Ajouter une date"
          className="w-full focus:outline-none text-[13px] text-sm text-gray-800 font-bold placeholder-gray-400 cursor-pointer"
          onClick={() => handleDateOpen("departure")}
          value={dateToLetters(departureDate)}
          readOnly
        />

        {showDateDropdown && currentDateField === "departure" && (
          <Calendar
            selectedDate={departureDate || new Date()}
            onDateSelect={(date) => handleDateSelect(date, "departure")}
          />
        )}
      </div>

      <div className="border-l border-gray-200 h-12"></div>

      <div className="relative flex-1 px-4 py-2 cursor-pointer" ref={guestsRef}>
        <label className="block text-start font-montserrat-medium font-bold text-sm text-gray-700">
          Nombre d&apos;invités
        </label>
        <div className="flex space-x-2 items-center text-gray-800 mt-2">
          {[
            {
              label: "Adultes",
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
              label: "Bébés",
              value: babies,
              type: "babies",
              setter: setBabies,
              getter: babies,
            },
          ].map(({ label, value, type, setter, getter }) => (
            <div
              key={label}
              className="flex items-center relative max-w-[90px]"
            >
              <label
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveGuestType(type);
                  setShowGuestsDropdown(!showGuestsDropdown);
                }}
                className="me-1 text-xs flex items-center text-gray-400 cursor-pointer font-bold gap-x-1"
              >
                {<span className="w-[45px]"> {getter || label} </span>}
                <ChevronDown
                  size={12}
                  className="text-gray-400 cursor-pointer"
                />
              </label>

              {/* Dropdown individuel pour chaque type */}
              {showGuestsDropdown && activeGuestType === type && (
                <div className="absolute  z-50 bg-white border border-gray-200 shadow-lg w-[70px] left-0 top-full mt-2 ">
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

      <button
        className="bg-primary hover:bg-primary/50 text-white p-4 rounded-full flex items-center justify-center transition-colors duration-200"
        onClick={handleSearch}
      >
        <Search className="text-xl" />
      </button>
    </div>
  );
}

export default SearchBar;
