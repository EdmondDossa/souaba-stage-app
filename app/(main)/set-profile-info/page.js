"use client";
import React from "react";
import { PersonalInformations } from "../add-establishment/steps-components";
import Wrapper from "../add-establishment/ui/Wrapper";
import { Button } from "@/components/ui/common";

const SetProfileInfoForAccomodation = () => {
  return (
    <div className="w-[85%] mx-auto mt-10">
      <Wrapper withBorder={false}>
        <PersonalInformations
          submitButtonText="Enregistrer et continuer"
          redirectUrl="/add-establishment"
        />
      </Wrapper>
    </div>
  );
};

export default SetProfileInfoForAccomodation;
