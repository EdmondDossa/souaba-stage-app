"use client";
import React from "react";
import { PersonalInformations } from "../add-establishment/steps-components";
import { Wrapper } from "../add-establishment/ui";
import { Button } from "@/components/ui/common";

const Page = () => {
  return (
    <div className="w-[85%] mx-auto mt-10">
      <Wrapper withBorder={false}>
        <PersonalInformations />
      </Wrapper>
    </div>
  );
};

export default Page;
