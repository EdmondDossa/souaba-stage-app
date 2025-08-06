import React from "react";
import AuthForm from "../components/AuthForm";
import { InputRow } from "@/components/ui/common";

const PasswordForgot = () => {
  return (
    <AuthForm showTopImage={false} btnTitle="Envoyez">
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
        placeholder="exemple@gmail.com"
      />
    </AuthForm>
  );
};

export default PasswordForgot;
