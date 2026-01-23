"use client";
import { useState, useEffect } from "react";
import PaymentMethod from "./steps/PaymentMethod";
import ReservationResume from "./steps/ReservationResume";
import FormSteps from "@/components/ui/common/FormSteps";
import Submitted from "./steps/Submitted";

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    paymentMethod: "WALLET",
  });

  const [isSubmitted, setSubmitted] = useState(false);

  const stepsDefinitions = [
    {
      name: "Méthode de paiement",
      stepIcon: "/images/calque-paiement-1.png",
      component: PaymentMethod,
    },
    {
      name: "Résumé de la réservation",
      stepIcon: "/images/calendar-paiement-2.png",
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

  const goToNextStep = () => {
    if (currentStep === stepsDefinitions.length - 1) {
      setSubmitted(true);
      setCurrentStep(0);
    } else
      setCurrentStep((prev) => Math.min(stepsDefinitions.length, prev + 1));
  };

  const goToPrevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  return isSubmitted ? (
    <Submitted />
  ) : (
    <section>
      <FormSteps steps={stepsDefinitions} currentStep={currentStep} />
      <div className="my-10 ">
        {render(stepsDefinitions[currentStep].component)}
      </div>
    </section>
  );
};

export default ReservationForm;
