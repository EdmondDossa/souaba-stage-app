import React, { useEffect, useState } from "react";
import personalInfoBanner from "@/public/images/add-etablishment/personal-info-banner.png";
import { Input, Label, CountrySelect } from "../ui";
import {  isValidPhoneNumber } from "@/utils/validator";
import InformationsForm from "./InformationsForm";
import { Button, InputRow } from "@/components/ui/common";
import { useRouter } from "next/navigation";
import getAxiosInstance from "@/lib/request";
import toast from "react-hot-toast";
import useAuthContext from "@/context/auth";

const PersonalInformations = () => {
  const router = useRouter();
  const http = getAxiosInstance();
  const [isLoading,setLoading] = useState(false);
  const { fetchUser } = useAuthContext();

  const [userinfo, setUserInfo] = useState({
    address: "",
    phone:"",
    city: "",
    country: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if(!isFormValid()) return;
    try {
      setLoading(true);
      await http.patch("/users/profile/",userinfo);
      await fetchUser();
    } catch (error) {
        toast.error("Une erreur est survenue. Veuillez réessayezplus tard!");
    }finally{
      setLoading(false);
    }
  }

  const [formError, setFormError] = useState({});

  function handleChange(e) {
    if(typeof e === "string"){
      setUserInfo({ ...userinfo, phone: e });
      return;
    }
    const { name, value } = e.target;
    setUserInfo({ ...userinfo, [name]: value });
  }

  function isFormValid() {
    return (
      Object.values(userinfo).every(Boolean) &&
      !Object.values(formError).some(Boolean)
    );
  }

  function validate(key) {
    console.log(userinfo[key]);
    
    if (key === "phone") {
      if (!isValidPhoneNumber(userinfo.phone))
        setFormError({ ...formError, phone: "Le numéro de téléphone ne correspond pas!" });
      else setFormError({ ...formError, phone: "" });
    } else {
      if (!userinfo[key] || userinfo[key].length < 3) {
        setFormError({ ...formError, [key]: "3 caractères au moins." });
      } else setFormError({ ...formError, [key]: "" });
    }
  }


  const formFields = [
    {
      label: "Addresse",
      name: "address",
      type: "text",
    },
    {
      label: "Ville",
      name: "city",
      type: "text",
    },
    {
      label: "Phone",
      name: "phone",
      type: "tel",
    }
  ];

  return (
    <>
      <InformationsForm
        onSubmit={handleSubmit}
        formStepTitle="Veuillez nous renseignez ces quelques informations sur vous..."
        bannerImg={personalInfoBanner}
      >
        <section className="p-3">
          {formFields.map((field) => {
            return (
              <div key={field.label} className="mb-5">
                <Label displayName={field.label} />
                <InputRow
                  errorMessage={formError[field.name]}
                  value={userinfo[field.name]}
                  name={field.name}
                  onChange={handleChange}
                  onBlur={() => validate(field.name)}
                  type={field.type}
                />
              </div>
            );
          })}
          <div>
            <Label displayName={"Pays"} />
            <CountrySelect onChange={handleChange} value={userinfo.country} />
          </div>
        </section>
        <div className="flex items-end justify-end my-15">
          <Button
            size="lg"
            isLoading={isLoading}
            className="font-montserrat-medium font-bold rounded-lg bg-primary py-3 hover:bg-primary/80 cursor-pointer"
          >
            Suivant{" "}
          </Button>
        </div>
      </InformationsForm>
    </>
  );
};

export default PersonalInformations;
