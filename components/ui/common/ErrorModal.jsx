import React from "react";
import { XCircle, X } from "lucide-react";

export default function ErrorModal({ message, onClose}) {

  if(!message) return;

  return (
    <div className="fixed inset-0 flex text-sm items-center justify-center bg-black/50 z-50">
      <div className="relative w-[400px] bg-white rounded-2xl shadow-lg p-6">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Icône + message */}
        <div className="flex flex-col items-center space-y-4">
          <XCircle className="text-red-500" size={60} />
          <h2 className="text-xl font-semibold text-red-600">Désolé</h2>
          <p className="text-center text-gray-700">{message}</p>
        </div>

        {/* Bouton OK */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
