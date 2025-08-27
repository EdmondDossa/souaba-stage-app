"use client";
import { useState, useEffect } from "react";
import PaymentMethod from "./steps/PaymentMethod";
import ReservationResume from "./steps/ReservationResume";
import FormSteps from "@/components/ui/common/FormSteps";
import Submitted from "./steps/Submitted";

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    paymentMethod: "portefeuille",
  });

  const [isSubmitted, setSubmitted] = useState(false);

  const stepsDefinitions = [
    {
      stepName: "Méthode de paiement",
      component: PaymentMethod,
    },
    {
      stepName: "Résumé de la réservation",
      component: ReservationResume,
    },
  ];

  function render(Component) {
    return (
      <Component
        goToNextStep={goToNextStep}
        goToPrevStep={goToPrevStep}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    );
  }

  const goToNextStep = () =>{
    if(currentStep === stepsDefinitions.length-1) {
      setSubmitted(true);
      setCurrentStep(0);
    }
    else setCurrentStep((prev) => Math.min(stepsDefinitions.length, prev + 1));
  }
   
  const goToPrevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  return isSubmitted ? (
    <Submitted />
  ) : (
    <section>
      <FormSteps
        stepsLabels={stepsDefinitions.map((step) => step.stepName)}
        currentStep={currentStep}
      />
      <div className="max-w-[320px] sm:max-w-md mx-auto my-10 ">
        {render(stepsDefinitions[currentStep].component)}
      </div>
    </section>
  );
};

export default ReservationForm;
