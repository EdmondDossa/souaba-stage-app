"use client";
import React, { useEffect, useState } from "react";
import StepTitle from "../ui/StepTitle";
import { Minus, Plus } from "lucide-react";

const Equipements = ({ handleFormDataUpdate, initialState, allowNextStep }) => {
  const [rooms, setRooms] = useState(initialState?.rooms ?? 1);
  const [bathrooms, setBathrooms] = useState(initialState?.bathrooms ?? 1);
  const [parking, setParking] = useState(initialState?.parking ?? 1);

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

  useEffect(() => {
    handleFormDataUpdate({ rooms, bathrooms, parking });
    if (rooms > 0 || bathrooms > 0 || parking > 0) allowNextStep();
    else allowNextStep(false);
  }, [rooms, bathrooms, parking]);

  return (
    <section className="mx-auto mb-10">
      <StepTitle>Ajoutez les installations disponibles chez vous. </StepTitle>
      <div className="flex flex-col md:flex-row justify-center gap-x-4 items-center py-7">
        {items.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-between w-[300px]"
            >
              <button
                onClick={() => item.update(decrement)}
                className="place-content-center mx-auto rounded-full p-2 bg-gray-200 cursor-pointer"
              >
                <Minus className="w-3 h-3 lg:w-6 lg:h-6" />
              </button>
              <div className="font-montserrat-medium font-bold text-gray-700 text-lg whitespace-nowrap">
                <span className="font-montserrat-bold text-xl lg:text-2xl w-8 inline-block ">
                  {item.value}
                </span>
                {item.label}
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
