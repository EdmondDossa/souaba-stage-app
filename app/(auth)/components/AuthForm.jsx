import React from "react";
import Image from "next/image";
import { Button } from "@/app/ui/common/index";
import Link from "next/link";

const AuthForm = ({
  formTitle,
  btnTitle,
  alternativeOptionMessage,
  alternativeOptionLink = "",
  alternativeOptionBtn,
  handleSubmit,
  children,
  showTopImage = true,
}) => {
  return (
    <>
      {showTopImage && (
        <div className="my-10">
          <Image
            src="/images/logo-primary.png"
            width="120"
            height="209"
            alt=""
          />
        </div>
      )}
      <form className="mx-auto w-[365px]  mb-10" onSubmit={handleSubmit}>
        <h1 className="font-montserrat-bold text-center mb-5 text-2xl">
          {formTitle}
        </h1>
        {children}
        <div>
          <Button className="w-full py-5 font-montserrat-bold rounded-4xl bg-primary hover:hover:bg-primary/70 transition duration-200 cursor-pointer">
            {btnTitle}
          </Button>
        </div>
        {alternativeOptionMessage && (
          <div className="text-sm text-center mt-4">
            <p className="font-bold">
              {alternativeOptionMessage}
              <Link
                href={alternativeOptionLink}
                className="ms-2 text-primary decoration-1 underline  hover:decoration-2 hover:decoration-dotted transition"
              >
                {alternativeOptionBtn}
              </Link>{" "}
            </p>
          </div>
        )}
      </form>
    </>
  );
};

export default AuthForm;
