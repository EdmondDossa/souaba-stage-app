"use client";
import FormSteps from "@/components/ui/common/FormSteps";
import { useEffect, useState } from "react";
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
  const stepsLabels = [
    "Hébergement",
    "Informations",
    "Equipements",
    "Commodités",
    "Sécurités",
    "Résumé",
    "Pièce d'identité",
  ];

  const components = [
    Hebergement,
    PropertyInformations,
    Equipements,
    Commodities,
    Security,
    Resume,
    IdentityCard,
  ];

  const [stepFormValues, setStepFormValues] = useState(() =>
    stepsLabels.map(() => ({ data: null, allowNextStep: false }))
  );

  const [currentStep, setCurrentStep] = useState(0);

  function handleFormDataUpdate(data) {
    let formDataCopy = Array.from(stepFormValues);
    formDataCopy[currentStep].data = data;
    setStepFormValues(formDataCopy);
  }

  function allowNextStep() {
    let formDataCopy = Array.from(stepFormValues);
    formDataCopy[currentStep].allowNextStep = true;
    setStepFormValues(formDataCopy);
  }

  function renderStepComponentWithData(CurrentStepComponent) {
    return (
      <CurrentStepComponent
        handleFormDataUpdate={handleFormDataUpdate}
        initialState={stepFormValues[currentStep].data}
        allowNextStep={allowNextStep}
      />
    );
  }

  function goToNextStep() {
    //make sure we are not on the last step
    if (currentStep != 6) {
      //move only if the prev component gives authorization
      if (stepFormValues[currentStep].allowNextStep)
        setCurrentStep(currentStep + 1);
    }
  }

  useEffect(() => {
    //to make sure the top of each new component is in view - ie reset scroll position
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  return (
    <section>
      <FormSteps stepsLabels={stepsLabels} currentStep={currentStep} />
      <section className="w-full md:w-[90%]  mx-auto mt-10">
        <Wrapper withBorder={![0, 1, 7].includes(currentStep)}>
          {/* Current steps components */}
          <div className="w-full p-4 mb-4">
            {renderStepComponentWithData(components[currentStep])}
          </div>
          <div className="flex justify-between px-10 mb-5">
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="secondary"
              size="lg"
              className={`font-montserrat-medium border border-gray-300 cursor-pointer hover:bg-white hover:text-black bg-white group rounded-lg ${
                currentStep === 0 ? "invisible" : "visible"
              }`}
            >
              <FaChevronLeft className="group-hover:-translate-x-1.5 transition-all ease-in" />{" "}
              Retour
            </Button>
            <Button
              onClick={goToNextStep}
              size="lg"
              className="font-montserrat-medium font-bold rounded-lg bg-primary py-3 hover:bg-primary/80 cursor-pointer"
            >
              {currentStep === 6 ? "Publier" : "Suivant"}
            </Button>
          </div>
        </Wrapper>
      </section>
    </section>
  );
};

export default AddEstablishment;
