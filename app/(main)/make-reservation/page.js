"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import PaymentMethod from "./steps/PaymentMethod";
import ReservationResume from "./steps/ReservationResume";
import GuestInfo from "./steps/GuestInfo";
import IdentityStep from "./steps/IdentityStep";
import FormSteps from "@/components/ui/common/FormSteps";
import Submitted from "./steps/Submitted";
import useAuthContext from "@/context/auth";
import SocialLoginButton from "@/components/ui/common/SocialLoginButton";

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    paymentMethod: "WALLET",
    guest: undefined,
  });

  const [isSubmitted, setSubmitted] = useState(false);
  const { user, isLogged } = useAuthContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTarget = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);
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

  useEffect(() => {
    if (!isLogged && typeof window !== "undefined") {
      sessionStorage.setItem("postAuthRedirect", redirectTarget || "/");
    }
  }, [isLogged, redirectTarget]);

  if (!isLogged) {
    return (
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-10 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-primary font-semibold">
                Finaliser la réservation
              </p>
              <h1 className="text-2xl md:text-3xl font-montserrat-bold text-gray-900 mt-2">
                Connectez-vous pour continuer
              </h1>
              <p className="text-sm text-gray-500 mt-2 max-w-xl">
                Pour confirmer et enregistrer votre réservation, vous devez être
                connecté. Cela nous permet de sécuriser la réservation et
                retrouver vos informations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-primary/5 p-4">
                <h3 className="font-montserrat-bold text-gray-900">
                  Réservation sécurisée
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Suivi des réservations et notifications en temps réel.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-primary/5 p-4">
                <h3 className="font-montserrat-bold text-gray-900">
                  Historique complet
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Accédez à vos voyages et factures à tout moment.
                </p>
              </div>
            </div>
          </div>

          <aside className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-montserrat-bold text-gray-900">
                Se connecter
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choisissez votre méthode préférée.
              </p>
            </div>

            <SocialLoginButton rememberMe={true} />

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex-1 h-px bg-gray-200" />
              ou
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={`/login?redirect=${encodeURIComponent(
                  redirectTarget || "/"
                )}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-montserrat-bold hover:bg-amber-400 transition"
              >
                Se connecter avec email
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(
                  redirectTarget || "/"
                )}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-primary text-primary font-montserrat-bold hover:bg-primary/5 transition"
              >
                Créer un compte
              </Link>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  return isSubmitted ? (
    <Submitted />
  ) : (
    <section className="min-h-screen pt-[5.5rem] pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm px-4 py-6 md:px-8 md:py-10">
          <FormSteps steps={stepsDefinitions} currentStep={currentStep} />
          <div className="mt-6">
            {render(
              stepsDefinitions[
                Math.min(currentStep, stepsDefinitions.length - 1)
              ].component
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationForm;
