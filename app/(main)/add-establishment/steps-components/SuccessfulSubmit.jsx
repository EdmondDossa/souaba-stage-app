import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const SuccessfulSubmit = () => {
  return (
    <section className="flex flex-col items-center justify-center mt-10 text-md">
      <div className="w-20 h-20 mb-2 bg-primary rounded-full place-content-center">
        <Check className="w-12 h-12 mx-auto text-white" />
      </div>
      <h1 className="text-xl mb-5 font-bold font-montserrat-medium">
        Merci pour votre soumission.
      </h1>
      <p className="text-center w-2xl mb-10 text-gray-500">
        Nous avons bien reçu les informations de la propriété que vous souhaitez
        héberger ainsi que votre pièce d’identité. Vous recevrez un email de
        confirmation d’ici peu pour l’activation de votre compte partenaire.
      </p>
      <Link
        href="/"
        className="flex items-center justify-center mt-10 border border-gray-200 px-4 py-3 rounded-md font-montserrat-medium font-bold text-sm hover:bg-gray-100"
      >
        {" "}
        <ChevronLeft /> Revenir à l'accueil{" "}
      </Link>
    </section>
  );
};

export default SuccessfulSubmit;
