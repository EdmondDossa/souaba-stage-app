"use client";
import React, { useEffect, useState } from "react";
import ChoiceCard from "@/components/ui/common/ChoiceCard";
import StepTitle from "./StepTitle";

const Security = ({ handleFormDataUpdate, initialState }) => {
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
    if (securities.length > 0) handleFormDataUpdate(securities);
  }, [securities.length]);

  return (
    <div>
      <>
        <StepTitle>Ajoutez la sécurité disponible chez vous.</StepTitle>
        <section className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-8">
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
