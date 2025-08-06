"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import React from "react";

export default function SearchBar() {
  const [destination, setDestination] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

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

  const increment = (setter, value) => setter(value + 1);

  const decrement = (setter, value) => setter(value > 0 ? value - 1 : 0);

  const handleDateInputFocus = (e) => {
    e.currentTarget.type = "date";
  };

  const handleDateInputBlur = (e) => {
    if (!e.currentTarget.value) {
      e.currentTarget.type = "text";
    }
  };

  return (
    <div className="relative bg-white rounded-full p-2 shadow-lg flex items-center justify-between space-x-4 max-w-5xl mx-auto border border-gray-200 ">
      <div className="flex-1 px-4 py-2">
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
          className="w-full focus:outline-none font-montserrat-medium  text-sm text-gray-800 font-bold  placeholder-gray-400"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className="border-l border-gray-200 h-12"></div>

      <div className="flex-1 px-4 py-2">
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
          className="w-full focus:outline-none font-montserrat-medium  text-sm text-gray-800 font-bold  placeholder-gray-400"
          onFocus={handleDateInputFocus}
          onBlur={handleDateInputBlur}
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
        />
      </div>

      <div className="border-l border-gray-200 h-12"></div>

      <div className="flex-1 px-4 py-2">
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
          className="w-full focus:outline-none font-montserrat-medium  text-sm text-gray-800 font-bold  placeholder-gray-400"
          onFocus={handleDateInputFocus}
          onBlur={handleDateInputBlur}
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </div>

      <div className="border-l border-gray-200 h-12"></div>

      <div className="relative flex-1 px-4 py-2 cursor-pointer">
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
              Bébés
            </label>
            <select
              className="font-mono"
              onChange={(e) => {
                setBabies(parseInt(e.target.value));
              }}
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
