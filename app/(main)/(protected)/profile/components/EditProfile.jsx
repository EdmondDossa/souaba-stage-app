"use client";
import { Button, InputRow } from "@/components/ui/common";
import useAuthContext from "@/context/auth";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import getAxiosInstance from "@/lib/request";
import {
  isEmail,
  isValidFullname,
  isValidPhoneNumber,
} from "@/utils/validator";
import toast from "react-hot-toast";
import PhotosUpload from "../../../add-establishment/steps-components/PhotosUpload";

const EditProfile = ({ onEditCancel }) => {
  const http = getAxiosInstance();
  const { user, fetchUser } = useAuthContext();

  const [formValues, setFormValues] = useState(user);
  const [formError, setFormError] = useState({});
  const [isLoading, setLoading] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  const initialFront = useMemo(
    () => user?.profile?.identity_card_front,
    [user]
  );
  const initialBack = useMemo(() => user?.profile?.identity_card_back, [user]);

  const [identityFront, setIdentityFront] = useState(null);
  const [identityBack, setIdentityBack] = useState(null);
  const [frontPreview, setFrontPreview] = useState(
    initialFront ? `${apiBase}/${initialFront}` : ""
  );
  const [backPreview, setBackPreview] = useState(
    initialBack ? `${apiBase}/${initialBack}` : ""
  );

  const [hasEdit, setHasEdit] = useState(false);

  const formFields = [
    {
      label: "Nom",
      name: "firstName",
    },
    {
      label: "Prénom",
      name: "lastName",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      label: "Téléphone",
      name: "phone",
      type: "tel",
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    setFormError(errors);
    if (Object.values(errors).some(Boolean)) {
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", formValues.firstName || "");
      formData.append("lastName", formValues.lastName || "");
      formData.append("email", formValues.email || "");
      formData.append("phone", formValues.phone || "");
      formData.append("gender", formValues.gender || "");
      if (identityFront) {
        formData.append("identity_card_front", identityFront);
      }
      if (identityBack) {
        formData.append("identity_card_back", identityBack);
      }

      await http.patch("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchUser(false);
      toast.success("Informations modifiées!");
      setHasEdit(false);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Impossible de mettre a jour le profil.";
      setFormError((prev) => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    let errors = {};
    if (!isEmail(formValues["email"])) errors.email = "Email invalide.";
    else errors.email = "";

    ["firstName", "lastName"].forEach((name) => {
      if (!isValidFullname(formValues[name]))
        errors[name] = "Ce champ est invalide. Trois caractères minimum.";
      else errors[name] = "";
    });

    if (!isValidPhoneNumber(formValues["phone"]))
      errors.phone = "Format du numéro invalide.";
    else formError["phone"] = "";
    return errors;
  }

  function handleChange(e) {
    if (!hasEdit) setHasEdit(true);
    // react-phone-input-2 renvoie directement la valeur pour les champs tel
    if (typeof e === "string") {
      setFormValues({ ...formValues, phone: e });
      return;
    }
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  const handleIdentityUpload = (e, side) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!hasEdit) setHasEdit(true);
    const previewUrl = URL.createObjectURL(file);
    if (side === "front") {
      setIdentityFront(file);
      setFrontPreview(previewUrl);
    } else {
      setIdentityBack(file);
      setBackPreview(previewUrl);
    }
  };

  return (
    <div className="flex-grow mt-0 lg:mt-0 space-y-4">
      <h2 className="font-montserrat-bold hidden lg:block ">
        Informations Personnelles
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {formFields.map((field) => (
            <InputRow
              key={field.name}
              label={field.label}
              name={field.name}
              onChange={handleChange}
              className="bg-white border border-gray-200"
              labelClassName="font-light font-sans text-md"
              type={field.type}
              value={formValues[field.name] || ""}
              errorMessage={formError?.[field.name]}
            />
          ))}
          <div>
            <label className="block text-[14px] mb-2" htmlFor="gender">
              Genre
            </label>
            <select
              onChange={handleChange}
              className="w-full border py-3 px-4 rounded-xl border-gray-200"
              value={formValues["gender"] || ""}
              name="gender"
              id="gender"
            >
              <option value="">Sélectionner</option>
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
        </div>
        <div className="mt-8 block lg:hidden">
          <PhotosUpload
            onPhotosChange={() => {}}
            iconSize={27}
            title="Ajouter le recto et après le verso"
            label="Pièce d'identité"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm font-montserrat-bold mb-2">
              Recto de la pièce
            </p>
            <label className="block border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
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
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-montserrat-bold mb-2">
              Verso de la pièce
            </p>
            <label className="block border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
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
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-end gap-4 mt-4 mb-2 font-montserrat-bold">
          <Button
            onClick={onEditCancel}
            variant="secondary"
            type="reset"
            className="flex text-sm bg-white border hover:bg-red-500/20 border-gray-200 rounded-lg items-center text-red-500 font-montserrat-medium w-full sm:w-auto"
          >
            <X className="text-red-500" /> Annuler{" "}
          </Button>
          <Button
            variant="secondary"
            disabled={!hasEdit}
            isLoading={isLoading}
            type="submit"
            className="inline-block min-w-20 text-sm py-3 rounded-lg text-white bg-primary hover:bg-amber-400 w-full sm:w-auto"
          >
            Enrégistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
