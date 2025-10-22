"use client";
import React from "react";
import { PersonalInformations } from "../(protected)/add-establishment/steps-components";
import { Wrapper } from "../(protected)/add-establishment/ui";
import { Button } from "@/components/ui/common";

const SetProfileInfoForAccomodation = () => {
  return (
    <div className="w-[85%] mx-auto mt-10">
      <Wrapper withBorder={false}>
        <PersonalInformations />
      </Wrapper>
    </div>
  );
};

export default SetProfileInfoForAccomodation;
