"use client";
import React, { useEffect, useState } from "react";
import ChoiceCard from "@/components/ui/common/ChoiceCard";
import StepTitle from "./StepTitle";

const Security = ({ handleFormDataUpdate, initialState, allowNextStep }) => {
  const [securities, setSecurities] = useState(initialState || []);

  const securitiesList = [
    "Désinfectants",
    "Lanceurs de feu",
    "Nettoyant quotidien",
    "Extincteurs",
    "Détecteur de fumée",
    "Option1",
    "Option2",
    "Option3",
  ];

  useEffect(() => {
    handleFormDataUpdate(securities);
    if (securities.length > 0) allowNextStep();
    else allowNextStep(false);
  }, [securities.length]);

  return (
    <div>
      <>
        <StepTitle>Ajoutez la sécurité disponible chez vous.</StepTitle>
        <section className="flex flex-wrap justify-center items-center sm:justify-start gap-x-5 gap-y-8">
          {securitiesList.map((security) => (
            <ChoiceCard
              key={security}
              optionType="checkbox"
              label={security}
              currentValue={securities}
              setCurrentValue={setSecurities}
            />
          ))}
        </section>
      </>
    </div>
  );
};

export default Security;
