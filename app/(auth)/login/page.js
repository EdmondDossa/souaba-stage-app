import React from "react";
import { InputRow } from "@/app/ui/common/index";
import Link from "next/link";
import AuthForm from "../ui/AuthForm";
const Page = () => {
  return (
    <AuthForm
      formTitle="Se Connecter"
      btnTitle="Se connecter"
      alternativeOptionBtn="S'inscrire"
      alternativeOptionMessage="Vous n'avez pas de compte ?"
      alternativeOptionLink="/register"
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

export default Page;
