"use client";
import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { SvgIcon } from '../../../components/ui/common';

const ReservationValide = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8">
        {/* Icône de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-300 rounded-full mb-6">
            <Check size={40} className="text-white" />
          </div>
          
          {/* Titre */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Félicitations!
          </h1>
          
          {/* Message de confirmation */}
          <p className="text-gray-600 text-lg leading-relaxed">
            Votre réservation d&apos;hôtel a bien été effectuée. Vous <br />
            pouvez la consulter dans le menu « Profil ».
          </p>
        </div>

        {/* Actions disponibles */}
        <div className="grid grid-cols-2 gap-6 mt-12">
          {/* Voir l'itinéraire */}
          <button className="flex items-center space-x-3 p-4  rounded-lg ">
            <div className="flex items-center justify-center w-12 h-12 ">
                 <SvgIcon name="Address" size={34} className="" />
            </div>
            <span className="text-gray-700 font-medium">Voir l&apos;itinéraire</span>
          </button>

          {/* Ajouter à mon calendrier */}
          <button className="flex items-center space-x-3 p-4  rounded-lg ">
            <div className="flex items-center justify-center w-12 h-12 ">
                 <SvgIcon name="calendar" size={34} className="" />
            </div>
            <span className="text-gray-700 font-medium">Ajouter à mon calendrier</span>
          </button>

          {/* Télécharger ma réservation en pdf */}
          <button className="flex items-center space-x-3 p-4  rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 ">
               <SvgIcon name="Export Pdf" size={34} className="" />
            </div>
            <span className="text-gray-700 font-medium">Télécharger ma réservation en pdf</span>
          </button>

          {/* Faire une nouvelle réservation */}
          <button className="flex items-center space-x-3 p-4  rounded-lg ">
            <div className="flex items-center justify-center w-12 h-12">
               <SvgIcon name="Joyent" size={34} className="" />
            </div>
            <span className="text-gray-700 font-medium">Faire une nouvelle réservation</span>
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default ReservationValide;
