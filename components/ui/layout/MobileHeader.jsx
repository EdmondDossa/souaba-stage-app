"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Menu,
  User,
  Search,
  X,
  MapPin,
  Building,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useAuthContext from "@/context/auth";
import ConditionalComponentRender from "@/components/auth/ConditionalComponentRender";
import { usePathname } from "next/navigation";
import { SvgIcon } from "@/components/ui/common";
import Calendar from "@/components/ui/common/Calendar";
import { dateToLetters } from "@/utils/dateToLetters";

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

const MobileHeader = () => {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // SearchBar states
  const [destination, setDestination] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [activeGuestType, setActiveGuestType] = useState(null);

  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const destinationRef = useRef(null);
  const arrivalDateRef = useRef(null);
  const departureDateRef = useRef(null);
  const guestsRef = useRef(null);

  useEffect(() => {
    function closeMenu(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationDropdown(false);
      }

      if (
        arrivalDateRef.current &&
        !arrivalDateRef.current.contains(event.target) &&
        departureDateRef.current &&
        !departureDateRef.current.contains(event.target)
      ) {
        setShowDateDropdown(false);
        setCurrentDateField(null);
      }

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


  useEffect(() => {
    function closeMenu(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleScroll() {
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
      setIsSearchOpen(false);
      setShowDestinationDropdown(false);
      setShowDateDropdown(false);
      setShowGuestsDropdown(false);
      setActiveGuestType(null);
      setCurrentDateField(null);
    }

    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", handleScroll);
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
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="fixed w-full bg-white shadow-md top-0 z-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu icon (mobile) */}
          <div
            ref={menuRef}
            className="w-10 h-10 flex items-center justify-center md:hidden relative"
          >
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition"
            >
              <div className="relative w-6 h-6">
                {/* Icône du menu fermé */}
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "opacity-0 scale-0 pointer-events-none"
                      : "opacity-100 scale-100"
                  }`}
                >
                  <SvgIcon name="menuGroup" size={25} />
                </div>

                {/* Icône du menu ouvert */}
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0 pointer-events-none"
                  }`}
                >
                  <SvgIcon name="menuGroupClicked" size={25} />
                </div>
              </div>
            </button>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
              <div className="fixed left-4 top-[72px] w-64 text-sm bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-[100]">
                <div className="p-4">
                  <nav className="flex flex-col space-y-2 mb-4">
                    <Link
                      href="/find-accomodation"
                      className="text-black  hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Trouver un hébergement
                    </Link>
                  </nav>

                  <ConditionalComponentRender forLoggedUser={false}>
                    <div className="flex flex-col space-y-2 mb-4">
                      <Link
                        href="/register"
                        className="inline-flex justify-center items-center px-5 py-2.5 border-2 border-primary text-black rounded-lg text-sm font-bold bg-white hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        S'inscrire
                      </Link>

                      <Link
                        href="/login"
                        className="inline-flex justify-center items-center px-5 py-2.5 border-2 border-primary text-black rounded-lg text-sm font-bold bg-white hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Se connecter
                      </Link>
                    </div>
                  </ConditionalComponentRender>

                  <Link
                    href="/add-establishment"
                    className="inline-flex whitespace-nowrap justify-center items-center w-full px-5 py-2.5 bg-green text-white rounded-lg text-sm font-bold hover:opacity-80 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ajouter votre établissement
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Logo - Center */}
          <div className="flex-1 flex justify-center md:flex-none md:flex-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-primary.png"
                alt="Logo"
                width={100}
                height={100}
                className="h-auto"
              />
            </Link>
          </div>

          {/* Right side - Search icon (mobile) */}
          <div className="w-10 h-10 flex items-center justify-center md:hidden relative">
            <button
              onClick={toggleSearch}
              className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition"
            >
              <div className="relative w-6 h-6">
                {/* Icône du menu fermé */}
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                    isSearchOpen
                      ? "opacity-0 scale-0 pointer-events-none"
                      : "opacity-100 scale-100"
                  }`}
                >
                  <SvgIcon name="Search" size={25} />
                </div>

                {/* Icône du menu ouvert */}
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                    isSearchOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0 pointer-events-none"
                  }`}
                >
                  <SvgIcon name="searchClicked" size={25} />
                </div>
              </div>
            </button>

            {/* Mobile Search Dropdown */}
            {isSearchOpen && (
              <div className="fixed right-4 top-[72px] min-w-[250px] w-[calc(100vw-17rem)] max-w-md bg-white rounded-xl shadow-lg border border-gray-200 overflow-visible z-[100]">
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Destination */}
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

                      {showDestinationDropdown &&
                        filteredDestinations.length > 0 && (
                          <ul
                            className="fixed z-[110] bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto w-[calc(100vw-4rem)] max-w-sm max-h-[50vh]"
                            style={{
                              top:
                                destinationRef.current?.getBoundingClientRect()
                                  .bottom +
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
                          className="w-full px-3 py-2 text-sm focus:outline-none cursor-pointer"
                        />
                        {showDateDropdown && currentDateField === "arrival" && (
                          <div
                            className="fixed z-[110]"
                            style={{
                              top:
                                arrivalDateRef.current?.getBoundingClientRect()
                                  .bottom +
                                4 +
                                "px",
                              left: "1rem",
                              right: "1rem",
                            }}
                          >
                            <Calendar
                              selectedDate={arrivalDate || new Date()}
                              onDateSelect={(date) =>
                                handleDateSelect(date, "arrival")
                              }
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
                          className="w-full px-3 py-2 text-sm focus:outline-none cursor-pointer"
                        />
                        {showDateDropdown &&
                          currentDateField === "departure" && (
                            <div
                              className="fixed z-[110]"
                              style={{
                                top:
                                  departureDateRef.current?.getBoundingClientRect()
                                    .bottom +
                                  4 +
                                  "px",
                                left: "1rem",
                                right: "1rem",
                              }}
                            >
                              <Calendar
                                selectedDate={departureDate || new Date()}
                                onDateSelect={(date) =>
                                  handleDateSelect(date, "departure")
                                }
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
                              <ChevronDown
                                size={12}
                                className="text-gray-400"
                              />
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
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
