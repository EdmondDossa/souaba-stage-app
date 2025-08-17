"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, MapPin, Building } from "lucide-react";
import React from "react";

export default function SearchBar() {
  const [destination, setDestination] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  //Dropdown destination
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  //Dropdown date
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null); // 'arrival' ou 'departure'
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Refs pour détecter les clics à l'extérieur
  const destinationRef = useRef(null);
  const dateRef = useRef(null);
  const guestsRef = useRef(null);

  // Gestion des clics à l'extérieur pour fermer les dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fermer le dropdown destination
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationDropdown(false);
      }
      
      // Fermer le dropdown date
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowDateDropdown(false);
        setCurrentDateField(null);
      }
      
      // Fermer le dropdown invités
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
    };

    // Ajouter l'event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Nettoyer l'event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Exemple statique de suggestions — tu pourras remplacer par un fetch API plus tard
  const suggestions = [
    {
      id: 1,
      name: "Abidjan",
      description: "Côte d'Ivoire",
      type: "city",
      icon: MapPin
    },
    {
      id: 2,
      name: "Abids",
      description: "Hyderabad, Telangana, India",
      type: "city",
      icon: MapPin
    },
    {
      id: 3,
      name: "Abidos Hotel Apartment Dubai Land",
      description: "Dubai, Dubai Emirate, United Arab Emirates",
      type: "hotel",
      icon: Building
    },
    {
      id: 4,
      name: "Hotel Abi d'Oru",
      description: "Olbia, Sardinia, Italy",
      type: "hotel",
      icon: Building
    },
    {
      id: 5,
      name: "Abidos Hotel Apartment Al Barsha",
      description: "Dubai, Dubai Emirate, United Arab Emirates",
      type: "hotel",
      icon: Building
    },
    {
      id: 6,
      name: "Dakar",
      description: "Sénégal",
      type: "city",
      icon: MapPin
    },
    {
      id: 7,
      name: "Saint-Louis",
      description: "Sénégal",
      type: "city",
      icon: MapPin
    },
    {
      id: 8,
      name: "Ziguinchor",
      description: "Sénégal",
      type: "city",
      icon: MapPin
    }
  ];

  const filteredDestinations = useMemo(() => {
    if (!destination) return suggestions;
    const q = destination.toLowerCase();
    return suggestions.filter((s) => s.name.toLowerCase().includes(q));
  }, [destination]);

  const openDestinationDropdown = () => {
    setShowDestinationDropdown(true);
    setActiveIndex(-1);
  };

  const closeDestinationDropdown = () => {
    setShowDestinationDropdown(false);
    setActiveIndex(-1);
  };

  const selectDestination = (value) => {
    setDestination(value.name);
    closeDestinationDropdown();
  };

  const handleDestinationKeyDown = (e) => {
    if (!showDestinationDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredDestinations.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredDestinations.length) {
        selectDestination(filteredDestinations[activeIndex]);
      }
    } else if (e.key === "Escape") {
      closeDestinationDropdown();
    }
  };
  // ---- fin dropdown destination ----

  // ---- gestion dropdown date ----
  const openDateDropdown = (field) => {
    setShowDateDropdown(true);
    setCurrentDateField(field);
    setSelectedDate(new Date());
  };

  const closeDateDropdown = () => {
    setShowDateDropdown(false);
    setCurrentDateField(null);
  };

  const selectDate = (date) => {
    const formattedDate = date.toLocaleDateString('fr-FR');
    if (currentDateField === 'arrival') {
      setArrivalDate(formattedDate);
    } else if (currentDateField === 'departure') {
      setDepartureDate(formattedDate);
    }
    closeDateDropdown();
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const previousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };
  // ---- fin dropdown date ----

  // ---- gestion dropdown invités ----
  const openGuestsDropdown = () => {
    setShowGuestsDropdown(true);
  };

  const closeGuestsDropdown = () => {
    setShowGuestsDropdown(false);
  };

  const increment = (setter, value) => setter(value + 1);
  const decrement = (setter, value) => setter(value > 0 ? value - 1 : 0);
  // ---- fin dropdown invités ----

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
    <div className="relative bg-white rounded-full p-2 shadow-lg flex items-center justify-between space-x-4 max-w-5xl mx-auto border border-gray-200 ">
      <div className="flex-1 px-4 py-2 relative" ref={destinationRef}>
        <label
          htmlFor="destination"
          className="block text-start text-sm text-gray-700 font-montserrat-medium font-bold"
        >
          Destination
        </label>
        <input
          type="text"
          id="destination"
          placeholder="Quelle ville préférez-vous ?"
          className="w-full focus:outline-none font-montserrat-medium text-sm text-gray-800 font-bold placeholder-gray-400"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            openDestinationDropdown();
          }}
          onFocus={openDestinationDropdown}
          onClick={openDestinationDropdown}
          onKeyDown={handleDestinationKeyDown}
          autoComplete="off"
        />

        {/* Dropdown suggestions */}
        {showDestinationDropdown && filteredDestinations.length > 0 && (
          <ul 
            className="absolute z-50 bg-white border border-gray-200 overflow-auto"
            style={{
              width: '226px',
              height: '191px',
              borderRadius: '5px',
              boxShadow: '0px 3px 5px 1px rgba(0, 0, 0, 0.25)',
              opacity: 1,
              left: '0px',
              top: '100%',
              marginTop: '8px'
            }}
          >
            {filteredDestinations.map((suggestion, idx) => {
              const IconComponent = suggestion.icon;
              return (
                <li
                  key={suggestion.id}
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                    idx === activeIndex ? "bg-gray-50" : ""
                  } ${idx !== filteredDestinations.length - 1 ? "border-b border-gray-100" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectDestination(suggestion);
                  }}
                >
                  <div className="flex-shrink-0 mr-3">
                    <IconComponent 
                      size={20} 
                      className="text-black" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-bold text-black truncate text-left">
                      {suggestion.name}
                    </div>
                    <div className="text-xs text-black truncate text-left">
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

      <div className="flex-1 px-4 py-2 relative" ref={dateRef}>
        <label
          htmlFor="arrivalDate"
          className="block text-start font-montserrat-medium font-bold text-sm text-gray-700"
        >
          Date d'arrivée
        </label>
        <input
          type="text"
          id="arrivalDate"
          placeholder="Ajouter une date"
          className="w-full focus:outline-none font-montserrat-medium text-sm text-gray-800 font-bold placeholder-gray-400 cursor-pointer"
          onClick={() => openDateDropdown('arrival')}
          value={arrivalDate}
          readOnly
        />

        {/* Dropdown calendrier arrivée */}
        {showDateDropdown && currentDateField === 'arrival' && (
          <div 
            className="absolute z-50 bg-white border border-gray-200 px-2 pt-2 pb-3"
            style={{
              width: '190px',
              height: '220px',
              borderRadius: '5px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.25)',
              opacity: 1,
              left: '0px',
              top: '100%',
              marginTop: '8px'
            }}
          >
            {/* En-tête du calendrier */}
            <div className="flex justify-between items-center mb-2">
              <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded text-black">
                <span className="text-xs">‹</span>
              </button>
              <h3 className="font-medium text-black text-xs">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-black">
                <span className="text-xs">›</span>
              </button>
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-0.5">
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-0.5">
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((date, idx) => {
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.getDate() === 20 && isCurrentMonth;
                return (
                  <button
                    key={idx}
                    onClick={() => selectDate(date)}
                    className={`py-1 text-xs hover:bg-gray-100 rounded text-center ${
                      !isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                    } ${isSelected ? 'bg-black text-white' : ''} ${isToday && !isSelected ? 'bg-blue-100' : ''}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="border-l border-gray-200 h-12"></div>

      <div className="flex-1 px-4 py-2 relative">
        <label
          htmlFor="departureDate"
          className="block text-start font-montserrat-medium font-bold text-sm text-gray-700"
        >
          Date de départ
        </label>
        <input
          type="text"
          id="departureDate"
          placeholder="Ajouter une date"
          className="w-full focus:outline-none font-montserrat-medium text-sm text-gray-800 font-bold placeholder-gray-400 cursor-pointer"
          onClick={() => openDateDropdown('departure')}
          value={departureDate}
          readOnly
        />

        {/* Dropdown calendrier départ */}
        {showDateDropdown && currentDateField === 'departure' && (
          <div 
            className="absolute z-50 bg-white border border-gray-200 px-2 pt-2 pb-3"
            style={{
              width: '190px',
              height: '220px',
              borderRadius: '5px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.25)',
              opacity: 1,
              left: '0px',
              top: '100%',
              marginTop: '8px'
            }}
          >
            {/* En-tête du calendrier */}
            <div className="flex justify-between items-center mb-2">
              <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded text-black">
                <span className="text-xs">‹</span>
              </button>
              <h3 className="font-medium text-black text-xs">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-black">
                <span className="text-xs">›</span>
              </button>
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-0.5">
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-0.5">
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((date, idx) => {
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.getDate() === 20 && isCurrentMonth;
                return (
                  <button
                    key={idx}
                    onClick={() => selectDate(date)}
                    className={`py-1 text-xs hover:bg-gray-100 rounded text-center ${
                      !isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                    } ${isSelected ? 'bg-black text-white' : ''} ${isToday && !isSelected ? 'bg-blue-100' : ''}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="border-l border-gray-200 h-12"></div>

      <div className="relative flex-1 px-4 py-2 cursor-pointer" ref={guestsRef}>
        <label className="block text-start font-montserrat-medium font-bold text-sm text-gray-700">
          Nombre d'invités
        </label>
        <div className="flex space-x-2 items-center text-gray-800 placeholder-gray-400">
          <div className="flex items-center justify-center">
            <label className="w-full me-1 focus:outline-none font-montserrat-medium text-sm md:text-[12px] text-gray-400 font-bold">
              Adultes
            </label>
            <select
              className="font-mono"
              onChange={(e) => {
                setAdults(parseInt(e.target.value));
              }}
              value={adults}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
            <label className="w-full me-1 focus:outline-none font-montserrat-medium text-sm md:text-[12px] text-gray-400 font-bold">
              Enfants
            </label>
            <select
              className="font-mono"
              onChange={(e) => {
                setChildren(parseInt(e.target.value));
              }}
              value={children}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
            <label className="w-full me-1 focus:outline-none font-montserrat-medium text-sm md:text-[12px] text-gray-400 font-bold">
              Bébés
            </label>
            <select
              className="font-mono"
              onChange={(e) => {
                setBabies(parseInt(e.target.value));
              }}
              value={babies}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          {!adults && !children && !babies && (
            <span className="text-gray-400">Ajouter des invités</span>
          )}
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
