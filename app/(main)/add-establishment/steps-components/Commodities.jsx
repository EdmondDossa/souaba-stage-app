"use client";
import React, { useState } from "react";
import ChoiceCard from "@/components/ui/common/ChoiceCard";
import StepTitle from "./StepTitle";

const Commodities = () => {
  const [commodities,setCommodities] = useState([]);

  const commoditiesList = [
  "Télévision",
  "Wifi",
  "Rondelle",
  "Balcon",
  "Nettoyeur",
  "Radio",
  "Ascenseur",
  "Autre"
  ];

  return (
    <>
      <StepTitle>Ajoutez les commodités disponibles chez vous.</StepTitle>
      <section className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-8">
        {commoditiesList.map((commoditie) => (
          <ChoiceCard
            key={commoditie}
            optionType="checkbox"
            label={commoditie}
            currentValue={commodities}
            setCurrentValue={setCommodities}
          />
        ))}
      </section>
    </>
  );
};

export default Commodities;
