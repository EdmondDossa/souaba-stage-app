"use client";
import getAxiosInstance from "@/lib/request";
import AuthForm from "../components/AuthForm";
import { InputRow } from "@/components/ui/common";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { isPaswordStrong } from "@/utils/validator";

const PasswordChangeContent = () => {
  const http = getAxiosInstance();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setLoading] = useState("");

  async function handlePasswordChange(e) {
    e.preventDefault();
    try {
      const password = e.target["password"].value;
      const confirmPassword = e.target["confirm-password"].value;
      if (password !== confirmPassword) {
        return setFormError("Les mots de passe ne correspondent pas.");
      }
      if (!isPaswordStrong(password)) {
        return setFormError(
          "Le mot de passe doit faire huit caractères au moins avec des lettres, des chiffres et caractères spéciaux."
        );
      }
      setLoading(true);
      await http.post("/auth/reset-password", { newPassword: password, token });
      router.replace("/login");
    } catch (error) {
      if (error.status === 401) {
        setFormError("Lien invalide ou déjà expiré.");
      } else {
        setFormError("Le mot de passe n'a pas pu être mis à jour");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace("/login");
    } else {
      setToken(token);
    }
  }, [router, searchParams]);

  return (
    <AuthForm
      showTopImage={false}
      isLoading={isLoading}
      onSubmit={handlePasswordChange}
      btnTitle="Créer un nouveau mot de passe"
    >
      <div className="mx-auto text-center flex flex-col justify-center items-center mb-7">
        <h2 className="font-montserrat-bold mb-5 text-2xl w-3/5 ">
          Nouveau Mot De Passe
        </h2>
        <p className="text-sm mx-auto text-center w-2/3 ">
          Votre nouveau mot de passe doit être différent des mots de passe
          précédemment utilisés.
        </p>
      </div>
      <InputRow
        label="Mot de passe"
        type="password"
        name="password"
        errorMessage={formError}
      />
      <InputRow
        label="Confirmez le mot de passe"
        type="password"
        name="confirm-password"
      />
    </AuthForm>
  );
};

const PasswordChange = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PasswordChangeContent />
    </Suspense>
  );
};

export default PasswordChange;
