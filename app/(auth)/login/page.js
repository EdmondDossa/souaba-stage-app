"use client";

import React, { useEffect, useState } from "react";
import { InputRow } from "@/components/ui/common/index";
import Link from "next/link";
import AuthForm from "../components/AuthForm";
import { useRouter } from "next/navigation";
import useAuthContext from "@/context/auth";
import { EMAIL_REGEX } from "@/utils/regex";

const LoginPage = () => {
  const router = useRouter();

  const { login, isLogged } = useAuthContext();
  const [formError, setFormError] = useState("");
  const [isLoading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const email = e.target["email"].value;
    const password = e.target["password"].value;

    if (!email || !password) {
      setFormError(
        "L'adresse email et le mot de passe sont des champs requis."
      );
      setLoading(false);
      return;
    } else {
      setFormError("");
    }

    if (!EMAIL_REGEX.test(email)) {
      setFormError("Votre adresse email est invalide");
      setLoading(false);
      return;
    } else {
      setFormError("");
    }

    const { success, message, status } = await login({ email, password });
    if (!success) {
      if (status === 403)
        setFormError(
          "Votre compte n'est pas encore activé. Pour vous connecter, activez votre compte en premier."
        );
      else if (status === 401)
        setFormError("Email ou mot de passe incorrecte.");
      else setFormError(message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isLogged) router.replace("/");
  }, [isLogged]);

  return (
    <AuthForm
      formTitle="Se Connecter"
      btnTitle="Se connecter"
      alternativeOptionBtn="S'inscrire"
      alternativeOptionMessage="Vous n'avez pas de compte ?"
      alternativeOptionLink="/register"
      isLoading={isLoading}
      formError={formError}
      onSubmit={handleSubmit}
    >
      <InputRow type="email" label="Email" name="email" required={true} />
      <InputRow
        type="password"
        label="Password"
        name="password"
        required={true}
      />

      <Link
        href="/forgot-password"
        className="text-primary text-sm text-end block font-bold decoration-1 underline mb-5 -mt-3 hover:decoration-2 hover:decoration-dotted transition"
      >
        Mot de passe oublié ?
      </Link>
    </AuthForm>
  );
};

export default LoginPage;
