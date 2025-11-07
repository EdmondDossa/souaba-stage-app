"use client";

import React, { Suspense, useState } from "react";
import { RadioGroup } from "radix-ui";
import AuthForm from "../components/AuthForm";
import { useSearchParams } from "next/navigation";
import { hideString } from "@/utils";

const RegisterConfirmationContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const contact = searchParams.get("contact");
  const [confirmationOption, setConfirmationOption] = useState("email");

  async function handleConfirmation() {
    
  }

  return (
    <AuthForm
      className="md:w-[700px] w-[200px]"
      formTitle="Choisissez un moyen de confirmer qu'il s'agit de vous"
      showTopImage={false}
      btnTitle="Continuer"
    >
      <section className="mb-5">
        <RadioGroup.Root
          onChange={(e) => setConfirmationOption(e.currentTarget.value)}
          defaultValue="email"
          name="confirmation-option"
          className="w-full border rounded-xl border-gray-300"
        >
          <label
            htmlFor="email"
            className="flex justify-between px-4 w-full py-8 space-x-4 border-b border-gray-300 cursor-pointer"
          >
            <div>
              <span className="font-montserrat-medium font-bold block text-sm md:text-xl">
                Adresse e-mail
              </span>
              <p className="text-sm md:text-lg">
                Nous enverrons un code à {hideString(email)}
              </p>
            </div>
            <div>
              <RadioGroup.Item
                id="email"
                name="email"
                className="size-[30px] border border-primary rounded-full bg-white outline-none cursor-pointer"
                value="email"
              >
                <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[18px] after:rounded-full after:bg-primary" />
              </RadioGroup.Item>
            </div>
          </label>

          <label
            htmlFor="messagerie"
            className="flex justify-between px-4 w-full py-8 space-x-4 cursor-pointer"
          >
            <div>
              <span className="font-montserrat-medium font-bold block text-sm md:text-xl">
                Messagerie
              </span>
              <p className="text-sm md:text-lg">
                Nous enverrons un code au {hideString(contact)}
              </p>
            </div>
            <div>
              <RadioGroup.Item
                id="messagerie"
                className="size-[30px] border border-primary cursor-pointer rounded-full bg-white outline-none"
                value="messagerie"
              >
                <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[18px] after:rounded-full after:bg-primary" />
              </RadioGroup.Item>
            </div>
          </label>
        </RadioGroup.Root>
      </section>
    </AuthForm>
  );
};

const RegisterConfirmation = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RegisterConfirmationContent />
    </Suspense>
  );
};
export default RegisterConfirmation;
