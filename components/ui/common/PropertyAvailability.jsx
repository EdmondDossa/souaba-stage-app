"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function PropertyAvailability() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 adultes");

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Disponibilité</h3>
      
      <div className="bg-orange-50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              placeholder="Yaoundé, Cameroun"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              readOnly
            />
          </div>

          {/* Date d'arrivée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'arrivée
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Date de départ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de départ
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Nombre d'invités */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre d'invités
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="1 adulte">1 adulte</option>
              <option value="2 adultes">2 adultes</option>
              <option value="3 adultes">3 adultes</option>
              <option value="4 adultes">4 adultes</option>
            </select>
          </div>
        </div>

        <button className="mt-4 w-full md:w-auto bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
          <Search size={20} />
          <span>Rechercher</span>
        </button>
      </div>
    </div>
  );
}
