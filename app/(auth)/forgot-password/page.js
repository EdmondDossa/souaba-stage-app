"use client";
import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { InputRow } from "@/components/ui/common";
import getAxiosInstance from "@/lib/request";
import { isEmail } from "@/utils/validator";

const PasswordForgot = () => {
  const http = getAxiosInstance();

  const [formError, setFormError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target["email"].value;
    if (!email || !isEmail(email)) {
      return setEmailError("Adresse email invalide.");
    } else setEmailError("");

    try {
      setLoading(true);
      await http.post("/auth/request-reset-password", { email });
      setEmailSent(true);
      e.target["email"].value = "";
    } catch (error) {
      setFormError(
        "L'email n'a pas pu être envoyé. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      showTopImage={false}
      btnTitle="Envoyez"
      formError={formError}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      
      <div className="mx-auto w-[90%] text-center">
        <h2 className="font-montserrat-bold text-center mb-5 text-2xl">
          Entrer Votre Adresse Email{" "}
        </h2>
        <p className="text-[15px] mx-auto text-center w-4/5">
          Après avoir entré votre adresse e-mail, vous recevrez un mail de
          vérification.
        </p>
      </div>
      <InputRow
        label="Email"
        type="email"
        name="email"
        errorMessage={emailError}
        placeholder="exemple@gmail.com"
      />
      {emailSent && (
        <p className="py-2 ms-2 text-green font-montserrat-medium text-justify text-sm">
          {" "}
          Un lien de réinitialisation vous a été envoyé à cette adresse. Si l&apos;adresse entrée est
          valide vous le recevrez.
        </p>
      )}
    </AuthForm>
  );
};

export default PasswordForgot;
