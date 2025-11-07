"use client";
import React, { Suspense, useEffect, useState } from "react";
import AuthForm from "../components/AuthForm";
import OtpInput from "@/components/ui/common/OtpInput";
import getAxiosInstance from "@/lib/request";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { formatTime } from "@/utils";

const RegisterConfirmationOtpContent = () => {
  const http = getAxiosInstance();
  const router = useRouter();
  const searchParams = useSearchParams();

  const OTP_RESENT_REQUEST_TIME = 60 + 30; //1 min 30s;
  const email = searchParams.get("email");
  const [otpCode, setOtpCode] = useState("------");
  const [isLoading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [isCodeResent, setCodeResent] = useState(false);
  const [accountActivate, setAccountActivate] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");

  async function handleAccountActivation(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (Number(otpCode) && otpCode.length === 6) {
        const activationToken = localStorage.getItem("activationToken");
        const data = {
          token: activationToken,
          otp: otpCode,
        };
        await http.post("/auth/activate/", data);
        setAccountActivate(true);
      }
    } catch (error) {
      if (error.status === 401)
        setFormError(
          "Le code que vous avez saisi est invalide ou a déjà expiré."
        );
      else setFormError("Une erreur est survenue pendant l'activation.");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtpCode(e) {
    e.preventDefault();
    if(timeRemaining) return;
    setLoading(true);
    try {
      const { data } = await http.post("/auth/resend-otp", { email });
      localStorage.setItem("activationToken", data.activationToken);
      setCodeResent(true);
      makeDecount();
    } catch (error) {
      if(error.status === 403) setFormError("Ce compte est déjà activé. Vous pouvez vous connecter.")
      else setFormError("Le code n'a pas pu être envoyé. Veuillez réessayer.");
      setTimeRemaining("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let timerId;
    if (accountActivate) {
      setFormError("");
      timerId = setTimeout(() => {
        router.replace("/login");
      }, 2500);
    }
    return () => clearTimeout(timerId);
  }, [accountActivate, router]);

  function makeDecount() {
    let timerId = null;
    let secondsRemaining = OTP_RESENT_REQUEST_TIME;
    timerId = setInterval(() => {
      secondsRemaining--;
      setTimeRemaining(formatTime(secondsRemaining));
      if (secondsRemaining === 0) {
        clearInterval(timerId);
        setTimeRemaining("");
      }
    }, 1000);
  }

  return (
    <AuthForm
      showTopImage={false}
      btnTitle="Vérifier"
      isLoading={isLoading}
      onSubmit={handleAccountActivation}
      formError={formError}
      formTitle="Vérification De Votre Identité"
    >
      {accountActivate && (
        <p className="flex flex-col items-center text-sm text-center justify-center text-green">
          Redirection vers la page de connexion{" "}
          <FaSpinner className="animate-spin" />
        </p>
      )}
      {timeRemaining && !accountActivate && (
        <p className="text-sm text-center font-montserrat-medium  mb-2">
          {" "}
          Vous pourrez redemander un code dans{" "}
          <span className="text-green font-montserrat-bold">
            {" "}
            <br />
            {timeRemaining}{" "}
          </span>
        </p>
      )}
      <div className="mx-auto w-[90%] text-center">
        <p className="text-[15px] mx-auto text-center w-4/5">
          Veuillez entrer le code que nous venons d&apos;envoyer par e-mail au{" "}
          <strong className="font-montserrat-bold"> {email} </strong>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center my-6">
        <OtpInput otpLength={6} otpValue={otpCode} setOtpValue={setOtpCode} />
      </div>
      <div className="mb-5 mt-4 text-sm text-center">
        <p>Vous n&apos;avez pas reçu d&apos;OTP ?</p>
        <button
          onClick={resendOtpCode}
          disabled={Boolean(timeRemaining)}
          className="ms-2 cursor-pointer font-montserrat-medium font-bold text-primary decoration-1 underline  hover:decoration-2 hover:decoration-dotted transition disabled:cursor-not-allowed"
        >
          Renvoyez le code
        </button>
      </div>
    </AuthForm>
  );
};

const RegisterConfirmationOtp = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RegisterConfirmationOtpContent />
    </Suspense>
  );
};

export default RegisterConfirmationOtp;