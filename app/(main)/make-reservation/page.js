"use client";
import { useState, useEffect, useMemo } from "react";
import PaymentMethod from "./steps/PaymentMethod";
import ReservationResume from "./steps/ReservationResume";
import GuestInfo from "./steps/GuestInfo";
import IdentityStep from "./steps/IdentityStep";
import FormSteps from "@/components/ui/common/FormSteps";
import Submitted from "./steps/Submitted";
import useAuthContext from "@/context/auth";

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    paymentMethod: "WALLET",
    guest: undefined,
  });

  const [isSubmitted, setSubmitted] = useState(false);
  const { user } = useAuthContext();
  const hasIdentity = Boolean(
    user?.profile?.identity_card_front &&
      user?.profile?.identity_card_back
  );

  const stepsDefinitions = useMemo(() => {
    const steps = [
      {
        name: "Informations du voyageur",
        stepIcon: "/images/calque-paiement-1.png",
        component: GuestInfo,
      },
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

    if (!hasIdentity) {
      steps.push({
        name: "Pièce d'identité",
        stepIcon: "/images/calendar-paiement-2.png",
        component: IdentityStep,
      });
    }

    return steps;
  }, [hasIdentity]);

  function render(Component) {
    return (
      <Component
        goToNextStep={goToNextStep}
        goToPrevStep={goToPrevStep}
        formValues={formValues}
        setFormValues={setFormValues}
        completeFlow={completeFlow}
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

  const completeFlow = () => {
    setSubmitted(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  useEffect(() => {
    if (currentStep > stepsDefinitions.length - 1) {
      setCurrentStep(stepsDefinitions.length - 1);
    }
  }, [currentStep, stepsDefinitions.length]);

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
