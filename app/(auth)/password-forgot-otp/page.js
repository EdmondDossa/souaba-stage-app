"use client";
import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import OtpInput from "@/components/ui/common/OtpInput";
import { AuthLayout } from "@/components/Layout";

const OtpCheck = () => {
  const [otpCode, setOtpCode] = useState("----");

  return (
    <AuthForm
      showTopImage={false}
      btnTitle="Vérifier"
      formTitle="Vérifier Le Code"
    >
      <div className="mx-auto w-[90%] text-center">
        <p className="text-[15px] mx-auto text-center w-4/5">
          Veuillez entrer le code que nous venons d'envoyer par e-mail au{" "}
          <strong className="font-montserrat-bold">exemple@gmail.com</strong>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center my-6">
        <OtpInput otpLength={4} otpValue={otpCode} setOtpValue={setOtpCode} />
      </div>
      <div className="mb-5 mt-4 text-sm text-center">
        <p>Vous n'avez pas reçu d'OTP ?</p>
        <button className="ms-2 cursor-pointer font-montserrat-medium font-bold text-primary decoration-1 underline  hover:decoration-2 hover:decoration-dotted transition">
          Renvoyez le code
        </button>
      </div>
    </AuthForm>
  );
};

export default OtpCheck;
