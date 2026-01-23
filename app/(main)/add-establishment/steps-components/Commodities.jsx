"use client";
import React, { useState, useEffect } from "react";
import ChoiceCard from "@/components/ui/common/ChoiceCard";
import StepTitle from "../ui/StepTitle";

const Commodities = ({
  handleFormDataUpdate,
  initialState,
  allowNextStep,
  formValues,
}) => {
  const [commodities, setCommodities] = useState(initialState || []);
  const isHotel =
    formValues.find((step) => step.stepName === "Hébergement").data === "Hôtel";

  const defaultCommoditiesList =  [
    "Piscine",
    "Jacuzzi",
    "Patio",
    "Barbecue",
    "Brasero",
    "Billard",
    "Cheminée",
    " Piano",
    "Désinfectants",
    "Extincteurs",
  ];
  const hotelCommoditiesList = [
    "Piscine",
    "Jacuzzi",
    "Patio",
    "Barbecue",
    "Brasero",
    "Billard",
    "Cheminée",
    " Piano",
    "Désinfectants",
    "Extincteurs",
  ];

  useEffect(() => {
    handleFormDataUpdate(commodities);
    if (commodities.length > 0) allowNextStep();
    else allowNextStep(false);
  }, [commodities.length]);

  return (
    <>
      <StepTitle>Ajoutez les commodités disponibles chez vous.</StepTitle>
      <section className="grid gap-x-4 gap-y-8 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {(isHotel ? hotelCommoditiesList : defaultCommoditiesList).map(
          (commoditie) => (
            <ChoiceCard
              key={commoditie}
              optionType="checkbox"
              label={commoditie}
              currentValue={commodities}
              setCurrentValue={setCommodities}
            />
          )
        )}
      </section>
    </>
  );
};

export default Commodities;
