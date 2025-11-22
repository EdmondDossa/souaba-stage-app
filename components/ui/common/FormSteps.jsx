"use client";
import Image from "next/image";
import { Tooltip } from "react-tooltip";

const FormSteps = ({ steps, currentStep }) => {
  const progressBar = (
    <section className="flex w-full items-center justify-center mt-3">
      {steps.map((step, index) => {
        return (
          <div
            id={step.name.split(" ")[0]}
            key={step.name}
            className="flex items-center"
          >
            <div
              className={`relative cursor-pointer h-1 text-center mx-0.5 rounded-sm w-[40px] ${
                currentStep >= index ? "bg-primary" : "bg-gray-300"
              } ${
                currentStep === index
                  ? "-animate-[bounce_600ms_linear_infinite]"
                  : ""
              } `}
            ></div>
            <Tooltip
              style={{ backgroundColor: "#f3f4f6", color: "black" }}
              place="bottom"
              className="bg-white text-black"
              anchorSelect={`#${step.name.split(" ")[0]}`}
              content={step.name}
            />
          </div>
        );
      })}
    </section>
  );
  return (
    <div className="flex flex-col justify-center items-center mt-32 md:mt-10">
      {steps[currentStep].stepIcon && (
        <div className="w-24 h-24 mb-4 md:hidden">
          <Image
            alt=""
            className="w-full h-full"
            width={150}
            height={150}
            src={steps[currentStep].stepIcon}
          />
        </div>
      )}
      {!steps[currentStep].stepIcon && (
        <h4 className="font-montserrat-bold text-lg">
          {" "}
          {steps[currentStep].name}{" "}
        </h4>
      )}
      <span className="font-montserrat-medium  block">
        Etape {currentStep + 1}/{steps.length}
      </span>
      {progressBar}
    </div>
  );
};

export default FormSteps;
