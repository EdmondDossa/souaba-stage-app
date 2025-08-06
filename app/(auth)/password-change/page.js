"use client";
import AuthForm from "../components/AuthForm";
import { InputRow } from "@/app/ui/common";

const PasswordChange = () => {
  return (
    <AuthForm showTopImage={false} btnTitle="Créer un nouveau mot de passe">
      <div className="mx-auto text-center flex flex-col justify-center items-center mb-7">
        <h2 className="font-montserrat-bold mb-5 text-2xl w-3/5 ">
          Nouveau Mot De Passe
        </h2>
        <p className="text-sm mx-auto text-center w-2/3 ">
          Votre nouveau mot de passe doit être différent des mots de passe
          précédemment utilisés.
        </p>
      </div>
      <InputRow label="Mot de passe" type="password" name="password" />
      <InputRow
        label="Confirmez le mot de passe"
        type="password"
        name="confirm-password"
      />
    </AuthForm>
  );
};

export default PasswordChange;
