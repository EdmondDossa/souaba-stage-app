"use client";
import FormSteps from "@/components/ui/common/FormSteps";
import { useState } from "react";
import {
  IdentityCard,
  Hebergement,
  Commodities,
  Equipements,
  PropertyInformations,
  Security,
  Resume,
} from "@/app/(main)/add-establishment/steps-components";
import { FaChevronLeft } from "react-icons/fa";
import { Button } from "@/components/ui/common";
import Wrapper from "./steps-components/Wrapper";

const AddEstablishment = () => {
  const steps = [
    "Hébergement",
    "Informations",
    "Equipements",
    "Commodités",
    "Sécurités",
    "Résumé",
    "Pièce d'identité",
  ];
  const [formValues, setFormValues] = useState(() => steps.map);

  const [currentStep, setCurrentStep] = useState(4);

  return (
    <section>
      <FormSteps steps={steps} currentStep={currentStep} />
      <section className="w-full md:w-[90%]  mx-auto mt-10">
        <Wrapper withBorder={![0,1].includes(currentStep)}>
          <div className="w-full p-4 mb-4">
            <Commodities />
          </div>
          <div className="flex justify-between px-10 mb-5">
            <Button
              variant="secondary"
              size="lg"
              className="font-montserrat-medium border border-gray-300 cursor-pointer hover:bg-white hover:text-black bg-white group rounded-lg"
            >
              <FaChevronLeft className="group-hover:-translate-x-1.5 transition-all ease-in" />{" "}
              Retour
            </Button>
            <Button
              size="lg"
              className="font-montserrat-medium font-bold rounded-lg bg-primary py-3 hover:bg-primary/80 cursor-pointer"
            >
              Suivant
            </Button>
          </div>
        </Wrapper>
      </section>
    </section>
  );
};

export default AddEstablishment;
