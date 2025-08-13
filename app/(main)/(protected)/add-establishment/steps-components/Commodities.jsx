"use client";
import React, { useState, useEffect } from "react";
import ChoiceCard from "@/components/ui/common/ChoiceCard";
import StepTitle from "./StepTitle";

const Commodities = ({ handleFormDataUpdate, initialState, allowNextStep }) => {
  const [commodities, setCommodities] = useState(initialState || []);

  const commoditiesList = [
    "Télévision",
    "Wifi",
    "Rondelle",
    "Balcon",
    "Nettoyeur",
    "Radio",
    "Ascenseur",
    "Autre",
  ];

  useEffect(() => {
    handleFormDataUpdate(commodities);
    if (commodities.length > 0) allowNextStep();
    else allowNextStep(false);
  }, [commodities.length]);

  return (
    <>
      <StepTitle>Ajoutez les commodités disponibles chez vous.</StepTitle>
      <section className="flex flex-wrap justify-center items-center sm:justify-start gap-x-5 gap-y-8">
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
