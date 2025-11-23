"use client";

import React, { useEffect, useState } from "react";
import { InputRow, CheckBox } from "@/components/ui/common/index";
import AuthForm from "../components/AuthForm";
import Link from "next/link";
import useAuthContext from "@/context/auth";
import { useRouter } from "next/navigation";
import ConnexionHero from "../components/ConnexionHero";
import {
  isEmail,
  isPaswordStrong,
  isValidFullname,
  isValidPhoneNumber,
} from "@/utils/validator";
import SocialLoginButton from "@/components/ui/common/SocialLoginButton";

const RegisterPage = () => {
  const router = useRouter();
  const { register, isLogged } = useAuthContext();
  const [isLoading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [validationError, setValidationError] = useState("");
  const userFields = ["email", "password", "username", "phone"];

  async function handleSubmit(e) {
    e.preventDefault();
    let user = {};
    userFields.forEach((key) => (user[key] = e.target[key].value));
    const errors = validateUserInfo(user);
    setValidationError(errors);

    const isInvalid = Object.values(errors).some((field) => Boolean(field));
    if (isInvalid) return;
    setLoading(true);

    //by default in the form skeleton we don't have firstname and lastname
    //but we have to get it using the fullname
    const fullnamePieces = user.username.trim().split(" ");
    user.firstName = fullnamePieces[0];
    if (fullnamePieces.length > 1)
      user.lastName = fullnamePieces.slice(1).join(" ");

    //then we need to create a unique username to the user
    user.username = `${user.firstName}-${Date.now()}`;
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
  }, [isLogged, router]);

  return (
    <section className="flex overflow-y-scroll">
      <ConnexionHero />
      <div className="h-screen overflow-y-auto scrollbar-hide">
        <AuthForm
          formTitle="Créer Un Compte"
          btnTitle="S'inscrire"
          alternativeOptionBtn="Connectez-vous"
          alternativeOptionMessage="Vous avez déjà un compte ?"
          alternativeOptionLink="/login"
          onSubmit={handleSubmit}
          showTopImage={true}
          isLoading={isLoading}
          formError={formError}
          withSocialLoginSection={true}
        >
          <InputRow
            label="Nom Complet"
            errorMessage={validationError.username}
            name="username"
          />
          <InputRow
            label="Téléphone"
            errorMessage={validationError.phone}
            name="phone"
            type="tel"
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
          <div className="flex items-center -mt-1 mb-5">
            <CheckBox id="terms" defaultChecked={false} />
            <label
              className="pl-[15px] text-sm leading-none font-montserrat-medium"
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
      </div>
    </section>
  );

  function validateUserInfo(userinfo) {
    const error = {};
    if (!userinfo.email || !isEmail(userinfo.email)) {
      error.email = "Email non valide";
    } else {
      error.email = "";
    }

    if (!userinfo.password || !isPaswordStrong(userinfo.password)) {
      error.password =
        "Le mot de passe doit contenir au moins huit caractères incluant au moins un chiffre, une lettre et un caractère spécial";
    } else {
      error.password = "";
    }

    if (!userinfo.username || !isValidFullname(userinfo.username)) {
      error.username = "Nom complet invalide";
    } else {
      error.username = "";
    }

    if (!userinfo.phone || !isValidPhoneNumber(userinfo.phone)) {
      error.phone = "Format du numéro de téléphone non valide";
    } else {
      error.phone = "";
    }
    return error;
  }
};

export default RegisterPage;
