"use client";

import { useEffect, useState } from "react";
import { InputRow, Button } from "@/components/ui/common";

const GuestInfo = ({ goToNextStep, formValues, setFormValues }) => {
  const [isOtherGuest, setIsOtherGuest] = useState(
    Boolean(formValues?.guest?.firstName || formValues?.guest?.lastName)
  );
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isOtherGuest) {
      setFormValues((prev) => ({ ...prev, guest: undefined }));
    }
    setFieldErrors({});
  }, [isOtherGuest, setFormValues]);

  const handleChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      guest: {
        ...(prev.guest || {}),
        [name]: value,
      },
    }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  return (
    <section className="flex flex-col items-center w-full text-sm relative">
      <div className="w-full max-w-2xl">
        <h1 className="font-bold text-xl sm:text-2xl text-center text-gray-600 mt-2 md:mt-10 font-montserrat-bold mb-6 sm:mb-8">
          Informations du voyageur
        </h1>

        <label className="flex items-center gap-3 text-sm font-montserrat-medium text-gray-700 mb-6">
          <input
            type="checkbox"
            checked={isOtherGuest}
            onChange={(e) => setIsOtherGuest(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Je réserve pour quelqu&apos;un d&apos;autre
        </label>

        {isOtherGuest && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputRow
              label="Prénom"
              name="firstName"
              value={formValues?.guest?.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="bg-white border border-gray-200"
              hasError={Boolean(fieldErrors.firstName)}
              errorMessage={fieldErrors.firstName}
            />
            <InputRow
              label="Nom"
              name="lastName"
              value={formValues?.guest?.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="bg-white border border-gray-200"
              hasError={Boolean(fieldErrors.lastName)}
              errorMessage={fieldErrors.lastName}
            />
            <InputRow
              label="Téléphone"
              name="phone"
              value={formValues?.guest?.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="bg-white border border-gray-200"
              hasError={Boolean(fieldErrors.phone)}
              errorMessage={fieldErrors.phone}
            />
            <InputRow
              label="Email"
              name="email"
              type="email"
              value={formValues?.guest?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-white border border-gray-200"
              hasError={Boolean(fieldErrors.email)}
              errorMessage={fieldErrors.email}
            />
          </div>
        )}
      </div>

      <div className="mt-10 sm:mt-16 self-end w-full place-content-end">
        <Button
          onClick={() => {
            const errors = {};
            if (isOtherGuest) {
              const required = ["firstName", "lastName", "phone", "email"];
              required.forEach((field) => {
                const value = formValues?.guest?.[field];
                const normalized =
                  typeof value === "string" ? value.trim() : value ?? "";
                if (!normalized) {
                  errors[field] = "Ce champ est requis";
                }
              });
            }
            setFieldErrors(errors);
            if (!Object.keys(errors).length) {
              goToNextStep();
            }
          }}
          className="w-full max-w-[560px] mx-auto bg-primary hover:bg-amber-400! py-3 font-montserrat-bold rounded-lg mb-5"
        >
          Continuer
        </Button>
      </div>
    </section>
  );
};

export default GuestInfo;
