"use client";
import React, { useEffect, useState } from "react";
import ChoiceCard from "@/components/ui/common/ChoiceCard";
import StepTitle from "../ui/StepTitle";

const Security = ({
  handleFormDataUpdate,
  formValues,
  initialState,
  allowNextStep,
}) => {
  const isHotel =
    formValues.find((step) => step.stepName === "Hébergement").data === "Hôtel";

  const [securities, setSecurities] = useState(initialState || []);

  const defaultSecurityList = [
    "Désinfectants",
    "Lanceurs de feu",
    "Nettoyant quotidien",
    "Extincteurs",
    "Détecteur de fumée",
  ];

  const hotelSecurityList = [...defaultSecurityList, "Kits de premier secours"];

  useEffect(() => {
    handleFormDataUpdate(securities);
    if (securities.length > 0) allowNextStep();
    else allowNextStep(false);
  }, [securities.length]);

  return (
    <div>
      <>
        <StepTitle>Ajoutez la sécurité disponible chez vous.</StepTitle>
        <section className="grid gap-x-4 gap-y-8 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {(isHotel ? hotelSecurityList : defaultSecurityList).map(
            (security) => (
              <ChoiceCard
                key={security}
                optionType="checkbox"
                label={security}
                currentValue={securities}
                setCurrentValue={setSecurities}
              />
            )
          )}
        </section>
      </>
    </div>
  );
};

export default Security;
