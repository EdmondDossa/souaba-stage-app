"use client";

import React, { useEffect, useState } from "react";
import { InputRow, CheckBox } from "@/components/ui/common/index";
import AuthForm from "../components/AuthForm";
import Link from "next/link";
import useAuthContext from "@/context/auth";
import { useRouter } from "next/navigation";
import {
  EMAIL_REGEX,
  FULLNAME_REGEX,
  PASSWORD_REGEX,
  TELEPHONE_REGEX,
} from "@/utils/regex";

const RegisterPage = () => {
  const router = useRouter();
  const { register, isLogged } = useAuthContext();

  const [isLoading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [validationError, setValidationError] = useState("");
  const userFields = ["email", "password", "username", "contact"];

  async function handleSubmit(e) {
    e.preventDefault();
    let user = {};
    userFields.forEach((key) => (user[key] = e.target[key].value));
    const errors = validateUserInfo(user);
    setValidationError(errors);

    const isInvalid = Object.values(errors).some((field) => Boolean(field));
    if (isInvalid) return;
    setLoading(true);
    const { success, message, status } = await register(user);

    if (success) {
      router.push(`/register-confirmation-otp?email=${user.email}`);
    } else {
      if (status === 409)
        setFormError("Un utilisateur existe déjà avec cette adresse email.");
      else setFormError(message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isLogged) router.replace("/");
  }, [isLogged]);

  return (
    <AuthForm
      formTitle="Créer Un Compte"
      btnTitle="S'inscrire"
      alternativeOptionBtn="Connectez-vous"
      alternativeOptionMessage="Vous avez déjà un compte ?"
      alternativeOptionLink="/login"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      formError={formError}
    >
      <InputRow
        label="Nom Complet"
        errorMessage={validationError.username}
        name="username"
      />
      <InputRow
        label="Téléphone"
        errorMessage={validationError.contact}
        name="contact"
      />
      <InputRow
        type="email"
        label="Email"
        name="email"
        errorMessage={validationError.email}
      />
      <InputRow
        type="password"
        label="Password"
        name="password"
        errorMessage={validationError.password}
      />
      <div className="flex items-center -mt-3 mb-5">
        <CheckBox id="terms" defaultChecked={false} />
        <label
          className="pl-[15px] text-[15px] leading-none font-montserrat-medium"
          htmlFor="terms"
        >
          Accepter les{" "}
          <Link
            href=""
            className="text-primary decoration-1 underline hover:decoration-2 hover:decoration-dotted"
          >
            termes et conditions
          </Link>
        </label>
      </div>
    </AuthForm>
  );

  function validateUserInfo(userinfo) {
    const error = {};
    if (!userinfo.email || !EMAIL_REGEX.test(userinfo.email)) {
      error.email = "Email non valide";
    } else {
      error.email = "";
    }

    if (!userinfo.password || !PASSWORD_REGEX.test(userinfo.password)) {
      error.password =
        "Le mot de passe doit contenir au moins huit caractères incluant au moins un chiffre, une lettre et un caractère spécial";
    } else {
      error.password = "";
    }

    if (!userinfo.username || !FULLNAME_REGEX.test(userinfo.username)) {
      error.username = "Nom complet invalide";
    } else {
      error.username = "";
    }

    if (!userinfo.contact || !TELEPHONE_REGEX.test(userinfo.contact)) {
      error.contact = "Format du numéro de téléphone non valide";
    } else {
      error.contact = "";
    }
    return error;
  }
};

export default RegisterPage;
