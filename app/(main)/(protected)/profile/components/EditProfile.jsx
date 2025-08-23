"use client";
import { Button, InputRow } from "@/components/ui/common";
import useAuthContext from "@/context/auth";
import { useState } from "react";
import { X } from "lucide-react";
import getAxiosInstance from "@/lib/request";
import {
  isEmail,
  isValidFullname,
  isValidPhoneNumber,
} from "@/utils/validator";
import toast from "react-hot-toast";

const EditProfile = ({ onEditCancel }) => {
  const http = getAxiosInstance();
  const { user, fetchUser } = useAuthContext();

  const [formValues, setFormValues] = useState(user);
  const [formError, setFormError] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [hasEdit,setHasEdit] = useState(false);

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
      await http.patch("/users/profile", formValues);
      await fetchUser(false);
      toast.success("Informations modifiées!");
      setHasEdit(false);
    } catch (error) {
      setFormError({ ...formError, error: error.message });
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
    if(!hasEdit) setHasEdit(true);
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  return (
    <div className="flex-grow">
      <h2 className="font-montserrat-bold">Informations Personnelles</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
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
              value={formValues["gender"]}
              name="gender"
              id="gender"
              defaultValue={formValues["gender"] || "M"}
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-x-8 mt-8 font-montserrat-bold">
          <Button
            onClick={onEditCancel}
            variant="secondary"
            type="reset"
            className="flex text-sm bg-white border hover:bg-red-500/20 border-gray-200 rounded-lg items-center text-red-500 font-montserrat-medium"
          >
            <X className="text-red-500" /> Annuler{" "}
          </Button>
          <Button
            variant="secondary"
            disabled={!hasEdit}
            isLoading={isLoading}
            type="submit"
            className="inline-block min-w-20 text-sm py-3 rounded-lg text-white bg-primary hover:bg-amber-400"
          >
            Enrégistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
