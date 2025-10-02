import React, { useEffect, useState } from "react";
import personalInfoBanner from "@/public/images/add-etablishment/personal-info-banner.png";
import { Input, Label, CountrySelect } from "../ui";
import { isEmail } from "@/utils/validator";
import InformationsForm from "./InformationsForm";
import { Button } from "@/components/ui/common";
import { useRouter } from "next/navigation";


const PersonalInformations = () => {
  const router = useRouter();
  const [userinfo, setUserInfo] = useState({
    email: "",
    user_address: "",
    user_city: "",
    country: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if(!isFormValid()) return;
    //traitement machin ...
    //
    //
    router.push("/add-establishment?env=test");
    //env query is just there to make avoid redirection due to absence of logged user
    //i'll remove it afterr
  }

  const [formError, setFormError] = useState({});

  function handleChange(e) {
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
    if (key === "email") {
      if (!isEmail(userinfo.email))
        setFormError({ ...formError, email: "Email invalide." });
      else setFormError({ ...formError, email: "" });
    } else {
      if (!userinfo[key] || userinfo[key].length < 3) {
        setFormError({ ...formError, [key]: "3 caractères au moins." });
      } else setFormError({ ...formError, [key]: "" });
    }
  }


  const formFields = [
    {
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      label: "Ville",
      name: "user_city",
      type: "text",
    },
    {
      label: "Addresse",
      name: "user_address",
      type: "text",
    },
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
                <Input
                  error={formError[field.name]}
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
