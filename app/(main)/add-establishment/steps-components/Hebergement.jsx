import React, { useEffect, useState } from "react";
import hotelMini from "@/public/images/add-etablishment/hotel-mini.png";
import residenceMini from "@/public/images/add-etablishment/residence-mini.png";
import studioMini from "@/public/images/add-etablishment/studio-mini.png";
import StepTitle from "../ui/StepTitle";
import ChoiceCard from "@/components/ui/common/ChoiceCard";

const Hebergement = ({ handleFormDataUpdate, initialState,allowNextStep }) => {
  const [hebergementMode, setHebergementMode] = useState(
    initialState || "Hôtel"
  );

  const items = [
    {
      label: "Hôtel",
      icon: hotelMini,
    },
    {
      label: "Résidence",
      icon: residenceMini,
    },
    {
      label: "Appartement",
      icon: residenceMini,
    },
    {
      label: "Villa",
      icon: residenceMini,
    },
    {
      label: "Studio",
      icon: studioMini,
    },
  ];

  useEffect(() => {
    if (hebergementMode) {
      handleFormDataUpdate(hebergementMode);
      allowNextStep();
    };
  }, [hebergementMode]);

  return (
    <>
      <StepTitle>Quel genre d'endroit allez-vous héberger ?</StepTitle>
      <section className="grid gap-x-4 gap-y-8 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {items.map((item) => (
          <ChoiceCard
            key={item.label}
            label={item.label}
            icon={item.icon}
            currentValue={hebergementMode}
            setCurrentValue={setHebergementMode}
          />
        ))}
      </section>
    </>
  );
};

export default Hebergement;
