import React from "react";
import { RadioGroup } from "radix-ui";
import AuthForm from "../components/AuthForm";

const RegisterConfirmation = () => {
  return (
    <AuthForm
      className="md:w-[700px] w-[200px]"
      formTitle="Choisissez un moyen de confirmer qu'il s'agit de vous"
      showTopImage={false}
      btnTitle="Continuer"
    >
      <section className="mb-5">
        <RadioGroup.Root
          defaultValue="Email"
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
                Nous enverrons un code à exe******o@gmail.com{" "}
              </p>
            </div>
            <div>
              <RadioGroup.Item
                id="email"
                className="size-[30px] border border-primary rounded-full bg-white outline-none cursor-pointer"
                value="Email"
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
                Nous enverrons un code au +225******22
              </p>
            </div>
            <div>
              <RadioGroup.Item
                id="messagerie"
                className="size-[30px] border border-primary cursor-pointer rounded-full bg-white outline-none"
                value="Messagerie"
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

export default RegisterConfirmation;
