"use client";
import React, { useEffect, useState } from "react";
import { InputRow } from "@/components/ui/common/index";
import Link from "next/link";
import AuthForm from "../components/AuthForm";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthContext from "@/context/auth";
import ConnexionHero from "../components/ConnexionHero";
import AuthWrapper from "../components/AuthWrapper";
import { isEmail } from "@/utils/validator";

const LoginPage = () => {
  const router = useRouter();

  const { login, isLogged } = useAuthContext();
  const [formError, setFormError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    const error = validateInput(email, password);
    setFormError(error);
    if (error) return;
    setLoading(true);
    const { success, message, status, code } = await login({
      email,
      password,
      rememberMe,
      redirect: redirectTarget,
    });
    if (!success) {
      if (status === 403) {
        if (code === "ACCOUNT_LOCKED") {
          setFormError(
            "Trop de tentatives de connexions. Votre compte a été vérouillé. Vous avez reçu un mail pour réinitialiser votre mot de passe  ou réessayez dans un moment."
          );
        } else {
          const activationToken =
            message?.activationToken || localStorage.getItem("activationToken");
          if (activationToken) {
            localStorage.setItem("activationToken", activationToken);
          }
          router.push(
            `/register-confirmation-otp?email=${encodeURIComponent(email)}`
          );
          return;
        }
      } else if (status === 401)
        setFormError("Email ou mot de passe incorrecte.");
      else setFormError(message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isLogged) router.replace(redirectTarget);
  }, [isLogged, router, redirectTarget]);

  return (
    <section className="flex justify-center items-center lg:justify-start">
      <ConnexionHero />
      <div className="h-screen overflow-y-auto scrollbar-hide flex items-center justify-center">
        <AuthForm
          formTitle="Se Connecter"
          btnTitle="Se connecter"
          alternativeOptionBtn="S'inscrire"
          alternativeOptionMessage="Vous n'avez pas de compte ?"
          alternativeOptionLink={`/register?redirect=${encodeURIComponent(
            redirectTarget
          )}`}
          isLoading={isLoading}
          showTopImage={true}
          formError={formError}
          withSocialLoginSection={true}
          rememberMe={rememberMe}
          onSubmit={handleSubmit}
        >
          <InputRow type="email" label="Email" name="email" required={true} />
          <InputRow
            type="password"
            label="Password"
            name="password"
            required={true}
          />
          <label className="flex items-center gap-3 text-sm font-montserrat-medium text-gray-700 mt-4">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Se souvenir de moi
          </label>

          <Link
            href="/forgot-password"
            className="text-primary text-sm text-end block font-bold decoration-1 underline mb-5 mt-5 hover:decoration-2 hover:decoration-dotted transition"
          >
            Mot de passe oublié ?
          </Link>
        </AuthForm>
      </div>
    </section>
  );

  function validateInput(email, password) {
    if (!email || !password) {
      return "L'adresse email et le mot de passe sont des champs requis.";
    }
    if (!isEmail(email)) {
      return "Votre adresse email est invalide";
    }
    return "";
  }
};

export default LoginPage;
