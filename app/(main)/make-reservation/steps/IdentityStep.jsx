"use client";

import { useEffect, useMemo, useState } from "react";
import getAxiosInstance from "@/lib/request";
import toast from "react-hot-toast";
import useAuthContext from "@/context/auth";
import { Button } from "@/components/ui/common";
import { submitReservation } from "./reservationApi";

const IdentityStep = ({ goToPrevStep, completeFlow, formValues }) => {
  const http = getAxiosInstance();
  const [isSavingIdentity, setIsSavingIdentity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identityFront, setIdentityFront] = useState(null);
  const [identityBack, setIdentityBack] = useState(null);
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [identityFieldErrors, setIdentityFieldErrors] = useState({
    front: false,
    back: false,
  });
  const [pendingReservation, setPendingReservation] = useState(null);

  const { user, fetchUser } = useAuthContext();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  const identityFrontPath =
    user?.profile?.identity_card_front || user?.identity_card_front;
  const identityBackPath =
    user?.profile?.identity_card_back || user?.identity_card_back;
  const hasIdentity = Boolean(identityFrontPath && identityBackPath);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pending = sessionStorage.getItem("pendingReservation");
    if (pending) {
      try {
        setPendingReservation(JSON.parse(pending));
      } catch (error) {
        console.error("Invalid pending reservation payload", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchUser(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!identityFront) {
      setFrontPreview(identityFrontPath ? `${apiBase}/${identityFrontPath}` : "");
    }
  }, [identityFrontPath, apiBase, identityFront]);

  useEffect(() => {
    if (!identityBack) {
      setBackPreview(identityBackPath ? `${apiBase}/${identityBackPath}` : "");
    }
  }, [identityBackPath, apiBase, identityBack]);

  const paymentMethod = useMemo(() => {
    return (formValues?.paymentMethod || "WALLET").toUpperCase();
  }, [formValues?.paymentMethod]);

  const handleIdentityUpload = (e, side) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (side === "front") {
      setIdentityFront(file);
      setIdentityFieldErrors((prev) => ({ ...prev, front: false }));
      setFrontPreview(previewUrl);
    } else {
      setIdentityBack(file);
      setIdentityFieldErrors((prev) => ({ ...prev, back: false }));
      setBackPreview(previewUrl);
    }
  };

  const saveIdentity = async () => {
    const needsFront = !identityFrontPath;
    const needsBack = !identityBackPath;

    const errors = {};
    if (needsFront && !identityFront) {
      errors.front = true;
    }
    if (needsBack && !identityBack) {
      errors.back = true;
    }
    setIdentityFieldErrors(errors);
    if (Object.keys(errors).length) {
      toast.error(
        "Veuillez compléter les parties manquantes de votre pièce d'identité."
      );
      return;
    }

    try {
      setIsSavingIdentity(true);
      const formData = new FormData();
      if (identityFront) formData.append("identity_card_front", identityFront);
      if (identityBack) formData.append("identity_card_back", identityBack);
      await http.patch("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchUser(false);
      setIdentityFront(null);
      setIdentityBack(null);
      toast.success("Pièce d'identité enregistrée.");

      if (paymentMethod === "CASH" && pendingReservation) {
        try {
          setIsSubmitting(true);
          const result = await submitReservation(
            http,
            pendingReservation,
            formValues?.guest,
            paymentMethod
          );
          if (result) {
            completeFlow();
            return;
          }
        } finally {
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Impossible d'enregistrer votre pièce d'identité.");
    } finally {
      setIsSavingIdentity(false);
    }
  };

  const handleContinue = async () => {
    if (!hasIdentity) {
      const errors = {};
      if (needsFront && !identityFront) errors.front = true;
      if (needsBack && !identityBack) errors.back = true;
      setIdentityFieldErrors(errors);
      toast.error("Veuillez enregistrer votre pièce d'identité.");
      return;
    }
    if (paymentMethod === "CASH" && pendingReservation) {
      try {
        setIsSubmitting(true);
        const result = await submitReservation(
          http,
          pendingReservation,
          formValues?.guest,
          paymentMethod
        );
        if (result) {
          completeFlow();
          return;
        }
      } finally {
        setIsSubmitting(false);
      }
    }
    goToPrevStep();
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-primary font-semibold">
            Étape 4 / Pièce d&apos;identité
          </p>
          <h1 className="font-montserrat-bold text-2xl text-gray-900 mt-1">
            Ajoutez votre pièce d&apos;identité
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cette étape est obligatoire pour finaliser votre réservation.
          </p>
        </div>

        {hasIdentity ? (
          <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
            Votre pièce d&apos;identité est déjà enregistrée.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm font-montserrat-bold mb-2">
                Recto de la pièce
              </p>
              <label
                className={`block border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 ${
                  identityFieldErrors.front
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleIdentityUpload(e, "front")}
                />
                {frontPreview ? (
                  <img
                    src={frontPreview}
                    alt="Recto carte"
                    className="mx-auto h-32 object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">
                    Télécharger le recto
                  </span>
                )}
              </label>
              {identityFieldErrors.front && (
                <p className="text-xs text-red-600 mt-2">
                  Recto requis
                </p>
              )}
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm font-montserrat-bold mb-2">
                Verso de la pièce
              </p>
              <label
                className={`block border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 ${
                  identityFieldErrors.back
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleIdentityUpload(e, "back")}
                />
                {backPreview ? (
                  <img
                    src={backPreview}
                    alt="Verso carte"
                    className="mx-auto h-32 object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">
                    Télécharger le verso
                  </span>
                )}
              </label>
              {identityFieldErrors.back && (
                <p className="text-xs text-red-600 mt-2">
                  Verso requis
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            onClick={goToPrevStep}
            variant="secondary"
            className="border border-gray-200 py-2.5 font-montserrat-bold rounded-xl"
          >
            Retour
          </Button>
          {!hasIdentity && (
            <Button
              onClick={saveIdentity}
              isLoading={isSavingIdentity}
              disabled={isSavingIdentity || isSubmitting}
              className="bg-primary hover:!bg-amber-400 py-2.5 font-montserrat-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Enregistrer la pièce d&apos;identité
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={!hasIdentity || isSubmitting}
            isLoading={isSubmitting}
            className="bg-primary hover:!bg-amber-400 py-2.5 font-montserrat-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continuer
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IdentityStep;
