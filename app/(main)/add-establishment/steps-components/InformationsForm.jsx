import React from "react";
import { StepTitle, Wrapper } from "../ui";
import Image from "next/image";

const InformationsForm = ({
  bannerImg,
  children,
  onSubmit,
  formStepTitle
}) => {
  return (
    <div className="text-sm">
      {/* main banner */}
      <div>
        <Image src={bannerImg} width={2000} height={472} alt="" />
      </div>
      <Wrapper>
        <StepTitle> { formStepTitle } </StepTitle>
        <form onSubmit={onSubmit} action="">{children}</form>
      </Wrapper>
    </div>
  );
};

export default InformationsForm;
