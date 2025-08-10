"use client";
import React, { useState } from "react";
import StepTitle from "./StepTitle";
import { Minus,Plus } from "lucide-react";

const Equipements = () => {
  const [rooms, setRooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [parking, setParking] = useState(0);

  const increment = (prev) => prev + 1;
  const decrement = (prev) => Math.max(prev - 1, 0);

  const items = [
    {
      label: "Chambres",
      value: rooms,
      update: setRooms,
    },
    {
      label: "Salle de bains",
      value: bathrooms,
      update: setBathrooms,
    },
    {
      label: "Parking",
      value: parking,
      update: setParking,
    },
  ];

  return (
    <section className="mx-auto">
      <StepTitle>Ajoutez les installations disponibles chez vous. </StepTitle>
      <div className="flex flex-col md:flex-row justify-center gap-x-4 items-center py-7">
        {items.map((item, index) => {
          return (
            <div key={index} className="flex items-center justify-between w-[300px]">
              <button
                onClick={() => item.update(decrement)}
                className="place-content-center mx-auto rounded-full p-2 bg-gray-200 cursor-pointer"
              >
                <Minus className="w-3 h-3 lg:w-6 lg:h-6" />
              </button>
              <div className="font-montserrat-medium font-bold text-gray-700 text-lg whitespace-nowrap">
                <span className="font-montserrat-bold text-xl lg:text-2xl w-8 inline-block "> {item.value} </span> {item.label}
              </div>
              <button
                onClick={() => item.update(increment)}
                className="place-content-center mx-auto rounded-full p-2 bg-primary text-white cursor-pointer"
              >
                <Plus className="w-3 h-3 lg:w-6 lg:h-6" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Equipements;
