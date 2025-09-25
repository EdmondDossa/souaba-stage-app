"use client";

import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Button } from "@/components/ui/common";
import { useRouter, useSearchParams } from "next/navigation";
import Wrapper from "./ui/Wrapper";
import toast from "react-hot-toast";
import getAxiosInstance from "@/lib/request";
import FormSteps from "@/components/ui/common/FormSteps";
import {
  IdentityCard,
  Hebergement,
  Commodities,
  Equipements,
  PropertyInformations,
  Security,
  Resume,
  SuccessfulSubmit,
  HotelsRoom,
} from "@/app/(main)/add-establishment/steps-components";
import useAuthContext from "@/context/auth";

const AddEstablishment = () => {
  const http = getAxiosInstance();
  const router = useRouter();
  const  {user} = useAuthContext();
  
  const stepsDefinitions = [
    {
      name: "Hébergement",
      component: Hebergement,
    },
    {
      name: "Informations",
      component: PropertyInformations,
    },
    {
      name: "Chambres",
      component: HotelsRoom,
    },
    {
      name: "Equipements",
      component: Equipements,
    },
    {
      name: "Commodités",
      component: Commodities,
    },
    {
      name: "Sécurités",
      component: Security,
    },
    {
      name: "Résumé",
      component: Resume,
    },
    {
      name: "Pièce d'identité",
      component: IdentityCard,
    },
  ];

  const searchParams = useSearchParams();
  const forTestingPurpose = searchParams.get("env") === "test";

  const [steps, setSteps] = useState(stepsDefinitions);
  const stepsLabels = steps.map((step) => step.name);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setSubmitted] = useState(false);

  const [stepFormValues, setStepFormValues] = useState(() =>
    steps.map((step) => ({
      stepName: step.name,
      data: null,
      allowNextStep: false,
    }))
  );

  const locate = (step) => step.stepName === stepsLabels[currentStep];

  //when the hebergement type choosen is Hôtel we have one extra step to manage infos about rooms type
  //by default the hebergement type is hôtel so we have to look at changes in order to update the steps components

  const hebergementType = stepFormValues.find(
    (step) => step.stepName === "Hébergement"
  ).data;

  useEffect(()=>{
    if(!user.profile && !forTestingPurpose) router.push("/set-profile-info");
  },[]);

  useEffect(() => {
    if (!hebergementType) return;
    if (hebergementType === "Hôtel") setSteps(stepsDefinitions);
    else {
      //when it is `Hôtel` as hebergement then retrieve the roomtype component step
      setSteps(
        stepsDefinitions.filter(
          (step) => step.name !== "Chambres" 
        )
      );
    }
  }, [hebergementType]);

  function handleFormDataUpdate(data) {
    let formDataCopy = Array.from(stepFormValues);
    const index = formDataCopy.findIndex(locate);
    formDataCopy[index].data = data;
    setStepFormValues(formDataCopy);
  }

  function allowNextStep(isAllowed = true) {
    let formDataCopy = Array.from(stepFormValues);
    const index = formDataCopy.findIndex(locate);
    formDataCopy[index].allowNextStep = isAllowed;
    setStepFormValues(formDataCopy);
  }

  function renderStepComponentWithData(CurrentStepComponent) {
    //we can only rely on the step label as state identifier since the index of steps in the array can change anytime
    const stepValue = stepFormValues.find(locate).data;
    return (
      <CurrentStepComponent
        formValues={stepFormValues} // in case a step need the state of others steps
        setCurrentStep={setCurrentStep} // only useful for resume step
        handleFormDataUpdate={handleFormDataUpdate} //update the global state of the data
        initialState={stepValue} //the state the current step
        allowNextStep={allowNextStep} // control either access or rejection to next step
      />
    );
  }

  function goToNextStep() {
    const index = stepFormValues.findIndex(locate);
    if (stepFormValues[index].allowNextStep) setCurrentStep(currentStep + 1);
    else {
      toast.error(
        "Des informations requises sur cette page sont manquantes pour continuer."
      );
      return;
    }

    //on the last step we have to publish
    if (currentStep === stepsLabels.length - 1) {
      setSubmitted(true);
    }
  }

  useEffect(() => {
    //to make sure the top of each new component is in view - ie reset scroll position
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  return isSubmitted ? (
    <SuccessfulSubmit />
  ) : (
    <section>
      <FormSteps steps={steps} currentStep={currentStep} />
      <section className="w-full md:w-[90%] mx-auto mt-2">
        <Wrapper
          fullWidth={[
            "Hébergement",
            "Commodités",
            "Sécurités",
          ].includes(stepsLabels[currentStep])}
          withBorder={["Equipements", "Résumé"].includes(
            stepsLabels[currentStep]
          )}
        >
          {/* Current steps components */}
          <div className="w-full p-4 mb-4">
            {renderStepComponentWithData(steps[currentStep].component)}
          </div>
          <div
            className={`flex justify-between w-[95%] mx-auto`}
          >
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
              {/* check if it is the last step */}
              {currentStep === stepsLabels.length - 1 ? "Publier" : "Suivant"}
            </Button>
          </div>
        </Wrapper>
      </section>
    </section>
  );
};

export default AddEstablishment;
