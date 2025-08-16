import React, { useEffect, useState } from "react";
import personalInfo from "@/public/images/add-etablishment/personal-info-banner.png";
import Image from "next/image";
import { Input, Label, CountrySelect } from "../ui";
import Wrapper from "../ui/Wrapper";
import StepTitle from "../ui/StepTitle";
import { isEmail } from "@/utils/validator";

const PersonalInformations = ({
  allowNextStep,
  initialState,
  handleFormDataUpdate,
}) => {
  const [userinfo, setUserInfo] = useState(
    initialState ?? {
      email: "",
      user_address: "",
      user_city: "",
      country: "",
    }
  );

  const [formError, setFormError] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setUserInfo({ ...userinfo, [name]: value });
    handleFormDataUpdate({ ...userinfo, [name]: value });
  }

  function verifyAvailabilityForNextStep() {
    if (
      Object.values(userinfo).every(Boolean) &&
      !Object.values(formError).some(Boolean)
    ) {
      allowNextStep(true);
    } else {
      return allowNextStep(false);
    }
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

  useEffect(() => {
    verifyAvailabilityForNextStep();
  }, [JSON.stringify(formError), JSON.stringify(userinfo)]);

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
    <section>
      <div>
        <Image src={personalInfo} width={2000} height={472} alt="" />
      </div>
      <Wrapper>
        <StepTitle>
          Veuillez nous renseignez ces quelques informations sur vous...
        </StepTitle>
        <form className="p-3" action="">
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
        </form>
      </Wrapper>
    </section>
  );
};

export default PersonalInformations;
