import React from "react";
import { InputRow } from "@/app/ui/common/index";
import AuthForm from "../components/AuthForm";
import CheckBox from "@/app/ui/common/CheckBox";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <AuthForm
      formTitle="Créer Un Compte"
      btnTitle="S'inscrire"
      alternativeOptionBtn="Connectez-vous"
      alternativeOptionMessage="Vous avez déjà un compte ?"
      alternativeOptionLink="/login"
    >
      <InputRow label="Nom Complet" name="fullname" />
      <InputRow label="Téléphone" name="contact" />
      <InputRow type="email" label="Email" name="email" />
      <InputRow type="password" label="Password" name="password" />
      <div className="flex items-center -mt-3 mb-5">
        <CheckBox id="terms" defaultChecked={true} />
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
};

export default RegisterPage;
